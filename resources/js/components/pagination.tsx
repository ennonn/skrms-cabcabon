import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, total, perPage, onPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            {/* Mobile pagination */}
            <div className="flex flex-1 justify-between sm:hidden">
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === lastPage}
                >
                    Next
                </Button>
            </div>

            {/* Desktop pagination */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">
                            {((currentPage - 1) * perPage) + 1}
                        </span>{' '}
                        to{' '}
                        <span className="font-medium">
                            {Math.min(currentPage * perPage, total)}
                        </span>{' '}
                        of{' '}
                        <span className="font-medium">{total}</span>{' '}
                        results
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {/* First Page */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-l-md"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        
                        {/* Previous Page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {/* Page Numbers */}
                        {[...Array(lastPage)].map((_, index) => {
                            const page = index + 1;
                            
                            // Always show first page, last page, current page, and pages around current page
                            if (
                                page === 1 ||
                                page === lastPage ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        onClick={() => onPageChange(page)}
                                        className="hidden sm:inline-flex"
                                    >
                                        {page}
                                    </Button>
                                );
                            }
                            
                            // Show ellipsis
                            if (
                                page === 2 && currentPage > 3 ||
                                page === lastPage - 1 && currentPage < lastPage - 2
                            ) {
                                return (
                                    <Button
                                        key={page}
                                        variant="outline"
                                        disabled
                                        className="hidden sm:inline-flex"
                                    >
                                        ...
                                    </Button>
                                );
                            }
                            
                            return null;
                        })}

                        {/* Next Page */}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Last Page */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-r-md"
                            onClick={() => onPageChange(lastPage)}
                            disabled={currentPage === lastPage}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </nav>
                </div>
            </div>
        </div>
    );
} 