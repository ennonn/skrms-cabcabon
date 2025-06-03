<?php

use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\ProposalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin,superadmin'])->group(function () {
    // User Management Routes
    Route::prefix('admin/users')->name('admin.users.')->group(function () {
        Route::get('/', [UserManagementController::class, 'index'])->name('index');
        Route::get('{user}/edit', [UserManagementController::class, 'edit'])->name('edit');
        Route::put('{user}', [UserManagementController::class, 'update'])->name('update');
        Route::delete('{user}', [UserManagementController::class, 'destroy'])->name('destroy');
        Route::post('{user}/toggle-activation', [UserManagementController::class, 'toggleActivation'])
            ->name('toggle-activation');
        Route::post('{user}/promote', [UserManagementController::class, 'promoteToAdmin'])
            ->name('promote');
        Route::post('{user}/demote', [UserManagementController::class, 'demoteToUser'])
            ->name('demote');
    });

    // Proposal Management Routes
    Route::prefix('admin/proposals')->name('admin.proposals.')->group(function () {
        Route::get('/', [ProposalController::class, 'index'])->name('index');
        Route::delete('/{proposal}', [ProposalController::class, 'destroy'])->name('destroy');
        Route::post('/{proposal}/approve', [ProposalController::class, 'approve'])->name('approve');
        Route::post('/{proposal}/reject', [ProposalController::class, 'reject'])->name('reject');
    });
});