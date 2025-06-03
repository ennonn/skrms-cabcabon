import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Proposal } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, MapPin, Users } from 'lucide-react';

interface Props {
    proposal: Proposal;
}

export function ProposalCard({ proposal }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'approved':
                return 'bg-green-500';
            case 'rejected':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="space-y-1">
                <div className="flex justify-between items-start">
                    <Badge className={getStatusColor(proposal.status)}>
                        {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{proposal.category.name}</Badge>
                </div>
                <CardTitle className="line-clamp-2">{proposal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                    {proposal.description}
                </p>
                
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {formatDate(proposal.implementation_start_date)} - {formatDate(proposal.implementation_end_date)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{proposal.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{proposal.target_participants} participants</span>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="text-sm font-medium">Total Budget</div>
                    <div className="text-lg font-semibold">
                        ₱{Number(proposal.total_budget).toLocaleString()}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="w-full">
                    {proposal.status === 'draft' ? (
                        <div className="flex gap-2">
                            <Button
                                asChild
                                className="flex-1"
                            >
                                <Link href={route('proposals.edit', proposal.id)}>
                                    Edit Draft
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                className="flex-1"
                            >
                                <Link
                                    href={route('proposals.submit', proposal.id)}
                                    method="post"
                                    as="button"
                                >
                                    Submit
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <Button
                            asChild
                            variant="secondary"
                            className="w-full"
                        >
                            <Link href={route('proposals.show', proposal.id)}>
                                View Details
                            </Link>
                        </Button>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
} 