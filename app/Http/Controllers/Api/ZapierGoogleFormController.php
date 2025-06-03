<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Records\PendingYouthProfile;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ZapierGoogleFormController extends Controller
{
    public function receive(Request $request)
    {
        try {
            // Save raw request for debugging
            $timestamp = now()->format('Y-m-d_H-i-s');
            $debugFile = "zzz_zapier/debug_google_form_{$timestamp}.json";
            
            // Store the raw request data
            file_put_contents(base_path($debugFile), json_encode([
                'request' => $request->all(),
                'raw_body' => file_get_contents('php://input')
            ], JSON_PRETTY_PRINT));

            // Log to Laravel logs
            Log::info('Received Google Form submission via Zapier', [
                'data' => $request->all(),
                'debug_file' => $debugFile
            ]);

            // Get the form data directly from request
            $formData = $request->all();
            if (empty($formData)) {
                throw new \Exception('No form data received');
            }

            // Helper functions for data transformation
            $parseIncome = function($value) {
                if (empty($value)) return null;
                return floatval(str_replace([',', ' '], '', $value));
            };

            $parseYesNo = function($value) {
                return strtolower(trim($value ?? '')) === 'yes';
            };

            // Transform the data to match our database structure
            $profileData = [
                'user_id' => 1, // System user for Zapier imports
                'status' => 'pending',
                'form_submitted_at' => now(),
                'data_collection_agreement' => $formData['COL$B'] ?? null,
                'full_name' => $formData['COL$C'] ?? null,
                'address' => $formData['COL$D'] ?? null,
                'gender' => ucfirst(strtolower($formData['COL$E'] ?? '')),
                'age' => intval($formData['COL$F'] ?? 0),
                'birthdate' => $this->parseDate($formData['COL$G'] ?? null),
                'email' => $formData['COL$H'] ?? null,
                'phone' => $formData['COL$I'] ?? null,
                'civil_status' => $formData['COL$J'] ?? null,
                'youth_age_group' => $formData['COL$K'] ?? null,
                'education_level' => $formData['COL$L'] ?? null,
                'youth_classification' => $formData['COL$M'] ?? null,
                'work_status' => $formData['COL$N'] ?? null,
                'is_sk_voter' => $parseYesNo($formData['COL$O']),
                'is_registered_national_voter' => $parseYesNo($formData['COL$P']),
                'voted_last_election' => $parseYesNo($formData['COL$Q']),
                'has_attended_assembly' => $parseYesNo($formData['COL$R']),
                'assembly_attendance' => empty($formData['COL$S']) ? null : intval($formData['COL$S']),
                'assembly_absence_reason' => $formData['COL$T'] ?? null,
                'mother_name' => $formData['COL$U'] ?? null,
                'father_name' => $formData['COL$V'] ?? null,
                'parents_monthly_income' => $parseIncome($formData['COL$W']),
                'personal_monthly_income' => $parseIncome($formData['COL$X']),
                'suggested_programs' => $formData['COL$Y'] ?? null,
                'interests_hobbies' => $formData['COL$Z'] ?? null,
            ];

            // Log the processed data for debugging
            $processedFile = "zzz_zapier/processed_google_form_{$timestamp}.json";
            file_put_contents(base_path($processedFile), json_encode($profileData, JSON_PRETTY_PRINT));

            // Check for duplicates
            $isDuplicate = PendingYouthProfile::where('full_name', $profileData['full_name'])
                ->where('birthdate', $profileData['birthdate'])
                ->exists();

            if ($isDuplicate) {
                $result = [
                    'status' => 'warning',
                    'message' => 'Duplicate profile detected',
                    'data' => [
                        'full_name' => $profileData['full_name'],
                        'birthdate' => $profileData['birthdate']
                    ]
                ];
            } else {
                // Create the pending profile
                $profile = PendingYouthProfile::create($profileData);
                
                $result = [
                    'status' => 'success',
                    'message' => 'Profile created successfully',
                    'profile_id' => $profile->id,
                    'name' => $profile->full_name
                ];
            }

            // Save the results for debugging
            $resultsFile = "zzz_zapier/results_google_form_{$timestamp}.json";
            file_put_contents(base_path($resultsFile), json_encode($result, JSON_PRETTY_PRINT));

            return response()->json([
                'status' => $result['status'],
                'message' => $result['message'],
                'data' => $result,
                'debug_file' => $debugFile,
                'processed_file' => $processedFile,
                'results_file' => $resultsFile
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to process Google Form submission', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to process submission: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Parse date from Google Form format (MM/DD/YYYY) to Y-m-d
     */
    private function parseDate($date)
    {
        if (empty($date)) return null;
        try {
            return Carbon::createFromFormat('n/j/Y', trim($date))->format('Y-m-d');
        } catch (\Exception $e) {
            Log::warning('Failed to parse date: ' . $date);
            return null;
        }
    }
} 