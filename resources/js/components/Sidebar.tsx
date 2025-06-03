import { InformationCircleIcon, ChartBarIcon, HomeIcon, UserGroupIcon, DocumentTextIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';
import classNames from 'classnames';

interface NavigationItem {
    name: string;
    href?: string;
    icon?: any;
    current?: boolean;
    children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
    {
        name: 'Platform',
        children: [
            {
                name: 'Dashboard',
                href: route('dashboard'),
                icon: HomeIcon,
                current: route().current('dashboard')
            },
            {
                name: 'Charts',
                href: route('charts.index'),
                icon: ChartBarIcon,
                current: route().current('charts.index')
            }
        ]
    },
    {
        name: 'Management',
        children: [
            {
                name: 'Youth Profiles',
                href: route('youth-profiles.manage'),
                icon: UserGroupIcon,
                current: route().current('youth-profiles.*')
            },
            {
                name: 'Proposals',
                href: route('proposals.manage.index'),
                icon: DocumentTextIcon,
                current: route().current('proposals.*')
            },
            {
                name: 'Settings',
                href: route('settings.index'),
                icon: Cog6ToothIcon,
                current: route().current('settings.*')
            }
        ]
    }
];

const bottomNavigation = [
    {
        name: 'About',
        href: route('about.index'),
        icon: InformationCircleIcon,
        current: route().current('about.index')
    },
    // ... existing bottom navigation items ...
];

export default function Sidebar() {
    return (
        <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                    <div className="space-y-4">
                        {navigation.map((section) => (
                            <div key={section.name} className="space-y-3">
                                <p className="px-2 text-xs font-semibold text-gray-500">{section.name}</p>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {section.children?.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href!}
                                                className={classNames(
                                                    item.current
                                                        ? 'bg-gray-50 text-primary'
                                                        : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                                )}
                                            >
                                                <item.icon
                                                    className={classNames(
                                                        item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                                                        'h-6 w-6 shrink-0'
                                                    )}
                                                    aria-hidden="true"
                                                />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </li>
                <li className="mt-auto">
                    <ul role="list" className="-mx-2 space-y-1">
                        {bottomNavigation.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href!}
                                    className={classNames(
                                        item.current
                                            ? 'bg-gray-50 text-primary'
                                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            item.current ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                                            'h-6 w-6 shrink-0'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </li>
            </ul>
        </nav>
    );
} 

