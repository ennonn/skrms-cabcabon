import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Proposal, ProposalCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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

export default function AdminProposalList({ auth, proposals, categories }: Props) {
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

    return (
        <AppLayout auth={auth}>
            <Head title="Manage Proposals" />

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
                                            <td className="py-3 px-4">{proposal.category.name}</td>
                                            <td className="py-3 px-4">{proposal.submitter.name}</td>
                                            <td className="py-3 px-4">
                                                <Badge className={getStatusColor(proposal.status)}>
                                                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(proposal.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => window.location.href = route('proposals.show', proposal.id)}
                                                    >
                                                        View Details
                                                    </Button>
                                                    {proposal.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                variant="default"
                                                                size="sm"
                                                                onClick={() => window.location.href = route('proposals.approve', proposal.id)}
                                                            >
                                                                Approve
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => window.location.href = route('proposals.reject', proposal.id)}
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