import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useAuth } from '@/hooks/auth';
import { 
    LayoutGrid, 
    Bell, 
    FileText, 
    ClipboardCheck, 
    PenTool, 
    Users, 
    Settings, 
    Activity, 
    Download,
    BarChart2,
    FileSpreadsheet,
    FileCheck2,
    CheckCircle2,
    FilePlus2,
    UserCheck,
    Info,
    Webhook,
    ClipboardList
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
    {
        title: 'Looker Visualization',
        href: route('charts.index'),
        icon: BarChart2,
    },
    {
        title: 'Notifications',
        href: route('notifications.index'),
        icon: Bell,
    },
];

const youthProfileItems: NavItem[] = [
    {
        title: 'Approved Profiles',
        href: route('youth-profiles.records.index'),
        icon: UserCheck,
    },
    {
        title: 'Pending Profiles',
        href: route('youth-profiles.pending.index'),
        icon: FileText,
    },
    {
        title: 'My Youth Profile Drafts',
        href: route('youth-profiles.drafts.index'),
        icon: PenTool,
    },
    {
        title: 'Manage Profiles',
        href: route('youth-profiles.manage'),
        icon: ClipboardCheck,
        adminOnly: true,
    },
];

const proposalItems: NavItem[] = [
    {
        title: 'Approved Proposals',
        href: route('proposals.records.index'),
        icon: CheckCircle2,
    },
    
    {
        title: 'Pending Proposals',
        href: route('proposals.pending'),
        icon: FileText,
    },
    {
        title: 'My Proposals',
        href: route('proposals.my.index'),
        icon: FileSpreadsheet,
    },

    {
        title: 'Manage Proposals',
        href: route('proposals.manage.index'),
        icon: ClipboardList,
        active: route().current('proposals.manage.*'),
        adminOnly: true,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'User Management',
        href: route('admin.users.index'),
        icon: Users,
    },
   
    {
        title: 'Admin Dashboard',
        href: route('admin.dashboard'),
        icon: LayoutGrid,
    },

    {
        title: 'Zapier Settings',
        href: route('system.zapier-settings'),
        icon: Webhook,
    },
    {
        title: 'About',
        href: '/about',
        icon: Info,
    },
];

const footerItems: NavItem[] = [];

export function AppSidebar() {
    const { user, isAdmin, isSuperAdmin } = useAuth();

    const filterAdminOnlyItems = (items: NavItem[]) => {
        return items.filter(item => !item.adminOnly || (isAdmin || isSuperAdmin));
    };

    return (
        <Sidebar>
            <SidebarHeader>
                <AppLogo />
            </SidebarHeader>
            <SidebarContent className="space-y-4">
                <NavMain items={mainNavItems} />
                <NavMain items={filterAdminOnlyItems(youthProfileItems)} />
                <NavMain items={filterAdminOnlyItems(proposalItems)} />
                {(isAdmin || isSuperAdmin) && (
                    <NavMain items={adminNavItems} />
                )}
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
                <NavFooter items={footerItems} />
            </SidebarFooter>
        </Sidebar>
    );
}
