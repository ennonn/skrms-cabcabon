<?php

namespace Database\Factories;

use App\Models\BudgetPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetPlanFactory extends Factory
{
    protected $model = BudgetPlan::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'amount' => $this->faker->randomFloat(2, 1000, 10000),
            'status' => 'draft',
            'submitted_by' => User::factory(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'approved_by' => User::factory(),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => $this->faker->paragraph(),
        ]);
    }
} 