import { Head } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Maintenance() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Head title="System Maintenance" />

            <Card className="w-[32rem] mx-4">
                <CardHeader>
                    <CardTitle>System Maintenance</CardTitle>
                    <CardDescription>
                        The system is currently undergoing maintenance.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                        We are performing scheduled maintenance to improve our services.
                        Please try again later. If you are an administrator, you can
                        still access the system by logging in.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <Button variant="outline" onClick={() => window.location.reload()}>
                            Refresh Page
                        </Button>
                        <Button onClick={() => window.location.href = '/login'}>
                            Administrator Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 