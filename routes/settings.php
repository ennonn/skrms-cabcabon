<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Settings\SystemSettingsController;
use App\Http\Controllers\Settings\ActivityMonitoringController;
use App\Http\Controllers\Settings\DataExportController;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', 'settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});

Route::middleware(['auth', 'verified', 'role:superadmin'])->group(function () {
    // System Settings
    Route::get('/settings/system', [SystemSettingsController::class, 'index'])->name('settings.system');
    Route::put('/settings/system/{setting}', [SystemSettingsController::class, 'update'])->name('settings.system.update');
    Route::post('/settings/system/auto-backup', [SystemSettingsController::class, 'toggleAutoBackup'])->name('settings.system.auto-backup');
    Route::put('/settings/system/retention-period', [SystemSettingsController::class, 'updateRetentionPeriod'])->name('settings.system.retention-period');
    Route::put('/settings/system/backup-frequency', [SystemSettingsController::class, 'updateBackupFrequency'])->name('settings.system.backup-frequency');

    // Activity Monitoring
    Route::get('/settings/activity-monitoring', [ActivityMonitoringController::class, 'index'])->name('settings.activity-monitoring');
    Route::get('/settings/activity-monitoring/{log}', [ActivityMonitoringController::class, 'show'])->name('settings.activity-monitoring.show');

    // Data Export
    Route::get('/settings/data-export', [DataExportController::class, 'index'])->name('settings.data-export');
    Route::post('/settings/data-export', [DataExportController::class, 'export'])->name('settings.data-export.export');
});
