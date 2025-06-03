<?php

namespace Database\Factories\Records;

use App\Models\Records\FamilyInformation;
use App\Models\Records\YouthProfileRecord;
use Illuminate\Database\Eloquent\Factories\Factory;

class FamilyInformationFactory extends Factory
{
    protected $model = FamilyInformation::class;

    public function definition(): array
    {
        return [
            'youth_profile_record_id' => YouthProfileRecord::factory(),
            'mother_name' => $this->faker->name('female'),
            'mother_age' => $this->faker->numberBetween(35, 70),
            'father_name' => $this->faker->name('male'),
            'father_age' => $this->faker->numberBetween(35, 70),
            'parents_monthly_income' => $this->faker->optional()->randomFloat(2, 0, 100000),
        ];
    }
} 