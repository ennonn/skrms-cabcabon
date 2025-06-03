import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { Activity, ArrowLeft, Globe, User } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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

type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
};

type Log = {
    id: number;
    user: User;
    action: string;
    model_type: string;
    model_id: number;
    details: {
        old_values: Record<string, any>;
        new_values: Record<string, any>;
        additional: Record<string, any>;
    };
    ip_address: string;
    user_agent: string;
    created_at: string;
    subject: any;
};

type Props = {
    log: Log;
};

export default function ActivityLogDetail({ log }: Props) {
    const getActionBadgeVariant = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return 'default';
            case 'updated':
                return 'secondary';
            case 'deleted':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatValue = (value: any) => {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'object') return JSON.stringify(value, null, 2);
        return value.toString();
    };

    const renderChanges = () => {
        if (log.action === 'updated' && log.details.old_values && log.details.new_values) {
            const changes = [];
            for (const key in log.details.new_values) {
                if (log.details.old_values[key] !== log.details.new_values[key]) {
                    changes.push(
                        <div key={key} className="mb-4 rounded-lg border p-4">
                            <h4 className="mb-2 font-medium">{key}</h4>
                            <div className="grid gap-2 text-sm">
                                <div className="text-red-500">
                                    - {formatValue(log.details.old_values[key])}
                                </div>
                                <div className="text-green-500">
                                    + {formatValue(log.details.new_values[key])}
                                </div>
                            </div>
                        </div>
                    );
                }
            }
            return changes;
        }
        return null;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Log Details" />

            <div className="container py-6">
                <div className="mb-6">
                    <Button variant="outline" onClick={() => window.history.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Activity Logs
                    </Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Activity Log Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-bold">
                                            {log.model_type ? log.model_type.split('\\').pop() : 'Unknown'} #{log.model_id}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(log.created_at), 'PPpp')}
                                        </p>
                                    </div>
                                    <Badge variant={getActionBadgeVariant(log.action)}>
                                        {log.action}
                                    </Badge>
                                </div>

                                <div className="grid gap-4 rounded-lg border p-4">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">User:</span>
                                        <span>
                                            {log.user.first_name} {log.user.last_name} ({log.user.email})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4" />
                                        <span className="font-medium">IP Address:</span>
                                        <span>{log.ip_address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        <span className="font-medium">User Agent:</span>
                                        <span className="text-sm">{log.user_agent}</span>
                                    </div>
                                </div>

                                {log.details.additional && (
                                    <div className="rounded-lg border p-4">
                                        <h3 className="mb-2 font-medium">Additional Details</h3>
                                        <pre className="whitespace-pre-wrap text-sm">
                                            {JSON.stringify(log.details.additional, null, 2)}
                                        </pre>
                                    </div>
                                )}

                                {renderChanges()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 