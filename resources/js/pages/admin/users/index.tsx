import { Head, router, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RoleFilter } from '@/components/role-filter';
import { UserActionsDropdown } from '@/components/user-actions-dropdown';
import AppLayout from '@/layouts/app-layout';
import { User } from '@/types';

type Props = {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
    };
    sort: 'role' | 'status';
    order: 'asc' | 'desc';
    roleFilter: string;
    search: string;
    flash?: {
        success: string | null;
        error: string | null;
    };
    auth: {
        user: User;
    };
};

const getRoleBadgeVariant = (role: 'superadmin' | 'admin' | 'user') => {
    switch (role) {
        case 'superadmin':
            return 'default' as const;
        case 'admin':
            return 'destructive' as const;
        case 'user':
            return 'secondary' as const;
        default:
            return 'default' as const;
    }
};

const breadcrumbs = [
    {
        title: 'User Management',
        href: route('admin.users.index'),
    }
];

export default function UserManagement({ users, sort, order, roleFilter, search = '', auth, flash = { success: null, error: null } }: Props) {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [action, setAction] = useState<'promote' | 'demote' | 'delete' | 'activate' | 'deactivate' | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [searchQuery, setSearchQuery] = useState(search);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }
        if (flash.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSort = (newSort: 'role' | 'status') => {
        const newOrder = sort === newSort && order === 'asc' ? 'desc' : 'asc';
        router.get(route('admin.users.index'), { sort: newSort, order: newOrder, role: roleFilter, search: searchQuery }, { preserveState: true });
    };

    const handleRoleFilter = (value: string) => {
        router.get(route('admin.users.index'), { sort, order, role: value, search: searchQuery }, { preserveState: true });
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { sort, order, role: roleFilter, search: searchQuery }, { preserveState: true });
    };

    const handleAction = (user: User, actionType: 'promote' | 'demote' | 'delete' | 'activate' | 'deactivate') => {
        setSelectedUser(user);
        setAction(actionType);
        setShowDialog(true);
    };

    const handleConfirm = () => {
        if (!selectedUser || !action) return;

        let url;
        let method: 'post' | 'delete' = 'post';

        switch (action) {
            case 'promote':
                url = route('admin.users.promote', { user: selectedUser.id });
                break;
            case 'demote':
                url = route('admin.users.demote', { user: selectedUser.id });
                break;
            case 'delete':
                url = route('admin.users.destroy', { user: selectedUser.id });
                method = 'delete';
                break;
            case 'activate':
            case 'deactivate':
                url = route('admin.users.toggle-activation', { user: selectedUser.id });
                break;
            default:
                return;
        }

        router[method](url, {}, {
            preserveScroll: true,
            onSuccess: () => {
                // Only clear state after successful action
                setShowDialog(false);
                setSelectedUser(null);
                setAction(null);
                if (method === 'delete') {
                    router.reload();
                }
            }
        });
    };

    const toggleActivation = (user: User) => {
        handleAction(user, user.is_active ? 'deactivate' : 'activate');
    };

    const handleEdit = (user: User) => {
        router.get(route('admin.users.edit', { user: user.id }));
    };

    return (
        <AppLayout user={auth.user} breadcrumbs={breadcrumbs}>
            <Head title="User Management" />

            <div className="container p-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <form onSubmit={handleSearch} className="flex items-center gap-2">
                            <Input
                                type="search"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-[300px]"
                            />
                            <Button type="submit">Search</Button>
                        </form>
                        <RoleFilter value={roleFilter} onChange={handleRoleFilter} />
                        <div className="flex gap-2">
                            <Button
                                variant={sort === 'role' ? 'default' : 'outline'}
                                onClick={() => handleSort('role')}
                                className="whitespace-nowrap"
                            >
                                Sort by Role {sort === 'role' && (order === 'asc' ? '↑' : '↓')}
                            </Button>
                            <Button
                                variant={sort === 'status' ? 'default' : 'outline'}
                                onClick={() => handleSort('status')}
                                className="whitespace-nowrap"
                            >
                                Sort by Status {sort === 'status' && (order === 'asc' ? '↑' : '↓')}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-card rounded-lg shadow">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Promoted By</th>
                                    <th className="px-6 py-3 text-right text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user) => (
                                    <tr key={user.id} className="border-b last:border-b-0">
                                        <td className="px-6 py-4 text-sm">
                                            {user.first_name} {user.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{user.email}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <Badge variant={user.is_active ? 'default' : 'secondary'}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {user.promoted_by ? `${user.promoted_by.first_name} ${user.promoted_by.last_name}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <UserActionsDropdown
                                                user={user}
                                                currentUser={auth.user}
                                                onToggleActivation={toggleActivation}
                                                onPromote={(user) => handleAction(user, 'promote')}
                                                onDemote={(user) => handleAction(user, 'demote')}
                                                onDelete={(user) => handleAction(user, 'delete')}
                                                onEdit={handleEdit}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Confirmation Dialog */}
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {action === 'promote' && 'Promote to Admin'}
                                {action === 'demote' && 'Demote to User'}
                                {action === 'delete' && 'Delete User'}
                                {action === 'activate' && 'Activate Account'}
                                {action === 'deactivate' && 'Deactivate Account'}
                            </DialogTitle>
                            <DialogDescription>
                                {action === 'promote' && 'Are you sure you want to promote this user to admin?'}
                                {action === 'demote' && 'Are you sure you want to demote this user to regular user?'}
                                {action === 'delete' && 'Are you sure you want to delete this user? This action cannot be undone.'}
                                {action === 'activate' && 'Are you sure you want to activate this user\'s account?'}
                                {action === 'deactivate' && 'Are you sure you want to deactivate this user\'s account?'}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                type="submit"
                                variant={action === 'delete' || action === 'deactivate' ? 'destructive' : 'default'}
                                onClick={handleConfirm}
                            >
                                Confirm
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {users.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <nav className="flex items-center space-x-2">
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === users.current_page ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get(route('admin.users.index', { page }))}
                                >
                                    {page}
                                </Button>
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}