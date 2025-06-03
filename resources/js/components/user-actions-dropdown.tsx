import { AlertCircle, CheckCircle, MoreHorizontal, Pencil, Shield, ShieldOff, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type User } from '@/types';

interface UserActionsDropdownProps {
    user: User;
    currentUser: User;
    onToggleActivation: (user: User) => void;
    onPromote: (user: User) => void;
    onDemote: (user: User) => void;
    onDelete: (user: User) => void;
    onEdit: (user: User) => void;
}

export function UserActionsDropdown({
    user,
    currentUser,
    onToggleActivation,
    onPromote,
    onDemote,
    onDelete,
    onEdit,
}: UserActionsDropdownProps) {
    const isAdmin = user.role === 'admin';
    const isActive = user.is_active;
    const isSuperAdmin = user.role === 'superadmin';
    const isCurrentUser = user.id === currentUser.id;
    const cannotModify = isSuperAdmin || isCurrentUser;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={cannotModify}>
                    {cannotModify ? 'No Actions Available' : 'Actions'}
                </Button>
            </DropdownMenuTrigger>
            {!cannotModify && (
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {isAdmin ? (
                            <DropdownMenuItem onClick={() => onDemote(user)}>
                                Demote to User
                                <DropdownMenuShortcut>⇧⌘U</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => onPromote(user)}>
                                Promote to Admin
                                <DropdownMenuShortcut>⇧⌘A</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        {isActive ? (
                            <DropdownMenuItem onClick={() => onToggleActivation(user)}>
                                Deactivate Account
                                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={() => onToggleActivation(user)}>
                                Activate Account
                                <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(user)}>
                        Edit
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => onDelete(user)} 
                        className="text-red-500"
                    >
                        Delete
                        <DropdownMenuShortcut className="text-red-500">⌘⌫</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
} 