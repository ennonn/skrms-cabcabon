<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        try {
            $request->authenticate();

            $request->session()->regenerate();

            $user = Auth::user();

            if (!$user->is_active) {
                if ($request->wantsJson()) {
                    return Inertia::location(route('pending-activation'));
                }
                return redirect()->route('pending-activation');
            }

            if ($user->isAdmin() || $user->isSuperAdmin()) {
                if ($request->wantsJson()) {
                    return Inertia::location(route('admin.dashboard'));
                }
                return redirect()->route('admin.dashboard');
            }

            if ($request->wantsJson()) {
                return Inertia::location(route('dashboard'));
            }
            return redirect()->route('dashboard');

        } catch (\Exception $e) {
            return Inertia::render('auth/login', [
                'errors' => ['email' => 'These credentials do not match our records.'],
                'canResetPassword' => Route::has('password.request'),
                'status' => $request->session()->get('status'),
            ])->toResponse($request)->setStatusCode(422);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->wantsJson()) {
            return Inertia::location(route('home'));
        }
        return redirect()->route('home')->with('status', 'You have been logged out successfully.');
    }
}
