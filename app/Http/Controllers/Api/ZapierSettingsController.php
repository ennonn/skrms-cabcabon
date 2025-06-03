<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\ImportYouthProfiles;
use App\Models\Records\PendingYouthProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Carbon\Carbon;

class ZapierSettingsController extends Controller
{
    public function getSettings()
    {
        return response()->json([
            'api_key' => config('services.zapier.api_key'),
            'webhook_url' => route('api.zapier.webhook'),
            'settings' => Cache::get('zapier_settings', [
                'auto_approve' => false,
                'send_notifications' => true,
                'send_reminders' => true,
            ]),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'auto_approve' => 'boolean',
            'send_notifications' => 'boolean',
            'send_reminders' => 'boolean',
        ]);

        Cache::put('zapier_settings', $validated);

        return response()->json([
            'message' => 'Settings updated successfully',
            'settings' => $validated,
        ]);
    }

    public function startImport(Request $request)
    {
        // Validate password
        if (!Hash::check($request->header('X-Password'), auth()->user()->password)) {
            return response()->json(['error' => 'Invalid password'], 401);
        }

        try {
            // Get the Google Sheet URL from your settings or environment
            $sheetUrl = config('services.zapier.google_sheet_url');
            if (!$sheetUrl) {
                throw new \Exception('Google Sheet URL not configured');
            }

            // For testing, use sample data
            $externalData = $this->getSampleData();
            
            // Store import status in cache
            $importStatus = [
                'total' => count($externalData),
                'processed' => 0,
                'duplicates' => 0,
                'errors' => 0,
            ];
            Cache::put('zapier_import_status_' . auth()->id(), $importStatus, now()->addHour());

            // Dispatch the import job
            ImportYouthProfiles::dispatch($externalData, auth()->id());

            return response()->json([
                'message' => 'Import started',
                'status' => $importStatus,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to start import',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function getImportStatus()
    {
        $status = Cache::get('zapier_import_status_' . auth()->id(), [
            'total' => 0,
            'processed' => 0,
            'duplicates' => 0,
            'errors' => 0,
        ]);

        return response()->json($status);
    }

    private function getSampleData()
    {
        // Sample data for testing
        return [
            [
                'full_name' => 'John Doe',
                'address' => '123 Main St',
                'gender' => 'Male',
                'birthdate' => '2000-01-01',
                'email' => 'john@example.com',
                'phone' => '09123456789',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'education_level' => 'College Level',
                'youth_classification' => 'In school Youth',
                'work_status' => 'Student',
                'is_sk_voter' => true,
                'is_registered_national_voter' => true,
                'voted_last_election' => true,
                'mother_name' => 'Jane Doe',
                'father_name' => 'James Doe',
                'parents_monthly_income' => 15000,
                'personal_monthly_income' => 0,
                'interests_hobbies' => 'Reading, Sports',
                'suggested_programs' => 'Youth Leadership Program',
            ],
            [
                'full_name' => 'Jane Smith',
                'address' => '456 Oak St',
                'gender' => 'Female',
                'birthdate' => '2001-02-15',
                'email' => 'jane@example.com',
                'phone' => '09187654321',
                'civil_status' => 'Single',
                'youth_age_group' => 'Core Youth (18 - 24 years old)',
                'education_level' => 'High School Level',
                'youth_classification' => 'Out of school Youth',
                'work_status' => 'Employed',
                'is_sk_voter' => true,
                'is_registered_national_voter' => false,
                'voted_last_election' => false,
                'mother_name' => 'Mary Smith',
                'father_name' => 'Robert Smith',
                'parents_monthly_income' => 20000,
                'personal_monthly_income' => 12000,
                'interests_hobbies' => 'Music, Dance',
                'suggested_programs' => 'Skills Training',
            ],
        ];
    }

    /**
     * Test endpoint that accepts and stores all Zapier data without validation
     */
    public function test(Request $request)
    {
        try {
            $timestamp = now()->format('Y-m-d_H-i-s');
            $filename = "zapier_payload_{$timestamp}.json";
            
            // Collect all possible data
            $data = [
                'timestamp' => now()->toIso8601String(),
                'request' => [
                    'method' => $request->method(),
                    'url' => $request->fullUrl(),
                    'headers' => $request->headers->all(),
                    'query' => $request->query(),
                    'body' => $request->all(),
                    'raw_body' => file_get_contents('php://input'),
                    'content_type' => $request->header('Content-Type'),
                ],
                'server' => [
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                ],
            ];

            // Use the existing zzz_zapier directory
            $filePath = base_path('zzz_zapier/' . $filename);
            
            // Save to file
            file_put_contents($filePath, json_encode($data, JSON_PRETTY_PRINT));

            Log::info('Zapier test data saved', [
                'filename' => $filename,
                'file_path' => $filePath,
                'data_preview' => array_keys($request->all())
            ]);

            return Response::json([
                'status' => 'success',
                'message' => 'Test data received and stored',
                'saved_to' => "zzz_zapier/{$filename}",
                'received_data' => [
                    'method' => $request->method(),
                    'content_type' => $request->header('Content-Type'),
                    'fields' => array_keys($request->all()),
                    'raw_data' => $request->all()
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to save Zapier test data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'directory' => base_path('zzz_zapier')
            ]);

            return Response::json([
                'status' => 'error',
                'message' => 'Failed to save test data',
                'error' => $e->getMessage(),
                'details' => 'Check if zzz_zapier directory exists and is writable'
            ], 500);
        }
    }

    private function parseDate($date)
    {
        if (empty($date)) return null;
        try {
            return Carbon::parse($date)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    private function parseIncome($value)
    {
        if (empty($value)) {
            return null;
        }

        // Remove any non-numeric characters except decimal point and commas
        $numericValue = preg_replace('/[^0-9,.]/', '', $value);
        // Remove commas
        $numericValue = str_replace(',', '', $numericValue);
        return floatval($numericValue);
    }

    private function processZapierRow($row)
    {
        return [
            'data_collection_agreement' => $row['COL$B'] ?? null,
            'full_name' => $row['COL$C'] ?? null,
            'address' => $row['COL$D'] ?? null,
            'gender' => $row['COL$E'] ?? null,
            'age' => intval($row['COL$F'] ?? 0),
            'birthdate' => $this->parseDate($row['COL$G'] ?? null),
            'email' => $row['COL$H'] ?? null,
            'phone' => $row['COL$I'] ?? null,
            'civil_status' => $row['COL$J'] ?? null,
            'youth_age_group' => $row['COL$K'] ?? null,
            'education_level' => $row['COL$L'] ?? null,
            'youth_classification' => $row['COL$M'] ?? null,
            'work_status' => $row['COL$N'] ?? null,
            'is_sk_voter' => strtolower($row['COL$O'] ?? '') === 'yes',
            'is_registered_national_voter' => strtolower($row['COL$P'] ?? '') === 'yes',
            'voted_last_election' => strtolower($row['COL$Q'] ?? '') === 'yes',
            'has_attended_assembly' => strtolower($row['COL$R'] ?? '') === 'yes',
            'assembly_attendance' => empty($row['COL$S']) ? null : intval($row['COL$S']),
            'assembly_absence_reason' => $row['COL$T'] ?? null,
            'mother_name' => $row['COL$U'] ?? null,
            'father_name' => $row['COL$V'] ?? null,
            'parents_monthly_income' => $this->parseIncome($row['COL$W'] ?? null),
            'personal_monthly_income' => $this->parseIncome($row['COL$X'] ?? null),
            'suggested_programs' => $row['COL$Y'] ?? null,
            'interests_hobbies' => $row['COL$Z'] ?? null,
        ];
    }

    /**
     * Handle the incoming request from Zapier
     */
    public function store(Request $request)
    {
        try {
            // Save raw request for debugging
            $timestamp = now()->format('Y-m-d_H-i-s');
            $debugFile = "zzz_zapier/debug_payload_{$timestamp}.json";
            file_put_contents(base_path($debugFile), json_encode([
                'request' => $request->all(),
                'raw_body' => file_get_contents('php://input')
            ], JSON_PRETTY_PRINT));

            // Get the formatted_rows from the request
            $body = $request->all();
            if (!isset($body['formatted_rows'])) {
                return Response::json([
                    'status' => 'error',
                    'message' => 'No formatted_rows data received',
                    'received' => $body
                ], 400);
            }

            // Convert single quotes to double quotes for valid JSON
            $formattedRows = str_replace("'", '"', $body['formatted_rows']);
            $rows = json_decode($formattedRows, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to parse formatted_rows JSON', [
                    'error' => json_last_error_msg(),
                    'formatted_rows' => $formattedRows
                ]);
                return Response::json([
                    'status' => 'error',
                    'message' => 'Invalid JSON in formatted_rows',
                    'error' => json_last_error_msg(),
                    'received' => $formattedRows
                ], 400);
            }

            // Process each row
            $results = [];
            foreach ($rows as $row) {
                try {
                    // Map the data exactly as received
                    $data = [
                        'data_collection_agreement' => true, // Since we have the agreement text
                        'full_name' => trim($row['COL$C']),
                        'address' => trim($row['COL$D']),
                        'gender' => trim($row['COL$E']),
                        'age' => intval($row['COL$F']),
                        'birthdate' => Carbon::createFromFormat('n/j/Y', trim($row['COL$G']))->format('Y-m-d'),
                        'email' => trim($row['COL$H']),
                        'phone' => trim($row['COL$I']),
                        'civil_status' => trim($row['COL$J']),
                        'youth_age_group' => trim($row['COL$K']),
                        'education_level' => trim($row['COL$L']),
                        'youth_classification' => trim($row['COL$M']),
                        'work_status' => trim($row['COL$N']),
                        'is_sk_voter' => trim($row['COL$O']) === 'Yes',
                        'is_registered_national_voter' => trim($row['COL$P']) === 'Yes',
                        'voted_last_election' => trim($row['COL$Q']) === 'Yes',
                        'has_attended_assembly' => trim($row['COL$R']) === 'Yes',
                        'assembly_attendance' => empty($row['COL$S']) ? null : intval($row['COL$S']),
                        'assembly_absence_reason' => trim($row['COL$T']),
                        'mother_name' => trim($row['COL$U']),
                        'father_name' => trim($row['COL$V']),
                        'parents_monthly_income' => floatval(str_replace(',', '', $row['COL$W'])),
                        'personal_monthly_income' => floatval(str_replace(',', '', $row['COL$X'])),
                        'suggested_programs' => trim($row['COL$Y']),
                        'interests_hobbies' => trim($row['COL$Z'])
                    ];

                    // Save the processed data for debugging
                    $processedFile = "zzz_zapier/processed_{$timestamp}.json";
                    file_put_contents(base_path($processedFile), json_encode($data, JSON_PRETTY_PRINT));

                    // Create the profile
                    $profile = PendingYouthProfile::create($data);
                    
                    $results[] = [
                        'status' => 'success',
                        'row' => $row['row'],
                        'profile_id' => $profile->id,
                        'name' => $profile->full_name
                    ];
                } catch (\Exception $e) {
                    Log::error('Failed to process row', [
                        'error' => $e->getMessage(),
                        'row' => $row,
                        'processed_data' => $data ?? null
                    ]);

                    $results[] = [
                        'status' => 'error',
                        'row' => $row['row'] ?? 'unknown',
                        'error' => $e->getMessage(),
                        'data' => $data ?? null
                    ];
                }
            }

            // Save processing results for debugging
            $resultsFile = "zzz_zapier/results_{$timestamp}.json";
            file_put_contents(base_path($resultsFile), json_encode($results, JSON_PRETTY_PRINT));

            // Return summary of processing
            $successCount = count(array_filter($results, fn($r) => $r['status'] === 'success'));
            $errorCount = count($results) - $successCount;

            return Response::json([
                'status' => 'completed',
                'message' => "Processed {$successCount} profiles successfully, {$errorCount} failed",
                'debug_file' => $debugFile,
                'results_file' => $resultsFile,
                'results' => $results
            ], $errorCount > 0 ? 207 : 200);

        } catch (\Exception $e) {
            Log::error('Failed to process Zapier webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return Response::json([
                'status' => 'error',
                'message' => 'Failed to process request',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 