<?php

namespace App\Http\Controllers;

use App\Models\Records\PendingYouthProfile;
use App\Models\Records\YouthProfileRecord;
use App\Models\Records\PersonalInformation;
use App\Models\Records\FamilyInformation;
use App\Models\Records\EngagementData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PendingYouthProfileController extends Controller
{
    public function index(Request $request)
    {
        // Make sure we only get records with 'pending' status
        $query = PendingYouthProfile::where('status', 'pending');
        
        // Add a log to see what query is being executed
        \Log::info('Fetching pending profiles', [
            'query_status' => 'pending',
            'request_data' => $request->all()
        ]);

        // Handle search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Handle education filter
        if ($request->has('education') && $request->education !== 'all') {
            $query->where('education_level', $request->education);
        }

        // Handle age filter
        if ($request->has('age') && $request->age !== 'all') {
            $query->where(function($q) use ($request) {
                switch ($request->age) {
                    case 'junior':
                        $q->where('youth_age_group', 'Child Youth (15 - 17 years old)');
                        break;
                    case 'core':
                        $q->where('youth_age_group', 'Core Youth (18 - 24 years old)');
                        break;
                    case 'senior':
                        $q->where('youth_age_group', 'Young Adult (25 - 30 years old)');
                        break;
                }
            });
        }

        // Handle sorting
        $sort = $request->input('sort', 'name');
        $order = $request->input('order', 'asc');

        if ($sort === 'name') {
            $query->orderBy('full_name', $order);
        } elseif ($sort === 'education') {
            $query->orderBy('education_level', $order);
        }

        // Execute the query with pagination
        $profiles = $query->with('user')->paginate(10)->withQueryString();
        
        \Log::info('Fetched pending profiles', [
            'count' => $profiles->count(),
            'total' => $profiles->total(),
            'current_page' => $profiles->currentPage(),
            'last_page' => $profiles->lastPage()
        ]);

        return Inertia::render('youth-profiles/pending/index', [
            'profiles' => $profiles,
            'sort' => $sort,
            'order' => $order,
            'educationFilter' => $request->input('education', 'all'),
            'ageFilter' => $request->input('age', 'all'),
            'search' => $request->input('search', ''),
        ]);
    }

    public function show(PendingYouthProfile $profile)
    {
        $profile->load(['user', 'approver']);
        
        $transformedProfile = [
            'id' => $profile->id,
            'status' => $profile->status,
            'personalInformation' => [
                'full_name' => $profile->full_name,
                'address' => $profile->address,
                'gender' => $profile->gender,
                'birthdate' => $profile->birthdate->format('Y-m-d'),
                'email' => $profile->email,
                'phone' => $profile->phone,
                'civil_status' => $profile->civil_status,
                'youth_age_group' => $profile->youth_age_group,
                'personal_monthly_income' => $profile->personal_monthly_income,
                'interests_hobbies' => $profile->interests_hobbies,
                'suggested_programs' => $profile->suggested_programs,
            ],
            'familyInformation' => [
                'mother_name' => $profile->mother_name,
                'father_name' => $profile->father_name,
                'parents_monthly_income' => $profile->parents_monthly_income,
            ],
            'engagementData' => [
                'education_level' => $profile->education_level,
                'youth_classification' => $profile->youth_classification,
                'work_status' => $profile->work_status,
                'is_sk_voter' => $profile->is_sk_voter,
                'is_registered_national_voter' => $profile->is_registered_national_voter,
                'voted_last_election' => $profile->voted_last_election,
                'assembly_attendance' => $profile->assembly_attendance,
                'assembly_absence_reason' => $profile->assembly_absence_reason,
            ],
            'user' => $profile->user,
            'approver' => $profile->approver,
            'created_at' => $profile->created_at,
            'updated_at' => $profile->updated_at,
        ];

        return Inertia::render('youth-profiles/pending/show', [
            'profile' => $transformedProfile,
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            // Create the pending profile
            $profile = PendingYouthProfile::create([
                'user_id' => auth()->id(),
                'status' => 'pending',
                'data_collection_agreement' => $request->input('data_collection_agreement'),
                'full_name' => $request->input('personalInformation.full_name'),
                'address' => $request->input('personalInformation.address'),
                'gender' => $request->input('personalInformation.gender'),
                'birthdate' => $request->input('personalInformation.birthdate'),
                'email' => $request->input('personalInformation.email'),
                'phone' => $request->input('personalInformation.phone'),
                'civil_status' => $request->input('personalInformation.civil_status'),
                'youth_age_group' => $request->input('personalInformation.youth_age_group'),
                'personal_monthly_income' => $request->input('personalInformation.personal_monthly_income'),
                'interests_hobbies' => $request->input('personalInformation.interests_hobbies'),
                'suggested_programs' => $request->input('personalInformation.suggested_programs'),
                'mother_name' => $request->input('familyInformation.mother_name'),
                'father_name' => $request->input('familyInformation.father_name'),
                'parents_monthly_income' => $request->input('familyInformation.parents_monthly_income'),
                'education_level' => $request->input('engagementData.education_level'),
                'youth_classification' => $request->input('engagementData.youth_classification'),
                'work_status' => $request->input('engagementData.work_status'),
                'is_sk_voter' => $request->input('engagementData.is_sk_voter'),
                'is_registered_national_voter' => $request->input('engagementData.is_registered_national_voter'),
                'voted_last_election' => $request->input('engagementData.voted_last_election'),
                'has_attended_assembly' => $request->input('engagementData.has_attended_assembly'),
                'assembly_attendance' => $request->input('engagementData.assembly_attendance'),
                'assembly_absence_reason' => $request->input('engagementData.assembly_absence_reason'),
            ]);

            DB::commit();

            return redirect()->route('youth-profiles.pending.show', $profile->id)
                ->with('success', 'Profile submitted successfully and is pending approval.');

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to create pending profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to create profile. Please try again.');
        }
    }

    public function approve(Request $request, PendingYouthProfile $profile)
    {
        try {
            // Check if profile is in pending state
            if ($profile->status !== 'pending') {
                return back()->with('error', 'Profile is not in pending state');
            }
            
            // Validate request
            $request->validate([
                'notes' => 'nullable|string|max:1000',
            ]);

            // Start transaction
            DB::beginTransaction();

            try {
                // Log the start of the approval process
                \Log::info('Starting profile approval process', [
                    'profile_id' => $profile->id, 
                    'current_status' => $profile->status
                ]);
                
                // Create the main youth profile record
                $record = YouthProfileRecord::create([
                    'user_id' => $profile->user_id,
                    'approver_id' => auth()->id(),
                    'approval_notes' => $request->input('notes'),
                ]);
                
                \Log::info('Created main record', ['record_id' => $record->id]);

                // Create personal information record and verify
                $personalInfo = PersonalInformation::create([
                    'youth_profile_record_id' => $record->id,
                    'full_name' => $profile->full_name,
                    'address' => $profile->address,
                    'gender' => $profile->gender,
                    'birthdate' => $profile->birthdate,
                    'age' => $profile->age,
                    'email' => $profile->email,
                    'phone' => $profile->phone,
                    'civil_status' => $profile->civil_status,
                    'youth_age_group' => $profile->youth_age_group,
                    'personal_monthly_income' => $profile->personal_monthly_income,
                    'interests_hobbies' => $profile->interests_hobbies,
                    'suggested_programs' => $profile->suggested_programs,
                ]);
                
                if (!$personalInfo) {
                    throw new \Exception('Failed to create personal information');
                }
                
                \Log::info('Created personal information', ['personal_info_id' => $personalInfo->id]);

                // Create family information record and verify
                $familyInfo = FamilyInformation::create([
                    'youth_profile_record_id' => $record->id,
                    'mother_name' => $profile->mother_name,
                    'father_name' => $profile->father_name,
                    'parents_monthly_income' => $profile->parents_monthly_income,
                ]);
                
                if (!$familyInfo) {
                    throw new \Exception('Failed to create family information');
                }
                
                \Log::info('Created family information', ['family_info_id' => $familyInfo->id]);

                // Create engagement data record and verify
                $engagementData = EngagementData::create([
                    'youth_profile_record_id' => $record->id,
                    'education_level' => $profile->education_level,
                    'youth_classification' => $profile->youth_classification,
                    'work_status' => $profile->work_status,
                    'is_sk_voter' => $profile->is_sk_voter,
                    'is_registered_national_voter' => $profile->is_registered_national_voter,
                    'voted_last_election' => $profile->voted_last_election,
                    'has_attended_assembly' => $profile->has_attended_assembly,
                    'assembly_attendance' => $profile->assembly_attendance,
                    'assembly_absence_reason' => $profile->assembly_absence_reason,
                    'suggested_programs' => $profile->suggested_programs,
                ]);
                
                if (!$engagementData) {
                    throw new \Exception('Failed to create engagement data');
                }
                
                \Log::info('Created engagement data', ['engagement_data_id' => $engagementData->id]);

                // Update the pending profile status
                $profile->status = 'approved';
                $profile->approver_id = auth()->id();
                $profile->approval_notes = $request->input('notes');
                $profile->save();
                
                \Log::info('Updated profile status', [
                    'profile_id' => $profile->id, 
                    'new_status' => $profile->status
                ]);

                // Verify all relationships are created properly
                $verifyRecord = YouthProfileRecord::with(['personalInformation', 'familyInformation', 'engagementData'])
                    ->find($record->id);
                
                if (!$verifyRecord || !$verifyRecord->personalInformation || !$verifyRecord->familyInformation || !$verifyRecord->engagementData) {
                    throw new \Exception('Failed to verify related records creation');
                }
                
                \Log::info('Verified all relationships', [
                    'record_id' => $verifyRecord->id,
                    'has_personal_info' => (bool)$verifyRecord->personalInformation,
                    'has_family_info' => (bool)$verifyRecord->familyInformation,
                    'has_engagement_data' => (bool)$verifyRecord->engagementData
                ]);

                // Create notification for the profile owner (submitter)
                $profile->user->notify(new \App\Notifications\ProfileApproved($request->input('notes'), $profile));
                
                // Send SMS notification
                try {
                    $smsService = app(\App\Services\SmsService::class);
                    $message = "Hello {$profile->full_name},\n\n" .
                        "Congratulations! Your youth registration has been approved.\n" .
                        "You are now officially part of our barangay youth community. We are excited to have you join us in making a positive impact in our community.\n\n" .
                        "To learn more about upcoming programs and activities, please visit our barangay office. Our youth coordinator will be happy to assist you.\n\n" .
                        "Together, we can create meaningful changes and build a stronger barangay community!\n\n" .
                        "Thank you for your interest in being part of our barangay youth community.";
                    
                    $smsService->send($profile->phone, $message);
                    \Log::info('Approval SMS sent successfully to youth', ['phone' => $profile->phone]);
                } catch (\Exception $e) {
                    \Log::error('Failed to send approval SMS to youth: ' . $e->getMessage(), [
                        'phone' => $profile->phone,
                        'exception' => $e,
                        'trace' => $e->getTraceAsString()
                    ]);
                }

                DB::commit();
                
                \Log::info('Approval process completed successfully', [
                    'profile_id' => $profile->id, 
                    'final_status' => $profile->fresh()->status
                ]);

                // Redirect with fresh data
                return redirect()->route('youth-profiles.pending.index')
                    ->with('success', 'Profile approved and added to records.');
                    
            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('Failed during approval transaction', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'profile_id' => $profile->id
                ]);
                return back()->with('error', 'Failed to approve profile: ' . $e->getMessage());
            }

        } catch (\Exception $e) {
            \Log::error('Profile approval failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    public function reject(Request $request, PendingYouthProfile $profile)
    {
        try {
            // Check if profile is in pending state
            if ($profile->status !== 'pending') {
                return back()->with('error', 'Profile is not in pending state');
            }

            $request->validate([
                'notes' => 'required|string|max:1000',
            ]);

            DB::beginTransaction();

            try {
                \Log::info('Starting profile rejection process', [
                    'profile_id' => $profile->id, 
                    'current_status' => $profile->status
                ]);

                // Update the profile status
                $profile->status = 'rejected';
                $profile->approver_id = auth()->id();
                $profile->approval_notes = $request->input('notes');
                $profile->save();

                \Log::info('Updated profile status', [
                    'profile_id' => $profile->id, 
                    'new_status' => $profile->status
                ]);

                // Create notification for the profile owner (submitter)
                $profile->user->notify(new \App\Notifications\ProfileRejected($request->input('notes')));
                
                // Send SMS notification
                try {
                    $smsService = app(\App\Services\SmsService::class);
                    $message = "Hello {$profile->full_name},\n\n" .
                        "We regret to inform you that your youth registration application could not be approved at this time.\n\n" .
                        "Reason: {$request->input('notes')}\n\n" .
                        "For more information about this decision or to discuss your application further, please visit our barangay office or contact our youth coordinator.\n\n" .
                        "Thank you for your interest in being part of our barangay youth community.";
                    
                    $smsService->send($profile->phone, $message);
                    \Log::info('Rejection SMS sent successfully to youth', ['phone' => $profile->phone]);
                } catch (\Exception $e) {
                    \Log::error('Failed to send rejection SMS to youth: ' . $e->getMessage(), [
                        'phone' => $profile->phone,
                        'exception' => $e,
                        'trace' => $e->getTraceAsString()
                    ]);
                }

                DB::commit();

                \Log::info('Rejection process completed successfully', [
                    'profile_id' => $profile->id, 
                    'final_status' => $profile->fresh()->status
                ]);

                return redirect()->route('youth-profiles.pending.index')
                    ->with('success', 'Profile rejected successfully.');

            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('Failed during rejection transaction', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'profile_id' => $profile->id
                ]);
                return back()->with('error', 'Failed to reject profile: ' . $e->getMessage());
            }
        } catch (\Exception $e) {
            \Log::error('Profile rejection failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', $e->getMessage());
        }
    }
} 