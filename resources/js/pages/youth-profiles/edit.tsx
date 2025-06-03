import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { YouthProfileForm } from '@/components/youth-profile-form';
import { YouthProfile } from '@/types';

interface Props {
    youth_profile: YouthProfile;
}

export default function EditYouthProfile({ youth_profile }: Props) {
    return (
        <AppLayout>
            <Head title="Edit Youth Profile" />

            <div className="container py-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit Youth Profile</h1>
                <YouthProfileForm youth_profile={youth_profile} isEditing />
            </div>
        </AppLayout>
    );
} 