<?php

namespace App\Models\Records;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EngagementData extends Model
{
    protected $fillable = [
        'youth_profile_record_id',
        'education_level',
        'youth_classification',
        'work_status',
        'is_sk_voter',
        'is_registered_national_voter',
        'voted_last_election',
        'assembly_attendance',
        'assembly_absence_reason',
        'suggested_programs',
    ];

    protected $casts = [
        'is_sk_voter' => 'boolean',
        'is_registered_national_voter' => 'boolean',
        'voted_last_election' => 'boolean',
        'assembly_attendance' => 'integer',
        'education_level' => 'string',
        'youth_classification' => 'string',
        'work_status' => 'string',
        'suggested_programs' => 'string',
    ];

    // Constants for enum values
    const EDUCATION_LEVELS = [
        'ELEMENTARY_LEVEL' => 'Elementary Level',
        'ELEMENTARY_GRADUATE' => 'Elementary Graduate',
        'HIGH_SCHOOL_LEVEL' => 'High School Level',
        'HIGH_SCHOOL_GRADUATE' => 'High School Graduate',
        'VOCATIONAL_GRADUATE' => 'Vocational Graduate',
        'COLLEGE_LEVEL' => 'College Level',
        'COLLEGE_GRADUATE' => 'College Graduate',
        'MASTERS_LEVEL' => 'Masters Level',
        'MASTERS_GRADUATE' => 'Masters Graduate',
        'DOCTORATE_LEVEL' => 'Doctorate Level',
        'DOCTORATE_GRADUATE' => 'Doctorate Graduate',
    ];

    const YOUTH_CLASSIFICATIONS = [
        'IN_SCHOOL' => 'In school Youth',
        'OUT_OF_SCHOOL' => 'Out of School Youth',
        'WORKING' => 'Working Youth',
        'PWD' => 'PWD',
        'CICL' => 'Children in conflict with the law',
        'INDIGENOUS' => 'Indigenous People',
    ];

    const WORK_STATUS = [
        'EMPLOYED' => 'Employed',
        'UNEMPLOYED' => 'Unemployed',
        'SELF_EMPLOYED' => 'Self-employed',
        'LOOKING_FOR_JOB' => 'Currently Looking for a Job',
        'NOT_INTERESTED' => 'Not interested in looking for a job',
    ];

    const SUGGESTED_PROGRAMS = [
        'EDUCATION_CULTURE' => 'Committee on Education and Culture',
        'ENVIRONMENT' => 'Committee on Environment',
        'EMPLOYMENT_LIVELIHOOD' => 'Committee on Youth Employment & Livelihood',
        'SPORTS_GENDER_DEV' => 'Committee on Sports, Gender, and Development',
        'HEALTH' => 'Committee on Health',
        'SOCIAL_PROTECTION' => 'Committee on Social Protection',
        'DEVELOPMENT_PROJECTS' => 'Committee on Development Projects',
        'FINANCE' => 'Committee on Finance, Ways, and Means',
    ];

    public function youthProfileRecord(): BelongsTo
    {
        return $this->belongsTo(YouthProfileRecord::class);
    }

    // Helper methods
    public function getVotingStatusAttribute(): array
    {
        return [
            'sk_voter' => $this->is_sk_voter,
            'national_voter' => $this->is_registered_national_voter,
            'voted_last_election' => $this->voted_last_election,
        ];
    }

    public function getAssemblyParticipationAttribute(): array
    {
        return [
            'has_attended' => $this->has_attended_assembly,
            'attendance_count' => $this->assembly_attendance,
            'absence_reason' => $this->assembly_absence_reason,
        ];
    }
}
