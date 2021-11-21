import { useCallback } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Layout } from '../../components/Layout';
import { useAddResourceMutation } from '../../graphql/generated/types';
import Checkbox from '../../components/form/Checkbox';
import Label from '../../components/form/Label';
import InputWrapper from '../../components/form/InputWrapper';
import Input from '../../components/form/Input';
import H2 from '../../components/typography/H2';
import Tooltip from '../../components/Tooltip';
import InputError from '../../components/form/InputError';
import toast from '../../components/utils/toast.utils';

const schema = z.object({
  label: z.string().min(1),
  category: z.string().optional(),
  seats: z.number().min(1),
  enabled: z.boolean().default(true),
});
type SchemaType = z.infer<typeof schema>;

export default function ResourcePage() {
  const router = useRouter();
  const [addResource, { loading, error }] = useAddResourceMutation();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: { enabled: true },
  });

  const onSubmit: SubmitHandler<SchemaType> = useCallback(
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={'flex flex-col max-w-xl mx-auto'}>
        <H2>New resource</H2>
        <InputWrapper>
          <Label htmlFor={'input-label'}>
            Resource label
            <Tooltip className={'ml-2'}>
              <strong>Required.</strong> Label of the resource. Can be changed
              later.
            </Tooltip>
          </Label>

          <Input {...register('label')} placeholder={'My resource'} />
          <InputError>{errors.label && errors.label.message}</InputError>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor={'category'}>
            Category{' '}
            <Tooltip className={'ml-2 color'}>
              <strong>Optional.</strong> Category can be used to create groups
              of resources that a user has access to, or when filter resources
              for availablility.
            </Tooltip>
          </Label>
          <Input
            id={'category'}
            placeholder={'Office space'}
            {...register('category')}
          />
          <InputError>{errors.category && errors.category.message}</InputError>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor={'seats'}>
            Number of seats
            <Tooltip className={'ml-2 color'}>
              <strong>Required.</strong> Number of bookings this resource can
              have at a time, before fully booked.
            </Tooltip>
          </Label>
          <Input
            defaultValue={1}
            type={'number'}
            {...register('seats', { valueAsNumber: true })}
          />
          <InputError>{errors.seats && errors.seats.message}</InputError>
        </InputWrapper>

        <InputWrapper>
          <Label htmlFor={'enabled'}>
            Enabled
            <Tooltip className={'ml-2'}>
              Whether users may add new bookings to this resource.
            </Tooltip>
          </Label>
          <Controller
            control={control}
            name={'enabled'}
            render={({ field }) => (
              <Checkbox
                {...field}
                value={undefined}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <InputError>{errors.enabled && errors.enabled.message}</InputError>
        </InputWrapper>

        <button
          type="submit"
          className="bg-green-600 text-white px-10 py-3 hover:bg-green-700 shadow-lg ml-auto"
          disabled={loading}>
          {(!loading && 'Add resource') || 'Submitting...'}
        </button>
      </form>
      {loading && <>Loading...</>}
      {!loading && error && (
        <InputError>
          Received the following error when attempting to add resource:{' '}
          {String(error)}
        </InputError>
      )}
    </Layout>
  );
}
