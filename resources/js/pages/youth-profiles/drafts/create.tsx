import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { YouthProfileForm } from '@/components/youth-profile-form';
import { DraftYouthProfile } from '@/types';

interface Props {
    copy_from?: DraftYouthProfile;
}

const breadcrumbs = [
    {
        title: 'Draft Youth Profiles',
        href: route('youth-profiles.drafts.index'),
    },
    {
        title: 'Create Profile',
        href: '#',
    },
];

export default function CreateDraftProfile({ copy_from }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Youth Profile" />

            <div className="container p-8">
                <h1 className="text-2xl font-semibold mb-6">
                    {copy_from ? 'Create New Draft from Rejected Profile' : 'Create Youth Profile'}
                </h1>
                <YouthProfileForm youth_profile={copy_from} />
            </div>
        </AppLayout>
    );
} 