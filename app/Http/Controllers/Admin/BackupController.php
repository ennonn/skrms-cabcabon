<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Backup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\Process\Process;

class BackupController extends Controller
{
    public function index()
    {
        return Inertia::render('admin/backup/index', [
            'backups' => Backup::with('admin:id,first_name,last_name')
                ->latest()
                ->paginate(10),
            'disk_usage' => [
                'total' => Storage::size('backups'),
                'latest' => Backup::latest()->first()?->size ?? 0,
            ]
        ]);
    }

    public function create(Request $request)
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

            // Create backup record
            $backup = Backup::create([
                'filename' => $filename,
                'size' => Storage::size("backups/{$filename}"),
                'admin_id' => auth()->id(),
                'type' => 'full',
                'status' => 'completed',
            ]);

            return back()->with('success', 'Backup created successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to create backup: ' . $e->getMessage());
        }
    }

    public function download(Backup $backup)
    {
        if (!Storage::exists("backups/{$backup->filename}")) {
            return back()->with('error', 'Backup file not found.');
        }

        return Storage::download("backups/{$backup->filename}");
    }

    public function restore(Backup $backup)
    {
        try {
            if (!Storage::exists("backups/{$backup->filename}")) {
                throw new \Exception('Backup file not found.');
            }

            // Use Laravel's backup package or custom restore logic
            $process = new Process(['php', 'artisan', 'backup:restore', '--filename=' . $backup->filename]);
            $process->run();

            if (!$process->isSuccessful()) {
                throw new \Exception('Restore failed: ' . $process->getErrorOutput());
            }

            return back()->with('success', 'System restored successfully from backup.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to restore backup: ' . $e->getMessage());
        }
    }

    public function destroy(Backup $backup)
    {
        try {
            if (Storage::exists("backups/{$backup->filename}")) {
                Storage::delete("backups/{$backup->filename}");
            }

            $backup->delete();

            return back()->with('success', 'Backup deleted successfully.');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to delete backup: ' . $e->getMessage());
        }
    }
} 