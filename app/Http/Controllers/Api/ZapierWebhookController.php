<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Records\PendingYouthProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ZapierWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        try {
            // Save raw request for debugging
            $timestamp = now()->format('Y-m-d_H-i-s');
            $debugFile = "zzz_zapier/debug_payload_{$timestamp}.json";
            file_put_contents(base_path($debugFile), json_encode([
                'request' => $request->all(),
                'raw_body' => file_get_contents('php://input')
            ], JSON_PRETTY_PRINT));

            // Get the raw_rows from the request
            $rawRows = $request->input('raw_rows');
            if (empty($rawRows)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No raw_rows data received',
                    'received' => $request->all()
                ], 400);
            }

            // Parse the raw rows JSON
            $rows = json_decode($rawRows, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                Log::error('Failed to parse raw_rows JSON', [
                    'error' => json_last_error_msg(),
                    'raw_rows' => $rawRows
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid JSON in raw_rows',
                    'error' => json_last_error_msg(),
                    'received' => $rawRows
                ], 400);
            }

            // Process each row
            $results = [];
            foreach ($rows as $rowData) {
                try {
                    // Helper function to convert income string to decimal
                    $parseIncome = function($value) {
                        if (empty($value)) return null;
                        // Remove commas and spaces, then convert to float with 2 decimal places
                        return number_format(floatval(str_replace([',', ' '], '', $value)), 2, '.', '');
                    };

                    // Map the data from array indices
                    $data = [
                        'user_id' => 1, // System user for Zapier imports
                        'status' => 'pending',
                        'form_submitted_at' => now(),
                        'data_collection_agreement' => trim($rowData[1]), // COL B
                        'full_name' => trim($rowData[2]),  // COL C
                        'address' => trim($rowData[3]),    // COL D
                        'gender' => ucfirst(strtolower(trim($rowData[4]))),     // COL E - Normalize to 'Male' or 'Female'
                        'age' => intval($rowData[5]),      // COL F
                        'birthdate' => Carbon::createFromFormat('n/j/Y', trim($rowData[6]))->format('Y-m-d'), // COL G
                        'email' => trim($rowData[7]) ?: null,      // COL H
                        'phone' => trim($rowData[8]) ?: null,      // COL I
                        'civil_status' => trim($rowData[9]), // COL J
                        'youth_age_group' => trim($rowData[10]), // COL K
                        'education_level' => trim($rowData[11]), // COL L
                        'youth_classification' => trim($rowData[12]), // COL M
                        'work_status' => trim($rowData[13]), // COL N
                        'is_sk_voter' => trim($rowData[14]) === 'Yes', // COL O
                        'is_registered_national_voter' => trim($rowData[15]) === 'Yes', // COL P
                        'voted_last_election' => trim($rowData[16]) === 'Yes', // COL Q
                        'has_attended_assembly' => trim($rowData[17]) === 'Yes', // COL R
                        'assembly_attendance' => empty($rowData[18]) ? null : intval($rowData[18]), // COL S
                        'assembly_absence_reason' => trim($rowData[19]) ?: null, // COL T
                        'mother_name' => trim($rowData[20]) ?: null, // COL U
                        'father_name' => trim($rowData[21]) ?: null, // COL V
                        'parents_monthly_income' => $parseIncome($rowData[22]), // COL W
                        'personal_monthly_income' => $parseIncome($rowData[23]), // COL X
                        'suggested_programs' => trim($rowData[24]) ?: null, // COL Y
                        'interests_hobbies' => trim($rowData[25]) ?: null  // COL Z
                    ];

                    // Save the processed data for debugging
                    $processedFile = "zzz_zapier/processed_{$timestamp}.json";
                    file_put_contents(base_path($processedFile), json_encode($data, JSON_PRETTY_PRINT));

                    // Check for duplicates
                    $isDuplicate = PendingYouthProfile::where('full_name', $data['full_name'])
                        ->where('birthdate', $data['birthdate'])
                        ->exists();

                    if ($isDuplicate) {
                        $results[] = [
                            'status' => 'warning',
                            'message' => 'Duplicate profile detected',
                            'data' => [
                                'full_name' => $data['full_name'],
                                'birthdate' => $data['birthdate']
                            ]
                        ];
                        continue;
                    }

                    // Create the profile using the model's fillable attributes
                    $profile = new PendingYouthProfile();
                    foreach ($data as $key => $value) {
                        $profile->$key = $value;
                    }
                    $profile->save();
                    
                    $results[] = [
                        'status' => 'success',
                        'profile_id' => $profile->id,
                        'name' => $profile->full_name
                    ];
                } catch (\Exception $e) {
                    Log::error('Failed to process row', [
                        'error' => $e->getMessage(),
                        'row_data' => $rowData,
                        'processed_data' => $data ?? null,
                        'trace' => $e->getTraceAsString()
                    ]);

                    $results[] = [
                        'status' => 'error',
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
            $errorCount = count(array_filter($results, fn($r) => $r['status'] === 'error'));
            $warningCount = count(array_filter($results, fn($r) => $r['status'] === 'warning'));

            return response()->json([
                'status' => 'completed',
                'message' => "Processed {$successCount} profiles successfully, {$warningCount} duplicates, {$errorCount} failed",
                'debug_file' => $debugFile,
                'results_file' => $resultsFile,
                'results' => $results
            ], $errorCount > 0 ? 207 : 200);

        } catch (\Exception $e) {
            Log::error('Failed to process webhook', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'error' => 'Failed to process webhook',
                'message' => $e->getMessage()
            ], 500);
        }
    }
} 