<?php

namespace App\Http\Controllers;

use App\Models\Proposal;
use App\Models\User;
use App\Models\Records\YouthProfileRecord;
use App\Models\Records\PersonalInformation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/analytics/dashboard');
    }

    private function getUserActivity()
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        
        return DB::table('activity_log')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(DISTINCT causer_id) as active_users'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getFundingDistribution()
    {
        return Proposal::where('status', 'approved')
            ->join('proposal_categories', 'proposals.proposal_category_id', '=', 'proposal_categories.id')
            ->select('proposal_categories.name as category', DB::raw('SUM(estimated_cost) as total_budget'))
            ->groupBy('proposal_categories.id', 'proposal_categories.name')
            ->get();
    }

    private function getAgeDistribution()
    {
        return PersonalInformation::join('youth_profile_records', 'personal_information.youth_profile_record_id', '=', 'youth_profile_records.id')
            ->whereNotNull('youth_profile_records.approver_id')
            ->select('age', DB::raw('COUNT(*) as count'))
            ->groupBy('age')
            ->orderBy('age')
            ->get();
    }

    private function getSkillsDistribution()
    {
        return PersonalInformation::join('youth_profile_records', 'personal_information.youth_profile_record_id', '=', 'youth_profile_records.id')
            ->whereNotNull('youth_profile_records.approver_id')
            ->whereNotNull('interests_hobbies')
            ->select('interests_hobbies as skills', DB::raw('COUNT(*) as count'))
            ->groupBy('interests_hobbies')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
    }

    private function getBudgetUtilization()
    {
        $sixMonthsAgo = Carbon::now()->subMonths(6)->startOfMonth();
        
        return Proposal::where('status', 'approved')
            ->where('proposals.created_at', '>=', $sixMonthsAgo)
            ->join('proposal_categories', 'proposals.proposal_category_id', '=', 'proposal_categories.id')
            ->select(
                DB::raw('DATE_FORMAT(proposals.created_at, "%Y-%m") as month'),
                'proposal_categories.name as category',
                DB::raw('SUM(estimated_cost) as total_budget')
            )
            ->groupBy('month', 'proposal_categories.id', 'proposal_categories.name')
            ->orderBy('month')
            ->get();
    }

    private function getApprovalTimeline()
    {
        return Proposal::whereIn('status', ['approved', 'rejected'])
            ->select(
                'status',
                DB::raw('AVG(TIMESTAMPDIFF(HOUR, created_at, updated_at)) as avg_hours'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('status')
            ->get();
    }

    private function getReviewerActivity()
    {
        return Proposal::whereNotNull('approved_by')
            ->join('users', 'users.id', '=', 'proposals.approved_by')
            ->select(
                DB::raw('CONCAT(users.first_name, " ", users.last_name) as reviewer'),
                DB::raw('COUNT(*) as reviewed_count'),
                DB::raw('AVG(TIMESTAMPDIFF(HOUR, proposals.created_at, proposals.updated_at)) as avg_response_time')
            )
            ->groupBy('users.id', 'users.first_name', 'users.last_name')
            ->orderByDesc('reviewed_count')
            ->get();
    }

    private function getEngagementMetrics()
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        
        $totalLogins = DB::table('activity_log')
            ->where('description', 'logged-in')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->count();

        $activeUsers = DB::table('activity_log')
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->distinct('causer_id')
            ->count('causer_id');

        $totalUsers = User::count();
        
        return [
            'total_logins' => $totalLogins,
            'active_users' => $activeUsers,
            'user_engagement_rate' => round(($activeUsers / $totalUsers) * 100, 2),
            'avg_daily_active_users' => round($activeUsers / 30, 2),
        ];
    }
} 