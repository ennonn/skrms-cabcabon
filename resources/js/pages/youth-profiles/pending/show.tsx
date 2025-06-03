import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/auth';
import { formatDate, calculateAge } from '@/lib/utils';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface PersonalInformation {
    full_name: string;
    address: string;
    gender: string;
    birthdate: string;
    email: string | null;
    phone: string | null;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income: number | null;
    interests_hobbies: string | null;
    suggested_programs: string | null;
}

interface FamilyInformation {
    mother_name: string | null;
    father_name: string | null;
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
    personalInformation: PersonalInformation;
    familyInformation: FamilyInformation;
    engagementData: EngagementData;
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
    profile: Profile;
}

const breadcrumbs = [
    {
        title: 'Youth Profiles',
        href: route('youth-profiles.pending.index'),
    },
    {
        title: 'Pending',
        href: route('youth-profiles.pending.index'),
    },
    {
        title: 'View Profile',
        href: '#',
    },
];

export default function ShowPendingYouthProfile({ profile }: Props) {
    const { user } = useAuth();
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showRejectionDialog, setShowRejectionDialog] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        notes: '',
    });

    const handleApprove = () => {
        post(route('youth-profiles.pending.approve', profile.id), {
            onSuccess: () => {
                toast.success('Profile approved successfully');
                setShowApprovalDialog(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to approve profile');
            },
        });
    };

    const handleReject = () => {
        post(route('youth-profiles.pending.reject', profile.id), {
            onSuccess: () => {
                toast.success('Profile rejected successfully');
                setShowRejectionDialog(false);
                reset();
            },
            onError: () => {
                toast.error('Failed to reject profile');
            },
        });
    };

    return (
        <AppLayout user={user} breadcrumbs={breadcrumbs}>
            <Head title={`View Pending Profile - ${profile.personalInformation.full_name}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-semibold">Pending Profile</h2>
                                    <Badge variant="outline">Pending</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('youth-profiles.pending.index')}>
                                        <Button variant="outline">Back to Pending Profiles</Button>
                                    </Link>
                                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                                        <>
                                            <Button onClick={() => setShowApprovalDialog(true)}>
                                                Approve
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setShowRejectionDialog(true)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                </div>
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
                                                <p>{profile.personalInformation.full_name}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Birthdate:</span>
                                                <p>
                                                    {formatDate(profile.personalInformation.birthdate)} ({calculateAge(profile.personalInformation.birthdate)} years old)
                                                </p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Gender:</span>
                                                <p>{profile.personalInformation.gender}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Email:</span>
                                                <p>{profile.personalInformation.email || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Phone:</span>
                                                <p>{profile.personalInformation.phone || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Address:</span>
                                                <p>{profile.personalInformation.address}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Civil Status:</span>
                                                <p>{profile.personalInformation.civil_status}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Youth Age Group:</span>
                                                <p>{profile.personalInformation.youth_age_group}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Personal Monthly Income:</span>
                                                <p>{profile.personalInformation.personal_monthly_income ? 
                                                    `₱${profile.personalInformation.personal_monthly_income.toLocaleString()}` : 
                                                    'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Interests & Hobbies:</span>
                                            <p>{profile.personalInformation.interests_hobbies || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium">Suggested Programs:</span>
                                            <p>{profile.personalInformation.suggested_programs || 'Not provided'}</p>
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
                                                <p>{profile.familyInformation.father_name || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Mother's Name:</span>
                                                <p>{profile.familyInformation.mother_name || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-medium">Parents' Monthly Income:</span>
                                            <p>{profile.familyInformation.parents_monthly_income ? 
                                                `₱${profile.familyInformation.parents_monthly_income.toLocaleString()}` : 
                                                'Not provided'}</p>
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
                                                <p>{profile.engagementData.education_level}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Youth Classification:</span>
                                                <p>{profile.engagementData.youth_classification}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Work Status:</span>
                                                <p>{profile.engagementData.work_status}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={profile.engagementData.is_sk_voter ? "default" : "secondary"}>
                                                    {profile.engagementData.is_sk_voter ? "Yes" : "No"}
                                                </Badge>
                                                <span>SK Voter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={profile.engagementData.is_registered_national_voter ? "default" : "secondary"}>
                                                    {profile.engagementData.is_registered_national_voter ? "Yes" : "No"}
                                                </Badge>
                                                <span>Registered National Voter</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={profile.engagementData.voted_last_election ? "default" : "secondary"}>
                                                    {profile.engagementData.voted_last_election ? "Yes" : "No"}
                                                </Badge>
                                                <span>Voted in Last Election</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={profile.engagementData.has_attended_assembly ? "default" : "secondary"}>
                                                    {profile.engagementData.has_attended_assembly ? "Yes" : "No"}
                                                </Badge>
                                                <span>Has Attended Assembly</span>
                                            </div>
                                        </div>

                                        {profile.engagementData.has_attended_assembly ? (
                                            <div>
                                                <span className="font-medium">Assembly Attendance:</span>
                                                <p>{profile.engagementData.assembly_attendance} times</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-medium">Reason for Assembly Absence:</span>
                                                <p>{profile.engagementData.assembly_absence_reason || 'No reason provided'}</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Approve Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Approval Notes</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Add any notes about the approval (optional)"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowApprovalDialog(false);
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

                            <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Reject Profile</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="notes">Rejection Notes</Label>
                                            <Textarea
                                                id="notes"
                                                placeholder="Please provide a reason for rejection"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setShowRejectionDialog(false);
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