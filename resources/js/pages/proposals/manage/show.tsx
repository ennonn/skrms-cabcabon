import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Proposal } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, ChevronLeft, CheckCircle, XCircle, PencilIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    proposal: Proposal & {
        implementation_start_date?: string;
        implementation_end_date?: string;
        location?: string;
        target_participants?: number;
        total_budget?: number;
        objectives?: string | string[];
        expected_outcomes?: string | string[];
        documents?: ProposalDocument[];
    };
}

interface ProposalDocument {
    id: number;
    filename: string;
    created_at: string;
    url?: string;
}

export default function ShowProposal({ auth, proposal }: Props) {
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDownloadDocument = (documentItem: ProposalDocument) => {
        if (!documentItem.url) {
            toast.error('Document URL not available');
            return;
        }

        // Create an anchor element to force download
        const link = window.document.createElement('a');
        link.href = documentItem.url;
        link.download = documentItem.filename; // Set the filename for download
        link.target = '_blank'; // This ensures it opens in a new tab if download doesn't work
        
        // Append to body, click, and remove
        window.document.body.appendChild(link);
        link.click();
        window.document.body.removeChild(link);
        
        toast.success('Starting download...');
    };

    const handleApprove = () => {
        setIsSubmitting(true);
        
        toast.success('Proposal approved successfully');
        
        router.post(route('proposals.manage.approve', proposal.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsApproveDialogOpen(false);
                setIsSubmitting(false);
                
                router.visit(route('proposals.manage.index'));
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to approve proposal. Please try again.');
            }
        });
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a rejection reason');
            return;
        }
        
        setIsSubmitting(true);
        
        toast.success('Proposal rejected successfully');
        
        router.post(route('proposals.manage.reject', proposal.id), {
            rejection_reason: rejectionReason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRejectDialogOpen(false);
                setIsSubmitting(false);
                setRejectionReason('');
                
                router.visit(route('proposals.manage.index'));
            },
            onError: (errors) => {
                setIsSubmitting(false);
                if (errors.rejection_reason) {
                    toast.error(`Rejection failed: ${errors.rejection_reason}`);
                } else {
                    toast.error('Failed to reject proposal. Please try again.');
                }
            }
        });
    };

    const handleDelete = () => {
        setIsSubmitting(true);
        router.delete(route('proposals.manage.destroy', proposal.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proposal deleted successfully');
                router.visit(route('proposals.manage.index'));
            },
            onError: () => {
                setIsSubmitting(false);
                toast.error('Failed to delete proposal');
            }
        });
    };

    const handleEdit = () => {
        // This function is no longer needed as we'll use Link instead
    };

    const breadcrumbs = [
        {
            title: 'Manage Proposals',
            href: route('proposals.manage.index'),
        },
        {
            title: 'Proposal Details',
            href: '#',
        },
    ];

    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'superadmin';

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title={`Proposal: ${proposal.title}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Proposal Details
                                </h2>
                                <Link href={route('proposals.manage.index')}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ChevronLeft className="h-4 w-4" />
                                        Back to Manage Proposals
                                    </Button>
                                </Link>
                            </div>

                            {isAdmin && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-medium mb-3">Administrative Actions</h3>
                                    <div className="flex gap-3">
                                        {proposal.status === 'pending' && (
                                            <>
                                                <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            className="flex items-center gap-2"
                                                        >
                                                            <CheckCircle className="h-4 w-4" />
                                                            Approve Proposal
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Approve Proposal</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to approve this proposal? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <p>Proposal title: <strong>{proposal.title}</strong></p>
                                                            <p>Category: <strong>{proposal.category.name}</strong></p>
                                                            <p>Submitter: <strong>{proposal.submitter?.first_name} {proposal.submitter?.last_name}</strong></p>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setIsApproveDialogOpen(false)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                onClick={handleApprove}
                                                                disabled={isSubmitting}
                                                            >
                                                                {isSubmitting ? 'Processing...' : 'Approve'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                
                                                <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            className="flex items-center gap-2"
                                                        >
                                                            <XCircle className="h-4 w-4" />
                                                            Reject Proposal
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Reject Proposal</DialogTitle>
                                                            <DialogDescription>
                                                                Please provide a reason for rejecting this proposal. This information will be shared with the submitter.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="py-4">
                                                            <Label htmlFor="rejection_reason">Rejection Reason</Label>
                                                            <Textarea
                                                                id="rejection_reason"
                                                                value={rejectionReason}
                                                                onChange={(e) => setRejectionReason(e.target.value)}
                                                                placeholder="Enter reason for rejection..."
                                                                className="mt-2"
                                                                rows={4}
                                                            />
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => setIsRejectDialogOpen(false)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                onClick={handleReject}
                                                                disabled={isSubmitting || !rejectionReason.trim()}
                                                            >
                                                                {isSubmitting ? 'Submitting...' : 'Reject Proposal'}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </>
                                        )}
                                        
                                        {proposal.status === 'rejected' && (
                                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                                <DialogTrigger asChild>
                                                    <Button variant="destructive" className="flex items-center gap-2">
                                                        Delete Proposal
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Delete Proposal</DialogTitle>
                                                        <DialogDescription>
                                                            This will permanently delete this rejected proposal. This action cannot be undone.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <DialogFooter>
                                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                                            Cancel
                                                        </Button>
                                                        <Button 
                                                            variant="destructive"
                                                            onClick={handleDelete}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? 'Deleting...' : 'Delete Permanently'}
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}
                                        
                                        {proposal.status === 'approved' && (
                                            <Link href={route('proposals.manage.edit', proposal.id)}>
                                                <Button 
                                                    className="flex items-center gap-2"
                                                >
                                                    <PencilIcon className="h-4 w-4" />
                                                    Edit Proposal
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Title</h4>
                                            <p className="text-lg">{proposal.title}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Status</h4>
                                            <Badge className={getStatusColor(proposal.status)}>
                                                {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Submitted By</h4>
                                            <p>{proposal.submitter?.first_name} {proposal.submitter?.last_name}</p>
                                            <p className="text-sm text-gray-500">
                                                on {formatDate(proposal.created_at)}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Category</h4>
                                            <p>{proposal.category.name}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Implementation Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Implementation Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Implementation Period</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Start Date:</span>
                                                    <span className="text-gray-600">
                                                        {proposal.implementation_start_date 
                                                            ? formatDate(proposal.implementation_start_date)
                                                            : "Not Available"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">End Date:</span>
                                                    <span className="text-gray-600">
                                                        {proposal.implementation_end_date
                                                            ? formatDate(proposal.implementation_end_date)
                                                            : "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Location</h4>
                                            <p className="text-gray-600">{proposal.location || "Not specified"}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">People Involved</h4>
                                                <p className="whitespace-pre-wrap text-gray-600">{proposal.people_involved}</p>
                                            </div>
                                            {proposal.target_participants && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Target Participants</h4>
                                                    <p className="text-gray-600">{proposal.target_participants} participants</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Budget Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Budget Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">Estimated Budget</h4>
                                                <p className="text-gray-600">₱{proposal.estimated_cost?.toLocaleString() || proposal.total_budget?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Frequency</h4>
                                                <p className="text-gray-600">{proposal.frequency}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Funding Source</h4>
                                                <p className="text-gray-600">{proposal.funding_source}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Objectives & Outcomes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Objectives & Expected Outcomes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Objectives</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="whitespace-pre-wrap text-gray-600">
                                                    {Array.isArray(proposal.objectives) 
                                                        ? proposal.objectives.join('\n') 
                                                        : proposal.objectives}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3">Expected Outcomes</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="whitespace-pre-wrap text-gray-600">
                                                    {Array.isArray(proposal.expected_outcomes) 
                                                        ? proposal.expected_outcomes.join('\n') 
                                                        : proposal.expected_outcomes}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Description */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="whitespace-pre-wrap leading-relaxed text-gray-600">{proposal.description}</p>
                                    </CardContent>
                                </Card>

                                {/* Documents */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {proposal.documents && proposal.documents.length > 0 ? (
                                            <div className="space-y-4">
                                                {proposal.documents.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">{doc.filename}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    Uploaded on {formatDate(doc.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadDocument(doc)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No documents attached to this proposal.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 