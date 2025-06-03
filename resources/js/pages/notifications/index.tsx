import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth';
import { Link, Head, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Notifications',
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

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    notifications: PaginatedNotifications;
    flash?: {
        success?: string;
        error?: string;
    };
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

export default function NotificationsIndex({ notifications, flash }: Props) {
    const { user } = useAuth();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
    const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

    // Handle flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleMarkAsRead = (id: string) => {
        router.post(route('notifications.mark-as-read', { notification: id }), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Notification marked as read');
            },
        });
    };

    const handleMarkAllAsRead = () => {
        router.post(route('notifications.mark-all-as-read'), {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('All notifications marked as read');
            },
        });
    };

    const handleDeleteClick = (id: string) => {
        setNotificationToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (notificationToDelete) {
            router.delete(route('notifications.delete', { notification: notificationToDelete }), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Notification deleted');
                    setDeleteDialogOpen(false);
                },
            });
        }
    };

    const handleDeleteAllClick = () => {
        setDeleteAllDialogOpen(true);
    };

    const handleDeleteAllConfirm = () => {
        router.delete(route('notifications.delete-all'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('All notifications deleted');
                setDeleteAllDialogOpen(false);
            },
        });
    };

    const handleViewDetails = (notification: Notification) => {
        router.get(route('notifications.show', { notification: notification.id }));
    };

    return (
        <AppLayout user={user} breadcrumbs={breadcrumbs}>
            <Head title="Notifications" />

            <div className="container p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleMarkAllAsRead} variant="outline">
                            Mark All as Read
                        </Button>
                        <Button onClick={handleDeleteAllClick} variant="destructive">
                            Delete All
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Your Notifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Read Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {notifications.data.map((notification) => (
                                    <TableRow key={notification.id}>
                                        <TableCell>
                                            {getNotificationTitle(notification)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {getNotificationType(notification.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={notification.type.includes('Approved') ? 'default' : 'destructive'}
                                            >
                                                {getNotificationStatus(notification)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={notification.read_at ? 'secondary' : 'default'}>
                                                {notification.read_at ? 'Read' : 'Unread'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(notification)}
                                                >
                                                    View Details
                                                </Button>
                                                {!notification.read_at && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                    >
                                                        Mark as Read
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(notification.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {notifications.last_page > 1 && (
                            <div className="mt-6 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === notifications.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => router.get(route('notifications.index', { page }))}
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Notification</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete this notification? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteConfirm}>
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={deleteAllDialogOpen} onOpenChange={setDeleteAllDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete All Notifications</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to delete all notifications? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteAllDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDeleteAllConfirm}>
                                Delete All
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
} 