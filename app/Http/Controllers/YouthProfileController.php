<?php

namespace App\Http\Controllers;

use App\Models\Records\PendingYouthProfile;
use App\Models\Records\YouthProfileRecord;
use App\Models\Records\PersonalInformation;
use App\Models\Records\FamilyInformation;
use App\Models\Records\EngagementData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class YouthProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
        
        // Only require admin role for approval/rejection
        $this->middleware(['role:admin,superadmin'])->only([
            'approve', 
            'reject'
        ]);

        // Use separate authorization for each type
        $this->authorizeResource(PendingYouthProfile::class, 'youth_profile', [
            'except' => ['edit', 'update']
        ]);
        
        // Add authorization for YouthProfileRecord
        $this->authorizeResource(YouthProfileRecord::class, 'profile', [
            'only' => ['edit', 'update', 'destroy']
        ]);
    }

    public function index()
    {
        return Inertia::render('youth-profiles/index', [
            'profiles' => PendingYouthProfile::with(['user', 'approver'])
                ->latest()
                ->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('youth-profiles/create');
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validate([
                'personal_info.first_name' => 'required|string|max:255',
                'personal_info.last_name' => 'required|string|max:255',
                'personal_info.birthdate' => 'required|date',
                'personal_info.gender' => 'required|string|in:male,female,other',
                'personal_info.email' => 'nullable|email|max:255',
                'personal_info.phone' => 'nullable|string|max:255',
                'personal_info.address' => 'required|string|max:255',
                'personal_info.monthly_income' => 'nullable|numeric|min:0',
                'family_info.father_name' => 'nullable|string|max:255',
                'family_info.father_age' => 'nullable|integer|min:0',
                'family_info.mother_name' => 'nullable|string|max:255',
                'family_info.mother_age' => 'nullable|integer|min:0',
                'engagement_data.education_level' => 'required|string|in:elementary,high_school,college,vocational,graduate,out_of_school',
                'engagement_data.employment_status' => 'required|string|in:employed,unemployed,student',
                'engagement_data.is_sk_voter' => 'required|boolean',
                'engagement_data.assembly_attendance' => 'nullable|integer|min:0',
            ]);

            $profile = new PendingYouthProfile();
            $profile->user_id = auth()->id();
            $profile->status = 'pending';
            $profile->personal_info = $data['personal_info'];
            $profile->family_info = $data['family_info'];
            $profile->engagement_data = $data['engagement_data'];
            $profile->save();

            DB::commit();

            return redirect()->route('youth-profiles.show', $profile)
                ->with('success', 'Youth profile created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating youth profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'An unexpected error occurred while creating the profile. Please try again.'
            ]);
        }
    }

    public function show(PendingYouthProfile $youth_profile)
    {
        return Inertia::render('youth-profiles/show', [
            'youth_profile' => $youth_profile->load(['user', 'approver']),
        ]);
    }

    public function edit(YouthProfileRecord $profile)
    {
        $profile->load(['user', 'approver', 'personalInformation', 'familyInformation', 'engagementData']);

        return Inertia::render('youth-profiles/manage/edit', [
            'profile' => [
                'id' => $profile->id,
                'status' => 'approved',
                'personalInformation' => $profile->personalInformation ? [
                    'full_name' => $profile->personalInformation->full_name,
                    'birthdate' => $profile->personalInformation->birthdate ? \Carbon\Carbon::parse($profile->personalInformation->birthdate)->format('Y-m-d') : null,
                    'gender' => $profile->personalInformation->gender,
                    'email' => $profile->personalInformation->email,
                    'phone' => $profile->personalInformation->phone,
                    'address' => $profile->personalInformation->address,
                    'civil_status' => $profile->personalInformation->civil_status,
                    'youth_age_group' => $profile->personalInformation->youth_age_group,
                    'personal_monthly_income' => $profile->personalInformation->personal_monthly_income,
                    'interests_hobbies' => $profile->personalInformation->interests_hobbies,
                    'suggested_programs' => $profile->personalInformation->suggested_programs,
                ] : null,
                'familyInformation' => $profile->familyInformation ? [
                    'father_name' => $profile->familyInformation->father_name,
                    'mother_name' => $profile->familyInformation->mother_name,
                    'parents_monthly_income' => $profile->familyInformation->parents_monthly_income,
                ] : null,
                'engagementData' => $profile->engagementData ? [
                    'education_level' => $profile->engagementData->education_level,
                    'youth_classification' => $profile->engagementData->youth_classification,
                    'work_status' => $profile->engagementData->work_status,
                    'is_sk_voter' => $profile->engagementData->is_sk_voter,
                    'is_registered_national_voter' => $profile->engagementData->is_registered_national_voter,
                    'voted_last_election' => $profile->engagementData->voted_last_election,
                    'has_attended_assembly' => $profile->engagementData->has_attended_assembly,
                    'assembly_attendance' => $profile->engagementData->assembly_attendance,
                    'assembly_absence_reason' => $profile->engagementData->assembly_absence_reason,
                ] : null,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                'approver' => $profile->approver ? [
                    'id' => $profile->approver->id,
                    'name' => $profile->approver->name,
                ] : null,
                'approval_notes' => $profile->approval_notes,
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ],
        ]);
    }

    public function update(Request $request, YouthProfileRecord $profile)
    {
        $validated = $request->validate([
            'personalInformation.full_name' => 'required|string|max:255',
            'personalInformation.birthdate' => 'required|date',
            'personalInformation.gender' => 'required|string|in:Male,Female',
            'personalInformation.email' => 'nullable|email|max:255',
            'personalInformation.phone' => 'nullable|string|max:255',
            'personalInformation.address' => 'required|string|max:255',
            'personalInformation.civil_status' => 'required|string|in:Single,Married,Widowed,Divorced,Separated,Annulled,Live-in,Unknown',
            'personalInformation.youth_age_group' => 'required|string|in:Child Youth (15 - 17 years old),Core Youth (18 - 24 years old),Young Adult (25 - 30 years old)',
            'personalInformation.personal_monthly_income' => 'nullable|numeric|min:0',
            'personalInformation.interests_hobbies' => 'nullable|string|max:255',
            'personalInformation.suggested_programs' => 'nullable|string|max:255',
            
            'familyInformation.mother_name' => 'nullable|string|max:255',
            'familyInformation.father_name' => 'nullable|string|max:255',
            'familyInformation.parents_monthly_income' => 'nullable|numeric|min:0',
            
            'engagementData.education_level' => 'required|string|in:Elementary Level,Elementary Graduate,High School Level,High School Graduate,Vocational Graduate,College Level,College Graduate,Masters Level,Masters Graduate,Doctorate Level,Doctorate Graduate',
            'engagementData.youth_classification' => 'required|string|in:In school Youth,Out of School Youth,Working Youth,PWD,Children in conflict with the law,Indigenous People',
            'engagementData.work_status' => 'required|string|in:Employed,Unemployed,Self-employed,Currently Looking for a Job,Not interested in looking for a job',
            'engagementData.is_sk_voter' => 'required|boolean',
            'engagementData.is_registered_national_voter' => 'required|boolean',
            'engagementData.voted_last_election' => 'required|boolean',
            'engagementData.has_attended_assembly' => 'required|boolean',
            'engagementData.assembly_attendance' => 'nullable|integer|min:0',
            'engagementData.assembly_absence_reason' => 'nullable|string|max:255',
        ]);

        $profile->personalInformation->update($validated['personalInformation']);
        $profile->familyInformation->update($validated['familyInformation']);
        $profile->engagementData->update($validated['engagementData']);

        return redirect()->route('youth-profiles.manage.show', $profile)
            ->with('success', 'Profile updated successfully.');
    }

    public function submit(PendingYouthProfile $youth_profile)
    {
        $this->authorize('submit', $youth_profile);

        $youth_profile->status = 'pending';
        $youth_profile->save();

        return back()->with('success', 'Profile submitted for approval.');
    }

    public function approve(Request $request, PendingYouthProfile $youth_profile)
    {
        $this->authorize('approve', $youth_profile);

        $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Create the main youth profile record
            $record = YouthProfileRecord::create([
                'user_id' => $youth_profile->user_id,
                'approver_id' => auth()->id(),
                'approval_notes' => $request->notes,
            ]);

            // Create personal information record
            PersonalInformation::create([
                'youth_profile_record_id' => $record->id,
                'first_name' => $youth_profile->personal_info['first_name'],
                'last_name' => $youth_profile->personal_info['last_name'],
                'birthdate' => $youth_profile->personal_info['birthdate'],
                'gender' => $youth_profile->personal_info['gender'],
                'email' => $youth_profile->personal_info['email'] ?? null,
                'phone' => $youth_profile->personal_info['phone'] ?? null,
                'address' => $youth_profile->personal_info['address'],
                'monthly_income' => $youth_profile->personal_info['monthly_income'] ?? null,
            ]);

            // Create family information record
            FamilyInformation::create([
                'youth_profile_record_id' => $record->id,
                'father_name' => $youth_profile->family_info['father_name'] ?? null,
                'father_age' => $youth_profile->family_info['father_age'] ?? null,
                'mother_name' => $youth_profile->family_info['mother_name'] ?? null,
                'mother_age' => $youth_profile->family_info['mother_age'] ?? null,
            ]);

            // Create engagement data record
            EngagementData::create([
                'youth_profile_record_id' => $record->id,
                'education_level' => $youth_profile->engagement_data['education_level'],
                'employment_status' => $youth_profile->engagement_data['employment_status'],
                'is_sk_voter' => $youth_profile->engagement_data['is_sk_voter'],
                'assembly_attendance' => $youth_profile->engagement_data['assembly_attendance'] ?? null,
            ]);

            // Update the pending profile status
            $youth_profile->update([
                'status' => 'approved',
                'approver_id' => auth()->id(),
                'approval_notes' => $request->notes,
            ]);

            DB::commit();

            return redirect()->route('youth-profiles.show', $youth_profile)
                ->with('success', 'Profile approved and added to records successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve profile. Please try again.');
        }
    }

    public function reject(Request $request, PendingYouthProfile $youth_profile)
    {
        $this->authorize('reject', $youth_profile);

        $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        $youth_profile->update([
            'status' => 'rejected',
            'approver_id' => auth()->id(),
            'approval_notes' => $request->notes,
        ]);

        return redirect()->route('youth-profiles.show', $youth_profile)
            ->with('success', 'Profile rejected with feedback.');
    }

    public function manage(Request $request)
    {
        $query = YouthProfileRecord::query()
            ->join('personal_information', 'youth_profile_records.id', '=', 'personal_information.youth_profile_record_id')
            ->join('engagement_data', 'youth_profile_records.id', '=', 'engagement_data.youth_profile_record_id')
            ->select('youth_profile_records.*', 
                    'personal_information.full_name',
                    'personal_information.email',
                    'personal_information.phone',
                    'personal_information.birthdate',
                    'engagement_data.education_level',
                    'engagement_data.work_status as employment_status');

        // Handle search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('personal_information.full_name', 'like', "%{$search}%")
                  ->orWhere('personal_information.email', 'like', "%{$search}%")
                  ->orWhere('personal_information.phone', 'like', "%{$search}%");
            });
        }

        // Handle education filter
        if ($request->has('education') && $request->education !== 'all') {
            $query->where('engagement_data.education_level', $request->education);
        }

        // Handle age filter
        if ($request->has('age') && $request->age !== 'all') {
            $ageRange = explode('-', $request->age);
            if (count($ageRange) === 2) {
                $minAge = $ageRange[0];
                $maxAge = $ageRange[1];
                $query->whereRaw('TIMESTAMPDIFF(YEAR, personal_information.birthdate, CURDATE()) BETWEEN ? AND ?', [$minAge, $maxAge]);
            }
        }

        // Handle sorting
        $sort = $request->input('sort', 'name');
        $order = $request->input('order', 'asc');

        if ($sort === 'name') {
            $query->orderBy('personal_information.full_name', $order);
        } elseif ($sort === 'education') {
            $query->orderBy('engagement_data.education_level', $order);
        }

        // Execute the query with pagination
        $profiles = $query->with(['user', 'approver'])->paginate(10)->withQueryString();

        // Transform the data to match the expected format
        $profiles->through(function ($profile) {
            return [
                'id' => $profile->id,
                'full_name' => $profile->full_name,
                'birthdate' => $profile->birthdate,
                'email' => $profile->email,
                'phone' => $profile->phone,
                'education_level' => $profile->education_level,
                'work_status' => $profile->employment_status,
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ];
        });

        return Inertia::render('youth-profiles/manage/index', [
            'profiles' => $profiles,
            'sort' => $sort,
            'order' => $order,
            'education' => $request->input('education', 'all'),
            'age' => $request->input('age', 'all'),
            'search' => $request->input('search', ''),
        ]);
    }

    public function manageShow(YouthProfileRecord $profile)
    {
        $profile->load(['personalInformation', 'familyInformation', 'engagementData', 'user', 'approver']);

        return inertia('youth-profiles/manage/show', [
            'profile' => [
                'id' => $profile->id,
                'status' => 'approved',
                'personalInformation' => $profile->personalInformation ? [
                    'full_name' => $profile->personalInformation->full_name,
                    'birthdate' => $profile->personalInformation->birthdate,
                    'gender' => $profile->personalInformation->gender,
                    'email' => $profile->personalInformation->email,
                    'phone' => $profile->personalInformation->phone,
                    'address' => $profile->personalInformation->address,
                    'civil_status' => $profile->personalInformation->civil_status,
                    'youth_age_group' => $profile->personalInformation->youth_age_group,
                    'personal_monthly_income' => $profile->personalInformation->personal_monthly_income,
                    'interests_hobbies' => $profile->personalInformation->interests_hobbies,
                    'suggested_programs' => $profile->personalInformation->suggested_programs,
                ] : null,
                'familyInformation' => $profile->familyInformation ? [
                    'father_name' => $profile->familyInformation->father_name,
                    'mother_name' => $profile->familyInformation->mother_name,
                    'parents_monthly_income' => $profile->familyInformation->parents_monthly_income,
                ] : null,
                'engagementData' => $profile->engagementData ? [
                    'education_level' => $profile->engagementData->education_level,
                    'youth_classification' => $profile->engagementData->youth_classification,
                    'work_status' => $profile->engagementData->work_status,
                    'is_sk_voter' => $profile->engagementData->is_sk_voter,
                    'is_registered_national_voter' => $profile->engagementData->is_registered_national_voter,
                    'voted_last_election' => $profile->engagementData->voted_last_election,
                    'has_attended_assembly' => $profile->engagementData->has_attended_assembly,
                    'assembly_attendance' => $profile->engagementData->assembly_attendance,
                    'assembly_absence_reason' => $profile->engagementData->assembly_absence_reason,
                ] : null,
                'user' => [
                    'id' => $profile->user->id,
                    'name' => $profile->user->name,
                ],
                'approver' => $profile->approver ? [
                    'id' => $profile->approver->id,
                    'name' => $profile->approver->name,
                ] : null,
                'approval_notes' => $profile->approval_notes,
                'created_at' => $profile->created_at,
                'updated_at' => $profile->updated_at,
            ],
        ]);
    }

    public function destroy(Request $request, YouthProfileRecord $profile)
    {
        // Override the policy check to explicitly allow admins and superadmins
        if (auth()->user()->isAdmin() || auth()->user()->isSuperAdmin()) {
            try {
                DB::beginTransaction();
                
                \Log::info('Starting profile deletion by admin/superadmin', [
                    'profile_id' => $profile->id,
                    'user_id' => auth()->id(),
                    'user_role' => auth()->user()->role
                ]);

                // Use raw SQL to delete everything in one go
                // This bypasses Eloquent's events and relationship checks
                
                // 1. Delete related data first
                DB::statement("DELETE FROM personal_information WHERE youth_profile_record_id = ?", [$profile->id]);
                DB::statement("DELETE FROM family_information WHERE youth_profile_record_id = ?", [$profile->id]);
                DB::statement("DELETE FROM engagement_data WHERE youth_profile_record_id = ?", [$profile->id]);
                
                // 2. Delete the main record
                DB::statement("DELETE FROM youth_profile_records WHERE id = ?", [$profile->id]);
                
                DB::commit();
                
                \Log::info('Profile deleted successfully', [
                    'profile_id' => $profile->id,
                    'user_id' => auth()->id()
                ]);

                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => true,
                        'message' => 'Profile deleted successfully'
                    ]);
                }

                return redirect()->route('youth-profiles.manage')
                    ->with('success', 'Profile deleted successfully');
                
            } catch (\Exception $e) {
                DB::rollBack();
                
                \Log::error('Failed to delete profile', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'profile_id' => $profile->id
                ]);
                
                if ($request->wantsJson() || $request->ajax()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to delete profile: ' . $e->getMessage()
                    ], 500);
                }
                
                // Return a proper Inertia error response
                return back()->withException($e);
            }
        } else {
            // User is not an admin, return unauthorized
            \Log::warning('Unauthorized delete attempt', [
                'user_id' => auth()->id(),
                'user_role' => auth()->user()->role,
                'profile_id' => $profile->id
            ]);
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this profile'
                ], 403);
            }
            
            return back()->withException(new \Illuminate\Auth\Access\AuthorizationException('You are not authorized to delete this profile.'));
        }
    }

    /**
     * Direct admin-only method to delete a profile without policy checks
     */
    public function adminDelete(Request $request, $id)
    {
        try {
            // User must be an admin or superadmin (already checked by middleware)
            DB::beginTransaction();
            
            \Log::info('Admin directly deleting profile', [
                'profile_id' => $id,
                'user_id' => auth()->id(),
                'user_role' => auth()->user()->role
            ]);
            
            // Use raw SQL to delete everything in one go
            // 1. Delete related data first
            DB::statement("DELETE FROM personal_information WHERE youth_profile_record_id = ?", [$id]);
            DB::statement("DELETE FROM family_information WHERE youth_profile_record_id = ?", [$id]);
            DB::statement("DELETE FROM engagement_data WHERE youth_profile_record_id = ?", [$id]);
            
            // 2. Delete the main record
            DB::statement("DELETE FROM youth_profile_records WHERE id = ?", [$id]);
            
            DB::commit();
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Profile deleted successfully'
                ]);
            }
            
            return redirect()->route('youth-profiles.manage')
                ->with('success', 'Profile deleted successfully');
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Failed to delete profile via direct admin method', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'profile_id' => $id
            ]);
            
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error: ' . $e->getMessage()
                ], 500);
            }
            
            return back()->with('error', 'Failed to delete profile: ' . $e->getMessage());
        }
    }
} 