<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Proposal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'proposal_category_id',
        'description',
        'estimated_cost',
        'frequency',
        'funding_source',
        'people_involved',
        'status',
        'submitted_by',
        'approved_by',
        'rejection_reason',
        'location',
        'objectives',
        'expected_outcomes',
        'implementation_start_date',
        'implementation_end_date'
    ];

    protected $casts = [
        'estimated_cost' => 'decimal:2',
    ];

    // Define valid status transitions
    private const STATUS_TRANSITIONS = [
        'draft' => ['pending'],
        'pending' => ['approved', 'rejected'],
        'approved' => [],  // Terminal state
        'rejected' => ['pending']  // Can be resubmitted
    ];

    // Define valid statuses
    public const STATUSES = [
        'draft',
        'pending',
        'approved',
        'rejected'
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProposalCategory::class, 'proposal_category_id');
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'draft' => ['label' => 'Draft', 'color' => 'gray'],
            'pending' => ['label' => 'Pending', 'color' => 'yellow'],
            'approved' => ['label' => 'Approved', 'color' => 'green'],
            'rejected' => ['label' => 'Rejected', 'color' => 'red'],
            default => ['label' => $this->status, 'color' => 'gray'],
        };
    }

    public function getCategoryColorAttribute()
    {
        return DB::table('proposal_categories')
            ->where('name', $this->category)
            ->value('color') ?? '#000000';
    }

    public function canTransitionTo(string $newStatus): bool
    {
        if (!in_array($newStatus, self::STATUSES)) {
            return false;
        }

        return in_array($newStatus, self::STATUS_TRANSITIONS[$this->status] ?? []);
    }

    public function transitionTo(string $newStatus): bool
    {
        if (!$this->canTransitionTo($newStatus)) {
            \Log::warning('Invalid status transition attempted', [
                'proposal_id' => $this->id,
                'current_status' => $this->status,
                'attempted_status' => $newStatus
            ]);
            return false;
        }

        $this->status = $newStatus;
        return true;
    }

    public function canBeEdited(): bool
    {
        return in_array($this->status, ['draft', 'rejected']);
    }

    public function canBeSubmitted(): bool
    {
        return $this->status === 'draft';
    }

    public function canBeWithdrawn(): bool
    {
        return $this->status === 'pending';
    }

    public function canBeApproved(): bool
    {
        return $this->status === 'pending';
    }

    public function canBeRejected(): bool
    {
        return $this->status === 'pending';
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved')
                    ->whereNotNull('approved_by');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public static function getStatuses(): array
    {
        return self::STATUSES;
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProposalDocument::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(ProposalAttachment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($proposal) {
            // Log status changes
            if ($proposal->isDirty('status')) {
                \Log::info('Proposal status change', [
                    'proposal_id' => $proposal->id,
                    'old_status' => $proposal->getOriginal('status'),
                    'new_status' => $proposal->status,
                    'user_id' => auth()->id()
                ]);
            }
        });
    }
} 