import { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useAddResourceMutation } from '../../graphql/generated/types';

type Inputs = {
  label: string;
  seats: number;
  category: string;
  enabled: boolean;
};

export default function ResourcePage() {
  const router = useRouter();
  const [addResource, { loading, error }] = useAddResourceMutation();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = useCallback(
    async ({ label, enabled, seats, category }) => {
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
      // Add message
      await router.push('/resources/');
    },
    [addResource, router]
  );

  return (
    <Layout social={{ title: 'Vailable | Add Resource' }}>
      <h3>New resource</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="My resource" {...register('label')} />
        <input defaultValue="" {...register('category')} />
        <input
          defaultValue={1}
          type={'number'}
          {...register('seats', { min: 1, valueAsNumber: true })}
        />
        <input type="checkbox" {...register('enabled')} />

        <input type="submit" />
      </form>
      {loading && <>Loading...</>}
      {!loading && error && <>Error: {String(error)}</>}
    </Layout>
  );
}
