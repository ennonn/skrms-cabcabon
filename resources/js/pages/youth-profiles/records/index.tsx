import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { useAuth } from '@/hooks/auth';

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

interface Record {
    id: number;
    user: {
        id: number;
        name: string;
    };
    approver: {
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
    records: Record[];
}

const breadcrumbs = [
    {
        title: 'Youth Profiles',
        href: route('youth-profiles.records.index'),
    },
];

const formatName = (personalInfo: PersonalInformation | undefined) => {
    if (!personalInfo) return 'N/A';
    
    let name = `${personalInfo.full_name}`;
    
    if (personalInfo.interests_hobbies) {
        name += ` (${personalInfo.interests_hobbies})`;
    }
    
    return name;
};

export default function YouthProfileRecords({ records }: Props) {
    const { user } = useAuth();
    const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');
    const [selectedEducation, setSelectedEducation] = useState('all');
    const [selectedEmployment, setSelectedEmployment] = useState('all');

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('youth-profiles.records.index'), {
            search: value,
            age_group: selectedAgeGroup,
            education: selectedEducation,
            employment: selectedEmployment
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleAgeGroupChange = (value: string) => {
        setSelectedAgeGroup(value);
        router.get(route('youth-profiles.records.index'), {
            search: searchQuery,
            age_group: value,
            education: selectedEducation,
            employment: selectedEmployment
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEducationChange = (value: string) => {
        setSelectedEducation(value);
        router.get(route('youth-profiles.records.index'), {
            search: searchQuery,
            age_group: selectedAgeGroup,
            education: value,
            employment: selectedEmployment
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEmploymentChange = (value: string) => {
        setSelectedEmployment(value);
        router.get(route('youth-profiles.records.index'), {
            search: searchQuery,
            age_group: selectedAgeGroup,
            education: selectedEducation,
            employment: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const calculateAge = (birthdate: string | undefined) => {
        if (!birthdate) return 'N/A';
        
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
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Approved Youth Profiles" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Input
                                        type="search"
                                        placeholder="Search youth profiles..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Select value={selectedAgeGroup} onValueChange={handleAgeGroupChange}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Age Group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Age Groups</SelectItem>
                                            <SelectItem value="junior">Junior Youth (15-17)</SelectItem>
                                            <SelectItem value="core">Core Youth (18-24)</SelectItem>
                                            <SelectItem value="senior">Senior Youth (25-30)</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={selectedEducation} onValueChange={handleEducationChange}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Education Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Education Levels</SelectItem>
                                            <SelectItem value="elementary">Elementary</SelectItem>
                                            <SelectItem value="highschool">High School</SelectItem>
                                            <SelectItem value="college">College</SelectItem>
                                            <SelectItem value="vocational">Vocational</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Select value={selectedEmployment} onValueChange={handleEmploymentChange}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Employment Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Employment Status</SelectItem>
                                            <SelectItem value="employed">Employed</SelectItem>
                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                            <SelectItem value="student">Student</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Education</TableHead>
                                        <TableHead>Employment</TableHead>
                                        <TableHead>Phone</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell>{record.personalInformation?.full_name || 'N/A'}</TableCell>
                                            <TableCell>
                                                {record.personalInformation ? calculateAge(record.personalInformation.birthdate) : 'N/A'}
                                            </TableCell>
                                            <TableCell>{record.engagementData?.education_level || 'N/A'}</TableCell>
                                            <TableCell>{record.engagementData?.work_status || 'N/A'}</TableCell>
                                            <TableCell>{record.personalInformation?.phone || 'N/A'}</TableCell>
                                            <TableCell>{record.personalInformation?.email || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Link href={route('youth-profiles.records.show', { record: record.id })}>
                                                    <Button
                                                        size="sm"
                                                    >
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
                        {selectedRecord && (
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Profile Details</DialogTitle>
                                    <DialogDescription>
                                        Detailed information about the youth profile.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Personal Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <div>
                                                <span className="font-medium">Name:</span>{' '}
                                                {selectedRecord.personalInformation?.full_name || 'N/A'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Birthdate:</span>{' '}
                                                {formatDate(selectedRecord.personalInformation.birthdate)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Gender:</span>{' '}
                                                {selectedRecord.personalInformation.gender}
                                            </div>
                                            <div>
                                                <span className="font-medium">Email:</span>{' '}
                                                {selectedRecord.personalInformation.email}
                                            </div>
                                            <div>
                                                <span className="font-medium">Phone:</span>{' '}
                                                {selectedRecord.personalInformation.phone}
                                            </div>
                                            <div>
                                                <span className="font-medium">Address:</span>{' '}
                                                {selectedRecord.personalInformation.address}
                                            </div>
                                            <div>
                                                <span className="font-medium">Monthly Income:</span>{' '}
                                                ₱{selectedRecord.personalInformation.personal_monthly_income.toLocaleString()}
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
                                                {selectedRecord.familyInformation.father_name}
                                            </div>
                                            <div>
                                                <span className="font-medium">Mother's Name:</span>{' '}
                                                {selectedRecord.familyInformation.mother_name}
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
                                                {selectedRecord.engagementData.education_level}
                                            </div>
                                            <div>
                                                <span className="font-medium">Employment Status:</span>{' '}
                                                {selectedRecord.engagementData.work_status}
                                            </div>
                                            <div>
                                                <span className="font-medium">SK Voter:</span>{' '}
                                                {selectedRecord.engagementData.is_sk_voter ? 'Yes' : 'No'}
                                            </div>
                                            <div>
                                                <span className="font-medium">Assembly Attendance:</span>{' '}
                                                {selectedRecord.engagementData.assembly_attendance}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </DialogContent>
                        )}
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}
