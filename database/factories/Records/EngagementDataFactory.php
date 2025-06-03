<?php

namespace Database\Factories\Records;

use App\Models\Records\EngagementData;
use App\Models\Records\YouthProfileRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

class EngagementDataFactory extends Factory
{
    protected $model = EngagementData::class;

    public function definition(): array
    {
        return [
            'youth_profile_record_id' => YouthProfileRecord::factory(),
            'education_level' => $this->faker->randomElement(['elementary', 'high_school', 'college', 'vocational']),
            'youth_classification' => $this->faker->randomElement(['student', 'working', 'unemployed']),
            'work_status' => $this->faker->randomElement(['employed', 'unemployed', 'student']),
            'is_sk_voter' => $this->faker->boolean(),
            'is_registered_national_voter' => $this->faker->boolean(),
            'voted_last_election' => $this->faker->boolean(),
            'assembly_attendance' => $this->faker->numberBetween(0, 10),
            'assembly_absence_reason' => $this->faker->optional()->sentence(),
        ];
    }
} 