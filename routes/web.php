<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\YouthProfileController;
use App\Http\Controllers\YouthProfileRecordController;
use App\Http\Controllers\DraftYouthProfileController;
use App\Http\Controllers\PendingYouthProfileController;
use App\Http\Controllers\RejectedYouthProfileController;
use App\Http\Controllers\Settings\ZapierController;
use App\Http\Controllers\YouthProfiles\DebugController;
use App\Http\Controllers\SystemSettingsController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\FixedDownloadController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::get('/maintenance', function () {
    return Inertia::render('maintenance');
})->name('maintenance');

// Guest-only routes
Route::middleware('guest')->group(function () {
    // Add any guest-only routes here
});

// Authenticated routes with role-specific dashboards
Route::middleware(['auth', 'verified', 'maintenance'])->group(function () {
    // Main dashboard - accessible to all authenticated users
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Admin routes
    Route::middleware(['auth', 'role:admin,superadmin'])->group(function () {
        Route::get('/admin/dashboard', [DashboardController::class, 'adminDashboard'])->name('admin.dashboard');
        Route::get('/admin/analytics', [AnalyticsController::class, 'index'])->name('admin.analytics');
    });

    // Youth Profile Routes
    Route::prefix('youth-profiles')->name('youth-profiles.')->group(function () {
        // Manage routes
        Route::get('/manage', [YouthProfileController::class, 'manage'])->name('manage');
        Route::post('/manage', [YouthProfileController::class, 'store'])->name('manage.store');
        Route::get('/manage/{profile}', [YouthProfileController::class, 'manageShow'])->name('manage.show');
        Route::put('/manage/{profile}', [YouthProfileController::class, 'update'])->name('manage.update');
        Route::delete('/manage/{profile}', [YouthProfileController::class, 'destroy'])->name('manage.destroy');
        Route::get('/manage/{profile}/edit', [YouthProfileController::class, 'edit'])->name('manage.edit');
        
        // Add this simple direct route for admin delete
        Route::post('/manage/delete/{id}', [YouthProfileController::class, 'adminDelete'])
            ->middleware(['auth', 'verified', 'role:admin,superadmin'])
            ->name('manage.admin-delete');

        // Draft profiles management
        Route::get('/drafts', [DraftYouthProfileController::class, 'index'])->name('drafts.index');
        Route::get('/drafts/create', [DraftYouthProfileController::class, 'create'])->name('drafts.create');
        Route::post('/drafts', [DraftYouthProfileController::class, 'store'])->name('drafts.store');
        Route::get('/drafts/{draft}', [DraftYouthProfileController::class, 'show'])->name('drafts.show');
        Route::get('/drafts/{draft}/edit', [DraftYouthProfileController::class, 'edit'])->name('drafts.edit');
        Route::put('/drafts/{draft}', [DraftYouthProfileController::class, 'update'])->name('drafts.update');
        Route::delete('/drafts/{draft}', [DraftYouthProfileController::class, 'destroy'])->name('drafts.destroy');
        Route::post('/drafts/{draft}/submit', [DraftYouthProfileController::class, 'submit'])->name('drafts.submit');
        Route::post('/drafts/{draft}/return', [DraftYouthProfileController::class, 'returnToDraft'])->name('drafts.return');

        // Pending profiles management
        Route::get('/pending', [PendingYouthProfileController::class, 'index'])->name('pending.index');
        Route::post('/pending', [PendingYouthProfileController::class, 'store'])->name('pending.store');
        Route::get('/pending/{profile}', [PendingYouthProfileController::class, 'show'])->name('pending.show');
        Route::post('/pending/{profile}/approve', [PendingYouthProfileController::class, 'approve'])
            ->name('pending.approve')
            ->middleware(['auth', 'verified', 'role:admin,superadmin']);
        Route::post('/pending/{profile}/reject', [PendingYouthProfileController::class, 'reject'])
            ->name('pending.reject')
            ->middleware(['auth', 'verified', 'role:admin,superadmin']);

        // Rejected profiles management
        Route::middleware(['auth', 'verified', 'role:admin,superadmin'])->group(function () {
            Route::get('/rejected', [RejectedYouthProfileController::class, 'index'])->name('rejected.index');
            Route::get('/rejected/{profile}', [RejectedYouthProfileController::class, 'show'])->name('rejected.show');
            Route::get('/rejected/{profile}/edit', [RejectedYouthProfileController::class, 'edit'])->name('rejected.edit');
            Route::put('/rejected/{profile}', [RejectedYouthProfileController::class, 'update'])->name('rejected.update');
            Route::post('/rejected/{profile}/approve', [RejectedYouthProfileController::class, 'approve'])->name('rejected.approve');
            Route::delete('/rejected/{profile}', [RejectedYouthProfileController::class, 'destroy'])->name('rejected.destroy');
        });

        // Approved records management
        Route::get('/records', [YouthProfileRecordController::class, 'index'])->name('records.index');
        Route::get('/records/{record}', [YouthProfileRecordController::class, 'show'])->name('records.show');
        Route::get('/records/{record}/edit', [YouthProfileRecordController::class, 'edit'])->name('records.edit')->middleware('can:admin');
        Route::put('/records/{record}', [YouthProfileRecordController::class, 'update'])->name('records.update')->middleware('can:admin');
        Route::delete('/records/{record}', [YouthProfileRecordController::class, 'destroy'])->name('records.destroy')->middleware('can:admin');
    });

    // Unified Proposal System Routes
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::prefix('proposals')->name('proposals.')->group(function () {
            // Management routes (admin only)
            Route::prefix('manage')->name('manage.')->group(function () {
                Route::get('/', [ProposalController::class, 'manage'])->name('index');
                Route::post('/', [ProposalController::class, 'store'])->name('store');
                Route::get('/{proposal}', [ProposalController::class, 'manageShow'])->name('show');
                Route::get('/{proposal}/edit', [ProposalController::class, 'manageEdit'])->name('edit');
                Route::put('/{proposal}/update', [ProposalController::class, 'update'])->name('update');
                Route::delete('/{proposal}', [ProposalController::class, 'destroy'])->name('destroy');
                Route::post('/{proposal}/approve', [ProposalController::class, 'approve'])->name('approve');
                Route::post('/{proposal}/reject', [ProposalController::class, 'reject'])->name('reject');
                Route::post('/{proposal}/resubmit', [ProposalController::class, 'submit'])->name('resubmit');
            });

            // Records routes
            Route::prefix('records')->name('records.')->group(function () {
                Route::get('/', [ProposalController::class, 'records'])->name('index');
                Route::get('/{proposal}', [ProposalController::class, 'recordShow'])->name('show');
            });

            // My Proposals routes
            Route::prefix('my')->name('my.')->group(function () {
                Route::get('/', [ProposalController::class, 'myProposals'])->name('index');
                Route::get('/create', [ProposalController::class, 'create'])->name('create');
                Route::post('/', [ProposalController::class, 'store'])->name('store');
                Route::get('/{proposal}', [ProposalController::class, 'show'])->name('show');
                Route::get('/{proposal}/edit', [ProposalController::class, 'myEdit'])->name('edit');
                Route::put('/{proposal}', [ProposalController::class, 'update'])->name('update');
                Route::delete('/{proposal}', [ProposalController::class, 'destroy'])->name('destroy');
                Route::post('/{proposal}/submit', [ProposalController::class, 'submit'])->name('submit');
            });

            // Status-specific routes
            Route::get('/pending', [ProposalController::class, 'pending'])->name('pending');
            Route::get('/pending/{proposal}', [ProposalController::class, 'showPending'])->name('pending.show');
            Route::get('/rejected', [ProposalController::class, 'rejected'])->name('rejected');
            Route::get('/rejected/{proposal}', [ProposalController::class, 'showRejected'])->name('rejected.show');

            // Proposal attachments routes
            Route::get('/proposal-attachments/{attachment}/download', [ProposalController::class, 'downloadAttachment'])->name('proposal-attachments.download');
            Route::get('/proposal-attachments/{attachment}/url', [ProposalController::class, 'getAttachmentUrl'])->name('proposal-attachments.url');

            // Alternative direct download route that doesn't use Content-Disposition: attachment
            Route::get('/proposal-attachments/{attachment}/view', [FixedDownloadController::class, 'download'])->name('proposal-attachments.view');
        });
    });

    // Settings routes
    Route::prefix('settings')->name('settings.')->group(function () {
        // Profile and password routes
        Route::get('/profile', [App\Http\Controllers\Settings\ProfileController::class, 'edit'])->name('profile');
        Route::patch('/profile', [App\Http\Controllers\Settings\ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [App\Http\Controllers\Settings\ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('/password', [App\Http\Controllers\Settings\PasswordController::class, 'edit'])->name('password');
        Route::put('/password', [App\Http\Controllers\Settings\PasswordController::class, 'update'])->name('password.update');

        // Admin-only routes that return 403
        Route::middleware(['auth', 'role:admin,superadmin'])->group(function () {
            Route::get('/system', [App\Http\Controllers\Settings\SystemSettingsController::class, 'index'])->name('system');
            Route::get('/activity-monitoring', [App\Http\Controllers\Settings\SystemSettingsController::class, 'activityMonitoring'])->name('activity-monitoring');
            Route::get('/analytics', [App\Http\Controllers\Settings\SystemSettingsController::class, 'analytics'])->name('analytics');
        });
    });
});

// Pending activation page - accessible to authenticated users regardless of activation status
Route::middleware(['auth'])->group(function () {
    Route::get('pending-activation', function () {
        return Inertia::render('auth/pending-activation');
    })->name('pending-activation');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/{notification}', [NotificationController::class, 'show'])->name('notifications.show');
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-as-read');
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-as-read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'delete'])->name('notifications.delete');
    Route::delete('/notifications', [NotificationController::class, 'deleteAll'])->name('notifications.delete-all');

    Route::get('/analytics', function () {
        return Inertia::render('Analytics');
    })->name('analytics');

    // About page route
    Route::get('/about', function () {
        return Inertia::render('about/index');
    })->name('about.index');

    Route::get('/charts', function () {
        return Inertia::render('charts/index');
    })->name('charts.index');
});

// Debug routes - temporarily allowing access during development
Route::middleware(['auth'])->group(function () {
    Route::post('/debug/approve-profile/{profile}', [DebugController::class, 'debugApproveProfile'])
        ->name('debug.approve-profile');
    Route::get('/debug/pending-status', [DebugController::class, 'checkPendingStatus'])
        ->name('debug.pending-status');
    Route::get('/debug/test-approval/{profile}', [DebugController::class, 'testApproval'])
        ->name('debug.test-approval');
    Route::get('/debug/check-model', [DebugController::class, 'checkModelFunctionality'])
        ->name('debug.check-model');
});

// About routes
Route::prefix('about')->name('about.')->group(function () {
    Route::get('/', function () {
        return Inertia::render('guest/about');
    })->name('index');

    Route::get('/dev', function () {
        return Inertia::render('guest/dev');
    })->name('dev');

    Route::get('/org-chart', fn () => Inertia::render('about/org-chart'))->name('org-chart');
});

Route::get('/hello', function () {
    return Inertia::render('guest/hello');
})->name('hello');

// System routes
Route::prefix('system')->name('system.')->middleware(['auth', 'verified'])->group(function () {
    // Admin settings
    Route::middleware(['role:admin,superadmin'])->group(function () {
        Route::get('/admin-settings', [SystemSettingsController::class, 'adminSettings'])->name('admin-settings');
        Route::post('/maintenance-mode', [SystemSettingsController::class, 'toggleMaintenanceMode'])
            ->middleware('password.confirm')
            ->name('maintenance-mode');
        Route::get('/activity-monitoring', [SystemSettingsController::class, 'activityMonitoring'])->name('activity-monitoring');
        
        // Zapier Settings
        Route::get('/zapier-settings', [ZapierController::class, 'index'])->name('zapier-settings');
        Route::post('/zapier-settings/webhook-url', [ZapierController::class, 'updateWebhookUrl'])
            ->name('zapier-settings.webhook-url');
        Route::post('/zapier-settings/reset', [ZapierController::class, 'reset'])
            ->name('zapier-settings.reset');
        Route::post('/zapier-settings/trigger-import', [ZapierController::class, 'triggerImport'])
            ->name('zapier-settings.trigger-import');
    });

    // User evaluation
    Route::get('/evaluation', function () {
        return Inertia::render('system/evaluation');
    })->name('evaluation');
    
    Route::post('/evaluation', [SystemSettingsController::class, 'submitEvaluation'])->name('evaluation.submit');
});

// Test routes for error pages
Route::get('/test-403', function () {
    throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException("Test 403 error");
})->name('test.403');

Route::get('/test-500', function () {
    throw new \Exception("Test 500 error");
})->name('test.500');

Route::get('/test-503', function () {
    throw new \Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException(null, "Test 503 error");
})->name('test.503');

// Error page previews
Route::get('/404', function () {
    return Inertia::render('errors/not-found', [
        'status' => 404,
        'message' => "Looks like you've ventured into the unknown digital realm."
    ]);
})->name('preview.404');

Route::get('/403', function () {
    return Inertia::render('errors/forbidden', [
        'status' => 403,
        'message' => "You don't have permission to access this page."
    ]);
})->name('preview.403');

Route::get('/500', function () {
    return Inertia::render('errors/error', [
        'status' => 500,
        'message' => "Something went wrong on our end."
    ]);
})->name('preview.500');

// Test route for proposal match email
Route::get('/test-proposal-match-email', function () {
    try {
        // Get a real proposal from the database
        $proposal = \App\Models\Proposal::with('category')->first();
        
        if (!$proposal) {
            return 'No proposals found in the database. Please create a proposal first.';
        }

        // Get the service
        $matchService = new \App\Services\ProposalMatchService();
        
        // Get matching youth
        $matches = $matchService->findMatchingYouth($proposal);
        
        $output = "Testing proposal match email:\n\n";
        $output .= "Proposal Details:\n";
        $output .= "Title: {$proposal->title}\n";
        $output .= "Category: {$proposal->category->name}\n\n";
        
        $output .= "Matching Youth:\n";
        if (empty($matches['youth'])) {
            $output .= "No matching youth found.\n";
        } else {
            foreach ($matches['youth'] as $youth) {
                $output .= "\nYouth: {$youth->personalInformation->full_name}\n";
                $output .= "Email: {$youth->personalInformation->email}\n";
                $output .= "Interests: {$youth->personalInformation->interests_hobbies}\n";
                $output .= "Suggested Programs: {$youth->personalInformation->suggested_programs}\n";
                $output .= "Matched Categories: " . implode(', ', $matches['categories'][$youth->id]) . "\n";
            }
        }

        // Try to send the notification
        $matchService->notifyMatchingYouth($proposal);
        
        $output .= "\nEmail notification sent to matching youth.";

        return response($output)->header('Content-Type', 'text/plain');
    } catch (\Exception $e) {
        return response("Error: " . $e->getMessage() . "\n\nStack trace:\n" . $e->getTraceAsString())
            ->header('Content-Type', 'text/plain');
    }
});

// Include other route files
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
