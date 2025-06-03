<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityMonitoringController extends Controller
{
    public function index(Request $request)
    {
        $query = Log::query()
            ->with(['user', 'subject'])
            ->latest();

        // Filter by action type
        if ($request->filled('type')) {
            $query->where('action', 'like', '%' . $request->type . '%');
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by model type
        if ($request->filled('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        $logs = $query->paginate(20)->through(function ($log) {
            return [
                'id' => $log->id,
                'user' => [
                    'id' => $log->user->id,
                    'first_name' => $log->user->first_name,
                    'last_name' => $log->user->last_name,
                    'email' => $log->user->email,
                ],
                'action' => $log->action,
                'model_type' => $log->model_type,
                'model_id' => $log->model_id,
                'details' => [
                    'old_values' => $log->old_values,
                    'new_values' => $log->new_values,
                    'additional' => $log->details,
                ],
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'created_at' => $log->created_at,
            ];
        });

        // Get list of users for the filter dropdown
        $users = User::select('id', 'first_name', 'last_name', 'email')
            ->orderBy('first_name')
            ->get();

        // Get list of unique model types for the filter dropdown
        $modelTypes = Log::distinct()
            ->pluck('model_type')
            ->filter()
            ->map(function ($type) {
                return [
                    'value' => $type,
                    'label' => class_basename($type),
                ];
            });

        // Get action types for the filter dropdown
        $actionTypes = Log::distinct()
            ->pluck('action')
            ->filter()
            ->map(function ($action) {
                return [
                    'value' => $action,
                    'label' => ucfirst($action),
                ];
            });

        return Inertia::render('settings/activity-monitoring', [
            'logs' => $logs,
            'filters' => $request->only(['type', 'user_id', 'date_from', 'date_to', 'model_type']),
            'users' => $users,
            'modelTypes' => $modelTypes,
            'actionTypes' => $actionTypes,
        ]);
    }

    public function show(Log $log)
    {
        $log->load(['user', 'subject']);
        
        return Inertia::render('settings/activity-log-detail', [
            'log' => [
                'id' => $log->id,
                'user' => [
                    'id' => $log->user->id,
                    'first_name' => $log->user->first_name,
                    'last_name' => $log->user->last_name,
                    'email' => $log->user->email,
                ],
                'action' => $log->action,
                'model_type' => $log->model_type,
                'model_id' => $log->model_id,
                'details' => [
                    'old_values' => $log->old_values,
                    'new_values' => $log->new_values,
                    'additional' => $log->details,
                ],
                'ip_address' => $log->ip_address,
                'user_agent' => $log->user_agent,
                'created_at' => $log->created_at,
                'subject' => $log->subject,
            ],
        ]);
    }
} 