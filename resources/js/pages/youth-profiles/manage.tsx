import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { calculateAge, formatDate } from '@/lib/utils';

interface Profile {
    id: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected';
    personalInformation: {
        full_name: string;
        birthdate: string;
        email?: string;
        phone?: string;
    };
    engagementData: {
        education_level: string;
        employment_status: string;
        is_sk_voter: boolean;
    };
    user: {
        id: number;
        name: string;
    };
    approver?: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface Props {
    profiles: {
        data: Profile[];
        current_page: number;
        last_page: number;
    };
    filters: {
        status: string;
        education: string;
    };
}

export default function ManageProfiles({ profiles, filters }: Props) {
    const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [notes, setNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleStatusFilter = (value: string) => {
        router.get(route('youth-profiles.manage'), { status: value, education: filters.education }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleEducationFilter = (value: string) => {
        router.get(route('youth-profiles.manage'), { status: filters.status, education: value }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleApprove = () => {
        if (!selectedProfile) return;
        setIsProcessing(true);

        router.post(route('youth-profiles.pending.approve', selectedProfile.id), {
            notes: notes,
        }, {
            onSuccess: () => {
                setShowApproveDialog(false);
                setSelectedProfile(null);
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
        if (!selectedProfile) return;
        setIsProcessing(true);

        router.post(route('youth-profiles.pending.reject', selectedProfile.id), {
            notes: notes,
        }, {
            onSuccess: () => {
                setShowRejectDialog(false);
                setSelectedProfile(null);
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
        if (!selectedProfile) return;
        setIsProcessing(true);

        router.delete(route('youth-profiles.rejected.destroy', selectedProfile.id), {
            onSuccess: () => {
                setShowDeleteDialog(false);
                setSelectedProfile(null);
                toast.success('Profile deleted successfully');
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
                return <Badge variant="warning">Pending</Badge>;
            case 'approved':
                return <Badge variant="success">Approved</Badge>;
            case 'rejected':
                return <Badge variant="destructive">Rejected</Badge>;
            default:
                return null;
        }
    };

    return (
        <AppLayout>
            <Head title="Manage Profiles" />

            <div className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Manage Youth Profiles</h1>
                    <div className="flex items-center gap-4">
                        <Select value={filters.status} onValueChange={handleStatusFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={filters.education} onValueChange={handleEducationFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by Education" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Education Levels</SelectItem>
                                <SelectItem value="elementary">Elementary</SelectItem>
                                <SelectItem value="high_school">High School</SelectItem>
                                <SelectItem value="college">College</SelectItem>
                                <SelectItem value="graduate">Graduate</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Profiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Contact</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Education</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-medium">Created</th>
                                        <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profiles.data.map((profile) => (
                                        <tr key={profile.id} className="border-b last:border-b-0">
                                            <td className="px-6 py-4">
                                                {profile.personalInformation?.full_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {calculateAge(profile.personalInformation.birthdate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <HoverCard>
                                                        <HoverCardTrigger className="text-left">
                                                            <span className="underline decoration-dotted">
                                                                {profile.personalInformation.email?.slice(0, 5) || 'N/A'}
                                                            </span>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                            {profile.personalInformation.email || 'No email provided'}
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                    <HoverCard>
                                                        <HoverCardTrigger className="text-left">
                                                            <span className="underline decoration-dotted">
                                                                {profile.personalInformation.phone?.slice(0, 5) || 'N/A'}
                                                            </span>
                                                        </HoverCardTrigger>
                                                        <HoverCardContent>
                                                            {profile.personalInformation.phone || 'No phone provided'}
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary">
                                                    {profile.engagementData.education_level.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(profile.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {formatDate(profile.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route(`youth-profiles.${profile.status}.show`, profile.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    {profile.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedProfile(profile);
                                                                    setShowApproveDialog(true);
                                                                }}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedProfile(profile);
                                                                    setShowRejectDialog(true);
                                                                }}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                    {profile.status === 'rejected' && (
                                                        <>
                                                            <Link href={route('youth-profiles.rejected.edit', profile.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    Edit
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedProfile(profile);
                                                                    setShowDeleteDialog(true);
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {profiles.last_page > 1 && (
                            <div className="mt-4 flex justify-center">
                                <Link
                                    href={route('youth-profiles.manage', {
                                        page: profiles.current_page - 1,
                                        status: filters.status,
                                        education: filters.education,
                                    })}
                                    className={`${profiles.current_page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <Button variant="outline" disabled={profiles.current_page === 1}>
                                        Previous
                                    </Button>
                                </Link>
                                <span className="mx-4">
                                    Page {profiles.current_page} of {profiles.last_page}
                                </span>
                                <Link
                                    href={route('youth-profiles.manage', {
                                        page: profiles.current_page + 1,
                                        status: filters.status,
                                        education: filters.education,
                                    })}
                                    className={`${profiles.current_page === profiles.last_page ? 'pointer-events-none opacity-50' : ''}`}
                                >
                                    <Button variant="outline" disabled={profiles.current_page === profiles.last_page}>
                                        Next
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Approve Dialog */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="notes" className="text-sm font-medium">
                                Notes (Optional)
                            </label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any notes about this approval..."
                                className="mt-1"
                            />
                        </div>
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
                            {isProcessing ? 'Approving...' : 'Approve'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="notes" className="text-sm font-medium">
                                Reason for Rejection <span className="text-red-500">*</span>
                            </label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Please provide a reason for rejecting this profile..."
                                className="mt-1"
                            />
                        </div>
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
                            disabled={isProcessing || !notes.trim()}
                        >
                            {isProcessing ? 'Rejecting...' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Profile</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this profile? This action cannot be undone.</p>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 