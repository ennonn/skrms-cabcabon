import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Settings',
        href: '/settings',
    },
    {
        title: 'System Settings',
        href: '/settings/system',
    },
];

const retentionOptions = [
    { value: '3', label: '3 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
];

const backupFrequencyOptions = [
    { value: '1', label: 'Every day' },
    { value: '3', label: 'Every 3 days' },
    { value: '7', label: 'Every 7 days' },
    { value: '14', label: 'Every 14 days' },
    { value: '30', label: 'Every 30 days' },
];

type Setting = {
    id: number;
    key: string;
    value: string | boolean | number;
    type: string;
    description: string;
    is_public: boolean;
};

type Props = {
    settings: Setting[];
};

export default function SystemSettings({ settings }: Props) {
    const [maintenanceMode, setMaintenanceMode] = useState(
        settings.find(s => s.key === 'maintenance_mode')?.value as boolean
    );
    const [autoBackup, setAutoBackup] = useState(
        settings.find(s => s.key === 'auto_backup_enabled')?.value as boolean
    );
    const [retentionPeriod, setRetentionPeriod] = useState(
        settings.find(s => s.key === 'backup_retention_period')?.value as string
    );
    const [backupFrequency, setBackupFrequency] = useState(
        settings.find(s => s.key === 'backup_frequency')?.value as string
    );
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [backupFile, setBackupFile] = useState<File | null>(null);
    const [isCreatingBackup, setIsCreatingBackup] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleToggleAutoBackup = async () => {
        try {
            const response = await fetch('/settings/system/auto-backup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled: !autoBackup }),
            });

            if (response.ok) {
                setAutoBackup(!autoBackup);
                toast.success(`Auto backup ${!autoBackup ? 'enabled' : 'disabled'}`);
            } else {
                toast.error('Failed to update auto backup setting');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleUpdateRetentionPeriod = async (value: string) => {
        try {
            const response = await fetch('/settings/system/retention-period', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value }),
            });

            if (response.ok) {
                setRetentionPeriod(value);
                toast.success('Retention period updated successfully');
            } else {
                toast.error('Failed to update retention period');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleUpdateBackupFrequency = async (value: string) => {
        try {
            const response = await fetch('/settings/system/backup-frequency', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ value }),
            });

            if (response.ok) {
                setBackupFrequency(value);
                toast.success('Backup frequency updated successfully');
            } else {
                toast.error('Failed to update backup frequency');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const handleToggleMaintenanceMode = async () => {
        setShowPasswordConfirm(true);
    };

    const handlePasswordConfirm = async () => {
        try {
            setIsSubmitting(true);
            
            await router.post('/confirm-password', {
                password,
            }, {
                onSuccess: async () => {
                    const response = await fetch('/settings/system/maintenance-mode', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                        },
                    });

                    if (response.ok) {
                        setMaintenanceMode(!maintenanceMode);
                        toast.success(`Maintenance mode ${!maintenanceMode ? 'enabled' : 'disabled'}`);
                        setShowPasswordConfirm(false);
                        setPassword('');
                    } else {
                        toast.error('Failed to toggle maintenance mode');
                    }
                },
                onError: (errors) => {
                    if (errors.password) {
                        toast.error(errors.password);
                    } else {
                        toast.error('Invalid password');
                    }
                },
            });
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateBackup = async () => {
        try {
            setIsCreatingBackup(true);
            const response = await fetch('/settings/system/backup', {
                method: 'POST',
            });

            if (response.ok) {
                toast.success('Backup created successfully');
            } else {
                toast.error('Failed to create backup');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsCreatingBackup(false);
        }
    };

    const handleRestoreBackup = async () => {
        if (!backupFile) return;

        try {
            setIsRestoring(true);
            const formData = new FormData();
            formData.append('backup_file', backupFile);

            const response = await fetch('/settings/system/restore', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success('System restored successfully');
                setShowRestoreDialog(false);
            } else {
                toast.error('Failed to restore system');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Settings" />

            <div className="container py-6">
                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        When enabled, only administrators can access the system.
                                    </p>
                                </div>
                                <Switch
                                    checked={maintenanceMode}
                                    onCheckedChange={handleToggleMaintenanceMode}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Backup & Restore</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Auto Backup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically backup the system based on the schedule.
                                    </p>
                                </div>
                                <Switch
                                    checked={autoBackup}
                                    onCheckedChange={handleToggleAutoBackup}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Backup Retention Period</Label>
                                <Select value={retentionPeriod} onValueChange={handleUpdateRetentionPeriod}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select retention period" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {retentionOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">
                                    How long to keep backup files before they are automatically deleted.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Backup Frequency</Label>
                                <Select value={backupFrequency} onValueChange={handleUpdateBackupFrequency}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select backup frequency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {backupFrequencyOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-sm text-muted-foreground">
                                    How often automatic backups should be created.
                                </p>
                            </div>

                            <div className="flex flex-col space-y-4">
                                <div className="space-y-2">
                                    <Label>Manual Backup</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Create or restore a backup manually.
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Button 
                                        onClick={handleCreateBackup} 
                                        disabled={isCreatingBackup}
                                    >
                                        {isCreatingBackup ? 'Creating Backup...' : 'Create Backup'}
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => setShowRestoreDialog(true)}
                                    >
                                        Restore from Backup
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Dialog open={showPasswordConfirm} onOpenChange={setShowPasswordConfirm}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirm Password</DialogTitle>
                                <DialogDescription>
                                    Please enter your password to confirm this action.
                                </DialogDescription>
                            </DialogHeader>
                            <Input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPasswordConfirm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePasswordConfirm}
                                    disabled={!password || isSubmitting}
                                >
                                    Confirm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Restore from Backup</DialogTitle>
                                <DialogDescription>
                                    Select a backup file to restore the system. This will replace all current data.
                                    Make sure you have a recent backup before proceeding.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Backup File</Label>
                                    <Input
                                        type="file"
                                        accept=".zip,.sql"
                                        onChange={(e) => setBackupFile(e.target.files?.[0] || null)}
                                    />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleRestoreBackup}
                                        disabled={!backupFile || isRestoring}
                                    >
                                        {isRestoring ? 'Restoring...' : 'Restore'}
                                    </Button>
                                </DialogFooter>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AppLayout>
    );
} 