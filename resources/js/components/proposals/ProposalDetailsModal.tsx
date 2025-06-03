import React, { useEffect, useRef } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Proposal } from '@/types/index';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, FileText, Edit } from 'lucide-react';
import { router } from '@inertiajs/react';

interface Props {
    proposal: Proposal | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProposalDetailsModal({ proposal, isOpen, onClose }: Props) {
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
        } else if (previousFocusRef.current) {
            previousFocusRef.current.focus();
        }
    }, [isOpen]);

    if (!proposal) return null;

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

    const handleDownloadDocument = (document: any) => {
        // Use a simple direct href with target="_blank"
        const url = route('proposals.proposal-attachments.view', document.id);
        window.open(url, '_blank');
    };

    const handleEdit = () => {
        router.get(route('proposals.manage.edit', proposal.id));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <DialogTitle className="text-2xl font-bold">Proposal Details</DialogTitle>
                    {proposal.status === 'draft' && (
                        <Button
                            onClick={handleEdit}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Proposal
                        </Button>
                    )}
                </DialogHeader>

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
                                    <h4 className="font-semibold mb-2">Estimated Cost</h4>
                                    <p className="text-gray-600">₱{proposal.estimated_cost.toLocaleString()}</p>
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
                                    <p className="whitespace-pre-wrap text-gray-600">{proposal.objectives}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Expected Outcomes</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="whitespace-pre-wrap text-gray-600">{proposal.expected_outcomes}</p>
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

                    {/* Approval Details */}
                    {proposal.status !== 'draft' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Approval Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {proposal.status === 'approved' && proposal.approver && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Approved By</h4>
                                        <p>
                                            {proposal.approver.first_name} {proposal.approver.last_name}
                                        </p>
                                    </div>
                                )}
                                {proposal.status === 'rejected' && proposal.rejection_reason && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Rejection Reason</h4>
                                        <p className="text-red-600">{proposal.rejection_reason}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
} 