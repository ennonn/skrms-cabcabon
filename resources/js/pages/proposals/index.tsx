import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Proposal } from '@/types';

interface PageProps {
    auth: {
        user: any;
    };
    proposals: Proposal[];
}

export default function ProposalsIndex({ auth, proposals = [] }: PageProps) {
    console.log('Proposals data:', proposals);
    console.log('Proposals type:', typeof proposals);
    console.log('Is Array:', Array.isArray(proposals));

    const proposalsList = Array.isArray(proposals) ? proposals : [];

    return (
        <AppLayout>
            <Head title="Proposals" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            My Proposals
                        </h2>
                        <Link href={route('proposals.create')}>
                            <Button>
                                Create New Proposal
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {proposalsList.map((proposal) => (
                            <Card key={proposal.id} className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium">
                                            <Link 
                                                href={route('proposals.show', proposal.id)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {proposal.title}
                                            </Link>
                                        </h3>
                                        <div className="mt-1 text-sm text-gray-500">
                                            Category: {proposal.category.name}
                                        </div>
                                        <div className="mt-1 text-sm text-gray-500">
                                            Created: {new Date(proposal.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            proposal.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                        </span>
                                        <Link 
                                            href={route('proposals.edit', proposal.id)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {proposalsList.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No proposals found.</p>
                                <Link href={route('proposals.create')} className="mt-4 inline-block">
                                    <Button>
                                        Create Your First Proposal
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 