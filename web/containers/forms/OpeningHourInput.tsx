import {
  FieldValues,
  UseFormRegister,
  Path,
  FieldError,
} from 'react-hook-form';
import Label from '../../components/form/Label';
import Tooltip from '../../components/Tooltip';
import Input from '../../components/form/Input';
import InputError from '../../components/form/InputError';
import InputWrapper from '../../components/form/InputWrapper';

interface OpeningHourInputProps<T extends FieldValues> {
  title: string;
  fromId: Path<T>;
  toId: Path<T>;
  errors: Record<string, FieldError | undefined>;
  register: UseFormRegister<T>;
}
export function OpeningHourInput<T extends FieldValues>({
  title,
  fromId,
  toId,
  register,
  errors,
}: OpeningHourInputProps<T>) {
  return (
    <InputWrapper>
      <div className={'flex items-center mb-2'}>
        <Label htmlFor={'input-tueFrom'}>{title}</Label>
        <Tooltip className={'ml-2 color'}>
          Format: <code>08:00</code>. Leave empty if closed.
        </Tooltip>
      </div>
      <div className={'flex flex-row'}>
        <Input
          id={`input-${fromId}`}
          placeholder={'08:00'}
          {...register(fromId)}
        />
        <Input
          id={`input-${toId}`}
          placeholder={'16:00'}
          className={'ml-1 px-3 py-2 shadow-md'}
          {...register(toId)}
        />
      </div>
      <InputError>
        {errors[fromId]?.message || errors[toId]?.message}
      </InputError>
    </InputWrapper>
  );
}
