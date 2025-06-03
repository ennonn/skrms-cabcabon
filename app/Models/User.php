<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone_number',
        'birthdate',
        'role',
        'is_active',
        'promoted_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'birthdate' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function promotedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'promoted_by');
    }

    public function promotedUsers(): HasMany
    {
        return $this->hasMany(User::class, 'promoted_by');
    }

    public function youthProfiles(): HasMany
    {
        return $this->hasMany(YouthProfile::class);
    }

    public function budgetPlans(): HasMany
    {
        return $this->hasMany(BudgetPlan::class, 'submitted_by');
    }

    public function activityPlans(): HasMany
    {
        return $this->hasMany(ActivityPlan::class, 'submitted_by');
    }

    public function approvedBudgetPlans(): HasMany
    {
        return $this->hasMany(BudgetPlan::class, 'approved_by');
    }

    public function approvedActivityPlans(): HasMany
    {
        return $this->hasMany(ActivityPlan::class, 'approved_by');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(Log::class);
    }

    public function backups(): HasMany
    {
        return $this->hasMany(Backup::class, 'admin_id');
    }

    // Helper methods
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'superadmin';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isUser(): bool
    {
        return $this->role === 'user';
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }
}
