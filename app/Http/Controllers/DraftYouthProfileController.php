<?php

namespace App\Http\Controllers;

use App\Models\Records\PendingYouthProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\Facades\Activity;

class DraftYouthProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('youth-profiles/drafts/index', [
            'records' => PendingYouthProfile::where('user_id', auth()->id())
                ->whereIn('status', ['draft', 'rejected'])
                ->with(['user'])
                ->latest()
                ->get()
        ]);
    }

    public function create(Request $request)
    {
        $copyFromProfile = null;
        if ($request->has('copy_from')) {
            $copyFromProfile = PendingYouthProfile::where('id', $request->copy_from)
                ->where('status', PendingYouthProfile::STATUS_REJECTED)
                ->where('user_id', auth()->id())
                ->firstOrFail();
        }

        return Inertia::render('youth-profiles/drafts/create', [
            'copy_from' => $copyFromProfile
        ]);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $profile = new PendingYouthProfile();
            $profile->user_id = auth()->id();
            $profile->status = PendingYouthProfile::STATUS_DRAFT;
            
            // If copying from a rejected profile, copy all the fields
            if ($request->has('copy_from')) {
                $copyFrom = PendingYouthProfile::where('id', $request->copy_from)
                    ->where('status', PendingYouthProfile::STATUS_REJECTED)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();

                $profile->fill($copyFrom->only([
                    'full_name',
                    'address',
                    'gender',
                    'birthdate',
                    'email',
                    'phone',
                    'civil_status',
                    'youth_age_group',
                    'personal_monthly_income',
                    'interests_hobbies',
                    'suggested_programs',
                    'mother_name',
                    'father_name',
                    'parents_monthly_income',
                    'education_level',
                    'youth_classification',
                    'work_status',
                    'is_sk_voter',
                    'is_registered_national_voter',
                    'voted_last_election',
                    'assembly_attendance',
                    'assembly_absence_reason',
                ]));

                // Save the new draft first
                $profile->save();

                // Delete the original rejected profile
                \Log::info('Deleting original rejected profile after copying', ['rejected_profile_id' => $copyFrom->id]);
                $copyFrom->delete();
            } else {
                // Extract personal information
                $personalInfo = $request->input('personalInformation');
                if ($personalInfo) {
                    $profile->fill([
                        'full_name' => $personalInfo['full_name'],
                        'birthdate' => $personalInfo['birthdate'],
                        'gender' => $personalInfo['gender'],
                        'email' => $personalInfo['email'],
                        'phone' => $personalInfo['phone'],
                        'address' => $personalInfo['address'],
                        'civil_status' => $personalInfo['civil_status'],
                        'youth_age_group' => $personalInfo['youth_age_group'],
                        'personal_monthly_income' => $personalInfo['personal_monthly_income'],
                        'interests_hobbies' => $personalInfo['interests_hobbies'],
                        'suggested_programs' => $personalInfo['suggested_programs'],
                    ]);
                }

                // Extract family information
                $familyInfo = $request->input('familyInformation');
                if ($familyInfo) {
                    $profile->fill([
                        'mother_name' => $familyInfo['mother_name'],
                        'father_name' => $familyInfo['father_name'],
                        'parents_monthly_income' => $familyInfo['parents_monthly_income'],
                    ]);
                }

                // Extract engagement data
                $engagementData = $request->input('engagementData');
                if ($engagementData) {
                    $profile->fill([
                        'education_level' => $engagementData['education_level'],
                        'youth_classification' => $engagementData['youth_classification'],
                        'work_status' => $engagementData['work_status'],
                        'is_sk_voter' => $engagementData['is_sk_voter'],
                        'is_registered_national_voter' => $engagementData['is_registered_national_voter'],
                        'voted_last_election' => $engagementData['voted_last_election'],
                        'has_attended_assembly' => $engagementData['has_attended_assembly'],
                        'assembly_attendance' => $engagementData['assembly_attendance'],
                        'assembly_absence_reason' => $engagementData['assembly_absence_reason'],
                    ]);
                }

                // Calculate age from birthdate if birthdate is set
                if ($profile->birthdate) {
                    $profile->age = Carbon::parse($profile->birthdate)->age;
                }
                
                \Log::info('About to save profile', ['profile_data' => $profile->toArray()]);
                
                $profile->save();
            }
            
            DB::commit();

            Activity::performedOn($profile)
                ->causedBy(auth()->user())
                ->log('Created draft youth profile' . ($request->has('copy_from') ? ' from rejected profile' : ''));

            \Log::info('Profile saved successfully', ['profile_id' => $profile->id]);

            $message = 'Youth profile saved as draft. You can now review and submit it.';

            return redirect()->route('youth-profiles.drafts.show', $profile)
                ->with('success', $message);
                
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating draft youth profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return back()->withErrors([
                'error' => 'An unexpected error occurred while saving the draft. Please try again.'
            ]);
        }
    }

    public function show(PendingYouthProfile $draft)
    {
        $this->authorize('view', $draft);

        return Inertia::render('youth-profiles/drafts/show', [
            'draft' => $draft->load(['user']),
        ]);
    }

    public function edit(PendingYouthProfile $draft)
    {
        \Log::info('DraftYouthProfileController@edit - Starting', [
            'draft_id' => $draft->id,
            'draft_status' => $draft->status,
            'draft_user_id' => $draft->user_id,
            'current_user' => [
                'id' => auth()->id(),
                'is_admin' => auth()->user()->isAdmin(),
                'is_superadmin' => auth()->user()->isSuperAdmin()
            ]
        ]);

        try {
            // Only allow the profile owner to edit drafts
            if ($draft->user_id !== auth()->id()) {
                \Log::warning('Unauthorized attempt to edit draft', [
                    'draft_id' => $draft->id,
                    'user_id' => auth()->id()
                ]);
                return redirect()->route('youth-profiles.drafts.index')
                    ->with('error', 'You are not authorized to edit this draft.');
            }

            // Ensure the profile is in draft state
            if ($draft->status !== 'draft') {
                \Log::warning('Attempt to edit non-draft profile', [
                    'draft_id' => $draft->id,
                    'status' => $draft->status
                ]);
                return redirect()->route('youth-profiles.drafts.index')
                    ->with('error', 'Only draft profiles can be edited.');
            }
            
            \Log::info('DraftYouthProfileController@edit - Authorization passed');
            
            return Inertia::render('youth-profiles/drafts/edit', [
                'profile' => $draft,
            ]);
        } catch (\Exception $e) {
            \Log::error('DraftYouthProfileController@edit - Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function update(Request $request, PendingYouthProfile $draft)
    {
        \Log::info('Starting draft profile update', [
            'profile_id' => $draft->id,
            'user_id' => auth()->id(),
            'profile_user_id' => $draft->user_id,
            'profile_status' => $draft->status,
            'request_data' => $request->all()
        ]);

        try {
            // Ensure the profile is in draft state
            if ($draft->status !== 'draft') {
                \Log::warning('Attempt to update non-draft profile', [
                    'draft_id' => $draft->id,
                    'status' => $draft->status
                ]);
                return redirect()->route('youth-profiles.drafts.index')
                    ->with('error', 'Only draft profiles can be updated.');
            }

            $data = $request->validate([
                'full_name' => 'required|string|max:255',
                'birthdate' => 'required|date',
                'gender' => ['required', 'string', 'in:Male,Female'],
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:255',
                'address' => 'required|string|max:255',
                'civil_status' => 'required|string',
                'youth_age_group' => 'required|string',
                'personal_monthly_income' => 'nullable|numeric|min:0',
                'interests_hobbies' => 'nullable|string|max:255',
                'suggested_programs' => 'nullable|string|max:255',
                'father_name' => 'nullable|string|max:255',
                'mother_name' => 'nullable|string|max:255',
                'parents_monthly_income' => 'nullable|numeric|min:0',
                'education_level' => 'required|string',
                'youth_classification' => 'required|string',
                'work_status' => 'required|string',
                'is_sk_voter' => 'required|boolean',
                'is_registered_national_voter' => 'required|boolean',
                'voted_last_election' => 'required|boolean',
                'has_attended_assembly' => 'required|boolean',
                'assembly_attendance' => 'nullable|integer|min:0',
                'assembly_absence_reason' => 'nullable|string|max:255',
            ]);

            DB::beginTransaction();

            try {
                // Update the existing draft profile using fill and save
                $draft->fill($data);
                $draft->status = 'draft'; // Explicitly set status to draft
                $draft->save();

                DB::commit();

                \Log::info('Draft profile updated successfully', [
                    'profile_id' => $draft->id,
                    'status' => $draft->status,
                    'updated_data' => $data
                ]);

                return redirect()->route('youth-profiles.drafts.show', $draft)
                    ->with('success', 'Draft updated successfully.');
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Error updating draft youth profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors([
                'error' => 'An unexpected error occurred while updating the draft. Please try again.'
            ]);
        }
    }

    public function submit(PendingYouthProfile $draft)
    {
        try {
            // Check if profile is in draft state
            if ($draft->status !== 'draft') {
                return back()->with('error', 'Only draft profiles can be submitted.');
            }

            // Check if user is authorized to submit
            if ($draft->user_id !== auth()->id()) {
                return back()->with('error', 'You are not authorized to submit this profile.');
            }

            DB::beginTransaction();

            // Update the profile status to pending
            $draft->status = 'pending';
            $draft->form_submitted_at = now();
            $draft->save();

            DB::commit();

            \Log::info('Draft submitted successfully', [
                'draft_id' => $draft->id,
                'new_status' => $draft->status,
                'user_id' => auth()->id()
            ]);

            return redirect()->route('youth-profiles.pending.show', ['profile' => $draft->id])
                ->with('success', 'Profile submitted successfully. It is now pending for review.');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error submitting youth profile', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'draft_id' => $draft->id,
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors([
                'error' => 'An unexpected error occurred while submitting the profile. Please try again.'
            ]);
        }
    }

    public function destroy(PendingYouthProfile $draft)
    {
        $this->authorize('delete', $draft);

        $draft->delete();

        return redirect()->route('youth-profiles.drafts.index')
            ->with('success', 'Draft profile deleted successfully.');
    }

    public function returnToDraft(PendingYouthProfile $draft)
    {
        try {
            // Check if profile is in approved state
            if ($draft->status !== 'approved') {
                return back()->with('error', 'Only approved profiles can be returned to draft.');
            }

            // Check if user is authorized to return to draft
            if ($draft->user_id !== auth()->id()) {
                return back()->with('error', 'You are not authorized to return this profile to draft.');
            }

            DB::beginTransaction();

            // Update the profile status to draft
            $draft->status = 'draft';
            $draft->save();

            DB::commit();

            \Log::info('Profile returned to draft successfully', [
                'draft_id' => $draft->id,
                'new_status' => $draft->status,
                'user_id' => auth()->id()
            ]);

            return redirect()->route('youth-profiles.drafts.show', $draft)
                ->with('success', 'Profile returned to draft successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error returning profile to draft', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'draft_id' => $draft->id,
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors([
                'error' => 'An unexpected error occurred while returning the profile to draft. Please try again.'
            ]);
        }
    }
} 