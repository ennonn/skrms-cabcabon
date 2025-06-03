import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Proposal, ProposalCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertCircle, Pencil, Trash2 } from 'lucide-react';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    proposals: {
        data: Array<Proposal & {
            submitter: {
                name: string;
            };
        }>;
        links: any;
    };
    categories: ProposalCategory[];
}

const breadcrumbs = [
    {
        title: 'Proposal Management',
        href: route('admin.proposals.index'),
    }
];

export default function AdminProposalList({ auth, proposals, categories }: Props) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-500 text-white';
            case 'pending':
                return 'bg-yellow-500 text-white';
            case 'approved':
                return 'bg-green-500 text-white';
            case 'rejected':
                return 'bg-red-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const handleDelete = (proposal: Proposal) => {
        setProposalToDelete(proposal);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (proposalToDelete) {
            router.delete(route('admin.proposals.destroy', proposalToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setProposalToDelete(null);
                },
            });
        }
    };

    const handleView = (proposal: Proposal) => {
        router.get(route('proposals.show', proposal.id));
    };

    const handleEdit = (proposal: Proposal) => {
        router.get(route('proposals.edit', proposal.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Proposal Management" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* Search and Filter Section */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1">
                                <Input
                                    type="search"
                                    placeholder="Search proposals..."
                                    className="max-w-sm"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select defaultValue="all">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="approved">Approved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="default">
                                    Sort by Title ↑
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Title</th>
                                        <th className="text-left py-3 px-4">Category</th>
                                        <th className="text-left py-3 px-4">Submitted By</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-left py-3 px-4">Date Submitted</th>
                                        <th className="text-left py-3 px-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proposals.data.map((proposal) => (
                                        <tr key={proposal.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{proposal.title}</td>
                                            <td className="py-3 px-4">{proposal.category?.name || 'N/A'}</td>
                                            <td className="py-3 px-4">{proposal.submitter?.fullName || 'N/A'}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={getStatusColor(proposal.status)}>
                                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                {proposal.created_at ? new Date(proposal.created_at).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleView(proposal)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(proposal)}
                                                    >
                                                        <Pencil className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(proposal)}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </Button>
                                                    {proposal.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => router.post(route('admin.proposals.approve', proposal.id))}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => router.post(route('admin.proposals.reject', proposal.id))}
                                                            >
                                                                Reject
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {proposals.data.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No proposals found.</p>
                                </div>
                            )}
                        </div>

                        {/* Delete Confirmation Dialog */}
                        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Proposal</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this proposal? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <AlertCircle className="h-5 w-5" />
                                    <p>This will permanently delete the proposal and all associated data.</p>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setDeleteDialogOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={confirmDelete}
                                    >
                                        Delete
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Pagination */}
                        {proposals.links && (
                            <div className="mt-6">
                                {/* Pagination component will go here */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 