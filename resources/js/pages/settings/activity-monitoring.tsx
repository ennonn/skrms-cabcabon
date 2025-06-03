import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { 
    Activity,
    AlertCircle,
    ArrowUpDown,
    Calendar,
    ChevronDown,
    FileText,
    Trash2,
    User,
    UserPlus,
    CheckCircle,
    XCircle,
    ArrowUpCircle,
    ArrowDownCircle,
    UserCheck,
    UserX
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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
};

type Props = {
    logs: {
        data: Log[];
        current_page: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: {
        type?: string;
        user_id?: string;
        date_from?: string;
        date_to?: string;
        model_type?: string;
    };
    users: User[];
    modelTypes: Array<{ value: string; label: string }>;
    actionTypes: Array<{ value: string; label: string }>;
};

export default function ActivityMonitoring({ logs, filters, users, modelTypes, actionTypes }: Props) {
    const getActionIcon = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
                return <UserPlus className="h-4 w-4" />;
            case 'updated':
                return <Activity className="h-4 w-4" />;
            case 'deleted':
                return <Trash2 className="h-4 w-4" />;
            case 'submitted_profile':
            case 'submitted_proposal':
                return <FileText className="h-4 w-4" />;
            case 'approved_profile':
            case 'approved_proposal':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected_profile':
            case 'rejected_proposal':
                return <XCircle className="h-4 w-4" />;
            case 'promoted_user':
                return <ArrowUpCircle className="h-4 w-4" />;
            case 'demoted_user':
                return <ArrowDownCircle className="h-4 w-4" />;
            case 'activated_user':
                return <UserCheck className="h-4 w-4" />;
            case 'deactivated_user':
                return <UserX className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getActionBadgeVariant = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created':
            case 'submitted_profile':
            case 'submitted_proposal':
                return 'default';
            case 'updated':
                return 'secondary';
            case 'approved_profile':
            case 'approved_proposal':
            case 'activated_user':
            case 'promoted_user':
                return 'success';
            case 'rejected_profile':
            case 'rejected_proposal':
            case 'deleted':
            case 'deactivated_user':
            case 'demoted_user':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatActionLabel = (action: string) => {
        return action
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            route('settings.activity-monitoring'),
            { ...filters, [key]: value },
            { preserveState: true }
        );
    };

    const handleResetFilters = () => {
        router.get(route('settings.activity-monitoring'), {});
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Monitoring" />

            <div className="container py-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Activity Logs</CardTitle>
                                <Button variant="outline" onClick={handleResetFilters}>
                                    Reset Filters
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6 grid gap-4 md:grid-cols-5">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Action Type</Label>
                                    <Select
                                        value={filters.type}
                                        onValueChange={(value) => handleFilterChange('type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select action" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {actionTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="user_id">User</Label>
                                    <Select
                                        value={filters.user_id}
                                        onValueChange={(value) => handleFilterChange('user_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem key={user.id} value={user.id.toString()}>
                                                    {user.first_name} {user.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="model_type">Record Type</Label>
                                    <Select
                                        value={filters.model_type}
                                        onValueChange={(value) => handleFilterChange('model_type', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modelTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_from">Date From</Label>
                                    <Input
                                        id="date_from"
                                        type="date"
                                        value={filters.date_from}
                                        onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_to">Date To</Label>
                                    <Input
                                        id="date_to"
                                        type="date"
                                        value={filters.date_to}
                                        onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>User</TableHead>
                                            <TableHead>Action</TableHead>
                                            <TableHead>Record Type</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead>IP Address</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.data.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                {format(new Date(log.created_at), 'MMM d, yyyy')}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {format(new Date(log.created_at), 'PPpp')}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <User className="mr-2 h-4 w-4" />
                                                        <span>{log.user.first_name} {log.user.last_name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={getActionBadgeVariant(log.action)}>
                                                        <span className="flex items-center gap-1">
                                                            {getActionIcon(log.action)}
                                                            {formatActionLabel(log.action)}
                                                        </span>
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {log.model_type ? log.model_type.split('\\').pop() : 'Unknown'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.get(route('settings.activity-monitoring.show', log.id))}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                                <TableCell>{log.ip_address}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {logs.last_page > 1 && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    {logs.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 