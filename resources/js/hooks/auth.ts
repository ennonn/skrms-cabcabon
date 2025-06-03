import { usePage } from '@inertiajs/react';
import { User } from '@/types';

export function useAuth() {
    const { auth } = usePage().props;
    const user = auth.user as User;

    return {
        user,
        isAdmin: user.role === 'admin' || user.role === 'superadmin',
        isSuperAdmin: user.role === 'superadmin',
    };
} 