import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type Proposal, type ProposalCategory } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ProposalDetailsModal } from '@/components/proposals/ProposalDetailsModal';
import { formatDate } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

interface Props {
    auth: Auth;
    proposals: {
        data: Proposal[];
        links: any;
    };
    categories?: ProposalCategory[];
}

const breadcrumbs = [
    {
        title: 'Rejected Proposals',
        href: '/#',
    },
];

export default function RejectedProposals({ auth, proposals, categories = [] }: Props) {
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);
    
    // Ensure proposals is always an array
    const proposalsList = proposals?.data ?? [];

    const handleDelete = (proposal: Proposal) => {
        setProposalToDelete(proposal);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (proposalToDelete) {
            router.delete(route('proposals.manage.destroy', proposalToDelete.id), {
                preserveScroll: true,
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setProposalToDelete(null);
                    router.visit(route('proposals.rejected'));
                }
            });
        }
    };

    const handleSubmit = (proposal: Proposal) => {
        router.post(route('proposals.manage.resubmit', { proposal: proposal.id }), {}, {
            onSuccess: () => {
                toast.success('Proposal resubmitted successfully');
            },
            onError: () => {
                toast.error('Failed to resubmit proposal');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Rejected Proposals" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                    <Input type="search" placeholder="Search proposals..." className="max-w-sm" />
                                    
                                    {categories.length > 0 && (
                                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                            <SelectTrigger className="w-[200px]">
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
                                    )}
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Submitted By</TableHead>
                                        <TableHead>Date Submitted</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {proposalsList.map((proposal) => (
                                        <TableRow key={proposal.id}>
                                            <TableCell>{proposal.title}</TableCell>
                                            <TableCell>{proposal.category.name}</TableCell>
                                            <TableCell>
                                                {proposal.submitter 
                                                    ? `${proposal.submitter.first_name} ${proposal.submitter.last_name}`
                                                    : 'Unknown'}
                                            </TableCell>
                                            <TableCell>{formatDate(proposal.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setSelectedProposal(proposal)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => handleSubmit(proposal)}
                                                    >
                                                        Submit Again
                                                    </Button>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(proposal)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <ProposalDetailsModal
                        proposal={selectedProposal}
                        isOpen={selectedProposal !== null}
                        onClose={() => setSelectedProposal(null)}
                    />

                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Delete Proposal</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this proposal? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsDeleteDialogOpen(false)}
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
                </div>
            </div>
        </AppLayout>
    );
} 