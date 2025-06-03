import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { YouthProfileForm } from '@/components/youth-profile-form';
import { DraftYouthProfile } from '@/types';

interface Props {
    profile: DraftYouthProfile;
}

const breadcrumbs = [
    {
        title: 'Draft Youth Profiles',
        href: route('youth-profiles.drafts.index'),
    },
    {
        title: 'Edit Profile',
        href: '#',
    },
];

export default function EditDraftProfile({ profile }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Draft Profile" />

            <div className="container py-6">
                <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit Draft Profile</h1>
                <YouthProfileForm youth_profile={profile} isEditing />
            </div>
        </AppLayout>
    );
} 