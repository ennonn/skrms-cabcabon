import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/auth';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Profile {
    id: number;
    status: string;
    full_name: string;
    birthdate: string;
    gender: string;
    email: string | null;
    phone: string | null;
    address: string;
    personal_monthly_income: number | null;
    mother_name: string | null;
    father_name: string | null;
    education_level: string;
    work_status: string;
    is_sk_voter: boolean;
    assembly_attendance: number | null;
    approval_notes: string | null;
    approver: {
        name: string;
    } | null;
    updated_at: string;
}

interface Props {
    profile: Profile;
}

export default function ShowRejectedYouthProfile({ profile }: Props) {
    const { user } = useAuth();
    const [showApprovalForm, setShowApprovalForm] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, processing } = useForm({
        notes: '',
    });

    const handleApprove = () => {
        post(route('youth-profiles.rejected.approve', profile.id), {
            onSuccess: () => {
                toast.success('Profile approved successfully');
                window.location.href = route('youth-profiles.rejected.index');
            },
            onError: (errors: Record<string, string>) => {
                console.error('Approval failed:', errors);
                toast.error(errors?.message || 'Failed to approve profile. Please try again.');
            }
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('youth-profiles.rejected.destroy', profile.id), {
            onSuccess: () => {
                toast.success('Profile deleted successfully');
                router.visit(route('youth-profiles.rejected.index'));
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete profile');
            }
        });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
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

    return (
        <AppLayout
            user={user}
            breadcrumbs={[
                { title: 'Rejected Profiles', href: route('youth-profiles.rejected.index') },
                { title: 'View Profile', href: route('youth-profiles.rejected.show', profile.id) },
            ]}
        >
            <Head title="View Rejected Youth Profile" />

            <div className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold tracking-tight">Rejected Youth Profile</h1>
                        <Badge variant="destructive">Rejected</Badge>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('youth-profiles.rejected.index')}>
                            <Button variant="outline">Back to Rejected Profiles</Button>
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'superadmin') && (
                            <Link href={route('youth-profiles.rejected.edit', profile.id)}>
                                <Button>Edit Profile</Button>
                            </Link>
                        )}
                        <Link href={route('youth-profiles.drafts.create', { copy_from: profile.id })}>
                            <Button>Create New Draft</Button>
                        </Link>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Name:</span>{' '}
                                {profile.full_name}
                            </div>
                            <div>
                                <span className="font-medium">Birthdate:</span>{' '}
                                {formatDate(profile.birthdate)}{' '}
                                <span className="text-sm text-gray-500">
                                    ({calculateAge(profile.birthdate)} years old)
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Gender:</span>{' '}
                                {profile.gender}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span>{' '}
                                {profile.email || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Phone:</span>{' '}
                                {profile.phone || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Address:</span>{' '}
                                {profile.address || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Monthly Income:</span>{' '}
                                {profile.personal_monthly_income ? 
                                    formatCurrency(profile.personal_monthly_income)
                                    : 'N/A'
                                }
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
                                {profile.father_name || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Mother's Name:</span>{' '}
                                {profile.mother_name || 'N/A'}
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
                                {profile.education_level}
                            </div>
                            <div>
                                <span className="font-medium">Employment Status:</span>{' '}
                                {profile.work_status}
                            </div>
                            <div>
                                <span className="font-medium">SK Voter:</span>{' '}
                                {profile.is_sk_voter ? 'Yes' : 'No'}
                            </div>
                            <div>
                                <span className="font-medium">Assembly Attendance:</span>{' '}
                                {profile.assembly_attendance !== null ? `${profile.assembly_attendance} times` : 'N/A'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rejection Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="font-medium">Rejected By:</span>{' '}
                                {profile.approver?.name || 'N/A'}
                            </div>
                            <div>
                                <span className="font-medium">Rejection Date:</span>{' '}
                                {formatDate(profile.updated_at)}
                            </div>
                            <div>
                                <span className="font-medium">Rejection Notes:</span>{' '}
                                <p className="mt-1 text-gray-600">{profile.approval_notes || 'No notes provided'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {(user?.role === 'admin' || user?.role === 'superadmin') && (
                        <Card className="md:col-span-2">
                            <CardHeader>
                                <CardTitle>Review Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {showApprovalForm ? (
                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="Add any notes about the approval (optional)"
                                                value={data.notes}
                                                onChange={e => setData('notes', e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleApprove}
                                                    disabled={processing}
                                                >
                                                    {processing ? 'Approving...' : 'Confirm Approval'}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowApprovalForm(false);
                                                        setData('notes', '');
                                                    }}
                                                    disabled={processing}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => setShowApprovalForm(true)}
                                            >
                                                Approve Profile
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setShowDeleteDialog(true)}
                                            >
                                                Delete Profile
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Profile</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this profile? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <div className="flex justify-end gap-2">
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
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 