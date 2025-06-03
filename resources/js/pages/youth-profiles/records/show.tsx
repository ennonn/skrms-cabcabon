import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

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
    record: Profile;
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
        href: route('youth-profiles.records.index'),
    },
    {
        title: 'Records',
        href: route('youth-profiles.records.index'),
    },
    {
        title: 'View Record',
        href: '#',
    },
];

export default function ShowYouthProfileRecord({ record, auth }: Props) {
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
            <Head title={`View Record - ${record.personalInformation.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Profile Record</h2>
                                <Link href={route('youth-profiles.records.index')}>
                                    <Button variant="outline">Back to Records</Button>
                                </Link>
                            </div>

                            <div className="grid gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <span className="font-medium">Full Name:</span>
                                                <p>{record.personalInformation.full_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Birthdate:</span>
                                                <p>
                                                    {formatDate(record.personalInformation.birthdate)} ({calculateAge(record.personalInformation.birthdate)} years old)
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Gender:</span>
                                                <p>{record.personalInformation.gender}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Email:</span>
                                                <p>{record.personalInformation.email}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Phone:</span>
                                                <p>{record.personalInformation.phone}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Address:</span>
                                                <p>{record.personalInformation.address}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Civil Status:</span>
                                                <p>{record.personalInformation.civil_status}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Youth Age Group:</span>
                                                <p>{record.personalInformation.youth_age_group}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Personal Monthly Income:</span>
                                                <p>₱{record.personalInformation.personal_monthly_income.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Interests & Hobbies:</span>
                                            <p>{record.personalInformation.interests_hobbies || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Suggested Programs:</span>
                                            <p>{record.personalInformation.suggested_programs || 'Not provided'}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Family Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <span className="font-medium">Father's Name:</span>
                                                <p>{record.familyInformation.father_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Mother's Name:</span>
                                                <p>{record.familyInformation.mother_name}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Parents' Monthly Income:</span>
                                            <p>₱{record.familyInformation.parents_monthly_income.toLocaleString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Engagement Data</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <span className="font-medium">Education Level:</span>
                                                <p>{record.engagementData.education_level}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Youth Classification:</span>
                                                <p>{record.engagementData.youth_classification}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Work Status:</span>
                                                <p>{record.engagementData.work_status}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={record.engagementData.is_sk_voter ? "default" : "secondary"}>
                                                    {record.engagementData.is_sk_voter ? "Yes" : "No"}
                                                </Badge>
                                                <span>SK Voter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={record.engagementData.is_registered_national_voter ? "default" : "secondary"}>
                                                    {record.engagementData.is_registered_national_voter ? "Yes" : "No"}
                                                </Badge>
                                                <span>Registered National Voter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={record.engagementData.voted_last_election ? "default" : "secondary"}>
                                                    {record.engagementData.voted_last_election ? "Yes" : "No"}
                                                </Badge>
                                                <span>Voted in Last Election</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={record.engagementData.has_attended_assembly ? "default" : "secondary"}>
                                                    {record.engagementData.has_attended_assembly ? "Yes" : "No"}
                                                </Badge>
                                                <span>Has Attended Assembly</span>
                                            </div>
                                        </div>

                                        {record.engagementData.has_attended_assembly ? (
                                            <div>
                                                <span className="font-medium">Assembly Attendance:</span>
                                                <p>{record.engagementData.assembly_attendance} times</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-medium">Reason for Assembly Absence:</span>
                                                <p>{record.engagementData.assembly_absence_reason || 'No reason provided'}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {record.approval_notes && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Approval Notes</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p>{record.approval_notes}</p>
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