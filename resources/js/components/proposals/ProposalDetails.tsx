import React from 'react';
import { Proposal } from '@/types';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';

interface Props {
  proposal: Proposal;
}

export function ProposalDetails({ proposal }: Props) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Badge className={getStatusColor(proposal.status)}>
          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
        </Badge>
        <Badge variant="outline">{proposal.category.name}</Badge>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">{proposal.title}</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{proposal.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500">Total Budget</div>
              <div className="text-2xl font-semibold flex items-center gap-1">
                <DollarSign className="h-5 w-5" />
                {Number(proposal.total_budget).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Funding Source</div>
              <div>{proposal.funding_source}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">Frequency</div>
              <div>{proposal.frequency}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">People Involved</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{proposal.people_involved}</p>
        </CardContent>
      </Card>

      {proposal.rejection_reason && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-lg text-red-600">Rejection Reason</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{proposal.rejection_reason}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 