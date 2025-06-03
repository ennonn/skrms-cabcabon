<?php

namespace App\Policies;

use App\Models\Proposal;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProposalPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any proposals.
     */
    public function viewAny(User $user): bool
    {
        \Log::info('ProposalPolicy@viewAny check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);

        return $user->isAdmin() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can view the proposal.
     */
    public function view(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@view check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
                'submitted_by' => $proposal->submitted_by,
            ],
        ]);

        return $user->id === $proposal->submitted_by || $user->isAdmin() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can create proposals.
     */
    public function create(User $user): bool
    {
        \Log::info('ProposalPolicy@create check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);

        return true; // All authenticated users can create proposals
    }

    /**
     * Determine whether the user can update the proposal.
     */
    public function update(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@update check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
                'submitted_by' => $proposal->submitted_by,
            ],
        ]);

        // Only allow updates if the proposal is in draft status
        if ($proposal->status !== 'draft') {
            return false;
        }

        return $user->id === $proposal->submitted_by || $user->isAdmin() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can delete the proposal.
     */
    public function delete(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@delete check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
            ],
        ]);

        return $user->isAdmin() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can manage proposals.
     */
    public function manage(User $user): bool
    {
        \Log::info('ProposalPolicy@manage check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
        ]);

        return $user->isAdmin() || $user->isSuperAdmin();
    }

    /**
     * Determine whether the user can approve proposals.
     */
    public function approve(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@approve check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
            ],
        ]);

        return ($user->isAdmin() || $user->isSuperAdmin()) && 
               ($proposal->status === 'pending' || $proposal->status === 'rejected');
    }

    /**
     * Determine whether the user can reject proposals.
     */
    public function reject(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@reject check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
            ],
        ]);

        return ($user->isAdmin() || $user->isSuperAdmin()) && 
               ($proposal->status === 'pending' || $proposal->status === 'approved');
    }

    /**
     * Determine whether the user can download proposal attachments.
     */
    public function download(User $user, Proposal $proposal): bool
    {
        \Log::info('ProposalPolicy@download check', [
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => $user->isAdmin(),
                'is_super_admin' => $user->isSuperAdmin(),
            ],
            'proposal' => [
                'id' => $proposal->id,
                'status' => $proposal->status,
                'submitted_by' => $proposal->submitted_by,
            ],
        ]);

        // Anyone with access to view the proposal can download attachments
        return $user->id === $proposal->submitted_by || $user->isAdmin() || $user->isSuperAdmin();
    }
} 