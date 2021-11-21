import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import toast from '../../../components/utils/toast.utils';
import { ResourceForm } from '../../../containers/forms/ResourceForm';
import {
  Resource,
  useGetResourceByIdQuery,
  useUpdateResourceMutation,
} from '../../../graphql/generated/types';

export default function EditResourcePage() {
  const router = useRouter();
  const id = useMemo(() => {
    const value = router.query.id;
    if (typeof value !== 'string') {
      return '';
    }
    return value;
  }, [router.query]);
  const [updateResource, { loading, error }] = useUpdateResourceMutation();
  const { data } = useGetResourceByIdQuery({
    variables: { id: String(router.query.id) },
  });
  const resource: Resource | null | undefined = useMemo(
    () => data?.getResourceById,
    [data]
  );

  const onSubmit = useCallback(
    async ({ label, seats, enabled, category }) => {
      await updateResource({
        variables: {
          updateResourceInput: {
            id,
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
      toast({ message: `Updated resource ${label}.`, type: 'success' });
      await router.push('/resources/');
    },
    [updateResource, router, id]
  );

  return (
    <Layout social={{ title: 'Vailable | Add Resource' }}>
      {resource && (
        <ResourceForm
          title={`Update resource`}
          loading={loading}
          onSubmit={onSubmit}
          error={error?.message}
          resource={resource}
        />
      )}
      {!resource && <span>...</span>}
    </Layout>
  );
}
