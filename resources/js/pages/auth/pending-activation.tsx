import { Head } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AuthLayout from '@/layouts/auth-layout';

export default function PendingActivation() {
    return (
        <AuthLayout title="Account Pending Activation" description="Your account is pending administrator approval">
            <Head title="Pending Activation" />
            
            <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Account Not Active</AlertTitle>
                <AlertDescription>
                    Your account is currently pending activation by an administrator. You will be notified via email once your account has been activated.
                </AlertDescription>
            </Alert>

            <div className="text-muted-foreground mt-6 text-center text-sm">
                <TextLink href={route('logout')} method="post" as="button">
                    Log out
                </TextLink>
            </div>
        </AuthLayout>
    );
} 