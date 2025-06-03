import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { YouthProfile, DraftYouthProfile } from '@/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Props {
    youth_profile?: YouthProfile | DraftYouthProfile;
    isEditing?: boolean;
    onSuccess?: () => void;
}

export function YouthProfileForm({ youth_profile, isEditing = false, onSuccess }: Props) {
    console.log('Youth Profile Data:', youth_profile); // Debug log

    const [data, setData] = useState({
        // Form Metadata
        form_submitted_at: youth_profile?.form_submitted_at ?? new Date().toISOString(),
        data_collection_agreement: youth_profile?.data_collection_agreement ?? 'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.',

        // Personal Information - try direct access first
        full_name: youth_profile?.full_name ?? '',
        address: youth_profile?.address ?? '',
        gender: youth_profile?.gender ?? '',
        birthdate: youth_profile?.birthdate ?? '',
        email: youth_profile?.email ?? '',
        phone: youth_profile?.phone ?? '',
        civil_status: youth_profile?.civil_status ?? '',
        youth_age_group: youth_profile?.youth_age_group ?? '',
        personal_monthly_income: youth_profile?.personal_monthly_income ?? '',
        interests_hobbies: youth_profile?.interests_hobbies ?? '',
        suggested_programs: youth_profile?.suggested_programs ?? '',

        // Family Information
        mother_name: youth_profile?.mother_name ?? '',
        father_name: youth_profile?.father_name ?? '',
        parents_monthly_income: youth_profile?.parents_monthly_income ?? '',

        // Engagement Data
        education_level: youth_profile?.education_level ?? '',
        youth_classification: youth_profile?.youth_classification ?? '',
        work_status: youth_profile?.work_status ?? '',
        is_sk_voter: youth_profile?.is_sk_voter ?? false,
        is_registered_national_voter: youth_profile?.is_registered_national_voter ?? false,
        voted_last_election: youth_profile?.voted_last_election ?? false,
        has_attended_assembly: youth_profile?.has_attended_assembly ?? false,
        assembly_attendance: youth_profile?.assembly_attendance ?? '',
        assembly_absence_reason: youth_profile?.assembly_absence_reason ?? '',
    });

    const CIVIL_STATUS_OPTIONS = [
        'Single',
        'Married',
        'Widowed',
        'Divorced',
        'Separated',
        'Annulled',
        'Live-in',
        'Unknown'
    ];

    const YOUTH_AGE_GROUP_OPTIONS = [
        'Child Youth (15 - 17 years old)',
        'Core Youth (18 - 24 years old)',
        'Young Adult (25 - 30 years old)'
    ];

    const EDUCATION_LEVEL_OPTIONS = [
        'Elementary Level',
        'Elementary Graduate',
        'High School Level',
        'High School Graduate',
        'Vocational Graduate',
        'College Level',
        'College Graduate',
        'Masters Level',
        'Masters Graduate',
        'Doctorate Level',
        'Doctorate Graduate'
    ];

    const YOUTH_CLASSIFICATION_OPTIONS = [
        'In school Youth',
        'Out of School Youth',
        'Working Youth',
        'PWD',
        'Children in conflict with the law',
        'Indigenous People'
    ];

    const WORK_STATUS_OPTIONS = [
        'Employed',
        'Unemployed',
        'Self-employed',
        'Currently Looking for a Job',
        'Not interested in looking for a job'
    ];

    const INTERESTS_OPTIONS = [
        'Volleyball',
        'Basketball',
        'Dancing',
        'Singing',
        'Drawing',
        'Reading',
        'Cooking'
    ];

    const PROGRAMS_OPTIONS = [
        'Committee on Education and Culture',
        'Committee on Environment',
        'Committee on Youth Employment & Livelihood',
        'Committee on Sports, Gender, and Development',
        'Committee on Health',
        'Committee on Social Protection',
        'Committee on Development Projects',
        'Committee on Finance, Ways, and Means'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        const requiredFields = {
            data_collection_agreement: 'Data Collection Agreement',
            full_name: 'Full Name',
            address: 'Address',
            gender: 'Gender',
            birthdate: 'Birthdate',
            civil_status: 'Civil Status',
            youth_age_group: 'Youth Age Group',
            education_level: 'Education Level',
            youth_classification: 'Youth Classification',
            work_status: 'Work Status',
            is_sk_voter: 'SK Voter Status',
            is_registered_national_voter: 'National Voter Registration Status',
            voted_last_election: 'Last Election Voting Status',
            has_attended_assembly: 'Assembly Attendance Status'
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key]) => data[key] === undefined || data[key] === '')
            .map(([, label]) => label);

        if (missingFields.length > 0) {
            toast.error(`Please fill in the following required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Structure the data for the backend
        const formattedData = {
            personalInformation: {
                full_name: data.full_name,
                birthdate: data.birthdate,
                gender: data.gender,
                email: data.email,
                phone: data.phone,
                address: data.address,
                civil_status: data.civil_status,
                youth_age_group: data.youth_age_group,
                personal_monthly_income: data.personal_monthly_income,
                interests_hobbies: data.interests_hobbies,
                suggested_programs: data.suggested_programs,
            },
            familyInformation: {
                father_name: data.father_name,
                mother_name: data.mother_name,
                parents_monthly_income: data.parents_monthly_income,
            },
            engagementData: {
                education_level: data.education_level,
                youth_classification: data.youth_classification,
                work_status: data.work_status,
                is_sk_voter: data.is_sk_voter,
                is_registered_national_voter: data.is_registered_national_voter,
                voted_last_election: data.voted_last_election,
                has_attended_assembly: data.has_attended_assembly,
                assembly_attendance: data.assembly_attendance,
                assembly_absence_reason: data.assembly_absence_reason,
            }
        };
        
        if (isEditing) {
            if (youth_profile?.status === 'rejected') {
                // For rejected profiles, use the rejected update route
                router.put(route('youth-profiles.rejected.update', { profile: youth_profile.id }), formattedData, {
                    onSuccess: () => {
                        toast.success('Profile updated successfully');
                        if (onSuccess) {
                            onSuccess();
                        }
                    },
                    onError: (errors) => {
                        console.error('Update error:', errors);
                        toast.error('Failed to update profile. Please check the form and try again.');
                    }
                });
            } else if (youth_profile?.status === 'draft') {
                // For draft profiles, send flat data
                const flatData = {
                    full_name: data.full_name,
                    birthdate: data.birthdate,
                    gender: data.gender,
                    email: data.email,
                    phone: data.phone,
                    address: data.address,
                    civil_status: data.civil_status,
                    youth_age_group: data.youth_age_group,
                    personal_monthly_income: data.personal_monthly_income,
                    interests_hobbies: data.interests_hobbies,
                    suggested_programs: data.suggested_programs,
                    father_name: data.father_name,
                    mother_name: data.mother_name,
                    parents_monthly_income: data.parents_monthly_income,
                    education_level: data.education_level,
                    youth_classification: data.youth_classification,
                    work_status: data.work_status,
                    is_sk_voter: data.is_sk_voter,
                    is_registered_national_voter: data.is_registered_national_voter,
                    voted_last_election: data.voted_last_election,
                    has_attended_assembly: data.has_attended_assembly,
                    assembly_attendance: data.assembly_attendance,
                    assembly_absence_reason: data.assembly_absence_reason,
                };

                router.put(route('youth-profiles.drafts.update', { draft: youth_profile.id }), flatData, {
                    onSuccess: () => {
                        toast.success('Draft updated successfully');
                        if (onSuccess) {
                            onSuccess();
                        }
                    },
                    onError: (errors) => {
                        console.error('Update error:', errors);
                        toast.error('Failed to update draft. Please check the form and try again.');
                    }
                });
            } else {
                // For admin managing profiles (approved profiles)
                router.put(route('youth-profiles.manage.update', { profile: youth_profile?.id }), formattedData, {
                    onSuccess: () => {
                        toast.success('Profile updated successfully');
                        if (onSuccess) {
                            onSuccess();
                        }
                    },
                    onError: (errors) => {
                        console.error('Update error:', errors);
                        const errorMessages = Object.values(errors).flat().join('\n');
                        toast.error(`Failed to update profile: ${errorMessages}`);
                    }
                });
            }
        } else {
            // For new profiles, use the drafts store route
            router.post(route('youth-profiles.drafts.store'), formattedData, {
                onSuccess: (response) => {
                    if (response?.props?.flash?.error) {
                        toast.error(response.props.flash.error);
                        return;
                    }
                    toast.success('Profile saved as draft successfully');
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.get(route('youth-profiles.drafts.index'));
                    }
                },
                onError: (errors) => {
                    console.error('Create error:', errors);
                    const errorMessages = Object.values(errors).flat().join('\n');
                    toast.error(`Failed to create profile: ${errorMessages}`);
                }
            });
        }
    };

    const handleChange = (field: string, value: any) => {
        setData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Data Collection Agreement</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Agreement</Label>
                        <div className="text-sm text-muted-foreground">
                            {data.data_collection_agreement}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="agreement"
                                checked={!!data.data_collection_agreement}
                                onCheckedChange={(checked) => {
                                    handleChange('data_collection_agreement', checked ? 
                                        'I understand that the information I submit through this form will be stored and processed accordingly. By registering, I consent to the storing and processing of my answers by the SK Barangay Cabcabon Committee on Secretariat and Officials.' : 
                                        ''
                                    );
                                }}
                            />
                            <Label htmlFor="agreement">I agree to the data collection terms</Label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                            id="full_name"
                            value={data.full_name}
                            onChange={e => handleChange('full_name', e.target.value)}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={data.gender}
                                onValueChange={value => handleChange('gender', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthdate">Birthdate</Label>
                            <Input
                                id="birthdate"
                                type="date"
                                value={data.birthdate}
                                onChange={e => handleChange('birthdate', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={e => handleChange('address', e.target.value)}
                            required
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => handleChange('email', e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={e => handleChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="civil_status">Civil Status</Label>
                            <Select
                                value={data.civil_status}
                                onValueChange={value => handleChange('civil_status', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select civil status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CIVIL_STATUS_OPTIONS.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youth_age_group">Youth Age Group</Label>
                            <Select
                                value={data.youth_age_group}
                                onValueChange={value => handleChange('youth_age_group', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select age group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YOUTH_AGE_GROUP_OPTIONS.map((group) => (
                                        <SelectItem key={group} value={group}>
                                            {group}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="personal_monthly_income">Personal Monthly Income</Label>
                        <Input
                            id="personal_monthly_income"
                            type="number"
                            value={data.personal_monthly_income}
                            onChange={e => handleChange('personal_monthly_income', e.target.value)}
                            placeholder="Enter your monthly income"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="interests_hobbies">Interests & Hobbies</Label>
                        <Select
                            value={data.interests_hobbies}
                            onValueChange={value => handleChange('interests_hobbies', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select interests" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INTERESTS_OPTIONS.map((interest) => (
                                        <SelectItem key={interest} value={interest}>
                                            {interest}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="suggested_programs">Suggested Programs</Label>
                            <Select
                                value={data.suggested_programs}
                            onValueChange={value => handleChange('suggested_programs', value)}
                            >
                                <SelectTrigger>
                                <SelectValue placeholder="Select programs" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PROGRAMS_OPTIONS.map((program) => (
                                        <SelectItem key={program} value={program}>
                                            {program}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Family Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="father_name">Father's Name</Label>
                            <Input
                                id="father_name"
                                value={data.father_name}
                                onChange={e => handleChange('father_name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="mother_name">Mother's Name</Label>
                            <Input
                                id="mother_name"
                                value={data.mother_name}
                                onChange={e => handleChange('mother_name', e.target.value)}
                            />
                        </div>
                    </div>

                        <div className="space-y-2">
                        <Label htmlFor="parents_monthly_income">Parents' Monthly Income</Label>
                            <Input
                            id="parents_monthly_income"
                                type="number"
                            value={data.parents_monthly_income}
                            onChange={e => handleChange('parents_monthly_income', e.target.value)}
                            />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Engagement Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="education_level">Education Level</Label>
                            <Select
                                value={data.education_level}
                                onValueChange={value => handleChange('education_level', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EDUCATION_LEVEL_OPTIONS.map((level) => (
                                        <SelectItem key={level} value={level}>
                                            {level}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youth_classification">Youth Classification</Label>
                            <Select
                                value={data.youth_classification}
                                onValueChange={value => handleChange('youth_classification', value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select classification" />
                                </SelectTrigger>
                                <SelectContent>
                                    {YOUTH_CLASSIFICATION_OPTIONS.map((classification) => (
                                        <SelectItem key={classification} value={classification}>
                                            {classification}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="work_status">Work Status</Label>
                        <Select
                            value={data.work_status}
                            onValueChange={value => handleChange('work_status', value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select work status" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORK_STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_sk_voter"
                                checked={data.is_sk_voter}
                                onCheckedChange={value => handleChange('is_sk_voter', value)}
                        />
                        <Label htmlFor="is_sk_voter">SK Voter</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_registered_national_voter"
                                checked={data.is_registered_national_voter}
                                onCheckedChange={value => handleChange('is_registered_national_voter', value)}
                        />
                        <Label htmlFor="is_registered_national_voter">Registered National Voter</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="voted_last_election"
                                checked={data.voted_last_election}
                                onCheckedChange={value => handleChange('voted_last_election', value)}
                        />
                        <Label htmlFor="voted_last_election">Voted in Last Election</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="has_attended_assembly"
                                checked={data.has_attended_assembly}
                            onCheckedChange={value => {
                                    handleChange('has_attended_assembly', value);
                                    if (!value) {
                                        handleChange('assembly_attendance', '');
                                }
                            }}
                        />
                        <Label htmlFor="has_attended_assembly">Has Attended Assembly</Label>
                    </div>

                        {data.has_attended_assembly && (
                    <div className="space-y-2">
                                <Label htmlFor="assembly_attendance">Assembly Attendance Count</Label>
                        <Input
                            id="assembly_attendance"
                            type="number"
                                    value={data.assembly_attendance}
                                    onChange={e => handleChange('assembly_attendance', e.target.value)}
                        />
                    </div>
                        )}

                        {!data.has_attended_assembly && (
                    <div className="space-y-2">
                                <Label htmlFor="assembly_absence_reason">Reason for Not Attending Assembly</Label>
                        <Input
                            id="assembly_absence_reason"
                                    value={data.assembly_absence_reason}
                                    onChange={e => handleChange('assembly_absence_reason', e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        if (isEditing) {
                            if (youth_profile?.status === 'draft') {
                                router.get(route('youth-profiles.drafts.index'));
                            } else if (youth_profile?.status === 'rejected') {
                                router.get(route('youth-profiles.rejected.index'));
                            } else {
                                router.get(route('youth-profiles.manage'));
                            }
                        } else {
                            router.get(route('youth-profiles.drafts.index'));
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button type="submit">
                    {isEditing ? 'Update Profile' : 'Create Profile'}
                </Button>
            </div>
        </form>
    );
} 