import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import toast from '../../../components/utils/toast.utils';
import {
  ResourceForm,
  ResourceFormType,
} from '../../../containers/forms/ResourceForm';
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
    async ({
      label,
      seats,
      enabled,
      category,
      defaultSlotDuration,
      defaultSlotInterval,
      ...rest
    }: ResourceFormType) => {
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
                start: rest.monFrom,
                end: rest.monTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'tue',
                start: rest.monFrom,
                end: rest.monTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'wed',
                start: rest.wedFrom,
                end: rest.wedTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'thu',
                start: rest.thuFrom,
                end: rest.thuTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'fri',
                start: rest.friFrom,
                end: rest.friTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'sat',
                start: rest.satFrom,
                end: rest.satTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'sun',
                start: rest.sunFrom,
                end: rest.sunTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
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
