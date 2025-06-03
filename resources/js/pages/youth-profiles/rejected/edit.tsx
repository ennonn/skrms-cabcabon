import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { YouthProfileForm } from '@/components/youth-profile-form';
import { YouthProfile } from '@/types';

interface Props {
    profile: YouthProfile;
}

const breadcrumbs = [
    {
        title: 'Rejected Youth Profiles',
        href: route('youth-profiles.rejected.index'),
    },
    {
        title: 'Edit Profile',
        href: '#',
    },
];

export default function EditRejectedProfile({ profile }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Rejected Profile" />

            <div className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Edit Rejected Profile</h1>
                    <div className="flex gap-2">
                        <Link href={route('youth-profiles.rejected.index')}>
                            <Button variant="outline">Back to Rejected Profiles</Button>
                        </Link>
                    </div>
                </div>

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
                    isEditing
                />
            </div>
        </AppLayout>
    );
} 