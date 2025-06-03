import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';

interface PersonalInformation {
    full_name: string;
    birthdate: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    personal_monthly_income: number;
    civil_status: string;
    youth_age_group: string;
    interests_hobbies?: string;
    suggested_programs?: string;
}

interface FamilyInformation {
    mother_name: string;
    father_name: string;
    parents_monthly_income: number;
}

interface EngagementData {
    education_level: string;
    work_status: string;
    is_sk_voter: boolean;
    assembly_attendance: number;
    youth_classification: string;
    is_registered_national_voter: boolean;
    voted_last_election: boolean;
    has_attended_assembly: boolean;
    assembly_absence_reason?: string;
}

interface Profile {
    id: number;
    user: {
        id: number;
        name: string;
    };
    approver?: {
        id: number;
        name: string;
    };
    personalInformation: PersonalInformation;
    familyInformation: FamilyInformation;
    engagementData: EngagementData;
    approval_notes?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    profile: Profile;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

const breadcrumbs = [
    {
        title: 'Youth Profiles',
        href: route('youth-profiles.index'),
    },
    {
        title: 'View Profile',
        href: '#',
    },
];

export default function ShowYouthProfile({ profile, auth }: Props) {
    const calculateAge = (birthdate: string) => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    return (
        <AppLayout user={auth.user} auth={auth} breadcrumbs={breadcrumbs}>
            <Head title={`View Profile - ${profile.personalInformation.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Profile Details</h2>
                                <Link href={route('youth-profiles.index')}>
                                    <Button variant="outline">Back to Manage Profiles</Button>
                                </Link>
                            </div>

                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="font-medium">Name:</span>{' '}
                                            {profile.personalInformation.full_name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Age:</span>{' '}
                                            {calculateAge(profile.personalInformation.birthdate)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Birthdate:</span>{' '}
                                            {formatDate(profile.personalInformation.birthdate)}
                                        </div>
                                        <div>
                                            <span className="font-medium">Gender:</span>{' '}
                                            {profile.personalInformation.gender}
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span>{' '}
                                            {profile.personalInformation.email}
                                        </div>
                                        <div>
                                            <span className="font-medium">Phone:</span>{' '}
                                            {profile.personalInformation.phone}
                                        </div>
                                        <div>
                                            <span className="font-medium">Address:</span>{' '}
                                            {profile.personalInformation.address}
                                        </div>
                                        <div>
                                            <span className="font-medium">Monthly Income:</span>{' '}
                                            ₱{profile.personalInformation.personal_monthly_income.toLocaleString()}
                                        </div>
                                        <div>
                                            <span className="font-medium">Civil Status:</span>{' '}
                                            {profile.personalInformation.civil_status}
                                        </div>
                                        <div>
                                            <span className="font-medium">Youth Age Group:</span>{' '}
                                            {profile.personalInformation.youth_age_group}
                                        </div>
                                        {profile.personalInformation.interests_hobbies && (
                                            <div>
                                                <span className="font-medium">Interests & Hobbies:</span>{' '}
                                                {profile.personalInformation.interests_hobbies}
                                            </div>
                                        )}
                                        {profile.personalInformation.suggested_programs && (
                                            <div>
                                                <span className="font-medium">Suggested Programs:</span>{' '}
                                                {profile.personalInformation.suggested_programs}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Family Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="font-medium">Father's Name:</span>{' '}
                                            {profile.familyInformation.father_name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Mother's Name:</span>{' '}
                                            {profile.familyInformation.mother_name}
                                        </div>
                                        <div>
                                            <span className="font-medium">Parents' Monthly Income:</span>{' '}
                                            ₱{profile.familyInformation.parents_monthly_income.toLocaleString()}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Engagement Data</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <div>
                                            <span className="font-medium">Education Level:</span>{' '}
                                            {profile.engagementData.education_level}
                                        </div>
                                        <div>
                                            <span className="font-medium">Employment Status:</span>{' '}
                                            {profile.engagementData.work_status}
                                        </div>
                                        <div>
                                            <span className="font-medium">SK Voter:</span>{' '}
                                            {profile.engagementData.is_sk_voter ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Assembly Attendance:</span>{' '}
                                            {profile.engagementData.assembly_attendance}
                                        </div>
                                        <div>
                                            <span className="font-medium">Youth Classification:</span>{' '}
                                            {profile.engagementData.youth_classification}
                                        </div>
                                        <div>
                                            <span className="font-medium">Registered National Voter:</span>{' '}
                                            {profile.engagementData.is_registered_national_voter ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Voted Last Election:</span>{' '}
                                            {profile.engagementData.voted_last_election ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Has Attended Assembly:</span>{' '}
                                            {profile.engagementData.has_attended_assembly ? 'Yes' : 'No'}
                                        </div>
                                        {profile.engagementData.assembly_absence_reason && (
                                            <div>
                                                <span className="font-medium">Assembly Absence Reason:</span>{' '}
                                                {profile.engagementData.assembly_absence_reason}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {profile.approval_notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Approval Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{profile.approval_notes}</p>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 