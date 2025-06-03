<?php

namespace App\Http\Controllers;

use App\Models\Records\PendingYouthProfile;
use App\Models\Records\YouthProfileRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ProfileApproved;
use Spatie\Activitylog\Facades\Activity;
use App\Models\Records\PersonalInformation;
use App\Models\Records\FamilyInformation;
use App\Models\Records\EngagementData;
use App\Models\Records\YouthProfile;

class RejectedYouthProfileController extends Controller
{
    public function index()
    {
        try {
            return Inertia::render('errors/forbidden', [
                'status' => 403,
                'message' => 'This feature is currently unavailable.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('errors/error', [
                'status' => 500,
                'message' => 'Something went wrong on our end.'
            ]);
        }
    }

    public function show(PendingYouthProfile $profile)
    {
        try {
            return Inertia::render('errors/forbidden', [
                'status' => 403,
                'message' => 'This feature is currently unavailable.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('errors/error', [
                'status' => 500,
                'message' => 'Something went wrong on our end.'
            ]);
        }
    }

    public function edit(PendingYouthProfile $profile)
    {
        try {
            // Load the relationships
            $profile->load(['personalInformation', 'familyInformation', 'engagementData']);

            return Inertia::render('youth-profiles/rejected/edit', [
                'profile' => $profile
            ]);
        } catch (\Exception $e) {
            return back()->withException($e);
        }
    }

    public function update(Request $request, PendingYouthProfile $profile)
    {
        try {
            $validated = $request->validate([
                'personal_information.full_name' => 'required|string|max:255',
                'personal_information.birthdate' => 'required|date',
                'personal_information.gender' => 'required|string|in:Male,Female',
                'personal_information.email' => 'nullable|email|max:255',
                'personal_information.phone' => 'nullable|string|max:255',
                'personal_information.address' => 'required|string|max:255',
                'personal_information.civil_status' => 'required|string',
                'personal_information.youth_age_group' => 'required|string',
                'personal_information.personal_monthly_income' => 'nullable|numeric|min:0',
                'personal_information.interests_hobbies' => 'nullable|string',
                'personal_information.suggested_programs' => 'nullable|string',

                'family_information.father_name' => 'nullable|string|max:255',
                'family_information.mother_name' => 'nullable|string|max:255',
                'family_information.parents_monthly_income' => 'nullable|numeric|min:0',

                'engagement_data.education_level' => 'required|string',
                'engagement_data.youth_classification' => 'required|string',
                'engagement_data.work_status' => 'required|string',
                'engagement_data.is_sk_voter' => 'required|boolean',
                'engagement_data.is_registered_national_voter' => 'required|boolean',
                'engagement_data.voted_last_election' => 'required|boolean',
                'engagement_data.has_attended_assembly' => 'required|boolean',
                'engagement_data.assembly_attendance' => 'nullable|numeric|min:0',
                'engagement_data.assembly_absence_reason' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            // Update personal information
            $profile->personalInformation()->update($validated['personal_information']);

            // Update family information
            $profile->familyInformation()->update($validated['family_information']);

            // Update engagement data
            $profile->engagementData()->update($validated['engagement_data']);

            DB::commit();

            // Log the activity
            Activity::performedOn($profile)
                ->causedBy(Auth::user())
                ->log('Updated rejected youth profile');

            if ($request->wantsJson()) {
                return response()->json(['message' => 'Profile updated successfully']);
            }

            return redirect()->back()->with('success', 'Profile updated successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Failed to update profile'], 500);
            }

            return back()->withException($e);
        }
    }

    public function approve(PendingYouthProfile $profile)
    {
        try {
            return Inertia::render('errors/forbidden', [
                'status' => 403,
                'message' => 'This feature is currently unavailable.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('errors/error', [
                'status' => 500,
                'message' => 'Something went wrong on our end.'
            ]);
        }
    }

    public function destroy(PendingYouthProfile $profile)
    {
        try {
            return Inertia::render('errors/forbidden', [
                'status' => 403,
                'message' => 'This feature is currently unavailable.'
            ]);
        } catch (\Exception $e) {
            return Inertia::render('errors/error', [
                'status' => 500,
                'message' => 'Something went wrong on our end.'
            ]);
        }
    }
} 