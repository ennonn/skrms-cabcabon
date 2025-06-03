import { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Auth, type Proposal, type ProposalCategory } from '@/types/index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Calendar, ChevronDown, ArrowUpDown } from 'lucide-react';
import * as _ from 'lodash';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

const breadcrumbs = [
    {
        title: 'Pending Proposals',
        href: '/#',
    },
];
interface Props {
    auth: Auth;
  proposals: {
        data: Proposal[];
    links: any;
        current_page: number;
        last_page: number;
  };
    categories?: ProposalCategory[];
    filters?: {
        search?: string;
        category?: string;
        budget_range?: string;
        start_date?: string;
        end_date?: string;
        sort_by?: string;
    };
}

type BudgetRange = 'all' | 'under5k' | '5k-10k' | '10k-25k' | '25k-50k' | '50k-100k' | '100kplus';
type SortOrder = 'title_asc' | 'budget_asc' | 'budget_desc' | 'date_asc' | 'date_desc';

export default function PendingProposals({ auth, proposals, categories = [], filters = {} }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<string>(filters.category || 'all');
    const [searchQuery, setSearchQuery] = useState<string>(filters.search || '');
    const [budgetRange, setBudgetRange] = useState<BudgetRange>(filters.budget_range as BudgetRange || 'all');
    const [sortBy, setSortBy] = useState<SortOrder>((filters.sort_by as SortOrder) || 'title_asc');
    const [currentPage, setCurrentPage] = useState(proposals.current_page || 1);
    const [startDate, setStartDate] = useState<Date | undefined>(
        filters.start_date ? new Date(filters.start_date) : undefined
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        filters.end_date ? new Date(filters.end_date) : undefined
    );
    
    // Ensure proposals is always an array
    let proposalsList = proposals?.data ?? [];

    // Create a debounced search function
    const debouncedSearch = _.debounce((value: string) => {
        // Reset to page 1 when searching
        setCurrentPage(1);
        
        router.get(route('proposals.pending'), {
            search: value,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            budget_range: budgetRange !== 'all' ? budgetRange : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
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
        
        router.get(route('proposals.pending'), {
            search: searchQuery,
            category: value !== 'all' ? value : undefined,
            budget_range: budgetRange !== 'all' ? budgetRange : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1, // Always go back to page 1 when changing category
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleBudgetRangeChange = (value: BudgetRange) => {
        setBudgetRange(value);
        
        // Reset to page 1 when changing budget range
        setCurrentPage(1);
        
        router.get(route('proposals.pending'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            budget_range: value !== 'all' ? value : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: sortBy,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleSortChange = (value: SortOrder) => {
        setSortBy(value);
        
        router.get(route('proposals.pending'), {
            search: searchQuery,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            budget_range: budgetRange !== 'all' ? budgetRange : undefined,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
            sort_by: value,
            page: currentPage,
        }, {
            preserveState: true,
            preserveScroll: true,
            only: ['proposals'],
        });
    };

    const handleStartDateChange = (date: Date | undefined) => {
        setStartDate(date);
        
        // Only update if we have an actual date or we're clearing the filter
        if (date || startDate) {
            // Reset to page 1 when changing start date
            setCurrentPage(1);
            
            router.get(route('proposals.pending'), {
                search: searchQuery,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                budget_range: budgetRange !== 'all' ? budgetRange : undefined,
                start_date: date ? format(date, 'yyyy-MM-dd') : undefined,
                end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
                sort_by: sortBy,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['proposals'],
            });
        }
    };

    const handleEndDateChange = (date: Date | undefined) => {
        setEndDate(date);
        
        // Only update if we have an actual date or we're clearing the filter
        if (date || endDate) {
            // Reset to page 1 when changing end date
            setCurrentPage(1);
            
            router.get(route('proposals.pending'), {
                search: searchQuery,
                category: selectedCategory !== 'all' ? selectedCategory : undefined,
                budget_range: budgetRange !== 'all' ? budgetRange : undefined,
                start_date: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
                end_date: date ? format(date, 'yyyy-MM-dd') : undefined,
                sort_by: sortBy,
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['proposals'],
            });
        }
    };

    // Helper function to format budget
    const formatBudget = (amount?: number) => {
        if (!amount) return "₱0";
        return `₱${amount.toLocaleString()}`;
    };

    const goToPage = (page: number) => {
        setCurrentPage(page);
        router.get(route('proposals.pending'), {
            search: searchQuery || undefined,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            budget_range: budgetRange !== 'all' ? budgetRange : undefined,
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

  return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
      <Head title="Pending Proposals" />

            <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-wrap">
                                    {categories.length > 0 && (
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
                                    )}

                                    <Select value={budgetRange} onValueChange={handleBudgetRangeChange}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Budget Range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Budgets</SelectItem>
                                            <SelectItem value="under5k">Under ₱5,000</SelectItem>
                                            <SelectItem value="5k-10k">₱5,000 - ₱10,000</SelectItem>
                                            <SelectItem value="10k-25k">₱10,000 - ₱25,000</SelectItem>
                                            <SelectItem value="25k-50k">₱25,000 - ₱50,000</SelectItem>
                                            <SelectItem value="50k-100k">₱50,000 - ₱100,000</SelectItem>
                                            <SelectItem value="100kplus">₱100,000+</SelectItem>
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
                                        <TableHead>Submitter</TableHead>
                                        <TableHead>Estimated Budget</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {proposalsList.map((proposal) => (
                                        <TableRow key={proposal.id}>
                                            <TableCell className="font-medium">{proposal.title}</TableCell>
                                            <TableCell>{proposal.category.name}</TableCell>
                                            <TableCell>
                                                {proposal.submitter?.first_name} {proposal.submitter?.last_name}
                                            </TableCell>
                                            <TableCell>{formatBudget(proposal.estimated_cost)}</TableCell>
                                            <TableCell>
                                                <Link href={route('proposals.pending.show', proposal.id)}>
                                                    <Button size="sm" variant="outline">
                                                    View Details
                                                </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {proposalsList.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No pending proposals found.</p>
                                </div>
                            )}

                            {proposals.last_page > 1 && (
                                <div className="flex justify-between items-center mt-6">
                                    <div className="text-sm text-gray-500">
                                        Showing 1 to {proposalsList.length} of {proposalsList.length * proposals.last_page} results
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
    </AppLayout>
  );
} 