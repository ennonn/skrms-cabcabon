import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { YouthProfile } from '@/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

interface Props {
    profiles: YouthProfile[];
}

type SortField = 'name' | 'status';
type SortOrder = 'asc' | 'desc';

export default function YouthProfiles({ profiles }: Props) {
    const [selectedProfile, setSelectedProfile] = useState<YouthProfile | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const itemsPerPage = 10;
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [profileToAction, setProfileToAction] = useState<YouthProfile | null>(null);
    
    const approveForm = useForm({
        notes: '',
    });

    const rejectForm = useForm({
        notes: '',
    });

    const getStatusBadgeColor = (status: string) => {
        const colors = {
            draft: 'bg-gray-500',
            pending: 'bg-yellow-500',
            approved: 'bg-green-500',
            rejected: 'bg-red-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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

    const truncateText = (text: string) => {
        return text.length > 5 ? text.substring(0, 5) + '...' : text;
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const getSortedAndFilteredData = () => {
        let filteredData = [...profiles];

        // Apply status filter
        if (statusFilter !== 'all') {
            filteredData = filteredData.filter(profile => profile.status === statusFilter);
        }

        // Apply sorting
        return filteredData.sort((a, b) => {
            if (sortField === 'name') {
                const nameA = `${a.personal_info?.first_name || ''} ${a.personal_info?.last_name || ''}`.toLowerCase();
                const nameB = `${b.personal_info?.first_name || ''} ${b.personal_info?.last_name || ''}`.toLowerCase();
                return sortOrder === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            } else {
                return sortOrder === 'asc' 
                    ? a.status.localeCompare(b.status)
                    : b.status.localeCompare(a.status);
            }
        });
    };

    const getCurrentPageData = () => {
        const sortedData = getSortedAndFilteredData();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedData.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(getSortedAndFilteredData().length / itemsPerPage);

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return <ChevronDown className="w-4 h-4 ml-1" />;
        return sortOrder === 'asc' ? (
            <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
            <ChevronDown className="w-4 h-4 ml-1" />
        );
    };

    const renderPaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);
        
        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1}>
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages}>
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    const handleApproveClick = (profile: YouthProfile) => {
        setProfileToAction(profile);
        setShowApproveModal(true);
    };

    const handleRejectClick = (profile: YouthProfile) => {
        setProfileToAction(profile);
        setShowRejectModal(true);
    };

    const handleApproveSubmit = () => {
        if (!profileToAction) return;
        
        approveForm.post(route('youth-profiles.approve', profileToAction.id), {
            notes: approveForm.data.notes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowApproveModal(false);
                setProfileToAction(null);
                approveForm.reset();
            },
        });
    };

    const handleRejectSubmit = () => {
        if (!profileToAction) return;
        
        rejectForm.post(route('youth-profiles.reject', profileToAction.id), {
            notes: rejectForm.data.notes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowRejectModal(false);
                setProfileToAction(null);
                rejectForm.reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Youth Profiles" />

            <div className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Youth Profiles</h1>
                    <Link href={route('youth-profiles.create')}>
                        <Button>Create New Profile</Button>
                    </Link>
                </div>

                <div className="bg-card rounded-lg shadow">
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-4">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                onClick={() => handleSort('name')}
                                className="flex items-center"
                            >
                                Sort by Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSort('status')}
                                className="flex items-center"
                            >
                                Sort by Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Age</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getCurrentPageData().map((profile) => {
                                    const info = profile.personal_info || {};
                                    const age = info.birthdate ? calculateAge(info.birthdate) : null;
                                    const birthdate = info.birthdate ? formatDate(info.birthdate) : null;

                                    return (
                                        <tr key={profile.id} className="border-b last:border-b-0">
                                            <td className="px-6 py-4 text-sm">
                                                {info.first_name && info.last_name 
                                                    ? `${info.first_name} ${info.last_name}`
                                                    : 'Not specified'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {info.email ? (
                                                    <HoverCard>
                                                        <HoverCardTrigger className="cursor-help">
                                                            {truncateText(info.email)}
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-auto">
                                                            <div className="space-y-1">
                                                                <p className="text-sm">
                                                                    {info.email}
                                                                </p>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {info.phone || 'Not specified'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {info.address ? (
                                                    <HoverCard>
                                                        <HoverCardTrigger className="cursor-help">
                                                            {truncateText(info.address)}
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-80">
                                                            <div className="space-y-1">
                                                                <p className="text-sm">
                                                                    {info.address}
                                                                </p>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {age ? (
                                                    <HoverCard>
                                                        <HoverCardTrigger className="cursor-help">
                                                            {age} years
                                                        </HoverCardTrigger>
                                                        <HoverCardContent className="w-auto">
                                                            <div className="space-y-1">
                                                                <p className="text-sm">
                                                                    Born: {birthdate}
                                                                </p>
                                                            </div>
                                                        </HoverCardContent>
                                                    </HoverCard>
                                                ) : (
                                                    'Not specified'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Badge className={getStatusBadgeColor(profile.status)}>
                                                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setSelectedProfile(profile)}
                                                    >
                                                        View
                                                    </Button>
                                                    {(profile.status === 'draft' || profile.status === 'rejected') && (
                                                        <Link href={route('youth-profiles.edit', profile.id)}>
                                                            <Button variant="outline" size="sm">
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {profile.status === 'draft' && (
                                                        <Link
                                                            href={route('youth-profiles.submit', profile.id)}
                                                            method="post"
                                                            className={cn(
                                                                buttonVariants({
                                                                    variant: "default",
                                                                    size: "sm",
                                                                })
                                                            )}
                                                        >
                                                            Submit
                                                        </Link>
                                                    )}
                                                    {profile.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700"
                                                                onClick={() => handleApproveClick(profile)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRejectClick(profile)}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="py-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                    
                                    {renderPaginationItems()}
                                    
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
                {selectedProfile && (
                    <div className="relative">
                        <DialogContent className="w-[90%] max-h-[90vh] overflow-y-auto">
                            <DialogHeader className="bg-background pb-2">
                                <DialogTitle className="flex items-center justify-between">
                                    <span>Youth Profile Details</span>
                                    
                                </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Personal Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-medium">Full Name:</span>{' '}
                                            {selectedProfile.personal_info?.first_name && selectedProfile.personal_info?.last_name
                                                ? `${selectedProfile.personal_info.first_name} ${selectedProfile.personal_info.last_name}`
                                                : 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Birthdate:</span>{' '}
                                            {selectedProfile.personal_info?.birthdate
                                                ? formatDate(selectedProfile.personal_info.birthdate)
                                                : 'Not specified'}
                                            {selectedProfile.personal_info?.birthdate && (
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({calculateAge(selectedProfile.personal_info.birthdate)} years old)
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium">Gender:</span>{' '}
                                            {selectedProfile.personal_info?.gender || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Email:</span>{' '}
                                            {selectedProfile.personal_info?.email || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Phone:</span>{' '}
                                            {selectedProfile.personal_info?.phone || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Address:</span>{' '}
                                            {selectedProfile.personal_info?.address || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Monthly Income:</span>{' '}
                                            {selectedProfile.personal_info?.monthly_income
                                                ? `₱${selectedProfile.personal_info.monthly_income.toLocaleString()}`
                                                : 'Not specified'}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Family Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-medium">Father's Name:</span>{' '}
                                            {selectedProfile.family_info?.father_name || 'Not specified'}
                                            {selectedProfile.family_info?.father_age && (
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({selectedProfile.family_info.father_age} years old)
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-medium">Mother's Name:</span>{' '}
                                            {selectedProfile.family_info?.mother_name || 'Not specified'}
                                            {selectedProfile.family_info?.mother_age && (
                                                <span className="text-sm text-gray-500 ml-1">
                                                    ({selectedProfile.family_info.mother_age} years old)
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Engagement Data</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="font-medium">Education Level:</span>{' '}
                                            {selectedProfile.engagement_data?.education_level
                                                ? selectedProfile.engagement_data.education_level.replace('_', ' ')
                                                : 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Employment Status:</span>{' '}
                                            {selectedProfile.engagement_data?.employment_status || 'Not specified'}
                                        </div>
                                        <div>
                                            <span className="font-medium">SK Voter:</span>{' '}
                                            {selectedProfile.engagement_data?.is_sk_voter ? 'Yes' : 'No'}
                                        </div>
                                        <div>
                                            <span className="font-medium">Assembly Attendance:</span>{' '}
                                            {selectedProfile.engagement_data?.assembly_attendance ?? 'Not specified'}
                                        </div>
                                    </CardContent>
                                </Card>

                                {(selectedProfile.status === 'approved' || selectedProfile.status === 'rejected') && (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Review Information</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            {selectedProfile.approver && (
                                                <div>
                                                    <span className="font-medium">Reviewed By:</span>{' '}
                                                    {selectedProfile.approver.first_name} {selectedProfile.approver.last_name}
                                                </div>
                                            )}
                                            {selectedProfile.approval_notes && (
                                                <div>
                                                    <span className="font-medium">Notes:</span>{' '}
                                                    {selectedProfile.approval_notes}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </DialogContent>
                    </div>
                )}
            </Dialog>

            <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Approve Youth Profile</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowApproveModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="approve-notes" className="text-sm font-medium">
                                Approval Notes
                            </label>
                            <Textarea
                                id="approve-notes"
                                placeholder="Enter any notes about this approval..."
                                value={approveForm.data.notes}
                                onChange={e => approveForm.setData('notes', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowApproveModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApproveSubmit}
                                disabled={approveForm.processing}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {approveForm.processing ? 'Approving...' : 'Approve Profile'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Reject Youth Profile</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setShowRejectModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </Button>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="reject-notes" className="text-sm font-medium">
                                Rejection Notes
                            </label>
                            <Textarea
                                id="reject-notes"
                                placeholder="Enter the reason for rejection..."
                                value={rejectForm.data.notes}
                                onChange={e => rejectForm.setData('notes', e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowRejectModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleRejectSubmit}
                                disabled={rejectForm.processing}
                            >
                                {rejectForm.processing ? 'Rejecting...' : 'Reject Profile'}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
} 