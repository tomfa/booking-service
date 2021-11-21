import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import H2 from '../../components/typography/H2';
import InputWrapper from '../../components/form/InputWrapper';
import Label from '../../components/form/Label';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/form/Input';
import InputError from '../../components/form/InputError';
import Checkbox from '../../components/form/Checkbox';
import { Resource } from '../../graphql/generated/types';

const schema = z.object({
  label: z.string().min(1),
  category: z.string().optional(),
  seats: z.number().min(1),
  enabled: z.boolean().default(true),
});
type SchemaType = z.infer<typeof schema>;

type Props = {
  loading: boolean;
  onSubmit: SubmitHandler<SchemaType>;
  error?: string;
  title?: string;
  resource?: Resource;
};

export const ResourceForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: props.resource ? props.resource.enabled : true,
      label: props.resource?.label,
      category: props.resource?.category || undefined,
      seats: props.resource?.seats || 1,
    },
  });
  return (
    <>
      <form
        onSubmit={handleSubmit(props.onSubmit)}
        className={'flex flex-col max-w-xl mx-auto'}>
        {props.title && <H2>{props.title}</H2>}
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
          disabled={props.loading}>
          {(!props.loading && props.title) || 'Submitting...'}
        </button>
      </form>
      {props.loading && <>Loading...</>}
      {!props.loading && props.error && (
        <InputError>
          Received the following error when attempting to submitting resource:{' '}
          {String(props.error)}
        </InputError>
      )}
    </>
  );
};
