<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ZapierUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // API key middleware handles authorization
    }

    public function rules(): array
    {
        return [
            'data' => 'required|array',
            'format' => 'required|in:csv,excel,json',
            'data.first_name' => 'required|string|max:255',
            'data.last_name' => 'required|string|max:255',
            'data.middle_name' => 'nullable|string|max:255',
            'data.suffix' => 'nullable|string|max:10',
            'data.address' => 'required|string|max:255',
            'data.gender' => 'required|in:male,female,other',
            'data.birthdate' => 'required|date',
            'data.email' => 'nullable|email|max:255',
            'data.phone' => 'nullable|string|max:20',
            'data.civil_status' => 'required|string|max:50',
            'data.youth_age_group' => 'required|string|max:50',
            'data.personal_monthly_income' => 'nullable|numeric|min:0',
            'data.interests_hobbies' => 'nullable|string',
            'data.suggested_programs' => 'nullable|string',
            'data.mother_name' => 'nullable|string|max:255',
            'data.father_name' => 'nullable|string|max:255',
            'data.parents_monthly_income' => 'nullable|numeric|min:0',
            'data.education_level' => 'required|string|max:100',
            'data.youth_classification' => 'required|string|max:100',
            'data.work_status' => 'required|string|max:100',
            'data.is_sk_voter' => 'required|boolean',
            'data.is_registered_national_voter' => 'required|boolean',
            'data.voted_last_election' => 'required|boolean',
            'data.assembly_attendance' => 'nullable|integer|min:0',
            'data.assembly_absence_reason' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'data.first_name.required' => 'First name is required',
            'data.last_name.required' => 'Last name is required',
            'data.address.required' => 'Address is required',
            'data.gender.required' => 'Gender is required',
            'data.birthdate.required' => 'Birthdate is required',
            'data.civil_status.required' => 'Civil status is required',
            'data.youth_age_group.required' => 'Youth age group is required',
            'data.education_level.required' => 'Education level is required',
            'data.youth_classification.required' => 'Youth classification is required',
            'data.work_status.required' => 'Work status is required',
            'data.is_sk_voter.required' => 'SK voter status is required',
            'data.is_registered_national_voter.required' => 'National voter status is required',
            'data.voted_last_election.required' => 'Last election voting status is required',
        ];
    }
} 