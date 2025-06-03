import { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type Proposal, type ProposalCategory } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, ChevronDown, MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown } from 'lucide-react';
import * as _ from 'lodash';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Textarea } from '@/components/ui/textarea';

interface Props {
    auth: Auth;
    proposals: {
        data: Proposal[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    categories: ProposalCategory[];
    filters?: {
        search?: string;
        category?: string;
        status?: string;
        start_date?: string;
        end_date?: string;
        sort_by?: string;
    };
}

const breadcrumbs = [
    {
        title: 'Manage Proposal',
        href: '/#',
    },
];

type SortOrder = 'title_asc' | 'budget_asc' | 'budget_desc' | 'date_asc' | 'date_desc';

export default function ManageProposals({ auth, proposals, categories, filters = {} }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<string>(filters.status || 'all');
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [sortBy, setSortBy] = useState<SortOrder>((filters.sort_by as SortOrder) || 'title_asc');
    const [startDate, setStartDate] = useState<Date | undefined>(
        filters.start_date ? new Date(filters.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filters.end_date ? new Date(filters.end_date) : undefined
    );
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [proposalToDelete, setProposalToDelete] = useState<Proposal | null>(null);
    const [proposalToReject, setProposalToReject] = useState<Proposal | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    
    const proposalsList = proposals?.data ?? [];
    const currentPage = proposals?.current_page ?? 1;
    const lastPage = proposals?.last_page ?? 1;
    const total = proposals?.total ?? 0;

    // Create a debounced search function
    const debouncedSearch = _.debounce((value: string) => {
        router.get(route('proposals.manage.index'), {
            search: value,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Reset to page 1 when searching
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    }, 300);

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
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: value !== 'all' ? value : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Reset to page 1 when changing category
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleStatusChange = (value: string) => {
        setSelectedStatus(value);
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: value !== 'all' ? value : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Reset to page 1 when changing status
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleSortChange = (value: SortOrder) => {
        setSortBy(value);
        
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: value,
            page: proposals.current_page,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: date ? format(date, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Reset to page 1 when changing date
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: date ? format(date, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Reset to page 1 when changing date
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('proposals.manage.index'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            status: selectedStatus !== 'all' ? selectedStatus : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleEdit = (proposal: Proposal) => {
        if (proposal.status !== 'pending') {
            router.get(route('proposals.manage.edit', proposal.id));
        }
    };

    const handleApprove = (proposal: Proposal) => {
        router.post(route('proposals.manage.approve', proposal.id), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proposal approved successfully');
                router.visit(route('proposals.manage.index'), {
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: () => {
                toast.error('Failed to approve proposal');
            }
        });
    };

    const handleReject = (proposal: Proposal) => {
        setProposalToReject(proposal);
        setRejectionReason('');
        setShowRejectDialog(true);
    };

    const confirmReject = () => {
        if (!proposalToReject || !rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        router.post(route('proposals.manage.reject', proposalToReject.id), {
            rejection_reason: rejectionReason
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proposal rejected successfully');
                setShowRejectDialog(false);
                setProposalToReject(null);
                setRejectionReason('');
                router.visit(route('proposals.manage.index'), { 
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: () => {
                toast.error('Failed to reject proposal');
            }
        });
    };

    const handleDelete = (proposal: Proposal) => {
        setProposalToDelete(proposal);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (!proposalToDelete) return;
        
        router.delete(route('proposals.manage.destroy', proposalToDelete.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proposal deleted successfully');
                setShowDeleteDialog(false);
                setProposalToDelete(null);
                router.visit(route('proposals.manage.index'), { 
                    preserveScroll: true,
                    preserveState: true,
                });
            },
            onError: () => {
                toast.error('Failed to delete proposal');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Manage Proposals" />

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
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="approved">Approved</SelectItem>
                                            <SelectItem value="rejected">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Sort Order */}
                                    <div>
                                        <Select 
                                            value={sortBy} 
                                            onValueChange={value => handleSortChange(value as SortOrder)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <div className="flex items-center">
                                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                                    <span>Sort By</span>
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                                                <SelectItem value="budget_asc">Budget (Low-High)</SelectItem>
                                                <SelectItem value="budget_desc">Budget (High-Low)</SelectItem>
                                                <SelectItem value="date_asc">Implementation Date (Near-Far)</SelectItem>
                                                <SelectItem value="date_desc">Implementation Date (Far-Near)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Start date filter */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-[180px] justify-between"
                                            >
                                                {startDate ? (
                                                    format(startDate, "MM/dd/yyyy")
                                                ) : (
                                                    "Start Date"
                                                )}
                                                <Calendar className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <div className="p-2 flex justify-between items-center border-b">
                                                <span className="text-sm font-medium">Select start date</span>
                                                {startDate && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleStartDateChange(undefined)}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <CalendarComponent
                                                mode="single"
                                                selected={startDate}
                                                onSelect={handleStartDateChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {/* End date filter */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-[180px] justify-between"
                                            >
                                                {endDate ? (
                                                    format(endDate, "MM/dd/yyyy")
                                                ) : (
                                                    "End Date"
                                                )}
                                                <Calendar className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <div className="p-2 flex justify-between items-center border-b">
                                                <span className="text-sm font-medium">Select end date</span>
                                                {endDate && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleEndDateChange(undefined)}
                                                    >
                                                        Clear
                                                    </Button>
                                                )}
                                            </div>
                                            <CalendarComponent
                                                mode="single"
                                                selected={endDate}
                                                onSelect={handleEndDateChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
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
                                        <TableHead>Submitted By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[50px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {proposalsList.map((proposal) => (
                                        <TableRow 
                                            key={proposal.id}
                                            className="cursor-pointer"
                                            onClick={() => router.get(route('proposals.manage.show', proposal.id))}
                                        >
                                            <TableCell className="font-medium">{proposal.title}</TableCell>
                                            <TableCell>{proposal.category.name}</TableCell>
                                            <TableCell>
                                                {proposal.submitter?.first_name} {proposal.submitter?.last_name}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        proposal.status === 'approved'
                                                            ? 'default'
                                                            : proposal.status === 'rejected'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.get(route('proposals.manage.show', proposal.id));
                                                        }}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (proposal.status !== 'pending') {
                                                                        handleEdit(proposal);
                                                                    }
                                                                }}
                                                                disabled={proposal.status === 'pending'}
                                                                className={proposal.status === 'pending' ? 'opacity-50 cursor-not-allowed' : ''}
                                                            >
                                                                Edit
                                                            </DropdownMenuItem>
                                                            {proposal.status === 'pending' && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleApprove(proposal);
                                                                    }}>
                                                                        Approve
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleReject(proposal);
                                                                        }}
                                                                        className="text-red-600"
                                                                    >
                                                                        Reject
                                                                    </DropdownMenuItem>
                                                                </>
                                                            )}
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    if (proposal.status === 'rejected') {
                                                                        handleDelete(proposal);
                                                                    }
                                                                }}
                                                                disabled={proposal.status !== 'rejected'}
                                                                className={
                                                                    proposal.status === 'rejected' 
                                                                        ? 'text-red-600' 
                                                                        : 'text-red-600 opacity-50 cursor-not-allowed'
                                                                }
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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

                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === lastPage}
                                    >
                                        Next
                                    </Button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{Math.min((currentPage - 1) * proposals.per_page + 1, total)}</span> to{' '}
                                            <span className="font-medium">{Math.min(currentPage * proposals.per_page, total)}</span> of{' '}
                                            <span className="font-medium">{total}</span> results
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronsLeft className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="text-sm text-gray-700">
                                            Page {currentPage} of {lastPage}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === lastPage}
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => handlePageChange(lastPage)}
                                            disabled={currentPage === lastPage}
                                        >
                                            <ChevronsRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
                                    onClick={() => setShowDeleteDialog(false)}
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

                    <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Reject Proposal</DialogTitle>
                                <DialogDescription>
                                    Please provide a reason for rejecting this proposal.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Textarea
                                    placeholder="Enter rejection reason"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    rows={4}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setShowRejectDialog(false);
                                        setRejectionReason('');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={confirmReject}
                                    disabled={!rejectionReason.trim()}
                                >
                                    Reject Proposal
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
}