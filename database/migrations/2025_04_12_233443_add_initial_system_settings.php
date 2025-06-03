<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Insert initial settings
        DB::table('system_settings')->insert([
            [
                'key' => 'maintenance_mode',
                'label' => 'Maintenance Mode',
                'value' => json_encode(false),
                'type' => 'boolean',
                'description' => 'When enabled, only administrators can access the system.',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'auto_backup_enabled',
                'label' => 'Auto Backup',
                'value' => json_encode(false),
                'type' => 'boolean',
                'description' => 'Enable automatic system backups.',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'backup_frequency',
                'label' => 'Backup Frequency',
                'value' => json_encode('7'),
                'type' => 'string',
                'description' => 'How often to create backups (in days).',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key' => 'backup_retention_period',
                'label' => 'Backup Retention Period',
                'value' => json_encode('30'),
                'type' => 'string',
                'description' => 'How long to keep backups (in days).',
                'is_public' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('system_settings')->whereIn('key', [
            'maintenance_mode',
            'auto_backup_enabled',
            'backup_frequency',
            'backup_retention_period',
        ])->delete();
    }
};
