<?php

namespace App\Http\Controllers;

use App\Models\Records\YouthProfileRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;

class YouthProfileRecordController extends Controller
{
    public function index(Request $request)
    {
        $query = YouthProfileRecord::with([
            'user',
            'approver',
            'personalInformation',
            'familyInformation',
            'engagementData'
        ]);

        // Handle search
        if ($request->has('search') && $request->search !== '') {
            $search = $request->search;
            $query->whereHas('personalInformation', function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Handle age group filter
        if ($request->has('age_group') && $request->age_group !== 'all') {
            $query->whereHas('personalInformation', function($q) use ($request) {
                switch ($request->age_group) {
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

        // Handle education filter
        if ($request->has('education') && $request->education !== 'all') {
            $query->whereHas('engagementData', function($q) use ($request) {
                $q->where('education_level', $request->education);
            });
        }

        // Handle employment filter
        if ($request->has('employment') && $request->employment !== 'all') {
            $query->whereHas('engagementData', function($q) use ($request) {
                $q->where('work_status', $request->employment);
            });
        }

        $records = $query->latest()->get();

        return Inertia::render('youth-profiles/records/index', [
            'records' => $records->map(function ($record) {
                return [
                    'id' => $record->id,
                    'user' => $record->user,
                    'approver' => $record->approver,
                    'personalInformation' => $record->personalInformation ? [
                        'full_name' => $record->personalInformation->full_name,
                        'birthdate' => $record->personalInformation->birthdate,
                        'gender' => $record->personalInformation->gender,
                        'email' => $record->personalInformation->email,
                        'phone' => $record->personalInformation->phone,
                        'address' => $record->personalInformation->address,
                        'personal_monthly_income' => $record->personalInformation->personal_monthly_income,
                        'civil_status' => $record->personalInformation->civil_status,
                        'youth_age_group' => $record->personalInformation->youth_age_group,
                        'interests_hobbies' => $record->personalInformation->interests_hobbies,
                        'suggested_programs' => $record->personalInformation->suggested_programs,
                    ] : null,
                    'familyInformation' => $record->familyInformation ? [
                        'mother_name' => $record->familyInformation->mother_name,
                        'father_name' => $record->familyInformation->father_name,
                        'parents_monthly_income' => $record->familyInformation->parents_monthly_income,
                    ] : null,
                    'engagementData' => $record->engagementData ? [
                        'education_level' => $record->engagementData->education_level,
                        'work_status' => $record->engagementData->work_status,
                        'is_sk_voter' => $record->engagementData->is_sk_voter,
                        'assembly_attendance' => $record->engagementData->assembly_attendance,
                        'youth_classification' => $record->engagementData->youth_classification,
                        'is_registered_national_voter' => $record->engagementData->is_registered_national_voter,
                        'voted_last_election' => $record->engagementData->voted_last_election,
                        'has_attended_assembly' => $record->engagementData->has_attended_assembly,
                        'assembly_absence_reason' => $record->engagementData->assembly_absence_reason,
                    ] : null,
                    'approval_notes' => $record->approval_notes,
                    'created_at' => $record->created_at,
                    'updated_at' => $record->updated_at,
                ];
            })
        ]);
    }

    public function show(YouthProfileRecord $record)
    {
        $record->load([
                'user',
                'approver',
                'personalInformation',
                'familyInformation',
                'engagementData'
        ]);

        if (!$record->personalInformation || !$record->familyInformation || !$record->engagementData) {
            abort(404, 'Record information is incomplete');
        }

        return Inertia::render('youth-profiles/records/show', [
            'record' => [
                'id' => $record->id,
                'user' => $record->user,
                'approver' => $record->approver,
                'personalInformation' => [
                    'full_name' => $record->personalInformation->full_name,
                    'birthdate' => $record->personalInformation->birthdate,
                    'gender' => $record->personalInformation->gender,
                    'email' => $record->personalInformation->email,
                    'phone' => $record->personalInformation->phone,
                    'address' => $record->personalInformation->address,
                    'personal_monthly_income' => $record->personalInformation->personal_monthly_income,
                    'civil_status' => $record->personalInformation->civil_status,
                    'youth_age_group' => $record->personalInformation->youth_age_group,
                    'interests_hobbies' => $record->personalInformation->interests_hobbies,
                    'suggested_programs' => $record->personalInformation->suggested_programs,
                ],
                'familyInformation' => [
                    'mother_name' => $record->familyInformation->mother_name,
                    'father_name' => $record->familyInformation->father_name,
                    'parents_monthly_income' => $record->familyInformation->parents_monthly_income,
                ],
                'engagementData' => [
                    'education_level' => $record->engagementData->education_level,
                    'work_status' => $record->engagementData->work_status,
                    'is_sk_voter' => $record->engagementData->is_sk_voter,
                    'assembly_attendance' => $record->engagementData->assembly_attendance,
                    'youth_classification' => $record->engagementData->youth_classification,
                    'is_registered_national_voter' => $record->engagementData->is_registered_national_voter,
                    'voted_last_election' => $record->engagementData->voted_last_election,
                    'has_attended_assembly' => $record->engagementData->has_attended_assembly,
                    'assembly_absence_reason' => $record->engagementData->assembly_absence_reason,
                ],
                'approval_notes' => $record->approval_notes,
                'created_at' => $record->created_at,
                'updated_at' => $record->updated_at,
            ]
        ]);
    }
}
