<?php

namespace App\Models\Records;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PersonalInformation extends Model
{
    protected $fillable = [
        'youth_profile_record_id',
        'data_collection_agreement',
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
    ];

    protected $casts = [
        'birthdate' => 'date',
        'age' => 'integer',
        'personal_monthly_income' => 'decimal:2',
        'gender' => 'string',
        'civil_status' => 'string',
        'youth_age_group' => 'string',
    ];

    // Constants for enum values
    const YOUTH_AGE_GROUPS = [
        'JUNIOR' => 'Junior Youth (15 - 17 years old)',
        'CORE' => 'Core Youth (18 - 24 years old)',
        'SENIOR' => 'Senior Youth (25 - 30 years old)',
    ];

    const CIVIL_STATUS = [
        'SINGLE' => 'Single',
        'MARRIED' => 'Married',
        'WIDOWED' => 'Widowed',
    ];

    const GENDER = [
        'MALE' => 'male',
        'FEMALE' => 'female',
        'OTHER' => 'other',
    ];

    public function youthProfileRecord(): BelongsTo
    {
        return $this->belongsTo(YouthProfileRecord::class);
    }

    // Helper methods
    public function calculateAndUpdateAge(): void
    {
        if ($this->birthdate) {
            $this->age = $this->birthdate->age;
            $this->save();
        }
    }

    public function determineYouthAgeGroup(): string
    {
        if ($this->age <= 17) {
            return self::YOUTH_AGE_GROUPS['JUNIOR'];
        } elseif ($this->age <= 24) {
            return self::YOUTH_AGE_GROUPS['CORE'];
        } else {
            return self::YOUTH_AGE_GROUPS['SENIOR'];
        }
    }
}
