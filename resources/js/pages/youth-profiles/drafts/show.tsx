import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { PendingYouthProfile } from '@/types/models';
import AppLayout from '@/layouts/app-layout';
import YouthProfileView from '@/components/youth-profiles/youth-profile-view';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props extends PageProps {
  draft: PendingYouthProfile;
}

export default function Show({ draft }: Props) {
  return (
    <AppLayout>
      <Head title="View Draft Profile" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  Draft Profile Details
                </h2>
                <div className="flex gap-4">
                  <Link href={route('youth-profiles.drafts.index')}>
                    <Button variant="outline">Back to Drafts</Button>
                  </Link>
                  {draft.status === 'approved' ? (
                    <Link href={route('youth-profiles.drafts.return', draft.id)} method="post" as="button">
                      <Button variant="outline">Return to Draft</Button>
                    </Link>
                  ) : (
                    <>
                      <Link href={route('youth-profiles.drafts.edit', draft.id)}>
                        <Button>Edit Draft</Button>
                      </Link>
                      <Link href={route('youth-profiles.drafts.submit', draft.id)} method="post" as="button">
                        <Button variant="default">Submit for Review</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <YouthProfileView profile={draft} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 