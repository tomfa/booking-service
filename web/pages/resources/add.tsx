import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useAddResourceMutation } from '../../graphql/generated/types';
import toast from '../../components/utils/toast.utils';
import { ResourceForm } from '../../containers/forms/ResourceForm';

export default function AddResourcePage() {
  const router = useRouter();
  const [addResource, { loading, error }] = useAddResourceMutation();

  const onSubmit = useCallback(
    async ({ label, seats, enabled, category }) => {
      await addResource({
        variables: {
          addResourceInput: {
            label,
            seats,
            enabled,
            category,
            schedule: [
              {
                day: 'mon',
                start: '08:00',
                end: '16:00',
                slotIntervalMinutes: 15,
                slotDurationMinutes: 30,
              },
            ],
          },
        },
      });
      toast({ message: `Added new resource ${label}.`, type: 'success' });
      await router.push('/resources/');
    },
    [addResource, router]
  );

  return (
    <Layout social={{ title: 'Vailable | Add Resource' }}>
      <ResourceForm
        title={'Add new resource'}
        loading={loading}
        onSubmit={onSubmit}
        error={error?.message}
      />
    </Layout>
  );
}
