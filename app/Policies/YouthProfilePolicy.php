<?php

namespace App\Policies;

use App\Models\Records\PendingYouthProfile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class YouthProfilePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->isActive();
    }

    public function view(User $user, PendingYouthProfile $youthProfile): bool
    {
        return $user->isActive();
    }

    public function create(User $user): bool
    {
        return $user->isActive();
    }

    public function update(User $user, PendingYouthProfile $youthProfile): bool
    {
        \Log::info('YouthProfilePolicy@update - Starting authorization check', [
            'user' => [
                'id' => $user->id,
                'roles' => [
                    'is_admin' => $user->isAdmin(),
                    'is_superadmin' => $user->isSuperAdmin(),
                    'is_active' => $user->isActive()
                ]
            ],
            'profile' => [
                'id' => $youthProfile->id,
                'user_id' => $youthProfile->user_id,
                'status' => $youthProfile->status
            ],
            'conditions' => [
                'is_same_user' => $user->id === $youthProfile->user_id,
                'is_draft_or_rejected' => in_array($youthProfile->status, ['draft', 'rejected'])
            ]
        ]);

        // Check superadmin first
        if ($user->isSuperAdmin()) {
            \Log::info('YouthProfilePolicy@update - Allowing access: User is superadmin');
            return true;
        }

        // Then check draft/rejected status and ownership
        if ($youthProfile->status === 'draft' || $youthProfile->status === 'rejected') {
            $hasAccess = $user->id === $youthProfile->user_id;
            \Log::info('YouthProfilePolicy@update - Regular user check', [
                'has_access' => $hasAccess,
                'reason' => $hasAccess ? 'User owns the profile' : 'User does not own the profile'
            ]);
            return $hasAccess;
        }

        \Log::info('YouthProfilePolicy@update - Denying access: Profile is not draft/rejected and user is not superadmin');
        return false;
    }

    public function submit(User $user, PendingYouthProfile $youthProfile): bool
    {
        // Only the creator can submit draft or rejected profiles
        if ($youthProfile->status === 'draft' || $youthProfile->status === 'rejected') {
            return $user->id === $youthProfile->user_id;
        }

        return false;
    }

    public function approve(User $user, PendingYouthProfile $youthProfile): bool
    {
        \Log::info('Starting policy check for approve action', [
            'user' => [
                'id' => $user->id,
                'is_active' => $user->isActive(),
            ],
            'profile' => [
                'id' => $youthProfile->id,
                'status' => $youthProfile->status,
            ]
        ]);

        $canApprove = $user->isActive() && $youthProfile->status === 'pending';

        \Log::info('Policy check result', [
            'can_approve' => $canApprove,
            'reason' => !$canApprove ? 'User is not active or profile is not pending' : 'User can approve'
        ]);

        return $canApprove;
    }

    public function reject(User $user, PendingYouthProfile $youthProfile): bool
    {
        // Only admins and superadmins can reject pending profiles
        return ($user->isAdmin() || $user->isSuperAdmin()) && 
               $user->isActive() && 
               $youthProfile->status === 'pending';
    }

    public function editRejected(User $user, PendingYouthProfile $profile): bool
    {
        return $user->role === 'admin' || $user->role === 'superadmin';
    }
} 