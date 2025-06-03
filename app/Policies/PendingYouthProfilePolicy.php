<?php

namespace App\Policies;

use App\Models\Records\PendingYouthProfile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PendingYouthProfilePolicy
{
    use HandlesAuthorization;

    public function view(User $user, PendingYouthProfile $profile)
    {
        return $user->id === $profile->user_id || $user->isAdmin() || $user->isSuperAdmin();
    }

    public function update(User $user, PendingYouthProfile $profile)
    {
        return $user->id === $profile->user_id || $user->isAdmin() || $user->isSuperAdmin();
    }

    public function delete(User $user, PendingYouthProfile $profile)
    {
        return $user->id === $profile->user_id || $user->isAdmin() || $user->isSuperAdmin();
    }

    public function submit(User $user, PendingYouthProfile $profile)
    {
        return $user->id === $profile->user_id || $user->isAdmin() || $user->isSuperAdmin();
    }

    public function viewAny(User $user)
    {
        return true; // Everyone can view the list
    }

    public function create(User $user)
    {
        return true; // Everyone can create
    }
} 