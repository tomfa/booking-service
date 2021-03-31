import { HTMLProps, MutableRefObject } from 'react';
import { Label } from './Label.styles';
import { Input } from './Input.styles';

type FormInputProps = {
  label: string;
  name: string;
  inputRef?: MutableRefObject<HTMLInputElement>;
};
export const FormInput = ({
  label,
  name,
  inputRef,
  ...props
}: FormInputProps & HTMLProps<HTMLInputElement>) => {
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input {...props} name={name} ref={inputRef} as={'input'} />
    </>
  );
};
