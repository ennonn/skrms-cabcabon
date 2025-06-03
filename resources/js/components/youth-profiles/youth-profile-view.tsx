import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    status: string;
    personalInformation?: PersonalInformation;
    familyInformation?: FamilyInformation;
    engagementData?: EngagementData;
    // For flat structure
    full_name?: string;
    birthdate?: string;
    gender?: string;
    email?: string | null;
    phone?: string | null;
    address?: string;
    civil_status?: string;
    youth_age_group?: string;
    personal_monthly_income?: number | null;
    interests_hobbies?: string | null;
    suggested_programs?: string | null;
    father_name?: string | null;
    mother_name?: string | null;
    parents_monthly_income?: number | null;
    education_level?: string;
    youth_classification?: string;
    work_status?: string;
    is_sk_voter?: boolean;
    is_registered_national_voter?: boolean;
    voted_last_election?: boolean;
    has_attended_assembly?: boolean;
    assembly_attendance?: number | null;
    assembly_absence_reason?: string | null;
}

interface Props {
    profile: Profile;
}

export default function YouthProfileView({ profile }: Props) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

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

    // Get personal information from either nested or flat structure
    const personal = {
        full_name: profile.personalInformation?.full_name || profile.full_name || 'N/A',
        birthdate: profile.personalInformation?.birthdate || profile.birthdate || 'N/A',
        gender: profile.personalInformation?.gender || profile.gender || 'N/A',
        civil_status: profile.personalInformation?.civil_status || profile.civil_status || 'N/A',
        email: profile.personalInformation?.email || profile.email || 'N/A',
        phone: profile.personalInformation?.phone || profile.phone || 'N/A',
        address: profile.personalInformation?.address || profile.address || 'N/A',
        personal_monthly_income: profile.personalInformation?.personal_monthly_income || profile.personal_monthly_income || null,
        interests_hobbies: profile.personalInformation?.interests_hobbies || profile.interests_hobbies || 'N/A',
        suggested_programs: profile.personalInformation?.suggested_programs || profile.suggested_programs || 'N/A',
    };

    // Get family information from either nested or flat structure
    const family = {
        father_name: profile.familyInformation?.father_name || profile.father_name || 'N/A',
        mother_name: profile.familyInformation?.mother_name || profile.mother_name || 'N/A',
        parents_monthly_income: profile.familyInformation?.parents_monthly_income || profile.parents_monthly_income || null,
    };

    // Get engagement data from either nested or flat structure
    const engagement = {
        education_level: profile.engagementData?.education_level || profile.education_level || 'N/A',
        youth_classification: profile.engagementData?.youth_classification || profile.youth_classification || 'N/A',
        work_status: profile.engagementData?.work_status || profile.work_status || 'N/A',
        is_sk_voter: profile.engagementData?.is_sk_voter ?? profile.is_sk_voter ?? false,
        is_registered_national_voter: profile.engagementData?.is_registered_national_voter ?? profile.is_registered_national_voter ?? false,
        voted_last_election: profile.engagementData?.voted_last_election ?? profile.voted_last_election ?? false,
        has_attended_assembly: profile.engagementData?.has_attended_assembly ?? profile.has_attended_assembly ?? false,
        assembly_attendance: profile.engagementData?.assembly_attendance || profile.assembly_attendance || null,
        assembly_absence_reason: profile.engagementData?.assembly_absence_reason || profile.assembly_absence_reason || null,
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-medium">Name:</span>{' '}
                        {personal.full_name}
                    </div>
                    {personal.birthdate !== 'N/A' && (
                        <div>
                            <span className="font-medium">Birthdate:</span>{' '}
                            {formatDate(personal.birthdate)}{' '}
                            <span className="text-sm text-gray-500">
                                ({calculateAge(personal.birthdate)} years old)
                            </span>
                        </div>
                    )}
                    <div>
                        <span className="font-medium">Gender:</span>{' '}
                        {personal.gender}
                    </div>
                    <div>
                        <span className="font-medium">Civil Status:</span>{' '}
                        {personal.civil_status}
                    </div>
                    <div>
                        <span className="font-medium">Email:</span>{' '}
                        {personal.email}
                    </div>
                    <div>
                        <span className="font-medium">Phone:</span>{' '}
                        {personal.phone}
                    </div>
                    <div>
                        <span className="font-medium">Address:</span>{' '}
                        {personal.address}
                    </div>
                    <div>
                        <span className="font-medium">Monthly Income:</span>{' '}
                        {formatCurrency(personal.personal_monthly_income)}
                    </div>
                    <div>
                        <span className="font-medium">Interests & Hobbies:</span>{' '}
                        {personal.interests_hobbies}
                    </div>
                    <div>
                        <span className="font-medium">Suggested Programs:</span>{' '}
                        {personal.suggested_programs}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Family Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-medium">Father's Name:</span>{' '}
                        {family.father_name}
                    </div>
                    <div>
                        <span className="font-medium">Mother's Name:</span>{' '}
                        {family.mother_name}
                    </div>
                    <div>
                        <span className="font-medium">Parents' Monthly Income:</span>{' '}
                        {formatCurrency(family.parents_monthly_income)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Engagement Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div>
                        <span className="font-medium">Education Level:</span>{' '}
                        {engagement.education_level}
                    </div>
                    <div>
                        <span className="font-medium">Youth Classification:</span>{' '}
                        {engagement.youth_classification}
                    </div>
                    <div>
                        <span className="font-medium">Work Status:</span>{' '}
                        {engagement.work_status}
                    </div>
                    <div>
                        <span className="font-medium">SK Voter:</span>{' '}
                        {engagement.is_sk_voter ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <span className="font-medium">Registered National Voter:</span>{' '}
                        {engagement.is_registered_national_voter ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <span className="font-medium">Voted in Last Election:</span>{' '}
                        {engagement.voted_last_election ? 'Yes' : 'No'}
                    </div>
                    <div>
                        <span className="font-medium">Has Attended Assembly:</span>{' '}
                        {engagement.has_attended_assembly ? 'Yes' : 'No'}
                    </div>
                    {engagement.has_attended_assembly && engagement.assembly_attendance && (
                        <div>
                            <span className="font-medium">Assembly Attendance:</span>{' '}
                            {engagement.assembly_attendance} times
                        </div>
                    )}
                    {!engagement.has_attended_assembly && engagement.assembly_absence_reason && (
                        <div>
                            <span className="font-medium">Reason for Not Attending:</span>{' '}
                            {engagement.assembly_absence_reason}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
} 