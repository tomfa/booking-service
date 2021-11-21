import * as CB from '@radix-ui/react-checkbox';
import * as React from 'react';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

export default function Checkbox(
  props: CheckboxProps & React.RefAttributes<HTMLButtonElement>
) {
  return (
    <CB.Root
      className={'flex justify-center items-center w-10 h-10 bg-white'}
      {...props}>
      <CB.Indicator>
        <CheckIcon className={'w-7 h-7'} />
      </CB.Indicator>
    </CB.Root>
  );
}
