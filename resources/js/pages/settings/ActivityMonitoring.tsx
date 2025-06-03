import { Head } from '@inertiajs/react';
import { Activity } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
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
];

export default function ActivityMonitoring() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Monitoring" />

            <div className="container mx-auto py-6">
                <PageHeader
                    title="Activity Monitoring"
                    subtitle="Monitor system activities and user actions"
                    icon={Activity}
                />

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activities</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Coming soon: Activity logs and monitoring features will be available here.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 