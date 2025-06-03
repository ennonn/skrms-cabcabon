<?php

namespace App\Models\Records;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Casts\Attribute;

class PendingYouthProfile extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    protected $table = 'pending_youth_profiles';

    protected $fillable = [
        'user_id',
        'status',
        'approver_id',
        'approval_notes',
        'data_collection_agreement',
        'form_submitted_at',
        // Personal Information
        'full_name',
        'address',
        'gender',
        'birthdate',
        'age',
        'email',
        'phone',
        'civil_status',
        'youth_age_group',
        'personal_monthly_income',
        'interests_hobbies',
        'suggested_programs',
        // Family Information
        'mother_name',
        'father_name',
        'parents_monthly_income',
        // Engagement Data
        'education_level',
        'youth_classification',
        'work_status',
        'is_sk_voter',
        'is_registered_national_voter',
        'voted_last_election',
        'assembly_attendance',
        'assembly_absence_reason',
    ];

    protected $casts = [
        'birthdate' => 'date',
        'age' => 'integer',
        'personal_monthly_income' => 'decimal:2',
        'parents_monthly_income' => 'decimal:2',
        'is_sk_voter' => 'boolean',
        'is_registered_national_voter' => 'boolean',
        'voted_last_election' => 'boolean',
        'assembly_attendance' => 'integer',
    ];

    // Accessors & Mutators
    protected function gender(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value,
            set: function ($value) {
                $normalized = ucfirst(strtolower($value));
                if (!in_array($normalized, ['Male', 'Female'])) {
                    throw new \InvalidArgumentException('Gender must be either Male or Female');
                }
                return $normalized;
            }
        );
    }

    // Status constants
    public const STATUS_DRAFT = 'draft';
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    // Helper methods
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    public function canBeEdited(): bool
    {
        // Only draft profiles can be edited
        return $this->isDraft();
    }

    public function canBeSubmitted(): bool
    {
        // Both draft and rejected profiles can be submitted
        return $this->isDraft() || $this->isRejected();
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly([
                'status',
                'approval_notes',
                'full_name',
                'address',
                'gender',
                'birthdate',
                'email',
                'phone',
                'civil_status',
                'youth_age_group',
                'personal_monthly_income',
                'interests_hobbies',
                'suggested_programs',
                'mother_name',
                'father_name',
                'parents_monthly_income',
                'education_level',
                'youth_classification',
                'work_status',
                'is_sk_voter',
                'is_registered_national_voter',
                'voted_last_election',
                'assembly_attendance',
                'assembly_absence_reason',
            ])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }

    // Add this helper method for debugging
    public function validate()
    {
        try {
            // Basic validation - these fields are required
            return !empty($this->full_name) && 
                   !empty($this->address) && 
                   !empty($this->gender) && 
                   !empty($this->birthdate) && 
                   !empty($this->education_level) && 
                   !empty($this->work_status);
        } catch (\Exception $e) {
            \Log::error('Validation failed', [
                'error' => $e->getMessage(),
                'model' => $this->toArray()
            ]);
            return false;
        }
    }
} 