<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ZapierWebhookController;
use App\Http\Controllers\Api\ZapierSettingsController;
use App\Http\Controllers\Api\ZapierGoogleFormController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route - no middleware
Route::get('/test', function() {
    return response()->json(['message' => 'API is working!']);
});

// Zapier Webhook Routes - no middleware for testing
Route::prefix('zapier')->group(function () {
    // Add test endpoint - no middleware for testing
    Route::post('/test', [ZapierSettingsController::class, 'test'])
        ->name('api.zapier.test');

    Route::post('/youth-profiles/upload', [ZapierWebhookController::class, 'handleWebhook'])
        ->name('api.zapier.webhook');
        
    // New Google Form endpoint
    Route::post('/youth-profiles/receive', [ZapierGoogleFormController::class, 'receive'])
        ->name('api.zapier.google-form');
        
    // Zapier Settings Routes
    Route::middleware(['auth:sanctum', 'role:admin,superadmin'])->group(function () {
        Route::get('/settings', [ZapierSettingsController::class, 'getSettings']);
        Route::post('/settings', [ZapierSettingsController::class, 'updateSettings']);
        Route::post('/regenerate-key', [ZapierSettingsController::class, 'regenerateApiKey']);
        Route::post('/send-reminder', [ZapierSettingsController::class, 'sendReminder']);
        
        // Import Routes
        Route::post('/import/start', [ZapierSettingsController::class, 'startImport']);
        Route::get('/import/status', [ZapierSettingsController::class, 'getImportStatus']);
    });
}); 