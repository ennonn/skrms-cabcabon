import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type Proposal } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, ChevronLeft, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { router } from '@inertiajs/react';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    proposal: Proposal & {
        implementation_start_date?: string;
        implementation_end_date?: string;
        location?: string;
        target_participants?: number;
        estimated_cost?: number;
        objectives?: string | string[];
        expected_outcomes?: string | string[];
        documents?: {
            id: number;
            filename: string;
            created_at: string;
        }[];
        approved_by?: {
            first_name: string;
            last_name: string;
        };
        approval_date?: string;
        comments?: string;
    };
}

const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejected: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
};

export default function Show({ auth, proposal }: Props) {
    const StatusIcon = statusConfig[proposal.status].icon;

    const breadcrumbs = [
        {
            title: 'My Proposals',
            href: route('proposals.my.index'),
        },
        {
            title: 'Proposal Details',
            href: '#',
        },
    ];

    const handleDownloadDocument = (doc: any) => {
        if (!doc.url) {
            console.error('Document URL not available');
            return;
        }
        
        // Using fetch to trigger download with proper headers
        fetch(doc.url, {
            method: 'GET',
            credentials: 'same-origin',
        })
        .then(response => {
            // Get filename from Content-Disposition header or use the one we have
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = doc.filename;
            
            if (contentDisposition) {
                const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
                if (filenameMatch && filenameMatch[1]) {
                    filename = filenameMatch[1].replace(/['"]/g, '');
                }
            }
            
            return response.blob().then(blob => {
                // Create a download link and trigger it
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            });
        })
        .catch(error => {
            console.error('Download failed:', error);
        });
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title={`Proposal: ${proposal.title}`} />


            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-800">
                                    Proposal Details
                                </h2>
                                <Link href={route('proposals.my.index')}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <ChevronLeft className="h-4 w-4" />
                                        Back to My Proposals
                                    </Button>
                                </Link>
                            </div>

                            {/* Status Section */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Badge className={`${statusConfig[proposal.status].color} flex items-center gap-1.5`}>
                                            <StatusIcon className="h-4 w-4" />
                                            {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                                        </Badge>
                                        {proposal.submitter && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Submitted by: {proposal.submitter.first_name} {proposal.submitter.last_name}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-1">
                                            Created on: {formatDate(proposal.created_at)}
                                        </p>
                                    </div>
                                    
                                    {proposal.status === 'draft' && (
                                        <div className="flex gap-3">
                                            <Link href={route('proposals.my.edit', proposal.id)}>
                                                <Button variant="outline">Edit Proposal</Button>
                                            </Link>
                                            <Link 
                                                href={route('proposals.my.submit', proposal.id)} 
                                                method="post" 
                                                as="button"
                                            >
                                                <Button>Submit for Review</Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Basic Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold mb-2">Title</h4>
                                            <p className="text-lg">{proposal.title}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Category</h4>
                                            <p>{proposal.category.name}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2">Description</h4>
                                            <p className="whitespace-pre-wrap text-gray-600">{proposal.description}</p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Implementation Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Implementation Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Implementation Period</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">Start Date:</span>
                                                    <span className="text-gray-600">
                                                        {proposal.implementation_start_date 
                                                            ? formatDate(proposal.implementation_start_date)
                                                            : "Not Available"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">End Date:</span>
                                                    <span className="text-gray-600">
                                                        {proposal.implementation_end_date
                                                            ? formatDate(proposal.implementation_end_date)
                                                            : "Not Available"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-2">Location</h4>
                                            <p className="text-gray-600">{proposal.location || "Not specified"}</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">People Involved</h4>
                                                <p className="whitespace-pre-wrap text-gray-600">{proposal.people_involved}</p>
                                            </div>
                                            {proposal.target_participants && (
                                                <div>
                                                    <h4 className="font-semibold mb-2">Target Participants</h4>
                                                    <p className="text-gray-600">{proposal.target_participants} participants</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Budget Details */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Budget Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-2">Estimated Budget</h4>
                                                <p className="text-gray-600">₱{proposal.estimated_cost?.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Frequency</h4>
                                                <p className="text-gray-600">{proposal.frequency}</p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-2">Funding Source</h4>
                                                <p className="text-gray-600">{proposal.funding_source}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Objectives & Outcomes */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Objectives & Expected Outcomes</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div>
                                            <h4 className="font-semibold mb-3">Objectives</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="whitespace-pre-wrap text-gray-600">
                                                    {Array.isArray(proposal.objectives) 
                                                        ? proposal.objectives.join('\n') 
                                                        : proposal.objectives}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-3">Expected Outcomes</h4>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <p className="whitespace-pre-wrap text-gray-600">
                                                    {Array.isArray(proposal.expected_outcomes) 
                                                        ? proposal.expected_outcomes.join('\n') 
                                                        : proposal.expected_outcomes}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Documents */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Documents</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {proposal.documents && proposal.documents.length > 0 ? (
                                            <div className="space-y-4">
                                                {proposal.documents.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="h-5 w-5 text-gray-500" />
                                                            <div>
                                                                <p className="font-medium">{doc.filename}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    Uploaded on {formatDate(doc.created_at)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownloadDocument(doc)}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No documents attached to this proposal.</p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}