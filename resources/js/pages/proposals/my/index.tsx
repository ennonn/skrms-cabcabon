import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type Proposal, type ProposalCategory } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import * as _ from 'lodash';

interface Props {
    auth: Auth;
    proposals: {
        data: Proposal[];
        links: any;
        current_page: number;
        last_page: number;
    };
    categories: ProposalCategory[];
    filters?: {
        search?: string;
        category?: string;
        status?: string;
    };
}

const breadcrumbs = [
    {
        title: 'My Proposals',
        href: '/#',
    },
];

export default function MyProposals({ auth, proposals, categories, filters = {} }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'all');
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);
    const [currentPage, setCurrentPage] = useState(proposals.current_page || 1);
    
    // Ensure proposals is always an array
    const proposalsList = proposals?.data ?? [];

    // Create a debounced search function
    const debouncedSearch = _.debounce((value: string) => {
        // Reset to page 1 when searching
        setCurrentPage(1);
        
        router.get(route('proposals.my.index'), {
            search: value,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    }, 300); // 300ms debounce delay

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        debouncedSearch(value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        
        // Reset to page 1 when changing category
        setCurrentPage(1);
        
        router.get(route('proposals.my.index'), {
            search: searchQuery,
            category: value !== 'all' ? value : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            page: 1, // Always go back to page 1 when changing category
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        
        // Reset to page 1 when changing status
        setCurrentPage(1);
        
        router.get(route('proposals.my.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: value !== 'all' ? value : undefined,
            page: 1, // Always go back to page 1 when changing status
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        router.get(route('proposals.my.index'), {
            search: searchQuery || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleViewDetails = (proposal: Proposal) => {
        switch (proposal.status) {
            case 'approved':
                router.get(route('proposals.records.show', proposal.id));
                break;
            case 'pending':
                router.get(route('proposals.pending.show', proposal.id));
                break;
            case 'rejected':
                router.get(route('proposals.rejected.show', proposal.id));
                break;
            case 'draft':
            default:
                router.get(route('proposals.my.show', proposal.id));
                break;
        }
    };

    const handleSubmitProposal = (proposalId: number) => {
        router.post(route('proposals.my.submit', proposalId), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleEdit = (proposal: Proposal) => {
        router.get(route('proposals.my.edit', proposal.id));
    };

    const handleDelete = (proposal: Proposal) => {
        setProposalToDelete(proposal);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!proposalToDelete) return;
        
        const toastId = toast.loading('Deleting proposal...');
        
        router.delete(route('proposals.my.destroy', proposalToDelete.id), {
            onBefore: () => {
                toast.loading('Deleting proposal...', { id: toastId });
            },
            onSuccess: () => {
                toast.dismiss(toastId);
                toast.success('Proposal deleted successfully');
                setShowDeleteDialog(false);
                setProposalToDelete(null);
                // Visit the page again to refresh data
                router.visit(route('proposals.my.index'), {
                    preserveScroll: false,
                    preserveState: false
                });
            },
            onError: (error) => {
                toast.dismiss(toastId);
                console.error('Delete error:', error);
                toast.error(error?.message || 'Failed to delete proposal. Please try again.');
                setShowDeleteDialog(false);
                setProposalToDelete(null);
            },
            onFinish: () => {
                toast.dismiss(toastId);
                setShowDeleteDialog(false);
                setProposalToDelete(null);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="My Proposals" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
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

                                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
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
                                </div>

                                <Button 
                                    variant="default" 
                                    className="whitespace-nowrap"
                                    onClick={() => router.get(route('proposals.my.create'))}
                                >
                                    Create New Proposal
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="relative max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="search"
                                    placeholder="Search proposals..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="pl-8 max-w-sm"
                                />
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {proposalsList.map((proposal) => (
                                        <TableRow 
                                            key={proposal.id} 
                                            className="cursor-pointer"
                                            onClick={() => handleViewDetails(proposal)}
                                        >
                                            <TableCell className="font-medium">{proposal.title}</TableCell>
                                            <TableCell>{proposal.category.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        proposal.status === 'approved'
                                                            ? 'default'
                                                            : proposal.status === 'rejected'
                                                            ? 'destructive'
                                                            : proposal.status === 'draft'
                                                            ? 'outline'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{formatDate(proposal.created_at)}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent row click event
                                                            handleViewDetails(proposal);
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    {proposal.status === 'draft' && (
                                                        <>
                                                            <Button 
                                                                variant="default" 
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent row click event
                                                                    handleEdit(proposal);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button 
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent row click event
                                                                    handleSubmitProposal(proposal.id);
                                                                }}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </>
                                                    )}
                                                    {proposal.status !== 'approved' && proposal.status !== 'pending' && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent row click event
                                                                handleDelete(proposal);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {proposalsList.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No proposals found.</p>
                                </div>
                            )}

                            {proposals.last_page > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-500">
                                        Showing page {currentPage} of {proposals.last_page}
                                    </div>
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => goToPage(1)}
                                            disabled={currentPage === 1}
                                        >
                                            «
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            ‹
                                        </Button>
                                        
                                        {/* Page numbers */}
                                        {[...Array(proposals.last_page)].map((_, index) => {
                                            const pageNumber = index + 1;
                                            // Only show a few page numbers around the current page
                                            if (
                                                pageNumber === 1 ||
                                                pageNumber === proposals.last_page ||
                                                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                            ) {
                                                return (
                                                    <Button
                                                        key={pageNumber}
                                                        variant={currentPage === pageNumber ? "default" : "outline"}
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => goToPage(pageNumber)}
                                                    >
                                                        {pageNumber}
                                                    </Button>
                                                );
                                            }
                                            // Show ellipsis for skipped pages
                                            if (
                                                (pageNumber === currentPage - 2 && pageNumber > 2) ||
                                                (pageNumber === currentPage + 2 && pageNumber < proposals.last_page - 1)
                                            ) {
                                                return <span key={pageNumber} className="px-2">…</span>;
                                            }
                                            return null;
                                        })}
                                        
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => goToPage(Math.min(proposals.last_page, currentPage + 1))}
                                            disabled={currentPage === proposals.last_page}
                                        >
                                            ›
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => goToPage(proposals.last_page)}
                                            disabled={currentPage === proposals.last_page}
                                        >
                                            »
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Proposal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this proposal? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}