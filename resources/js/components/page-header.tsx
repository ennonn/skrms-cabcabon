import { LucideIcon } from 'lucide-react';

interface Props {
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
}

export function PageHeader({ title, subtitle, icon: Icon }: Props) {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-4">
                {Icon && <Icon className="h-8 w-8 text-muted-foreground" />}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            </div>
        </div>
    );
} 