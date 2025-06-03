import { Head } from '@inertiajs/react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Activity Monitoring',
        href: '/settings/activity-monitoring',
    },
    {
        title: 'Log Details',
        href: '#',
    },
];

type Log = {
    id: number;
    type: string;
    description: string;
    subject_type: string;
    subject_id: number;
    causer_type: string;
    causer_id: number;
    properties: Record<string, any>;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    subject: {
        id: number;
        name: string;
    };
};

type Props = {
    log: Log;
};

export default function ActivityLogDetail({ log }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log Details" />

            <div className="container py-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Log Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4">
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Type</dt>
                                    <dd className="text-sm">{log.type}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                                    <dd className="text-sm">{log.description}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">User</dt>
                                    <dd className="text-sm">{log.user.name}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Subject</dt>
                                    <dd className="text-sm">{log.subject.name}</dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Date</dt>
                                    <dd className="text-sm">
                                        {format(new Date(log.created_at), 'PPpp')}
                                    </dd>
                                </div>
                                <div className="grid gap-1">
                                    <dt className="text-sm font-medium text-muted-foreground">Properties</dt>
                                    <dd className="text-sm">
                                        <pre className="whitespace-pre-wrap">
                                            {JSON.stringify(log.properties, null, 2)}
                                        </pre>
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button asChild>
                            <a href="/settings/activity-monitoring">Back to Activity Logs</a>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 