import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Proposal } from '@/types';
import { ProposalForm } from '@/components/proposals/proposal-form';

interface Props {
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
  categories: any[];
  proposal: Proposal;
}

export default function EditProposal({ auth, categories, proposal }: Props) {
  return (
    <AppLayout auth={auth}>
      <Head title="Edit Proposal" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Edit Proposal
              </h2>

              <ProposalForm
                categories={categories}
                proposal={proposal}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 