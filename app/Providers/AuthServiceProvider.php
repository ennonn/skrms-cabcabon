<?php

namespace App\Providers;

use App\Models\Records\PendingYouthProfile;
use App\Models\Records\YouthProfileRecord;
use App\Models\Proposal;
use App\Models\User;
use App\Policies\YouthProfilePolicy;
use App\Policies\YouthProfileRecordPolicy;
use App\Policies\ProposalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        PendingYouthProfile::class => \App\Policies\PendingYouthProfilePolicy::class,
        YouthProfileRecord::class => YouthProfileRecordPolicy::class,
        Proposal::class => ProposalPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Superadmin override - they can do anything
        Gate::before(function (User $user, string $ability) {
            if ($user->isSuperAdmin()) {
                return true;
            }
        });

        // Add this in the boot method
        Gate::define('viewDebugTools', function ($user) {
            return app()->environment('local', 'development') || 
                in_array($user->role, ['admin', 'superadmin']);
        });

        // Define manage-proposals ability
        Gate::define('manage-proposals', function (User $user) {
            return in_array($user->role, ['admin', 'superadmin']);
        });
    }
} 