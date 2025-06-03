import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    user: {
        email: string;
        [key: string]: any;
    };
}

export default ({ children, breadcrumbs, auth, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} auth={auth} {...props}>
        {children}
    </AppLayoutTemplate>
);
