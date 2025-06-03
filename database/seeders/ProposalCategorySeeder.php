<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProposalCategory;

class ProposalCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Skills & Capacity Building',
                'description' => 'Programs focused on developing youth skills and leadership capabilities',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Community Development & Environment',
                'description' => 'Initiatives for community improvement and environmental conservation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Social Transformation',
                'description' => 'Programs aimed at social change and community empowerment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sports & Recreation',
                'description' => 'Athletic and recreational activities for youth engagement',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Health & Wellness',
                'description' => 'Programs promoting physical and mental health awareness',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Education Support',
                'description' => 'Educational initiatives and academic assistance programs',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Advocacy & Governance',
                'description' => 'Youth participation in governance and advocacy campaigns',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($categories as $category) {
            ProposalCategory::create($category);
        }
    }
} 