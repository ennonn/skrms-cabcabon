import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';

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
        title: 'Data Export',
        href: '/settings/data-export',
    },
];

export default function DataExport() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Export" />

            <div className="container mx-auto py-6">
                <PageHeader
                    title="Data Export"
                    subtitle="Export system data and reports"
                    icon={Download}
                />

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Options</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Coming soon: Data export options and report generation features will be available here.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 