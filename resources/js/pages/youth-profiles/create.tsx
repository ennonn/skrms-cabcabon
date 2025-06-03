import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { YouthProfileForm } from '@/components/youth-profile-form';

export default function CreateYouthProfile() {
    return (
        <AppLayout>
            <Head title="Create Youth Profile" />

            <div className="container py-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-6">Create Youth Profile</h1>
                <YouthProfileForm />
            </div>
        </AppLayout>
    );
} 