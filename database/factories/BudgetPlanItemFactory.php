<?php

namespace Database\Factories;

use App\Models\BudgetPlan;
use App\Models\BudgetPlanItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class BudgetPlanItemFactory extends Factory
{
    protected $model = BudgetPlanItem::class;

    public function definition(): array
    {
        return [
            'budget_plan_id' => BudgetPlan::factory(),
            'description' => $this->faker->sentence(),
            'amount' => $this->faker->randomFloat(2, 100, 1000),
            'quantity' => $this->faker->numberBetween(1, 10),
            'unit' => $this->faker->randomElement(['pcs', 'kg', 'box', 'set']),
        ];
    }
} 