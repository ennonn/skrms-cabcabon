<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/activity/index', [
            'recentActivity' => Log::with('user')
                ->latest()
                ->take(10)
                ->get(),
            'stats' => [
                'total_logs' => Log::count(),
                'today_logs' => Log::whereDate('created_at', today())->count(),
                'this_week_logs' => Log::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
                'this_month_logs' => Log::whereMonth('created_at', now()->month)->count(),
            ]
        ]);
    }

    public function logs(Request $request)
    {
        $logs = Log::with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('action', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            })
            ->when($request->date_from, function ($query, $date) {
                $query->whereDate('created_at', '>=', $date);
            })
            ->when($request->date_to, function ($query, $date) {
                $query->whereDate('created_at', '<=', $date);
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/activity/logs', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'date_from', 'date_to']),
        ]);
    }

    public function auditTrail()
    {
        $auditTrail = Log::with('user')
            ->where('action', 'like', '%critical%')
            ->orWhere('action', 'like', '%security%')
            ->latest()
            ->paginate(15);

        return Inertia::render('admin/activity/audit-trail', [
            'auditTrail' => $auditTrail,
        ]);
    }

    public function clearLogs()
    {
        // Only clear logs older than 30 days
        Log::where('created_at', '<', now()->subDays(30))->delete();

        return back()->with('success', 'Old logs cleared successfully.');
    }
} 