<?php

namespace Database\Factories\Records;

use App\Models\Records\YouthProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class YouthProfileFactory extends Factory
{
    protected $model = YouthProfile::class;

    public function definition(): array
    {
        $statuses = ['draft', 'pending', 'approved', 'rejected'];
        $status = $this->faker->randomElement($statuses);
        
        return [
            'user_id' => User::factory()->create(['role' => 'user']), // This is the SK official who created/manages the record
            'status' => $status,
            'approver_id' => $status === 'draft' ? null : User::factory()->create(['role' => 'admin']),
            'approval_notes' => $status === 'draft' ? null : $this->faker->optional()->sentence(),
        ];
    }

    public function draft(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'draft',
                'approver_id' => null,
                'approval_notes' => null,
            ];
        });
    }

    public function pending(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'pending',
                'approver_id' => null,
                'approval_notes' => null,
            ];
        });
    }

    public function approved(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'approved',
                'approver_id' => User::factory()->create(['role' => 'admin']),
                'approval_notes' => $this->faker->optional()->sentence(),
            ];
        });
    }

    public function rejected(): self
    {
        return $this->state(function (array $attributes) {
            return [
                'status' => 'rejected',
                'approver_id' => User::factory()->create(['role' => 'admin']),
                'approval_notes' => $this->faker->sentence(),
            ];
        });
    }
} 