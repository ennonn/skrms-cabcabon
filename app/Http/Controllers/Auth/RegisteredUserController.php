<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse|Response
    {
        try {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
                'birthdate' => 'required|date|before:today',
                'phone_number' => 'required|string|regex:/^[0-9]{11}$/',
            ]);

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'birthdate' => $request->birthdate,
                'phone_number' => $request->phone_number,
                'role' => 'user',
                'is_active' => false, // Users start inactive until approved
            ]);

            event(new Registered($user));

            Auth::login($user);

            return to_route('pending-activation');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return Inertia::render('auth/register', [
                'errors' => $e->errors(),
            ])->with('status', 'registration-error');
        } catch (\Exception $e) {
            return Inertia::render('auth/register', [
                'errors' => [
                    'email' => ['An unexpected error occurred during registration.'],
                ],
            ])->with('status', 'registration-error');
        }
    }
}
