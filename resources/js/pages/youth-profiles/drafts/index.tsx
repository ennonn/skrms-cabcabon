import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { formatDate, calculateAge } from '@/lib/utils';
import { DraftYouthProfile } from '@/types/index';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

interface Props {
    records: DraftYouthProfile[];
}

const breadcrumbs = [
    {
        title: 'Draft Youth Profiles',
        href: route('youth-profiles.drafts.index'),
    },
];

export default function DraftYouthProfiles({ records = [] }: Props) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSubmit = (profile: DraftYouthProfile) => {
        router.post(route('youth-profiles.drafts.submit', { draft: profile.id }), {}, {
            onSuccess: () => {
                toast.success('Profile submitted for approval');
                router.reload();
            },
            onError: (errors) => {
                console.error('Submit error:', errors);
                toast.error('Failed to submit profile. Please try again.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={user}>
            <Head title="Draft Youth Profiles" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <Input
                                        type="search"
                                        placeholder="Search youth profiles..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="max-w-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="default"
                                        onClick={() => window.location.href = route('youth-profiles.drafts.create')}
                                    >
                                        Create New Youth Profile
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Age</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date Created</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {(!records || records.length === 0) ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                                    No draft youth profiles found.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            records.map((record) => (
                                                <TableRow key={record.id}>
                                                    <TableCell>{record.full_name}</TableCell>
                                                    <TableCell>{calculateAge(record.birthdate)}</TableCell>
                                                    <TableCell>{record.status}</TableCell>
                                                    <TableCell>{formatDate(record.created_at)}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Link href={route('youth-profiles.drafts.show', record.id)}>
                                                                <Button variant="outline" size="sm">
                                                                    View Details
                                                                </Button>
                                                            </Link>
                                                            {record.status === 'draft' && (
                                                                <>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => window.location.href = route('youth-profiles.drafts.edit', record.id)}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        variant="default"
                                                                        size="sm"
                                                                        onClick={() => handleSubmit(record)}
                                                                    >
                                                                        Submit
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {record.status === 'rejected' && (
                                                                <Button
                                                                    variant="default"
                                                                    size="sm"
                                                                    onClick={() => window.location.href = route('youth-profiles.drafts.create', { copy_from: record.id })}
                                                                >
                                                                    Create New Draft
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 