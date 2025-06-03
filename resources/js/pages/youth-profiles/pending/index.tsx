import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useAuth } from '@/hooks/auth';
import { formatDate } from '@/lib/utils';
import type { Errors } from '@inertiajs/core';
import { toast } from 'sonner';
import { Search, Phone, Mail, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Pagination } from '@/components/pagination';

interface PersonalInformation {
    full_name: string;
    birthdate: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string;
    personal_monthly_income: number;
    civil_status: string;
    youth_age_group: string;
    interests_hobbies?: string;
    suggested_programs?: string;
}

interface FamilyInformation {
    father_name: string | null;
    mother_name: string | null;
    parents_monthly_income: number | null;
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

interface PendingYouthProfile {
    id: number;
    status: string;
    user_id: number;
    approver_id: number | null;
    approval_notes: string | null;
    data_collection_agreement: string;
    full_name: string;
    address: string;
    gender: string;
    birthdate: string;
    age: number;
    email: string | null;
    phone: string | null;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income: number | null;
    interests_hobbies: string | null;
    suggested_programs: string | null;
    mother_name: string | null;
    father_name: string | null;
    parents_monthly_income: number | null;
    education_level: string;
    youth_classification: string;
    work_status: string;
    is_sk_voter: boolean;
    is_registered_national_voter: boolean;
    voted_last_election: boolean;
    assembly_attendance: number | null;
    assembly_absence_reason: string | null;
    user: {
        id: number;
        name: string;
    };
    approver: {
        id: number;
        name: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    profiles: {
        data: PendingYouthProfile[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    sort?: 'name' | 'education';
    order?: 'asc' | 'desc';
    educationFilter?: string;
    ageFilter?: string;
    search?: string;
}

const breadcrumbs = [
    {
        title: 'Pending Profiles',
        href: route('youth-profiles.pending.index'),
    },
];

export default function PendingYouthProfiles({ 
    profiles,
    sort = 'name',
    order = 'asc',
    educationFilter = 'all',
    ageFilter = 'all',
    search = ''
}: Props) {
    const { user } = useAuth();
    const [selectedProfile, setSelectedProfile] = useState<PendingYouthProfile | null>(null);
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showRejectionForm, setShowRejectionForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState(search);
    const [selectedAgeFilter, setSelectedAgeFilter] = useState(ageFilter);
    const [selectedEducationFilter, setSelectedEducationFilter] = useState(educationFilter);

    const { data, setData, post, processing, reset } = useForm({
        notes: '',
    });

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        router.get(route('youth-profiles.pending.index'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: selectedAgeFilter,
            search: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('youth-profiles.pending.index'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: selectedAgeFilter,
            search: searchQuery,
            page
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleAgeFilter = (value: string) => {
        setSelectedAgeFilter(value);
        router.get(route('youth-profiles.pending.index'), {
            sort,
            order,
            education: selectedEducationFilter,
            age: value,
            search: searchQuery
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleEducationFilter = (value: string) => {
        setSelectedEducationFilter(value);
        router.get(route('youth-profiles.pending.index'), {
            sort,
            order,
            education: value,
            age: selectedAgeFilter,
            search: searchQuery
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

    const handleApprove = () => {
        if (!selectedProfile) return;

        router.post(route('youth-profiles.pending.approve', selectedProfile.id), 
            { notes: data.notes },
            {
                onSuccess: () => {
                    toast.success('Profile approved successfully');
                    setShowApprovalForm(false);
                    setSelectedProfile(null);
                    reset();
                    window.location.href = route('youth-profiles.pending.index');
                },
                onError: (errors: Errors) => {
                    console.error('Approval error:', errors);
                    toast.error('Failed to approve profile. Please try again.');
                }
            }
        );
    };

    const handleReject = () => {
        if (!selectedProfile || !data.notes) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        router.post(route('youth-profiles.pending.reject', selectedProfile.id), 
            { notes: data.notes },
            {
                onSuccess: () => {
                    toast.success('Profile rejected successfully');
                    setShowRejectionForm(false);
                    setSelectedProfile(null);
                    reset();
                    window.location.href = route('youth-profiles.pending.index');
                },
                onError: (errors: Errors) => {
                    console.error('Rejection error:', errors);
                    toast.error('Failed to reject profile. Please try again.');
                }
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Pending Youth Profiles" />
            
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
                                    <Select value={selectedAgeFilter} onValueChange={handleAgeFilter}>
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

                                    <Select value={selectedEducationFilter} onValueChange={handleEducationFilter}>
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
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Education Level</TableHead>
                                        <TableHead>Contact Information</TableHead>
                                        <TableHead>Date Submitted</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(!profiles.data || profiles.data.length === 0) ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                                                No pending profiles found.
                                            </TableCell>
                                        </TableRow>
                                    ) :
                                        profiles.data.map((profile) => (
                                            <TableRow key={profile.id}>
                                                <TableCell>{profile.full_name}</TableCell>
                                                <TableCell>
                                                    {calculateAge(profile.birthdate)}
                                                </TableCell>
                                                <TableCell>{profile.education_level}</TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm flex items-center gap-2">
                                                            {profile.phone ? (
                                                                <>
                                                                    <Phone className="h-4 w-4" />
                                                                    <span>{profile.phone}</span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                            {profile.email ? (
                                                                <>
                                                                    <Mail className="h-4 w-4" />
                                                                    <span>{profile.email}</span>
                                                                </>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(profile.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('youth-profiles.pending.show', { profile: profile.id })}>
                                                            <Button
                                                                size="sm"
                                                            >
                                                                View Details
                                                            </Button>
                                                        </Link>
                                                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                                            <>
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedProfile(profile);
                                                                        setShowApprovalForm(true);
                                                                    }}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedProfile(profile);
                                                                        setShowRejectionForm(true);
                                                                    }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>

                            {profiles.last_page > 1 && (
                                <Pagination
                                    currentPage={profiles.current_page}
                                    lastPage={profiles.last_page}
                                    total={profiles.total}
                                    perPage={profiles.per_page}
                                    onPageChange={handlePageChange}
                                />
                            )}

                            <Dialog open={showApprovalForm} onOpenChange={setShowApprovalForm}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Approve Profile</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to approve this profile? This action will move the profile to approved records.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <Label htmlFor="notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Add any notes about the approval"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowApprovalForm(false);
                                                reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleApprove}
                                            disabled={processing}
                                        >
                                            Confirm Approval
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={showRejectionForm} onOpenChange={setShowRejectionForm}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Reject Profile</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to reject this profile? Please provide a reason for rejection.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <Label htmlFor="notes">Rejection Reason</Label>
                                        <Textarea
                                            id="notes"
                                            placeholder="Enter the reason for rejection"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowRejectionForm(false);
                                                reset();
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleReject}
                                            disabled={processing || !data.notes}
                                        >
                                            Confirm Rejection
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}