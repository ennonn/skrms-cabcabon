import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { EyeIcon, EyeOffIcon, RefreshCw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface User {
    email: string;
}

interface Auth {
    user: User;
}

interface ZapierSettingsProps {
    auth: Auth;
    zapierWebhookUrl: string | null;
}

export default function ZapierSettings({ auth, zapierWebhookUrl: initialWebhookUrl }: ZapierSettingsProps) {
    const [isImporting, setIsImporting] = useState(false);
    const [showWebhookUrl, setShowWebhookUrl] = useState(false);
    const [ignoreDuplicates, setIgnoreDuplicates] = useState(false);
    const systemWebhookUrl = `${window.location.origin}/api/zapier/youth-profiles/upload`;

    const { data, setData, post, processing } = useForm({
        webhook_url: initialWebhookUrl || '',
    });

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('URL copied to clipboard');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('system.zapier-settings.webhook-url'), {
            onSuccess: () => {
                toast.success('Webhook URL saved successfully');
            },
            onError: (errors) => {
                toast.error('Failed to save webhook URL', {
                    description: errors.webhook_url || 'Please try again'
                });
            }
        });
    };

    const startImport = async () => {
        if (!data.webhook_url) {
            toast.error('Please enter a Zapier webhook URL first');
            return;
        }

        setIsImporting(true);
        try {
            const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!token) {
                throw new Error('CSRF token not found. Please refresh the page and try again.');
            }

            const response = await fetch(route('system.zapier-settings.trigger-import'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                body: JSON.stringify({
                    webhook_url: data.webhook_url,
                    ignore_duplicates: ignoreDuplicates,
                }),
                credentials: 'same-origin',
            });

            if (response.status === 419) {
                throw new Error('Your session has expired. Please refresh the page and try again.');
            }

            const result = await response.json().catch(() => ({
                error: 'Invalid response from server'
            }));

            if (response.ok) {
                if (result.status === 'warning' && result.message?.includes('duplicate')) {
                    toast.warning('Import completed with duplicates', {
                        description: 'Some profiles were skipped because they already exist. Toggle "Ignore Duplicates" to import all profiles.',
                        duration: 5000,
                    });
                } else {
                    toast.success('Import request sent', {
                        description: result.message || 'Zapier has received your request and will begin processing.',
                        duration: 3000,
                    });
                }
            } else {
                if (result.message === 'CSRF token mismatch.') {
                    throw new Error('Security verification failed. Please refresh the page and try again.');
                } else if (result.error?.toLowerCase().includes('connection')) {
                    toast.error('Connection Error', {
                        description: result.details || 'Could not connect to Zapier. Please check your internet connection and try again.',
                        duration: 5000,
                    });
                } else if (result.error?.toLowerCase().includes('webhook url')) {
                    toast.error('Invalid Webhook URL', {
                        description: result.details || 'Please check your Zapier webhook URL and try again.',
                        duration: 5000,
                    });
                } else {
                    console.error('Import error details:', result);
                    throw new Error(result.error || 'Failed to trigger import');
                }
            }
        } catch (error: unknown) {
            console.error('Import error:', error);
            toast.error('Import Failed', {
                description: error instanceof Error 
                    ? error.message
                    : 'An unexpected error occurred. Please try again later.',
                duration: 8000,
            });
        } finally {
            setIsImporting(false);
        }
    };

    const resetImport = async () => {
        if (!window.confirm('Are you sure you want to reset the import? This will clear all pending profiles and stop any ongoing imports.')) {
            return;
        }

        try {
            const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!token) {
                throw new Error('CSRF token not found. Please refresh the page and try again.');
            }

            const response = await fetch(route('system.zapier-settings.reset'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                toast.success('Import data reset successfully', {
                    description: 'All pending profiles have been cleared. Please wait a moment before starting a new import to ensure all processes have stopped.',
                    duration: 5000,
                });

                setIsImporting(true);
                setTimeout(() => {
                    setIsImporting(false);
                }, 5000);
            } else {
                const result = await response.json().catch(() => ({
                    error: 'Invalid response from server'
                }));
                throw new Error(result.error || 'Failed to reset import data');
            }
        } catch (error: unknown) {
            console.error('Reset error:', error);
            toast.error('Failed to reset import data', {
                description: error instanceof Error ? error.message : 'Please try again.',
                duration: 8000,
            });
        }
    };

    return (
        <AppLayout user={auth.user}>
            <Head title="Zapier Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Zapier Integration Settings</CardTitle>
                            <CardDescription>
                                Configure your Zapier integration to automate youth profile imports.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Zapier Webhook URL Input */}
                                <div className="space-y-2">
                                    <Label htmlFor="webhook_url">Zapier Webhook URL</Label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <Input
                                                id="webhook_url"
                                                name="webhook_url"
                                                type={showWebhookUrl ? "text" : "password"}
                                                value={data.webhook_url}
                                                onChange={e => setData('webhook_url', e.target.value)}
                                                placeholder="Paste your Zapier webhook URL here"
                                                className="pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowWebhookUrl(!showWebhookUrl)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                            >
                                                {showWebhookUrl ? (
                                                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4 text-gray-500" />
                                                )}
                                            </button>
                                        </div>
                                        <Button 
                                            type="submit"
                                            disabled={processing}
                                            variant="outline"
                                        >
                                            {processing ? 'Saving...' : 'Save URL'}
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            {/* System Webhook URL Display */}
                            <div className="space-y-2">
                                <Label htmlFor="systemWebhookUrl">Your System Webhook URL</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="systemWebhookUrl"
                                        type="text"
                                        value={systemWebhookUrl}
                                        readOnly
                                        className="bg-gray-50"
                                    />
                                    <Button 
                                        onClick={() => copyToClipboard(systemWebhookUrl)}
                                        variant="outline"
                                    >
                                        Copy
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Configure Zapier to send data to this webhook URL.
                                </p>
                            </div>

                            {/* Import Options */}
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Ignore Duplicates</Label>
                                        <p className="text-sm text-gray-500">
                                            When enabled, duplicate profiles will be imported instead of skipped
                                        </p>
                                    </div>
                                    <Switch
                                        checked={ignoreDuplicates}
                                        onCheckedChange={setIgnoreDuplicates}
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        onClick={startImport} 
                                        disabled={isImporting}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        {isImporting ? 'Starting Import...' : 'Start Import'}
                                    </Button>
                                    <Button
                                        onClick={resetImport}
                                        variant="outline"
                                        className="gap-2"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                        Reset Import
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}