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
import { validateHourMinute } from '../../utils/validation.utils';

const validateHourStringInput = z.string().refine(val => {
  if (!val) {
    return true;
  }
  try {
    validateHourMinute(val);
    return true;
  } catch {
    return false;
  }
}, 'Time must be empty or in format HH:MM');

const schema = z.object({
  label: z.string().min(1),
  category: z.string().optional(),
  seats: z
    .number({ invalid_type_error: 'You must have at least 1 seat' })
    .min(1, 'You must have at least 1 seat'),
  enabled: z.boolean().default(true),
  defaultSlotInterval: z
    .number({ invalid_type_error: 'Must be at least 1' })
    .min(1, 'Must be at least 1'),
  defaultSlotDuration: z
    .number({ invalid_type_error: 'A booking must last at least 5 minutes' })
    .min(5, 'A booking must last at least 5 minutes'),
  monFrom: validateHourStringInput,
  monTo: validateHourStringInput,
  tueFrom: validateHourStringInput,
  tueTo: validateHourStringInput,
  wedFrom: validateHourStringInput,
  wedTo: validateHourStringInput,
  thuFrom: validateHourStringInput,
  thuTo: validateHourStringInput,
  friFrom: validateHourStringInput,
  friTo: validateHourStringInput,
  satFrom: validateHourStringInput,
  satTo: validateHourStringInput,
  sunFrom: validateHourStringInput,
  sunTo: validateHourStringInput,
});
export type ResourceFormType = z.infer<typeof schema>;

type Props = {
  loading: boolean;
  onSubmit: SubmitHandler<ResourceFormType>;
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
  } = useForm<ResourceFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      enabled: props.resource ? props.resource.enabled : true,
      label: props.resource?.label,
      category: props.resource?.category || undefined,
      seats: props.resource?.seats || 1,
      monFrom: props.resource?.schedule.mon.start || '',
      monTo: props.resource?.schedule.mon.end || '',
      tueTo: props.resource?.schedule.tue.end || '',
      tueFrom: props.resource?.schedule.tue.start || '',
      wedTo: props.resource?.schedule.wed.end || '',
      wedFrom: props.resource?.schedule.wed.start || '',
      thuTo: props.resource?.schedule.thu.end || '',
      thuFrom: props.resource?.schedule.thu.start || '',
      friTo: props.resource?.schedule.fri.end || '',
      friFrom: props.resource?.schedule.fri.start || '',
      satTo: props.resource?.schedule.sat.end || '',
      satFrom: props.resource?.schedule.sat.start || '',
      sunTo: props.resource?.schedule.sun.end || '',
      sunFrom: props.resource?.schedule.sun.start || '',
      defaultSlotInterval: props.resource?.schedule.mon.slotIntervalMinutes,
      defaultSlotDuration: props.resource?.schedule.mon.slotDurationMinutes,
    },
  });
  return (
    <>
      <form
        onSubmit={handleSubmit(props.onSubmit)}
        className={'flex flex-col max-w-xl mx-auto'}>
        {props.title && <H2>{props.title}</H2>}
        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-label'}>Resource label</Label>
            <Tooltip className={'ml-2'}>
              <strong>Required.</strong> Label of the resource. Can be changed
              later.
            </Tooltip>
          </div>

          <Input
            id={'input-label'}
            {...register('label')}
            placeholder={'My resource'}
          />
          <InputError>{errors.label && errors.label.message}</InputError>
        </InputWrapper>
        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-category'}>Category </Label>
            <Tooltip className={'ml-2 color'}>
              <strong>Optional.</strong> Category can be used to create groups
              of resources that a user has access to, or when filter resources
              for availablility.
            </Tooltip>
          </div>
          <Input
            id={'input-category'}
            placeholder={'Office space'}
            {...register('category')}
          />
          <InputError>{errors.category && errors.category.message}</InputError>
        </InputWrapper>
        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-seats'}>Number of seats</Label>
            <Tooltip className={'ml-2 color'}>
              <strong>Required.</strong> Number of bookings this resource can
              have at a time, before fully booked.
            </Tooltip>
          </div>
          <Input
            id={'input-seats'}
            type={'number'}
            {...register('seats', { valueAsNumber: true })}
          />
          <InputError>{errors.seats && errors.seats.message}</InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-enabled'}>Enabled</Label>
            <Tooltip className={'ml-2'}>
              Whether users may add new bookings to this resource.
            </Tooltip>
          </div>
          <Controller
            control={control}
            name={'enabled'}
            render={({ field }) => (
              <Checkbox
                {...field}
                id={'input-enabled'}
                value={undefined}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />

          <InputError>{errors.enabled && errors.enabled.message}</InputError>
        </InputWrapper>

        <h2 className={'text-2xl mb-2 mt-4'}>Opening hours</h2>
        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-defaultSlotInterval'}>
              Booking duration (min)
            </Label>
            <Tooltip className={'ml-2 color'}>
              Duration in minutes for 1 booking.
            </Tooltip>
          </div>
          <Input
            type={'number'}
            id={'input-defaultSlotDuration'}
            placeholder={'60'}
            {...register('defaultSlotDuration', { valueAsNumber: true })}
          />
          <InputError>
            {errors.defaultSlotDuration && errors.defaultSlotDuration.message}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-defaultSlotInterval'}>
              Bookable every X min
            </Label>
            <Tooltip className={'ml-2 color'}>
              E.g. &quot;15&quot; will make bookings start at 12:00, 12:15,
              12:30 etc.
            </Tooltip>
          </div>
          <Input
            type={'number'}
            placeholder={'15'}
            id={'input-defaultSlotInterval'}
            {...register('defaultSlotInterval', { valueAsNumber: true })}
          />
          <InputError>
            {errors.defaultSlotInterval && errors.defaultSlotInterval.message}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-monFrom'}>Monday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-monFrom'}
              placeholder={'08:00'}
              {...register('monFrom')}
            />
            <Input
              id={'input-monTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('monTo')}
            />
          </div>
          <InputError>
            {(errors.monFrom && errors.monFrom.message) ||
              (errors.monTo && errors.monTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-tueFrom'}>Tuesday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-tueFrom'}
              placeholder={'08:00'}
              {...register('tueFrom')}
            />
            <Input
              id={'input-tueTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('tueTo')}
            />
          </div>
          <InputError>
            {(errors.tueFrom && errors.tueFrom.message) ||
              (errors.tueTo && errors.tueTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-wedFrom'}>Wednesday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-wedFrom'}
              placeholder={'08:00'}
              {...register('wedFrom')}
            />
            <Input
              id={'input-wedTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('wedTo')}
            />
          </div>
          <InputError>
            {(errors.wedFrom && errors.wedFrom.message) ||
              (errors.wedTo && errors.wedTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-thuFrom'}>Thursday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-thuFrom'}
              placeholder={'08:00'}
              {...register('thuFrom')}
            />
            <Input
              id={'input-thuTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('thuTo')}
            />
          </div>
          <InputError>
            {(errors.thuFrom && errors.thuFrom.message) ||
              (errors.thuTo && errors.thuTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-friFrom'}>Friday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-friFrom'}
              placeholder={'08:00'}
              {...register('friFrom')}
            />
            <Input
              id={'input-friTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('friTo')}
            />
          </div>
          <InputError>
            {(errors.friFrom && errors.friFrom.message) ||
              (errors.friTo && errors.friTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-satFrom'}>Saturday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-satFrom'}
              placeholder={'08:00'}
              {...register('satFrom')}
            />
            <Input
              id={'input-satTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('satTo')}
            />
          </div>
          <InputError>
            {(errors.satFrom && errors.satFrom.message) ||
              (errors.satTo && errors.satTo.message)}
          </InputError>
        </InputWrapper>

        <InputWrapper>
          <div className={'flex items-center mb-2'}>
            <Label htmlFor={'input-sunFrom'}>Sunday</Label>
            <Tooltip className={'ml-2 color'}>
              Format: <code>08:00</code>. Leave empty if closed.
            </Tooltip>
          </div>
          <div className={'flex flex-row'}>
            <Input
              id={'input-sunFrom'}
              placeholder={'08:00'}
              {...register('sunFrom')}
            />
            <Input
              id={'input-sunTo'}
              placeholder={'16:00'}
              className={'ml-1 px-3 py-2 shadow-md'}
              {...register('sunTo')}
            />
          </div>
          <InputError>
            {(errors.sunFrom && errors.sunFrom.message) ||
              (errors.sunTo && errors.sunTo.message)}
          </InputError>
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
