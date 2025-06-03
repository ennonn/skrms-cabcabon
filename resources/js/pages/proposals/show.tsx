import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Proposal } from '@/types';
import { ProposalDetails } from '@/components/proposals/ProposalDetails';
import { Button } from '@/components/ui/button';

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  proposal: Proposal;
}

export default function ShowProposal({ auth, proposal }: Props) {
  const breadcrumbs = [
    {
      title: 'Proposals',
      href: route('proposals.index'),
    },
    {
      title: 'Proposal Details',
      href: '#',
    },
  ];

  return (
    <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
      <Head title={`Proposal: ${proposal.title}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Proposal Details
                </h2>
                <div className="flex gap-4">
                  {auth.user.id === proposal.submitter?.id && proposal.status === 'rejected' && (
                    <Link href={route('proposals.my.edit', proposal.id)}>
                    </Link>
                  )}
                  <Link href={route('proposals.my.index')}>
                    <Button variant="outline">Back to My Proposals</Button>
                  </Link>
                </div>
              </div>

              <ProposalDetails proposal={proposal} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 