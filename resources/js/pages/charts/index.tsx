import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';

interface PageProps {
    auth: {
        user: {
            email: string;
            [key: string]: any;
        };
    };
    [key: string]: any;
}

const breadcrumbs = [
     {
        title: 'Looker Charts',
        href: '/#',
    },
];

export default function ChartsPage() {
    const { auth } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs} user={auth.user}>
            <Head title="Analytics Dashboard" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                </div>

                <Tabs defaultValue="youth-profiles" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="youth-profiles">Youth Profiles</TabsTrigger>
                        <TabsTrigger value="proposals">Proposals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="youth-profiles" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Youth Profile Visualization</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src="https://lookerstudio.google.com/embed/reporting/e27a31cf-a74a-4a4d-ac9e-f350984a125a/page/1lLIF" 
                                    frameBorder="0" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="proposals" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Proposals Visualization</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[500px]">
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src="https://lookerstudio.google.com/embed/reporting/12a9698b-7148-4d68-9dd6-1ae966db2569/page/U1LIF" 
                                    frameBorder="0" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
} 