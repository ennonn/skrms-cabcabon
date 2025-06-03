import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function AnalyticsDashboard() {
    return (
        <AppLayout>
            <Head title="Analytics Dashboard" />
            
            <div className="container mx-auto py-6 space-y-6">
                <div className="flex justify-between items-center">
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>SK Youth Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative w-full aspect-[600/443] overflow-hidden rounded-lg">
                            <iframe 
                                src="https://lookerstudio.google.com/embed/reporting/9dffa522-fe4a-4972-a716-1d230fc6240d/page/9OwHF" 
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', top: 0, left: 0, border: 0 }}
                                frameBorder="0"
                                allowFullScreen
                                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 