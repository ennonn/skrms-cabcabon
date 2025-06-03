<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckMaintenanceMode
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (config('app.maintenance_mode')) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'System is under maintenance. Please try again later.',
                    'status' => 'maintenance'
                ], 503);
            }

            return Inertia::render('errors/maintenance', [
                'status' => 503,
                'message' => 'System is under maintenance. Please try again later.'
            ])->toResponse($request)->setStatusCode(503);
        }

        return $next($request);
    }
} 