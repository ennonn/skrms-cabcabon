import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

interface AppSidebarLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    auth?: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AppSidebarLayout({ children, breadcrumbs = [], auth }: AppSidebarLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar auth={auth} />
            <AppContent variant="sidebar">
                <AppSidebarHeader breadcrumbs={breadcrumbs} auth={auth} />
                {children}
            </AppContent>
        </AppShell>
    );
}
