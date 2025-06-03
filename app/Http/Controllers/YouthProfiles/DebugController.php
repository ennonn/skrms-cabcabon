<?php

namespace App\Http\Controllers\YouthProfiles;

use App\Http\Controllers\Controller;
use App\Models\Records\PendingYouthProfile;
use App\Models\Records\YouthProfileRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class DebugController extends Controller
{
    public function debugApproveProfile(Request $request, $profileId)
    {
        // Get the profile
        $profile = PendingYouthProfile::findOrFail($profileId);
        
        // Log the profile data
        Log::info('Profile to approve', [
            'profile_id' => $profile->id,
            'profile_status' => $profile->status,
            'request_data' => $request->all()
        ]);
        
        // Check if notes are being received
        $notes = $request->input('notes');
        Log::info('Notes received', ['notes' => $notes]);
        
        // Return debug information
        return response()->json([
            'success' => true,
            'message' => 'Debug information for profile approval',
            'profile' => $profile,
            'request_data' => $request->all(),
            'notes' => $notes
        ]);
    }
    
    public function checkPendingStatus()
    {
        try {
            // Get all pending profiles
            $pendingProfiles = PendingYouthProfile::where('status', 'pending')->get();
            
            // Get all approved profiles
            $approvedProfiles = PendingYouthProfile::where('status', 'approved')->get();
            
            // Get all rejected profiles
            $rejectedProfiles = PendingYouthProfile::where('status', 'rejected')->get();
            
            // Get all main youth profile records
            $mainRecords = YouthProfileRecord::all();
            
            // Try a direct SQL query for pending profiles
            $pendingSql = DB::select('SELECT id, status FROM pending_youth_profiles WHERE status = ?', ['pending']);
            
            // Try a direct SQL query for approved profiles
            $approvedSql = DB::select('SELECT id, status FROM pending_youth_profiles WHERE status = ?', ['approved']);
            
            // Check database connection
            try {
                DB::connection()->getPdo();
                $dbConnection = "DB connection successful";
            } catch (\Exception $e) {
                $dbConnection = "DB connection failed: " . $e->getMessage();
            }
            
            // Get sample pending profile details
            $pendingSample = [];
            foreach ($pendingProfiles->take(3) as $profile) {
                $pendingSample[] = [
                    'id' => $profile->id,
                    'name' => $profile->first_name . ' ' . $profile->last_name,
                    'status' => $profile->status,
                    'user_id' => $profile->user_id,
                    'created_at' => $profile->created_at->format('Y-m-d H:i:s')
                ];
            }
            
            // Get sample approved profile details
            $approvedSample = [];
            foreach ($approvedProfiles->take(3) as $profile) {
                $approvedSample[] = [
                    'id' => $profile->id,
                    'name' => $profile->first_name . ' ' . $profile->last_name,
                    'status' => $profile->status,
                    'user_id' => $profile->user_id,
                    'approver_id' => $profile->approver_id,
                    'approval_notes' => $profile->approval_notes,
                    'created_at' => $profile->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $profile->updated_at->format('Y-m-d H:i:s')
                ];
            }
            
            // Return counts and sample data
            return response()->json([
                'db_connection' => $dbConnection,
                'pending_count' => $pendingProfiles->count(),
                'approved_count' => $approvedProfiles->count(),
                'rejected_count' => $rejectedProfiles->count(),
                'main_records_count' => $mainRecords->count(),
                'sql_query_results' => [
                    'pending_count' => count($pendingSql),
                    'approved_count' => count($approvedSql),
                    'pending_ids' => collect($pendingSql)->pluck('id'),
                ],
                'pending_sample' => $pendingSample,
                'approved_sample' => $approvedSample
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to check status',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function testApproval($profileId)
    {
        $profile = PendingYouthProfile::findOrFail($profileId);
        
        Log::info('Before approval', [
            'profile_id' => $profile->id,
            'status' => $profile->status
        ]);
        
        DB::beginTransaction();
        
        try {
            $mainRecord = YouthProfileRecord::create([
                'user_id' => $profile->user_id,
                'approver_id' => auth()->id() ?? 1,
                'approval_notes' => 'Test approval via debug controller',
            ]);
            
            Log::info('Created main record', [
                'main_record_id' => $mainRecord->id
            ]);
            
            // Skip creating related records for simplicity in this test
            
            // 2. Update the profile status
            $updateResult = $profile->update([
                'status' => 'approved',
                'approver_id' => auth()->id() ?? 1,
                'approval_notes' => 'Test approval via debug controller'
            ]);
            
            // Refresh from database
            $profile->refresh();
            
            // Check if database was actually updated
            $dbCheck = PendingYouthProfile::find($profileId);
            
            Log::info('After approval', [
                'profile_id' => $profile->id,
                'update_result' => $updateResult,
                'status_from_model' => $profile->status,
                'status_from_db' => $dbCheck ? $dbCheck->status : 'Profile not found',
                'main_record_id' => $mainRecord->id,
                'db_query' => 'SELECT status FROM pending_youth_profiles WHERE id = ' . $profileId
            ]);
            
            // Commit the transaction
            DB::commit();
            
            return response()->json([
                'success' => $updateResult && $profile->status === 'approved',
                'message' => 'Test approval completed',
                'before_status' => 'pending',
                'after_status' => $profile->status,
                'db_status' => $dbCheck ? $dbCheck->status : 'Profile not found',
                'update_result' => $updateResult,
                'profile' => $profile,
                'main_record' => $mainRecord
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction if any part fails
            DB::rollBack();
            
            Log::error('Test approval failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'profile_id' => $profileId
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Test approval failed: ' . $e->getMessage(),
                'profile_id' => $profileId
            ]);
        }
    }

    public function checkModelFunctionality()
    {
        try {
            // Test the database connection
            $dbStatus = DB::connection()->getPdo() ? 'Connected' : 'Failed';
            
            // Check for any pending profiles
            $pendingCount = PendingYouthProfile::where('status', 'pending')->count();
            $approvedCount = PendingYouthProfile::where('status', 'approved')->count();
            
            // Try a direct SQL query
            $result = DB::select('SELECT COUNT(*) as count FROM pending_youth_profiles WHERE status = ?', ['pending']);
            $sqlCount = $result[0]->count ?? 'Query failed';
            
            // Test model save functionality with a temporary record
            $testModel = new PendingYouthProfile();
            $testModel->fill([
                'status' => 'test',
                'last_name' => 'TEST',
                'first_name' => 'DEBUG',
                'address' => 'Test Address',
                'gender' => 'male',
                'birthdate' => now()->subYears(20),
                'education_level' => 'college',
                'work_status' => 'employed',
                'is_sk_voter' => false,
                'is_registered_national_voter' => false,
                'voted_last_election' => false,
                'data_collection_agreement' => 'yes'
            ]);
            
            // Don't actually save to avoid polluting the DB
            $modelValid = $testModel->validate();
            
            return response()->json([
                'success' => true,
                'db_connection' => $dbStatus,
                'model_counts' => [
                    'pending' => $pendingCount,
                    'approved' => $approvedCount,
                    'sql_pending' => $sqlCount
                ],
                'model_validation' => $modelValid ? 'Valid' : 'Invalid',
                'laravel_version' => app()->version(),
                'php_version' => PHP_VERSION
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error checking model functionality: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }

    public function verifyRecordIntegrity()
    {
        try {
            // Fetch all youth profile records
            $records = YouthProfileRecord::all();
            
            // Initialize counters
            $totalRecords = $records->count();
            $missingPersonalInfo = 0;
            $missingFamilyInfo = 0;
            $missingEngagementData = 0;
            $completeRecords = 0;
            
            // Check each record for relationship integrity
            $problematicRecords = [];
            
            foreach ($records as $record) {
                $personalInfo = $record->personalInformation;
                $familyInfo = $record->familyInformation;
                $engagementData = $record->engagementData;
                
                $issues = [];
                
                if (!$personalInfo) {
                    $missingPersonalInfo++;
                    $issues[] = 'personal_information';
                }
                
                if (!$familyInfo) {
                    $missingFamilyInfo++;
                    $issues[] = 'family_information';
                }
                
                if (!$engagementData) {
                    $missingEngagementData++;
                    $issues[] = 'engagement_data';
                }
                
                if (count($issues) > 0) {
                    $problematicRecords[] = [
                        'record_id' => $record->id,
                        'user_id' => $record->user_id,
                        'created_at' => $record->created_at->format('Y-m-d H:i:s'),
                        'missing_relationships' => $issues
                    ];
                } else {
                    $completeRecords++;
                }
            }
            
            // Check for orphaned relationship records
            $orphanedPersonalInfo = DB::table('personal_information')
                ->leftJoin('youth_profile_records', 'personal_information.youth_profile_record_id', '=', 'youth_profile_records.id')
                ->whereNull('youth_profile_records.id')
                ->count();
                
            $orphanedFamilyInfo = DB::table('family_information')
                ->leftJoin('youth_profile_records', 'family_information.youth_profile_record_id', '=', 'youth_profile_records.id')
                ->whereNull('youth_profile_records.id')
                ->count();
                
            $orphanedEngagementData = DB::table('engagement_data')
                ->leftJoin('youth_profile_records', 'engagement_data.youth_profile_record_id', '=', 'youth_profile_records.id')
                ->whereNull('youth_profile_records.id')
                ->count();
            
            return response()->json([
                'success' => true,
                'total_records' => $totalRecords,
                'complete_records' => $completeRecords,
                'incomplete_records_count' => $totalRecords - $completeRecords,
                'missing_relationships' => [
                    'personal_information' => $missingPersonalInfo,
                    'family_information' => $missingFamilyInfo,
                    'engagement_data' => $missingEngagementData
                ],
                'orphaned_records' => [
                    'personal_information' => $orphanedPersonalInfo,
                    'family_information' => $orphanedFamilyInfo,
                    'engagement_data' => $orphanedEngagementData
                ],
                'problematic_records' => $problematicRecords
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
