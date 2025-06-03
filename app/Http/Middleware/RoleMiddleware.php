<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();
        
        \Log::info('Role middleware check', [
            'user_id' => $user->id,
            'user_role' => $user->role,
            'required_roles' => $roles,
            'is_in_roles' => in_array($user->role, $roles),
            'is_active' => $user->isActive()
        ]);
        
        if (!$user->isActive()) {
            return $request->expectsJson()
                ? response()->json(['message' => 'Your account is inactive.'], 403)
                : redirect()->route('home')->with('error', 'Your account is inactive.');
        }

        if (!in_array($user->role, $roles)) {
            return $request->expectsJson()
                ? response()->json(['message' => 'You are not authorized to access this resource.'], 403)
                : redirect()->route('home')->with('error', 'You are not authorized to access this resource.');
        }

        return $next($request);
    }
} 