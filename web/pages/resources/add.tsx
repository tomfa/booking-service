import { useCallback } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { useAddResourceMutation } from '../../graphql/generated/types';
import Checkbox from '../../components/form/Checkbox';
import Label from '../../components/form/Label';
import InputWrapper from '../../components/form/InputWrapper';
import Input from '../../components/form/Input';
import H2 from '../../components/typography/H2';

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
      <H2>New resource</H2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWrapper>
          <Label htmlFor={'input-label'}>Resource label</Label>
          <Input
            id={'input-label'}
            defaultValue="My resource"
            {...register('label', { required: true })}
          />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor={'category'}>Category</Label>
          <Input id={'category'} defaultValue="" {...register('category')} />
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor={'num-seats'}>Number of seats</Label>
          <Input
            id={'num-seats'}
            defaultValue={1}
            type={'number'}
            {...register('seats', {
              min: 1,
              valueAsNumber: true,
              required: true,
            })}
          />
        </InputWrapper>

        <InputWrapper>
          <Label htmlFor={'input-enabled'}>Enabled</Label>
          <Checkbox id={'input-enabled'} {...register('enabled')}>
            ost
          </Checkbox>
        </InputWrapper>

        <button type="submit" className="bg-white px-10 py-3 hover:bg-gray-100">
          Add resource
        </button>
      </form>
      {loading && <>Loading...</>}
      {!loading && error && <>Error: {String(error)}</>}
    </Layout>
  );
}
