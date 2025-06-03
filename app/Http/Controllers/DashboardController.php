<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Records\YouthProfileRecord;
use App\Models\Records\PendingYouthProfile;
use App\Models\Proposal;
use App\Models\ProposalCategory;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get total and active users count
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)
            ->whereNull('deleted_at')
            ->count();

        // Get user's proposals counts
        $myTotalProposals = Proposal::where('submitted_by', $user->id)
            ->whereNull('deleted_at')
            ->count();
        $myPendingProposals = Proposal::where('submitted_by', $user->id)
            ->where('status', 'pending')
            ->whereNull('deleted_at')
            ->count();
        
        // Get user's approved proposals and system total
        $myApprovedProposals = Proposal::where('submitted_by', $user->id)
            ->where('status', 'approved')
            ->whereNull('deleted_at')
            ->count();
        $totalProposals = Proposal::whereNotIn('status', ['draft'])
            ->whereNull('deleted_at')
            ->count();

        // Get youth profile counts
        $registeredYouthProfiles = YouthProfileRecord::whereNull('deleted_at')->count();
        $pendingYouthProfiles = PendingYouthProfile::where('status', 'pending')
            ->whereNull('deleted_at')
            ->count();

        // Get total budget from approved proposals
        $totalBudget = Proposal::where('status', 'approved')
            ->whereNull('deleted_at')
            ->sum('estimated_cost');

        // Dashboard statistics
        $stats = [
            'total_users' => [
                'value' => $totalUsers,
                'trend' => $activeUsers,
                'trend_text' => 'Active',
                'trend_direction' => 'up'
            ],
            'my_proposals' => [
                'value' => $myTotalProposals,
                'trend' => $myPendingProposals,
                'trend_text' => 'Pending Proposals',
                'trend_direction' => 'neutral'
            ],
            'approved_proposals' => [
                'value' => $myApprovedProposals,
                'trend' => $totalProposals,
                'trend_text' => 'total proposals',
                'trend_direction' => 'up'
            ],
            'registered_youth' => [
                'value' => $registeredYouthProfiles,
                'trend' => $pendingYouthProfiles,
                'trend_text' => 'Pending Youth Profiles',
                'trend_direction' => 'up'
            ],
            'total_budget' => $totalBudget
        ];

        // Get proposal status distribution (for task status)
        $proposalStatus = [
            ['label' => 'Approved Proposals', 'value' => Proposal::where('status', 'approved')->whereNull('deleted_at')->count()],
            ['label' => 'Pending Proposals', 'value' => Proposal::where('status', 'pending')->whereNull('deleted_at')->count()],
            ['label' => 'Rejected Proposals', 'value' => Proposal::where('status', 'rejected')->whereNull('deleted_at')->count()]
        ];

        // Get youth profile status distribution (replacing system metrics)
        $youthProfileStatus = [
            ['label' => 'Approved Profiles', 'value' => YouthProfileRecord::whereNull('deleted_at')->count()],
            ['label' => 'Pending Profiles', 'value' => PendingYouthProfile::where('status', 'pending')->whereNull('deleted_at')->count()],
            ['label' => 'Rejected Profiles', 'value' => PendingYouthProfile::where('status', 'rejected')->whereNull('deleted_at')->count()]
        ];

        // Get proposal categories count (for linear/bar chart)
        $proposalCategories = ProposalCategory::withCount(['proposals' => function($query) {
                $query->whereNull('deleted_at');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'category' => $category->name,
                    'value' => $category->proposals_count
                ];
            });

        // Calculate total non-draft proposals
        $totalProposals = Proposal::whereNotIn('status', ['draft'])
            ->whereNull('deleted_at')
            ->count();

        // Get monthly stats for proposals (excluding drafts)
        $monthlyStats = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            $proposalCount = Proposal::whereNotIn('status', ['draft'])
                ->whereNull('deleted_at')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $monthlyStats[] = [
                'month' => $date->format('M Y'),
                'value' => $proposalCount
            ];
        }

        $chartData = [
            'proposal_categories' => $proposalCategories, // Linear/bar chart data
            'proposal_status' => $proposalStatus,         // Task status data
            'youth_profile_status' => $youthProfileStatus, // Pie chart data (replacing system metrics)
            'monthly_stats' => $monthlyStats              // Monthly frequency of proposals
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'chartData' => $chartData
        ]);
    }

    public function adminDashboard()
    {
        // Get total and active users count
        $totalUsers = User::count();
        $activeUsers = User::where('is_active', true)
            ->whereNull('deleted_at')
            ->count();

        // Get total proposals counts
        $totalProposals = Proposal::whereNotIn('status', ['draft'])
            ->whereNull('deleted_at')
            ->count();
        $pendingProposals = Proposal::where('status', 'pending')
            ->whereNull('deleted_at')
            ->count();
        
        // Get total approved proposals
        $approvedProposals = Proposal::where('status', 'approved')
            ->whereNull('deleted_at')
            ->count();

        // Get youth profile counts
        $registeredYouthProfiles = YouthProfileRecord::whereNull('deleted_at')->count();
        $pendingYouthProfiles = PendingYouthProfile::where('status', 'pending')
            ->whereNull('deleted_at')
            ->count();

        // Get total budget from approved proposals
        $totalBudget = Proposal::where('status', 'approved')
            ->whereNull('deleted_at')
            ->sum('estimated_cost');

        // Admin Dashboard statistics
        $stats = [
            'total_users' => [
                'value' => $totalUsers,
                'trend' => $activeUsers,
                'trend_text' => 'Active Users',
                'trend_direction' => 'up'
            ],
            'total_proposals' => [
                'value' => $totalProposals,
                'trend' => $pendingProposals,
                'trend_text' => 'Pending Review',
                'trend_direction' => 'neutral'
            ],
            'approved_proposals' => [
                'value' => $approvedProposals,
                'trend' => $totalProposals,
                'trend_text' => 'Total Proposals',
                'trend_direction' => 'up'
            ],
            'registered_youth' => [
                'value' => $registeredYouthProfiles,
                'trend' => $pendingYouthProfiles,
                'trend_text' => 'Pending Registration',
                'trend_direction' => 'up'
            ],
            'total_budget' => $totalBudget
        ];

        // Get proposal status counts
        $proposalStatusCounts = [
            'approved' => Proposal::where('status', 'approved')->whereNull('deleted_at')->count(),
            'pending' => Proposal::where('status', 'pending')->whereNull('deleted_at')->count(),
            'rejected' => Proposal::where('status', 'rejected')->whereNull('deleted_at')->count()
        ];

        // Get youth profile status counts
        $youthStatusCounts = [
            'approved' => YouthProfileRecord::whereNull('deleted_at')->count(),
            'pending' => PendingYouthProfile::where('status', 'pending')->whereNull('deleted_at')->count(),
            'rejected' => PendingYouthProfile::where('status', 'rejected')->whereNull('deleted_at')->count()
        ];

        // Get category budgets for approved proposals
        $categoryBudgets = ProposalCategory::withSum(['proposals' => function($query) {
            $query->where('status', 'approved')->whereNull('deleted_at');
        }], 'estimated_cost')
        ->get()
        ->map(function ($category) {
            return [
                'category' => $category->name,
                'value' => floatval($category->proposals_sum_estimated_cost ?? 0)
            ];
        });

        // Get proposal categories with counts
        $proposalCategories = ProposalCategory::withCount(['proposals' => function($query) {
                $query->whereNotIn('status', ['draft'])->whereNull('deleted_at');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'category' => $category->name,
                    'count' => $category->proposals_count
                ];
            });

        // Get monthly proposal frequency
        $proposalFrequency = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $count = Proposal::whereNotIn('status', ['draft'])
                ->whereNull('deleted_at')
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();

            $proposalFrequency[] = [
                'month' => $date->format('M Y'),
                'value' => $count
            ];
        }

        // Get recent proposals by status
        $recentApprovedProposals = Proposal::with('submitter')
            ->where('status', 'approved')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($proposal) {
                return [
                    'id' => $proposal->id,
                    'title' => $proposal->title,
                    'status' => $proposal->status,
                    'submitted_by' => $proposal->submitter->name,
                    'created_at' => $proposal->created_at
                ];
            });

        $recentPendingProposals = Proposal::with('submitter')
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($proposal) {
                return [
                    'id' => $proposal->id,
                    'title' => $proposal->title,
                    'status' => $proposal->status,
                    'submitted_by' => $proposal->submitter->name,
                    'created_at' => $proposal->created_at
                ];
            });

        $recentRejectedProposals = Proposal::with('submitter')
            ->where('status', 'rejected')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($proposal) {
                return [
                    'id' => $proposal->id,
                    'title' => $proposal->title,
                    'status' => $proposal->status,
                    'submitted_by' => $proposal->submitter->name,
                    'created_at' => $proposal->created_at
                ];
            });

        // Get recent youth profiles by status
        $recentApprovedYouth = YouthProfileRecord::with('personalInformation')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->personalInformation->full_name,
                    'status' => 'approved',
                    'created_at' => $profile->created_at
                ];
            });

        $recentPendingYouth = PendingYouthProfile::where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->full_name,
                    'status' => 'pending',
                    'created_at' => $profile->created_at
                ];
            });

        $recentRejectedYouth = PendingYouthProfile::where('status', 'rejected')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($profile) {
                return [
                    'id' => $profile->id,
                    'name' => $profile->full_name,
                    'status' => 'rejected',
                    'created_at' => $profile->created_at
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'categoryBudgets' => $categoryBudgets,
            'statusCounts' => [
                'proposals' => $proposalStatusCounts,
                'youth' => $youthStatusCounts
            ],
            'proposalCategories' => $proposalCategories,
            'proposalFrequency' => $proposalFrequency,
            'recentProposals' => [
                'approved' => $recentApprovedProposals,
                'pending' => $recentPendingProposals,
                'rejected' => $recentRejectedProposals
            ],
            'recentYouth' => [
                'approved' => $recentApprovedYouth,
                'pending' => $recentPendingYouth,
                'rejected' => $recentRejectedYouth
            ]
        ]);
    }
}
