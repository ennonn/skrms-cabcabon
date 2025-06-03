import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { calculateAge, formatDate } from '@/lib/utils';

interface PersonalInfo {
    first_name: string;
    last_name: string;
    birthdate: string;
    email?: string;
    phone?: string;
    address?: string;
    gender: string;
    full_name: string;
    civil_status: string;
    youth_age_group: string;
    personal_monthly_income?: string;
    interests_hobbies?: string;
    suggested_programs?: string;
}

interface FamilyInfo {
    mother_name?: string;
    father_name?: string;
    parents_monthly_income?: string;
}

interface EngagementData {
    education_level: string;
    youth_classification: string;
    work_status: string;
    is_sk_voter: boolean;
    is_registered_national_voter: boolean;
    voted_last_election: boolean;
    has_attended_assembly: boolean;
    assembly_attendance?: string;
    assembly_absence_reason?: string;
    registered_voter: boolean;
    attended_leadership_training: boolean;
    attended_skills_training: boolean;
    has_business: boolean;
}

interface Profile {
    id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    personalInformation: PersonalInfo;
    familyInformation: FamilyInfo;
    engagementData: EngagementData;
    user: {
        id: number;
        name: string;
    } | null;
    approver: {
        id: number;
        name: string;
    } | null;
    from_google_form?: boolean;
    approval_notes?: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    profile: Profile;
    user: {
        name: string;
        email: string;
    };
}

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Manage Profiles',
        href: route('youth-profiles.manage'),
    },
    {
        title: 'View Profile',
        href: '#',
    },
];

export default function ShowProfile({ profile, user }: Props) {
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log('Profile Data:', {
        status: profile.status,
        approver: profile.approver,
        user: profile.user
    });

    const handleApprove = () => {
        setIsProcessing(true);

        router.post(route('youth-profiles.pending.approve', profile.id), {
            notes: notes,
        }, {
            onSuccess: () => {
                setShowApproveDialog(false);
                setNotes('');
                toast.success('Profile approved successfully');
            },
            onError: () => {
                toast.error('Failed to approve profile');
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const handleReject = () => {
        setIsProcessing(true);

        router.post(route('youth-profiles.pending.reject', profile.id), {
            notes: notes,
        }, {
            onSuccess: () => {
                setShowRejectDialog(false);
                setNotes('');
                toast.success('Profile rejected successfully');
            },
            onError: () => {
                toast.error('Failed to reject profile');
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const handleDelete = () => {
        setIsProcessing(true);

        router.delete(route('youth-profiles.manage.destroy', profile.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                toast.success('Profile deleted successfully');
                router.visit(route('youth-profiles.manage'));
            },
            onError: () => {
                toast.error('Failed to delete profile');
            },
            onFinish: () => {
                setIsProcessing(false);
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'pending':
                return <Badge variant="outline">Pending</Badge>;
            case 'approved':
                return <Badge variant="default">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout
            user={user}
            breadcrumbs={[
                { title: 'Youth Profiles', href: route('youth-profiles.manage') },
                { title: 'View Profile', href: '#' },
            ]}
        >
            <Head title="View Profile" />

            <div className="container p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold">View Profile</h1>
                        <div className="flex items-center gap-2">
                            <Badge variant={profile?.status === 'pending' ? "outline" : profile?.status === 'approved' ? "default" : "destructive"}>
                                {profile?.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : 'Unknown'}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('youth-profiles.manage')}>
                            <Button variant="outline">Back to Manage Profiles</Button>
                        </Link>
                        {profile.status === 'pending' && (
                            <>
                                <Button
                                    onClick={() => setShowApproveDialog(true)}
                                >
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => setShowRejectDialog(true)}
                                >
                                    Reject
                                </Button>
                            </>
                        )}
                        {profile.status === 'rejected' && (
                            <Link href={route('youth-profiles.rejected.edit', profile.id)}>
                                <Button variant="outline">Edit</Button>
                            </Link>
                        )}
                        <Button
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete
                        </Button>
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
                                    <p>{profile?.personalInformation?.full_name || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Birthdate:</span>
                                    <p>
                                        {formatDate(profile?.personalInformation?.birthdate)} ({calculateAge(profile?.personalInformation?.birthdate)} years old)
                                    </p>
                                </div>
                                <div>
                                    <span className="font-medium">Gender:</span>
                                    <p>{profile?.personalInformation?.gender || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Email:</span>
                                    <p>{profile?.personalInformation?.email || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Phone:</span>
                                    <p>{profile?.personalInformation?.phone || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Address:</span>
                                    <p>{profile?.personalInformation?.address || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Civil Status:</span>
                                    <p>{profile?.personalInformation?.civil_status || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Youth Age Group:</span>
                                    <p>{profile?.personalInformation?.youth_age_group || 'Not provided'}</p>
                                </div>
                                <div>
                                    <span className="font-medium">Personal Monthly Income:</span>
                                    <p>{profile?.personalInformation?.personal_monthly_income ? `₱${profile.personalInformation.personal_monthly_income}` : 'Not provided'}</p>
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
                                <p>{profile.familyInformation.parents_monthly_income ? `₱${profile.familyInformation.parents_monthly_income}` : 'Not provided'}</p>
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
                                <div className="flex items-center gap-2">
                                    <Badge variant={profile.engagementData.registered_voter ? "default" : "secondary"}>
                                        {profile.engagementData.registered_voter ? "Yes" : "No"}
                                    </Badge>
                                    <span>Registered Voter</span>
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <span className="font-medium">Created At:</span>
                                    <p>{formatDate(profile.created_at)}</p>
                                </div>
                                {profile.status === 'approved' && (
                                    <div>
                                        <span className="font-medium">Approved At:</span>
                                        <p>{formatDate(profile.updated_at)}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Approve Dialog */}
                <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approve Profile</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to approve this profile? You can add optional notes below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Add any notes about this approval (optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveDialog(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApprove}
                                disabled={isProcessing}
                            >
                                {isProcessing ? 'Approving...' : 'Approve Profile'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Reject Dialog */}
                <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Reject Profile</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to reject this profile? Please provide a reason below.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Textarea
                                placeholder="Enter reason for rejection"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectDialog(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleReject}
                                disabled={isProcessing || !notes}
                            >
                                {isProcessing ? 'Rejecting...' : 'Reject Profile'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Dialog */}
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Profile</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this profile? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteDialog(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Profile'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
} 