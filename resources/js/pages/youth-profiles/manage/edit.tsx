import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { YouthProfileForm } from '@/components/youth-profile-form';

interface PersonalInformation {
    full_name: string;
    birthdate: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income: number | null;
    interests_hobbies: string | null;
    suggested_programs: string | null;
}

interface FamilyInformation {
    father_name: string | null;
    mother_name: string | null;
    parents_monthly_income: number | null;
}

interface EngagementData {
    education_level: string;
    youth_classification: string;
    work_status: string;
    is_sk_voter: boolean;
    is_registered_national_voter: boolean;
    voted_last_election: boolean;
    has_attended_assembly: boolean;
    assembly_attendance: number | null;
    assembly_absence_reason: string | null;
}

interface Profile {
    id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    personalInformation: PersonalInformation;
    familyInformation: FamilyInformation;
    engagementData: EngagementData;
    user: {
        id: number;
        name: string;
    };
    approver?: {
        id: number;
        name: string;
    };
    approval_notes?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    profile: Profile;
}

export default function EditProfile({ profile, auth }: Props) {
    return (
        <AppLayout user={auth.user}>
            <Head title="Edit Youth Profile" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                    Edit Youth Profile - {profile.personalInformation.full_name}
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <YouthProfileForm 
                                    youth_profile={{
                                        ...profile,
                                        full_name: profile.personalInformation.full_name,
                                        birthdate: profile.personalInformation.birthdate,
                                        gender: profile.personalInformation.gender,
                                        email: profile.personalInformation.email,
                                        phone: profile.personalInformation.phone,
                                        address: profile.personalInformation.address,
                                        civil_status: profile.personalInformation.civil_status,
                                        youth_age_group: profile.personalInformation.youth_age_group,
                                        personal_monthly_income: profile.personalInformation.personal_monthly_income,
                                        interests_hobbies: profile.personalInformation.interests_hobbies,
                                        suggested_programs: profile.personalInformation.suggested_programs,
                                        father_name: profile.familyInformation.father_name,
                                        mother_name: profile.familyInformation.mother_name,
                                        parents_monthly_income: profile.familyInformation.parents_monthly_income,
                                        education_level: profile.engagementData.education_level,
                                        youth_classification: profile.engagementData.youth_classification,
                                        work_status: profile.engagementData.work_status,
                                        is_sk_voter: profile.engagementData.is_sk_voter,
                                        is_registered_national_voter: profile.engagementData.is_registered_national_voter,
                                        voted_last_election: profile.engagementData.voted_last_election,
                                        has_attended_assembly: profile.engagementData.has_attended_assembly,
                                        assembly_attendance: profile.engagementData.assembly_attendance,
                                        assembly_absence_reason: profile.engagementData.assembly_absence_reason,
                                    }}
                                    isEditing={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 