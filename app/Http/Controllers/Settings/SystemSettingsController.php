<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class SystemSettingsController extends Controller
{
    public function index()
    {
        return Inertia::render('errors/forbidden', [
            'status' => 403,
            'message' => 'This feature is currently unavailable.'
        ]);
    }

    public function activityMonitoring()
    {
        return Inertia::render('errors/forbidden', [
            'status' => 403,
            'message' => 'This feature is currently unavailable.'
        ]);
    }

    public function analytics()
    {
        return Inertia::render('errors/forbidden', [
            'status' => 403,
            'message' => 'This feature is currently unavailable.'
        ]);
    }

    public function update(Request $request, SystemSetting $setting)
    {
        $request->validate([
            'value' => 'required',
        ]);

        $setting->update([
            'value' => $request->value,
        ]);

        return redirect()->back()->with('success', 'Setting updated successfully.');
    }

    public function toggleAutoBackup(Request $request)
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        $setting = SystemSetting::where('key', 'auto_backup_enabled')->first();
        $setting->update([
            'value' => $request->enabled ? 'true' : 'false',
        ]);

        return redirect()->back()->with('success', 'Auto backup ' . ($request->enabled ? 'enabled' : 'disabled') . '.');
    }

    public function updateRetentionPeriod(Request $request)
    {
        $request->validate([
            'value' => 'required|in:3,5,7,14,30',
        ]);

        $setting = SystemSetting::where('key', 'backup_retention_period')->first();
        $setting->update([
            'value' => $request->value,
        ]);

        return redirect()->back()->with('success', 'Retention period updated successfully.');
    }

    public function updateBackupFrequency(Request $request)
    {
        $request->validate([
            'value' => 'required|in:1,3,7,14,30',
        ]);

        $setting = SystemSetting::where('key', 'backup_frequency')->first();
        $setting->update([
            'value' => $request->value,
        ]);

        return redirect()->back()->with('success', 'Backup frequency updated successfully.');
    }

    public function toggleMaintenanceMode(Request $request)
    {
        $request->validate([
            'password' => 'required|current_password',
        ]);

        if (app()->isDownForMaintenance()) {
            Artisan::call('up');
            $message = 'Application is now live.';
        } else {
            Artisan::call('down', [
                '--render' => 'maintenance',
            ]);
            $message = 'Application is now in maintenance mode.';
        }

        $setting = SystemSetting::where('key', 'maintenance_mode')->first();
        if ($setting) {
            $setting->update([
                'value' => !$setting->value,
            ]);
        }

        return redirect()->back()->with('success', $message);
    }

    public function createBackup()
    {
        try {
            // Create backup filename
            $filename = 'backup-' . now()->format('Y-m-d-H-i-s') . '.zip';
            
            // Use Laravel's backup package or custom backup logic
            $process = new Process(['php', 'artisan', 'backup:run']);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('Backup failed: ' . $process->getErrorOutput());
            }

            return redirect()->back()->with('success', 'Backup created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    public function restore(Request $request)
    {
        try {
            $request->validate([
                'backup_file' => ['required', 'file', 'mimes:zip,sql'],
            ]);

            $file = $request->file('backup_file');
            $filename = $file->getClientOriginalName();

            // Store the uploaded file
            $file->storeAs('backups/temp', $filename);

            // Use Laravel's backup package or custom restore logic
            $process = new Process(['php', 'artisan', 'backup:restore', '--filename=' . $filename]);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('Restore failed: ' . $process->getErrorOutput());
            }

            // Clean up
            Storage::delete('backups/temp/' . $filename);

            return redirect()->back()->with('success', 'System restored successfully from backup.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to restore backup: ' . $e->getMessage());
        }
    }
} 