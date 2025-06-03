<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $sortBy = $request->input('sort', 'role'); // Default sort by role
        $sortOrder = $request->input('order', 'asc');
        $roleFilter = $request->input('role', 'all');
        $search = $request->input('search', '');

        $query = User::with('promotedBy');

        // Apply search if provided
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone_number', 'like', "%{$search}%");
            });
        }

        // Apply role filter if not "all"
        if ($roleFilter !== 'all') {
            $query->where('role', $roleFilter);
        }

        // Get the current user first
        $currentUser = auth()->user();

        // Build the main query based on sort type
        if ($sortBy === 'status') {
            $query->orderBy('is_active', $sortOrder)
                  ->orderBy('first_name', 'asc')
                  ->orderBy('last_name', 'asc');
        } else {
            // Default sorting (role hierarchy)
            $query->orderByRaw("
                CASE 
                    WHEN role = 'superadmin' THEN 2
                    WHEN role = 'admin' THEN 3
                    WHEN role = 'user' THEN 4
                END")
                ->orderBy('first_name', 'asc')
                ->orderBy('last_name', 'asc');
        }

        $users = $query->paginate(10);

        // Move current user to the top of the list
        $users = $users->toArray();
        $currentUserData = null;
        
        foreach ($users['data'] as $key => $user) {
            if ($user['id'] === $currentUser->id) {
                $currentUserData = $user;
                unset($users['data'][$key]);
                break;
            }
        }

        if ($currentUserData) {
            array_unshift($users['data'], $currentUserData);
        }

        return inertia('admin/users/index', [
            'users' => $users,
            'sort' => $sortBy,
            'order' => $sortOrder,
            'roleFilter' => $roleFilter,
            'search' => $search,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function toggleActivation(User $user)
    {
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.users.index')->with('error', 'Cannot modify superadmin status.');
        }

        try {
            $user->is_active = !$user->is_active;
            $user->save();

            // Log the action
            $user->logs()->create([
                'user_id' => auth()->id(),
                'action' => $user->is_active ? 'activated_user' : 'deactivated_user',
                'details' => ['target_user' => $user->id],
                'ip_address' => request()->ip(),
            ]);

            // Notify the user
            try {
                $user->notifications()->create([
                    'message' => $user->is_active 
                        ? 'Your account has been activated. You can now log in.'
                        : 'Your account has been deactivated. Please contact the administrator.',
                ]);
            } catch (\Exception $e) {
                \Log::warning('Failed to create notification: ' . $e->getMessage());
            }

            return redirect()->route('admin.users.index')->with('success', 
                $user->is_active ? 'User activated successfully.' : 'User deactivated successfully.');
        } catch (\Exception $e) {
            \Log::error('Failed to toggle user activation: ' . $e->getMessage());
            return redirect()->route('admin.users.index')->with('error', 'Failed to toggle user activation.');
        }
    }

    public function promoteToAdmin(User $user)
    {
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.users.index')->with('error', 'Cannot modify superadmin status.');
        }

        try {
            $user->role = 'admin';
            $user->promoted_by = auth()->id();
            $user->save();

            // Log the action
            $user->logs()->create([
                'user_id' => auth()->id(),
                'action' => 'promoted_to_admin',
                'details' => ['target_user' => $user->id],
                'ip_address' => request()->ip(),
            ]);

            // Try to create notification, but don't let it affect the success
            try {
                $user->notifications()->create([
                    'message' => 'You have been promoted to admin status.',
                ]);
            } catch (\Exception $e) {
                \Log::warning('Failed to create notification: ' . $e->getMessage());
            }

            return redirect()->route('admin.users.index')->with('success', 'User promoted to admin successfully.');
        } catch (\Exception $e) {
            \Log::error('Failed to promote user: ' . $e->getMessage());
            return redirect()->route('admin.users.index')->with('error', 'Failed to promote user.');
        }
    }

    public function demoteToUser(User $user)
    {
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.users.index')->with('error', 'Cannot modify superadmin status.');
        }

        if ($user->promoted_by !== auth()->id() && !auth()->user()->isSuperAdmin()) {
            return redirect()->route('admin.users.index')->with('error', 'You can only demote users you promoted.');
        }

        try {
            $user->role = 'user';
            $user->promoted_by = null;
            $user->save();

            // Log the action
            $user->logs()->create([
                'user_id' => auth()->id(),
                'action' => 'demoted_to_user',
                'details' => ['target_user' => $user->id],
                'ip_address' => request()->ip(),
            ]);

            // Try to create notification, but don't let it affect the success
            try {
                $user->notifications()->create([
                    'message' => 'You have been demoted to user status.',
                ]);
            } catch (\Exception $e) {
                \Log::warning('Failed to create notification: ' . $e->getMessage());
            }

            return redirect()->route('admin.users.index')->with('success', 'User demoted to user successfully.');
        } catch (\Exception $e) {
            \Log::error('Failed to demote user: ' . $e->getMessage());
            return redirect()->route('admin.users.index')->with('error', 'Failed to demote user.');
        }
    }

    public function edit(User $user)
    {
        if ($user->isSuperAdmin()) {
            return back()->with('error', 'Cannot modify superadmin.');
        }

        // Format the birthdate to yyyy-MM-dd
        $formattedUser = $user->toArray();
        $formattedUser['birthdate'] = $user->birthdate ? $user->birthdate->format('Y-m-d') : null;

        return inertia('admin/users/edit', [
            'user' => $formattedUser,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin.users.index')->with('error', 'Cannot modify superadmin.');
        }

        try {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'birthdate' => 'required|date|before:today',
                'phone_number' => 'required|string|regex:/^[0-9]{11}$/',
            ]);

            $user->update($request->only(['first_name', 'last_name', 'birthdate', 'phone_number']));

            // Log the action
            $user->logs()->create([
                'user_id' => auth()->id(),
                'action' => 'updated_user',
                'details' => ['target_user' => $user->id],
                'ip_address' => request()->ip(),
            ]);

            return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users.index')->with('error', 'Failed to update user.');
        }
    }

    public function destroy(User $user)
    {
        if ($user->role === 'superadmin') {
            return Inertia::render('admin/users/index', [
                'users' => User::with('promotedBy')->paginate(10),
                'error' => 'Cannot delete superadmin accounts.'
            ]);
        }

        try {
            $user->delete();
            
            Log::info('User deleted', [
                'user_id' => $user->id,
                'deleted_by' => auth()->id()
            ]);

            return redirect()->route('admin.users.index')->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.users.index')->with('error', 'Failed to delete user. Please try again.');
        }
    }
} 