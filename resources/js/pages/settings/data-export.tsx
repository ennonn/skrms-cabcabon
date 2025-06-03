import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'Data Export',
        href: '/settings/data-export',
    },
];

export default function DataExport() {
    const handleExport = async (type: string, format: string) => {
        try {
            const response = await fetch('/settings/data-export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type, format }),
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${type}_export.${format}`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                throw new Error('Export failed');
            }
        } catch (error) {
            console.error('Export error:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Export" />

            <div className="container py-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Export Data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Data Type</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select data type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="users">Users</SelectItem>
                                            <SelectItem value="youth_profiles">Youth Profiles</SelectItem>
                                            <SelectItem value="activity_plans">Activity Plans</SelectItem>
                                            <SelectItem value="budget_plans">Budget Plans</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Export Format</Label>
                                    <RadioGroup defaultValue="csv" className="flex gap-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="csv" id="csv" />
                                            <Label htmlFor="csv">CSV</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="json" id="json" />
                                            <Label htmlFor="json">JSON</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={() => handleExport('users', 'csv')}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 