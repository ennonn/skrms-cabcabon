<?php

namespace App\Policies;

use App\Models\Records\YouthProfileRecord;
use App\Models\User;

class YouthProfileRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, YouthProfileRecord $record): bool
    {
        return $user->isActive() && (
            $user->id === $record->user_id || 
            $user->isAdmin() || 
            $user->isSuperAdmin()
        );
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function update(User $user, YouthProfileRecord $record): bool
    {
        return $user->isActive() && (
            $user->id === $record->user_id || 
            $user->isAdmin() || 
            $user->isSuperAdmin()
        );
    }

    public function delete(User $user, YouthProfileRecord $record): bool
    {
        return $user->isActive() && (
            $user->isAdmin() || 
            $user->isSuperAdmin()
        );
    }
} 