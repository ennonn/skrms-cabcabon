import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifications',
        href: route('notifications.index'),
    },
    {
        title: 'Details',
        href: '#',
    },
];

interface Notification {
    id: string;
    type: string;
    data: {
        message: string;
        action_url?: string;
        proposal_id?: number;
        title?: string;
        notes?: string;
        rejection_reason?: string;
    };
    read_at: string | null;
    created_at: string;
}

interface Props {
    notification: Notification;
}

const getNotificationType = (type: string): string => {
    if (type.includes('ProfileApproved') || type.includes('ProfileRejected')) {
        return 'Youth Profile';
    }
    if (type.includes('ProposalApproved') || type.includes('ProposalRejected')) {
        return 'Proposal';
    }
    return 'System';
};

const getNotificationStatus = (notification: Notification): string => {
    if (notification.type.includes('Approved')) {
        return 'Approved';
    }
    if (notification.type.includes('Rejected')) {
        return 'Rejected';
    }
    return 'Updated';
};

const getNotificationTitle = (notification: Notification): string => {
    if (notification.type.includes('Proposal')) {
        // Extract title from message (e.g., 'Your proposal "Title Here" has been approved/rejected')
        const match = notification.data.message.match(/"([^"]+)"/);
        return match ? match[1] : 'Unknown Proposal';
    }
    return 'Youth Profile';
};

const getNotificationDetails = (notification: Notification): string => {
    if (notification.type.includes('Profile')) {
        return notification.data.notes || '';
    }
    if (notification.type.includes('Proposal')) {
        return notification.data.rejection_reason || '';
    }
    return '';
};

export default function NotificationShow({ notification }: Props) {
    const { user } = useAuth();

    const handleBack = () => {
        router.get(route('notifications.index'));
    };

    const notificationType = getNotificationType(notification.type);
    const status = getNotificationStatus(notification);
    const title = getNotificationTitle(notification);
    const details = getNotificationDetails(notification);

    return (
        <AppLayout user={user} breadcrumbs={breadcrumbs}>
            <Head title="Notification Details" />

            <div className="container p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Notification Details</h1>
                    <Button onClick={handleBack} variant="outline">
                        Back to Notifications
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                                <Badge variant="outline" className="mt-1">
                                    {notificationType}
                                </Badge>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                <Badge 
                                    variant={status === 'Approved' ? 'default' : 'destructive'}
                                    className="mt-1"
                                >
                                    {status}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
                            <p className="text-lg mt-1">{title}</p>
                        </div>

                        {details && (
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    {status === 'Rejected' ? 'Rejection Reason' : 'Notes'}
                                </h3>
                                <p className="text-lg mt-1">{details}</p>
                            </div>
                        )}

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                            <p className="text-lg mt-1">
                                {format(new Date(notification.created_at), 'PPpp')}
                            </p>
                        </div>

                        {notification.data.action_url && (
                            <div className="pt-4">
                                <Button onClick={() => router.get(notification.data.action_url!)}>
                                    View {notificationType}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 