<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SystemSettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'app_name',
                'value' => 'Youth Profile Management System',
                'type' => 'string',
                'group' => 'general',
                'label' => 'Application Name',
                'description' => 'The name of the application',
                'is_public' => true,
            ],
            [
                'key' => 'maintenance_mode',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'system',
                'label' => 'Maintenance Mode',
                'description' => 'Enable maintenance mode',
                'is_public' => false,
            ],
            [
                'key' => 'default_items_per_page',
                'value' => '10',
                'type' => 'integer',
                'group' => 'general',
                'label' => 'Items Per Page',
                'description' => 'Default number of items to show per page',
                'is_public' => true,
            ],
            [
                'key' => 'auto_backup_enabled',
                'value' => 'false',
                'type' => 'boolean',
                'group' => 'backup',
                'label' => 'Auto Backup',
                'description' => 'Enable automatic system backups',
                'is_public' => false,
            ],
            [
                'key' => 'backup_frequency',
                'value' => '7',
                'type' => 'integer',
                'group' => 'backup',
                'label' => 'Backup Frequency',
                'description' => 'How often to create new backups (in days)',
                'is_public' => false,
            ],
            [
                'key' => 'backup_retention_period',
                'value' => '30',
                'type' => 'integer',
                'group' => 'backup',
                'label' => 'Backup Retention Period',
                'description' => 'How long to keep backup files before automatic deletion (in days)',
                'is_public' => false,
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('system_settings')->insertOrIgnore($setting);
        }
    }
} 