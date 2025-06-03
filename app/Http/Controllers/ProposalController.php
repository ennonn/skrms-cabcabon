<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\ProposalCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Notifications\ProposalApproved;
use App\Notifications\ProposalRejected;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\ProposalAttachment;
use Illuminate\Support\Facades\DB;

class ProposalController extends Controller
{
    public function __construct()
    {
        // Add middleware first, before any logging
        $this->middleware(['auth', 'verified']);
        
        // Only require admin role for management routes
        $this->middleware(['role:admin,superadmin'])->only([
            'manage',
            'manageShow',
            'approve', 
            'reject'
        ]);

        // Log after middleware is set up
        $this->middleware(function ($request, $next) {
            \Log::info('ProposalController middleware', [
                'user' => auth()->check() ? [
                    'id' => auth()->id(),
                    'email' => auth()->user()->email,
                    'role' => auth()->user()->role,
                    'is_logged_in' => auth()->check(),
                ] : 'Not authenticated',
                'route' => request()->route()?->getName(),
                'method' => request()->method(),
                'session_has_auth' => session()->has('auth'),
            ]);
            return $next($request);
        });

        // Remove the general resource authorization since we'll handle it per method
        // $this->authorizeResource(Proposal::class, 'proposal');
    }

    public function index()
    {
        \Log::info('Accessing proposals index', [
            'user' => auth()->user()->only(['id', 'email', 'role']),
            'filters' => ['status' => 'approved']
        ]);

        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->where('status', 'approved')
            ->whereNotNull('approved_by')  // Additional check to ensure it's properly approved
            ->latest()
            ->paginate(10);

        \Log::info('Retrieved approved proposals', [
            'count' => $proposals->count(),
            'total' => $proposals->total()
        ]);

        return Inertia::render('proposals/records/index', [
            'proposals' => $proposals,
        ]);
    }

    public function manage()
    {
        \Log::info('Accessing proposal management', [
            'user' => auth()->user()->only(['id', 'email', 'role']),
            'filters' => [
                'status' => request('status'),
                'category' => request('category'),
                'search' => request('search'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);

        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->whereIn('status', ['pending', 'approved', 'rejected'])  // Exclude drafts from management view
            ->when(request('status'), function($query, $status) {
                return $query->where('status', $status);
            })
            ->when(request('category'), function($query, $category) {
                return $query->where('proposal_category_id', $category);
            })
            ->when(request('search'), function($query, $search) {
                return $query->where(function($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('start_date'), function($query, $startDate) {
                return $query->where('implementation_start_date', '>=', $startDate);
            })
            ->when(request('end_date'), function($query, $endDate) {
                return $query->where('implementation_end_date', '<=', $endDate);
            })
            ->when(request('sort_by'), function($query, $sortBy) {
                switch ($sortBy) {
                    case 'title_asc':
                        return $query->orderBy('title', 'asc');
                    case 'budget_asc':
                        return $query->orderBy('estimated_cost', 'asc');
                    case 'budget_desc':
                        return $query->orderBy('estimated_cost', 'desc');
                    case 'date_asc':
                        return $query->orderBy('implementation_start_date', 'asc');
                    case 'date_desc':
                        return $query->orderBy('implementation_start_date', 'desc');
                    default:
                        return $query->orderBy('title', 'asc');
                }
            }, function($query) {
                // Default ordering if no sort_by parameter
                return $query->latest();
            })
            ->paginate(10)
            ->withQueryString();

        \Log::info('Retrieved proposals for management', [
            'count' => $proposals->count(),
            'total' => $proposals->total(),
            'filters' => [
                'status' => request('status'),
                'category' => request('category'),
                'search' => request('search'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);

        $categories = ProposalCategory::all();

        return Inertia::render('proposals/manage/index', [
            'proposals' => $proposals,
            'categories' => $categories,
            'filters' => [
                'status' => request('status'),
                'category' => request('category'),
                'search' => request('search'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);
    }

    public function manageShow(Proposal $proposal)
    {
        $this->authorize('manage', Proposal::class);
        
        $proposal->load(['category', 'submitter', 'approver', 'attachments']);

        \Log::info('Proposal attachments loaded for manage view', [
            'proposal_id' => $proposal->id,
            'attachment_count' => $proposal->attachments->count(),
            'attachments' => $proposal->attachments->map(function($attachment) {
                return [
                    'id' => $attachment->id,
                    'filename' => $attachment->filename,
                    'original_filename' => $attachment->original_filename,
                    'path' => $attachment->path,
                    'created_at' => $attachment->created_at,
                ];
            }),
        ]);

        // Transform attachments to documents format expected by frontend
        $transformedProposal = $proposal->toArray();
        $transformedProposal['documents'] = $proposal->attachments->map(function($attachment) {
            return [
                'id' => $attachment->id,
                'filename' => $attachment->original_filename ?: $attachment->filename,
                'created_at' => $attachment->created_at,
                'url' => route('proposals.proposal-attachments.download', $attachment->id),
            ];
        })->toArray();

        return Inertia::render('proposals/manage/show', [
            'proposal' => $transformedProposal,
        ]);
    }

    public function manageEdit(Proposal $proposal)
    {
        $this->authorize('manage', Proposal::class);
        
        $categories = ProposalCategory::where('is_active', true)->get();
        
        return Inertia::render('proposals/manage/edit', [
            'proposal' => $proposal->load(['category', 'submitter', 'approver']),
            'categories' => $categories
        ]);
    }

    public function show(Proposal $proposal)
    {
        $this->authorize('view', $proposal);
        
        $proposal->load(['category', 'submitter', 'approver', 'attachments']);

        // Transform attachments to documents format expected by frontend
        $transformedProposal = $proposal->toArray();
        $transformedProposal['documents'] = $proposal->attachments->map(function($attachment) {
            return [
                'id' => $attachment->id,
                'filename' => $attachment->original_filename ?: $attachment->filename,
                'created_at' => $attachment->created_at,
                'url' => route('proposals.proposal-attachments.download', $attachment->id),
            ];
        })->toArray();

        if ($proposal->status === 'approved') {
            return Inertia::render('proposals/show', [
                'proposal' => $transformedProposal,
            ]);
        } else if ($proposal->status === 'pending') {
            return Inertia::render('proposals/pending/show', [
                'proposal' => $transformedProposal,
            ]);
        } else if ($proposal->status === 'rejected') {
            return Inertia::render('proposals/rejected/show', [
                'proposal' => $transformedProposal,
            ]);
        } else if ($proposal->status === 'draft') {
            // Use the my/show view for draft proposals
            return Inertia::render('proposals/my/show', [
                'proposal' => $transformedProposal,
            ]);
        }

        return Inertia::render('proposals/show', [
            'proposal' => $transformedProposal,
        ]);
    }

    public function create()
    {
        $categories = ProposalCategory::where('is_active', true)->get();

        return Inertia::render('proposals/my/create', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        \Log::info('Starting proposal creation', [
            'user_id' => auth()->id(),
            'user_role' => auth()->user()->role,
            'request_data' => $request->except(['attachments'])
        ]);

        try {
            $validated = $request->validate([
                'category_id' => 'required|exists:proposal_categories,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'implementation_start_date' => 'required|date',
                'implementation_end_date' => 'required|date|after:implementation_start_date',
                'location' => 'required|string|max:255',
                'estimated_cost' => 'required|numeric|min:0',
                'frequency' => 'required|string|max:255',
                'funding_source' => 'required|string|max:255',
                'people_involved' => 'required|string',
                'target_participants' => 'required|integer|min:1',
                'objectives' => 'required|string',
                'expected_outcomes' => 'required|string',
                'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
            ]);

            \Log::info('Proposal validation passed', [
                'validated_data' => $validated
            ]);

            // Create proposal with correct field mapping
            $proposal = new Proposal();
            $proposal->proposal_category_id = $validated['category_id']; // Map category_id to proposal_category_id
            $proposal->title = $validated['title'];
            $proposal->description = $validated['description'];
            $proposal->implementation_start_date = $validated['implementation_start_date'];
            $proposal->implementation_end_date = $validated['implementation_end_date'];
            $proposal->location = $validated['location'];
            $proposal->estimated_cost = $validated['estimated_cost'];
            $proposal->frequency = $validated['frequency'];
            $proposal->funding_source = $validated['funding_source'];
            $proposal->people_involved = $validated['people_involved'];
            $proposal->target_participants = $validated['target_participants'];
            $proposal->objectives = $validated['objectives'];
            $proposal->expected_outcomes = $validated['expected_outcomes'];
            $proposal->submitted_by = Auth::id();
            $proposal->status = 'draft';
            
            \Log::info('About to save new proposal', [
                'proposal_data' => $proposal->toArray()
            ]);

            $proposal->save();

            // Handle file attachments if any
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('proposal-attachments', 'public');
                    
                    // Log file information
                    \Log::info('Storing proposal attachment', [
                        'proposal_id' => $proposal->id,
                        'original_name' => $file->getClientOriginalName(),
                        'stored_name' => basename($path),
                        'path' => $path,
                        'full_path' => Storage::disk('public')->path($path),
                        'url' => Storage::disk('public')->url($path)
                    ]);
                    
                    $proposal->attachments()->create([
                        'filename' => basename($path),
                        'original_filename' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ]);
                }
            }

            \Log::info('Proposal created successfully', [
                'proposal_id' => $proposal->id
            ]);

            return redirect()->route('proposals.my.show', $proposal)
                ->with('success', 'Proposal created successfully.');

        } catch (\Exception $e) {
            \Log::error('Unexpected error during proposal creation', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->withErrors([
                'error' => 'An unexpected error occurred while creating the proposal. Please try again.'
            ])->withInput();
        }
    }

    public function edit(Proposal $proposal)
    {
        $this->authorize('update', $proposal);

        $categories = ProposalCategory::where('is_active', true)->get();

        return Inertia::render('proposals/form', [
            'proposal' => $proposal->load(['category', 'submitter', 'approver']),
            'categories' => $categories,
            'statuses' => Proposal::getStatuses(),
        ]);
    }

    public function update(Request $request, Proposal $proposal)
    {
        try {
            \Log::info('Attempting to update proposal', [
                'proposal_id' => $proposal->id,
                'user_id' => auth()->id(),
                'form_data' => $request->all(),
                'has_files' => $request->hasFile('attachments'),
                'request_method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
            ]);
            
            $validated = $request->validate([
                'category_id' => 'required|exists:proposal_categories,id',
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'implementation_start_date' => 'required|date',
                'implementation_end_date' => 'required|date|after:implementation_start_date',
                'location' => 'required|string|max:255',
                'estimated_cost' => 'required|numeric|min:0',
                'frequency' => 'required|string|max:255',
                'funding_source' => 'required|string|max:255',
                'people_involved' => 'required|string',
                'target_participants' => 'required|integer|min:1',
                'objectives' => 'required|string',
                'expected_outcomes' => 'required|string',
                'attachments.*' => 'nullable|file|max:10240|mimes:pdf,doc,docx,xls,xlsx,jpg,jpeg,png',
            ]);

            \Log::info('Proposal validation passed', [
                'proposal_id' => $proposal->id,
                'validated_data' => $validated
            ]);

            // Map category_id to proposal_category_id
            $data = $validated;
            $data['proposal_category_id'] = $data['category_id'];
            unset($data['category_id']);

            $proposal->update($data);

            // Handle file uploads
            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = $file->store('proposal-attachments/' . $proposal->id, 'public');
                    
                    $proposal->attachments()->create([
                        'filename' => basename($path),
                        'original_filename' => $file->getClientOriginalName(),
                        'mime_type' => $file->getMimeType(),
                        'path' => $path,
                        'size' => $file->getSize(),
                    ]);
                }
            }
            
            \Log::info('Proposal updated successfully', [
                'proposal_id' => $proposal->id
            ]);

            return back()->with('success', 'Proposal updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error updating proposal', [
                'proposal_id' => $proposal->id,
                'errors' => $e->errors(),
            ]);
            
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Error updating proposal', [
                'proposal_id' => $proposal->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['error' => 'Failed to update proposal. Please try again.']);
        }
    }

    public function destroy(Proposal $proposal)
    {
        try {
            // Check if user owns the proposal or is admin/superadmin
            if (auth()->user()->role !== 'admin' && auth()->user()->role !== 'superadmin' && $proposal->submitted_by !== auth()->id()) {
                throw new \Illuminate\Auth\Access\AuthorizationException('You are not authorized to delete this proposal.');
            }
            
            // Store the proposal ID for logging
            $proposalId = $proposal->id;
            
            // Force delete to ensure it's removed
            $proposal->forceDelete();

            \Log::info('Proposal deleted successfully', [
                'proposal_id' => $proposalId,
                'user_id' => auth()->id()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Proposal deleted successfully'
                ]);
            }

            return redirect()->route('proposals.my.index')
                ->with('success', 'Proposal deleted successfully.');

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            \Log::error('Authorization error deleting proposal', [
                'proposal_id' => $proposal->id,
                'user_id' => auth()->id(),
                'error' => $e->getMessage()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 403);
            }

            return back()->with('error', $e->getMessage());
        } catch (\Exception $e) {
            \Log::error('Error deleting proposal', [
                'proposal_id' => $proposal->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if (request()->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to delete proposal',
                    'error' => $e->getMessage()
                ], 500);
            }

            return back()->with('error', 'Failed to delete proposal. Please try again.');
        }
    }

    public function submit(Proposal $proposal)
    {
        \Log::info('Attempting to submit proposal', [
            'proposal_id' => $proposal->id,
            'current_status' => $proposal->status,
            'user_id' => auth()->id()
        ]);

        if (!$proposal->canBeSubmitted()) {
            \Log::warning('Proposal submission rejected - invalid state', [
                'proposal_id' => $proposal->id,
                'status' => $proposal->status
            ]);
            return back()->with('error', 'This proposal cannot be submitted. Only draft proposals can be submitted.');
        }

        $proposal->status = 'pending';
        $proposal->save();

        \Log::info('Proposal submitted successfully', [
            'proposal_id' => $proposal->id,
            'new_status' => $proposal->status
        ]);

        return redirect()->route('proposals.my.index')
            ->with('success', 'Proposal submitted successfully. It is now pending for review.');
    }

    public function withdraw(Proposal $proposal)
    {
        if (!$proposal->canBeWithdrawn()) {
            return back()->with('error', 'This proposal cannot be withdrawn.');
        }

        $proposal->status = 'draft';
        $proposal->save();

        return back()->with('success', 'Proposal withdrawn successfully.');
    }

    public function approve(Request $request, Proposal $proposal)
    {
        try {
            DB::beginTransaction();

            // Update proposal status
            $proposal->status = 'approved';
            $proposal->approved_at = now();
            $proposal->approved_by = auth()->id();
            $proposal->save();

            // Get the committee's programs
            $committeePrograms = [
                'Committee on Education and Culture' => [
                    'Education Support',
                    'Skills & Capacity Building',
                    'Cultural aspects of Community Development'
                ],
                'Committee on Environment' => [
                    'Community Development & Environment',
                    'Social Transformation'
                ],
                'Committee on Youth Employment & Livelihood' => [
                    'Skills & Capacity Building',
                    'Social Transformation',
                    'Advocacy & Governance'
                ],
                'Committee on Sports, Gender, and Development' => [
                    'Sports & Recreation',
                    'Social Transformation',
                    'Community Development & Environment'
                ],
                'Committee on Health' => [
                    'Health & Wellness',
                    'Community Development & Environment'
                ],
                'Committee on Social Protection' => [
                    'Social Transformation',
                    'Advocacy & Governance',
                    'Health & Wellness'
                ],
                'Committee on Development Projects' => [
                    'Community Development & Environment',
                    'Skills & Capacity Building'
                ],
                'Committee on Finance, Ways, and Means' => [
                    'Advocacy & Governance'
                ]
            ];

            // Get programs for the proposal's committee
            \Log::info('Proposal committee matching', [
                'proposal_id' => $proposal->id,
                'proposal_committee' => $proposal->committee,
                'available_committees' => array_keys($committeePrograms)
            ]);
            
            $programs = $committeePrograms[$proposal->committee] ?? [];
            
            \Log::info('Found matching programs', [
                'proposal_id' => $proposal->id,
                'committee' => $proposal->committee,
                'programs' => $programs
            ]);

            // Find matching youth profiles
            $matchingYouth = \App\Models\Records\YouthProfileRecord::with('personalInformation')
                ->whereHas('personalInformation', function($query) use ($programs) {
                    $query->where(function($q) use ($programs) {
                        foreach ($programs as $program) {
                            $q->orWhere('suggested_programs', 'like', '%' . $program . '%');
                        }
                    });
                })
                ->get()
                ->unique(function ($youth) {
                    return $youth->personalInformation->email;
                });

            // Send notifications to matching youth
            $sentEmails = [];
            foreach ($matchingYouth as $youth) {
                if ($youth->personalInformation && $youth->personalInformation->email) {
                    $email = $youth->personalInformation->email;
                    if (!in_array($email, $sentEmails)) {
                        \Log::info('Attempting to send email notification', [
                            'proposal_id' => $proposal->id,
                            'proposal_title' => $proposal->title,
                            'youth_email' => $email,
                            'youth_name' => $youth->personalInformation->full_name
                        ]);

                        try {
                            \Illuminate\Support\Facades\Mail::to($email)
                                ->send(new \App\Mail\ProposalApprovedMail($proposal, $youth));
                            
                            \Log::info('Email notification sent successfully', [
                                'proposal_id' => $proposal->id,
                                'youth_email' => $email
                            ]);
                            
                            $sentEmails[] = $email;
                        } catch (\Exception $e) {
                            \Log::error('Failed to send email notification', [
                                'proposal_id' => $proposal->id,
                                'youth_email' => $email,
                                'error' => $e->getMessage(),
                                'trace' => $e->getTraceAsString()
                            ]);
                        }
                    }
                }
            }

            // Notify the submitter
            $proposal->submitter->notify(new ProposalApproved($proposal));

            DB::commit();

            return redirect()->route('proposals.manage.index')
                ->with('success', 'Proposal has been approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Proposal approval failed: ' . $e->getMessage());
            return back()->with('error', 'Failed to approve proposal. Please try again.');
        }
    }

    public function reject(Request $request, Proposal $proposal)
    {
        $this->authorize('reject', $proposal);

        try {
        $validated = $request->validate([
            'rejection_reason' => 'required|string'
        ]);

        $proposal->status = 'rejected';
        $proposal->rejection_reason = $validated['rejection_reason'];
        $proposal->approved_by = Auth::id();
        $proposal->save();

        $proposal->submitter->notify(new ProposalRejected($proposal));

            return redirect()->route('proposals.manage.index')->with([
                'success' => 'Proposal rejected successfully.'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Error during proposal rejection', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with([
                'error' => 'An error occurred while rejecting the proposal.'
            ]);
        }
    }
    public function myProposals()
    {
        \Log::info('Accessing my proposals', [
            'user_id' => auth()->id(),
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'status' => request('status'),
                'page' => request('page')
            ]
        ]);
        
        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->where('submitted_by', auth()->id())
            ->when(request('search'), function($query, $search) {
                return $query->where(function($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('category'), function($query, $category) {
                if ($category !== 'all') {
                    return $query->where('proposal_category_id', $category);
                }
                return $query;
            })
            ->when(request('status'), function($query, $status) {
                if ($status !== 'all') {
                    return $query->where('status', $status);
                }
                return $query;
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        $categories = ProposalCategory::where('is_active', true)->get();

        return Inertia::render('proposals/my/index', [
            'proposals' => $proposals,
            'categories' => $categories,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'status' => request('status')
            ]
        ]);
    }
    
    /**
     * Show the form for editing the specified proposal in "My Proposals" section.
     */
    public function myEdit(Proposal $proposal)
    {
        $this->authorize('update', $proposal);
        
        $categories = ProposalCategory::where('is_active', true)->get();
        
        return Inertia::render('proposals/my/edit', [
            'proposal' => $proposal->load(['category', 'submitter', 'approver']),
            'categories' => $categories,
        ]);
    }

    public function pending()
    {
        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->where('status', 'pending')
            ->when(request('search'), function($query, $search) {
                return $query->where(function($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('category'), function($query, $category) {
                if ($category !== 'all') {
                    return $query->where('proposal_category_id', $category);
                }
                return $query;
            })
            ->when(request('budget_range'), function($query, $budgetRange) {
                switch ($budgetRange) {
                    case 'under5k':
                        return $query->where('estimated_cost', '<', 5000);
                    case '5k-10k':
                        return $query->whereBetween('estimated_cost', [5000, 10000]);
                    case '10k-25k':
                        return $query->whereBetween('estimated_cost', [10000, 25000]);
                    case '25k-50k':
                        return $query->whereBetween('estimated_cost', [25000, 50000]);
                    case '50k-100k':
                        return $query->whereBetween('estimated_cost', [50000, 100000]);
                    case '100kplus':
                        return $query->where('estimated_cost', '>=', 100000);
                    default:
                        return $query;
                }
            })
            ->when(request('start_date'), function($query, $startDate) {
                return $query->where('implementation_start_date', '>=', $startDate);
            })
            ->when(request('end_date'), function($query, $endDate) {
                return $query->where('implementation_end_date', '<=', $endDate);
            })
            ->when(request('sort_by'), function($query, $sortBy) {
                switch ($sortBy) {
                    case 'title_asc':
                        return $query->orderBy('title', 'asc');
                    case 'budget_asc':
                        return $query->orderBy('estimated_cost', 'asc');
                    case 'budget_desc':
                        return $query->orderBy('estimated_cost', 'desc');
                    case 'date_asc':
                        return $query->orderBy('implementation_start_date', 'asc');
                    case 'date_desc':
                        return $query->orderBy('implementation_start_date', 'desc');
                    default:
                        return $query->orderBy('title', 'asc');
                }
            }, function($query) {
                // Default ordering if no sort_by parameter
                return $query->latest();
            })
            ->paginate(10)
            ->withQueryString();

        $categories = ProposalCategory::where('is_active', true)->get();

        return Inertia::render('proposals/pending/index', [
            'proposals' => $proposals,
            'categories' => $categories,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'budget_range' => request('budget_range'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);
    }

    public function showPending(Proposal $proposal)
    {
        if ($proposal->status !== 'pending') {
            return redirect()->route('proposals.records.show', $proposal);
        }

        $proposal->load(['category', 'submitter', 'approver', 'attachments']);
        $categories = ProposalCategory::where('is_active', true)->get();

        // Transform attachments to documents format expected by frontend
        $transformedProposal = $proposal->toArray();
        $transformedProposal['documents'] = $proposal->attachments->map(function($attachment) {
            return [
                'id' => $attachment->id,
                'filename' => $attachment->original_filename ?: $attachment->filename,
                'created_at' => $attachment->created_at,
                'url' => route('proposals.proposal-attachments.download', $attachment->id),
            ];
        })->toArray();

        return Inertia::render('proposals/pending/show', [
            'proposal' => $transformedProposal,
            'categories' => $categories,
        ]);
    }

    public function rejected()
    {
        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->where('status', 'rejected')
            ->latest()
            ->paginate(10);

        return Inertia::render('proposals/rejected/index', [
            'proposals' => $proposals,
        ]);
    }

    public function showRejected(Proposal $proposal)
    {
        if ($proposal->status !== 'rejected') {
            return redirect()->route('proposals.records.show', $proposal);
        }

        $proposal->load(['category', 'submitter', 'approver', 'attachments']);

        // Transform attachments to documents format expected by frontend
        $transformedProposal = $proposal->toArray();
        $transformedProposal['documents'] = $proposal->attachments->map(function($attachment) {
            return [
                'id' => $attachment->id,
                'filename' => $attachment->original_filename ?: $attachment->filename,
                'created_at' => $attachment->created_at,
                'url' => route('proposals.proposal-attachments.download', $attachment->id),
            ];
        })->toArray();

        return Inertia::render('proposals/rejected/show', [
            'proposal' => $transformedProposal,
        ]);
    }

    public function records()
    {
        \Log::info('Accessing proposal records', [
            'user' => auth()->user()->only(['id', 'email', 'role']),
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'budget_range' => request('budget_range'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);

        $proposals = Proposal::with(['category', 'submitter', 'approver'])
            ->where('status', 'approved')
            ->whereNotNull('approved_by')  // Ensure it's properly approved
            ->when(request('search'), function($query, $search) {
                return $query->where(function($query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                          ->orWhere('description', 'like', "%{$search}%");
                });
            })
            ->when(request('category'), function($query, $category) {
                if ($category !== 'all') {
                    return $query->where('proposal_category_id', $category);
                }
                return $query;
            })
            ->when(request('budget_range'), function($query, $budgetRange) {
                switch ($budgetRange) {
                    case 'under5k':
                        return $query->where('estimated_cost', '<', 5000);
                    case '5k-10k':
                        return $query->whereBetween('estimated_cost', [5000, 10000]);
                    case '10k-25k':
                        return $query->whereBetween('estimated_cost', [10000, 25000]);
                    case '25k-50k':
                        return $query->whereBetween('estimated_cost', [25000, 50000]);
                    case '50k-100k':
                        return $query->whereBetween('estimated_cost', [50000, 100000]);
                    case '100kplus':
                        return $query->where('estimated_cost', '>=', 100000);
                    default:
                        return $query;
                }
            })
            ->when(request('start_date'), function($query, $startDate) {
                return $query->where('implementation_start_date', '>=', $startDate);
            })
            ->when(request('end_date'), function($query, $endDate) {
                return $query->where('implementation_end_date', '<=', $endDate);
            })
            ->when(request('sort_by'), function($query, $sortBy) {
                switch ($sortBy) {
                    case 'title_asc':
                        return $query->orderBy('title', 'asc');
                    case 'budget_asc':
                        return $query->orderBy('estimated_cost', 'asc');
                    case 'budget_desc':
                        return $query->orderBy('estimated_cost', 'desc');
                    case 'date_asc':
                        return $query->orderBy('implementation_start_date', 'asc');
                    case 'date_desc':
                        return $query->orderBy('implementation_start_date', 'desc');
                    default:
                        return $query->orderBy('title', 'asc');
                }
            }, function($query) {
                // Default ordering if no sort_by parameter
                return $query->latest();
            })
            ->paginate(10)
            ->withQueryString();

        \Log::info('Retrieved approved proposal records', [
            'count' => $proposals->count(),
            'total' => $proposals->total(),
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'budget_range' => request('budget_range'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);

        $categories = ProposalCategory::where('is_active', true)->get();

        return Inertia::render('proposals/records/index', [
            'proposals' => $proposals,
            'categories' => $categories,
            'filters' => [
                'search' => request('search'),
                'category' => request('category'),
                'budget_range' => request('budget_range'),
                'start_date' => request('start_date'),
                'end_date' => request('end_date'),
                'sort_by' => request('sort_by')
            ]
        ]);
    }

    public function recordShow(Proposal $proposal)
    {
        $proposal->load(['category', 'submitter', 'approver', 'attachments']);

        // Transform attachments to documents format expected by frontend
        $transformedProposal = $proposal->toArray();
        $transformedProposal['documents'] = $proposal->attachments->map(function($attachment) {
            return [
                'id' => $attachment->id,
                'filename' => $attachment->original_filename ?: $attachment->filename,
                'created_at' => $attachment->created_at,
                'url' => route('proposals.proposal-attachments.download', $attachment->id),
            ];
        })->toArray();

        return Inertia::render('proposals/records/show', [
            'proposal' => $transformedProposal,
        ]);
    }

    /**
     * Download a proposal attachment
     */
    public function downloadAttachment(ProposalAttachment $attachment)
    {
        try {
            \Log::info('Download attachment request', [
                'attachment_id' => $attachment->id,
                'proposal_id' => $attachment->proposal_id,
                'user_id' => auth()->id(),
                'path' => $attachment->path,
                'original_name' => $attachment->original_filename,
            ]);
            
            // Check if user is authorized to download the attachment
            if (!auth()->user()->can('download', $attachment->proposal)) {
                \Log::warning('Unauthorized download attempt', [
                    'user_id' => auth()->id(),
                    'attachment_id' => $attachment->id,
                ]);
                abort(403, 'You are not authorized to download this file.');
            }
            
            // Check if file exists
            $filePath = storage_path('app/public/' . $attachment->path);
            
            \Log::info('Checking file path', [
                'file_path' => $filePath,
                'exists' => file_exists($filePath)
            ]);
            
            if (!file_exists($filePath)) {
                \Log::error('Attachment file not found', [
                    'attachment_id' => $attachment->id,
                    'path' => $attachment->path,
                    'full_path' => $filePath
                ]);
                return back()->with('error', 'File not found.');
            }
            
            // Set the filename for download
            $filename = $attachment->original_filename ?: $attachment->filename;
            
            \Log::info('Downloading attachment', [
                'attachment_id' => $attachment->id,
                'proposal_id' => $attachment->proposal_id,
                'user_id' => auth()->id(),
                'filename' => $filename
            ]);
            
            // Use headers to force download rather than inline view
            return response()->download($filePath, $filename, [
                'Content-Type' => $attachment->mime_type,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Error downloading attachment', [
                'attachment_id' => $attachment->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'An error occurred while downloading the file.');
        }
    }

    /**
     * Get a direct download URL for a proposal attachment
     */
    public function getAttachmentUrl(ProposalAttachment $attachment)
    {
        try {
            \Log::info('Get attachment URL request', [
                'attachment_id' => $attachment->id,
                'proposal_id' => $attachment->proposal_id,
                'user_id' => auth()->id(),
                'path' => $attachment->path,
            ]);
            
            // Check if user is authorized to download the attachment
            if (!auth()->user()->can('download', $attachment->proposal)) {
                \Log::warning('Unauthorized download URL attempt', [
                    'user_id' => auth()->id(),
                    'attachment_id' => $attachment->id,
                ]);
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            
            // Return the direct URL to the file
            $url = Storage::disk('public')->url($attachment->path);
            
            return response()->json([
                'url' => $url,
                'filename' => $attachment->original_filename ?: $attachment->filename,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error getting attachment URL', [
                'attachment_id' => $attachment->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
} 