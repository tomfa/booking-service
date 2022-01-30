import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useAddResourceMutation } from '../../graphql/generated/types';
import toast from '../../components/utils/toast.utils';
import {
  ResourceForm,
  ResourceFormType,
} from '../../containers/forms/ResourceForm';

export default function AddResourcePage() {
  const router = useRouter();
  const [addResource, { loading, error }] = useAddResourceMutation();

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
                start: rest.monFrom,
                end: rest.monTo,
                slotIntervalMinutes: defaultSlotInterval,
                slotDurationMinutes: defaultSlotDuration,
              },
              {
                day: 'tue',
                start: rest.tueFrom,
                end: rest.tueTo,
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
      toast({ message: `Added new resource ${label}.`, type: 'success' });
      await router.push('/resources/');
    },
    [addResource, router]
  );

  return (
    <Layout social={{ title: 'Vailable | Add Resource' }} crumbs>
      <ResourceForm
        title={'Add new resource'}
        loading={loading}
        onSubmit={onSubmit}
        error={error?.message}
      />
    </Layout>
  );
}
