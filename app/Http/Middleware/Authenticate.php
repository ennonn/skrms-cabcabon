<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        \Log::info('Auth middleware redirectTo called', [
            'is_ajax' => $request->expectsJson(),
            'path' => $request->path(),
            'method' => $request->method(),
            'auth_check' => auth()->check(),
            'session_id' => session()->getId(),
            'session_has_auth' => session()->has('auth'),
        ]);

        if ($request->header('X-Inertia')) {
            return null; // Let the unauthenticated method handle Inertia requests
        }

        return $request->expectsJson() ? null : route('login');
    }

    /**
     * Handle an unauthenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  array  $guards
     * @return void
     *
     * @throws \Illuminate\Auth\AuthenticationException
     */
    protected function unauthenticated($request, array $guards)
    {
        \Log::info('Auth middleware unauthenticated called', [
            'guards' => $guards,
            'is_ajax' => $request->expectsJson(),
            'path' => $request->path(),
            'method' => $request->method(),
            'auth_check' => auth()->check(),
            'session_id' => session()->getId(),
            'session_has_auth' => session()->has('auth'),
        ]);

        if ($request->header('X-Inertia')) {
            return Inertia::render('errors/inactive-session', [
                'status' => 440,
                'message' => 'You have been inactive for a while. Please log in again to continue.'
            ])->toResponse($request)->setStatusCode(440);
        }

        if ($request->expectsJson()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        return response()->view('errors.inactive-session', [
            'status' => 440,
            'message' => 'You have been inactive for a while. Please log in again to continue.'
        ], 440);
    }
} 