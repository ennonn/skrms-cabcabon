<?php

namespace App\Models\Records;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class YouthProfileRecord extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'approver_id',
        'approval_notes',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function personalInformation(): HasOne
    {
        return $this->hasOne(PersonalInformation::class);
    }

    public function familyInformation(): HasOne
    {
        return $this->hasOne(FamilyInformation::class);
    }

    public function engagementData(): HasOne
    {
        return $this->hasOne(EngagementData::class);
    }
}
