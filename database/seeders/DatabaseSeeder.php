<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SystemSettingsSeeder::class,
            UserSeeder::class,
            // Youth profile seeders disabled to allow importing real data
            // DraftYouthProfileSeeder::class,
            // PendingYouthProfileSeeder::class,
            // ApprovedYouthProfileSeeder::class,
            ProposalCategorySeeder::class,
            ProposalSeeder::class,
            NotificationSeeder::class,
            YouthProfileSeeder::class,
        ]);
    }
}
