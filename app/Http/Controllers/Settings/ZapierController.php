<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Records\PendingYouthProfile;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

class ZapierController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/zapier-settings', [
            'zapierWebhookUrl' => config('services.zapier.webhook_url', null),
        ]);
    }

    public function updateWebhookUrl(Request $request)
    {
        $validated = $request->validate([
            'webhook_url' => 'required|url'
        ]);

        try {
            // Update the webhook URL in the .env file
            $this->updateEnvVariable('ZAPIER_WEBHOOK_URL', $validated['webhook_url']);
            
            // Clear the config cache to ensure the new value is used
            \Artisan::call('config:clear');
            
            return back()->with('success', 'Zapier webhook URL updated successfully');
        } catch (\Exception $e) {
            Log::error('Failed to update Zapier webhook URL', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'webhook_url' => 'Failed to update webhook URL: ' . $e->getMessage()
            ])->withInput();
        }
    }

    public function reset()
    {
        try {
            // Delete all pending youth profiles
            PendingYouthProfile::truncate();

            // Clear the Zapier debug files
            $zapierDir = storage_path('app/zapier');
            if (File::exists($zapierDir)) {
                File::cleanDirectory($zapierDir);
            }

            // Clear any temporary files or logs
            $tempDir = storage_path('app/temp/zapier');
            if (File::exists($tempDir)) {
                File::cleanDirectory($tempDir);
            }

            // Log the reset action
            Log::info('Import data reset successfully', [
                'user' => auth()->user()->email,
                'timestamp' => now(),
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Import data reset successfully',
                'details' => 'All pending profiles and temporary files have been cleared.'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to reset import data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user' => auth()->user()->email
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to reset import data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function triggerImport(Request $request)
    {
        try {
            $validated = $request->validate([
                'webhook_url' => 'required|url',
                'ignore_duplicates' => 'boolean',
            ]);

            // Log the request for debugging
            Log::info('Triggering Zapier import', [
                'webhook_url' => $validated['webhook_url'],
                'ignore_duplicates' => $validated['ignore_duplicates'] ?? false,
                'user' => auth()->user()->email
            ]);

            // Create HTTP client
            $client = new Client();

            try {
                // Make the request to Zapier
                $response = $client->post($validated['webhook_url'], [
                    'json' => [
                        'trigger' => 'import_profiles',
                        'ignore_duplicates' => $validated['ignore_duplicates'] ?? false,
                        'user' => auth()->user()->email,
                        'timestamp' => now()->toIso8601String()
                    ]
                ]);

                // Log the successful response
                Log::info('Zapier import triggered successfully', [
                    'status_code' => $response->getStatusCode(),
                    'response' => json_decode($response->getBody()->getContents(), true),
                    'user' => auth()->user()->email
                ]);

                return response()->json([
                    'status' => 'success',
                    'message' => 'Import request sent to Zapier successfully',
                    'details' => 'The import process has been initiated.'
                ]);

            } catch (ClientException $e) {
                // Log the error response from Zapier
                Log::error('Zapier returned an error', [
                    'status_code' => $e->getResponse()->getStatusCode(),
                    'response' => json_decode($e->getResponse()->getBody()->getContents(), true),
                    'user' => auth()->user()->email
                ]);

                throw new \Exception('Zapier returned an error: ' . $e->getMessage());

            } catch (ConnectException $e) {
                // Log connection errors
                Log::error('Failed to connect to Zapier', [
                    'error' => $e->getMessage(),
                    'user' => auth()->user()->email
                ]);

                throw new \Exception('Could not connect to Zapier: ' . $e->getMessage());
            }

        } catch (\Exception $e) {
            Log::error('Failed to trigger import', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user' => auth()->user()->email
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to trigger import',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function updateEnvVariable($key, $value)
    {
        $path = base_path('.env');
        
        if (!file_exists($path)) {
            throw new \Exception('.env file not found');
        }

        if (!is_writable($path)) {
            throw new \Exception('.env file is not writable');
        }

        try {
            $content = file_get_contents($path);
            if ($content === false) {
                throw new \Exception('Unable to read .env file');
            }
            
            // If the key exists, replace its value
            if (str_contains($content, $key . '=')) {
                $content = preg_replace(
                    "/^{$key}=.*/m",
                    "{$key}=" . $value,
                    $content
                );
            } else {
                // If the key doesn't exist, append it
                $content .= "\n{$key}=" . $value;
            }
            
            if (file_put_contents($path, $content) === false) {
                throw new \Exception('Unable to write to .env file');
            }
        } catch (\Exception $e) {
            throw new \Exception('Failed to update .env file: ' . $e->getMessage());
        }
    }
} 