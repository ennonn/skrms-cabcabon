<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        \Log::info('CheckRole middleware', [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
                'is_active' => $request->user()->is_active,
            ] : 'No user',
            'required_roles' => $roles,
            'path' => $request->path(),
            'method' => $request->method(),
            'route' => $request->route()->getName(),
        ]);

        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            if ($request->user() && !$request->user()->is_active) {
                \Log::warning('User not active, redirecting to pending activation', [
                    'user_id' => $request->user()->id,
                    'user_email' => $request->user()->email,
                ]);
                return Inertia::render('auth/pending-activation');
            }
            
            \Log::warning('Unauthorized action in role middleware', [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : 'No user',
                'required_roles' => $roles,
            ]);

            return Inertia::render('errors/forbidden', [
                'status' => 403,
                'message' => 'You do not have permission to perform this action.'
            ])->toResponse($request)->setStatusCode(403);
        }

        return $next($request);
    }
} 