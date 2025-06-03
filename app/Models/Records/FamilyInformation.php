<?php

namespace App\Models\Records;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FamilyInformation extends Model
{
    protected $fillable = [
        'youth_profile_record_id',
        'mother_name',
        'mother_age',
        'father_name',
        'father_age',
        'parents_monthly_income',
    ];

    protected $casts = [
        'mother_age' => 'integer',
        'father_age' => 'integer',
        'parents_monthly_income' => 'decimal:2',
    ];

    public function youthProfileRecord(): BelongsTo
    {
        return $this->belongsTo(YouthProfileRecord::class);
    }

    // Helper methods
    public function getParentsFullNameAttribute(): array
    {
        return [
            'mother' => $this->mother_name,
            'father' => $this->father_name,
        ];
    }
}
