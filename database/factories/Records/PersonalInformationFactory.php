<?php

namespace Database\Factories\Records;

use App\Models\Records\PersonalInformation;
use App\Models\Records\YouthProfileRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

class PersonalInformationFactory extends Factory
{
    protected $model = PersonalInformation::class;

    public function definition(): array
    {
        return [
            'youth_profile_record_id' => YouthProfileRecord::factory(),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'middle_name' => $this->faker->optional()->firstName(),
            'suffix' => $this->faker->optional()->suffix(),
            'birthdate' => $this->faker->dateTimeBetween('-30 years', '-15 years'),
            'gender' => $this->faker->randomElement(['male', 'female', 'other']),
            'email' => $this->faker->optional(0.7)->safeEmail(),
            'phone' => $this->faker->optional(0.8)->phoneNumber(),
            'address' => $this->faker->address(),
            'civil_status' => $this->faker->randomElement(['single', 'married', 'separated']),
            'youth_age_group' => $this->faker->randomElement(['15-17', '18-24', '25-30']),
            'personal_monthly_income' => $this->faker->optional(0.6)->randomFloat(2, 0, 50000),
            'interests_hobbies' => $this->faker->optional()->sentences(2, true),
            'suggested_programs' => $this->faker->optional()->sentences(2, true),
        ];
    }
} 