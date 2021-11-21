import * as RCheckbox from '@radix-ui/react-checkbox';
import * as React from 'react';
import { CheckboxProps } from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import { Ref } from 'react';

const Checkbox = React.forwardRef(
  (
    props: CheckboxProps & React.RefAttributes<HTMLButtonElement>,
    ref?: Ref<HTMLButtonElement>
  ) => {
    return (
      <RCheckbox.Root
        className={
          'flex justify-center items-center w-10 h-10 bg-white border-gray-400 border-2 rounded-md'
        }
        {...props}
        ref={ref}>
        <RCheckbox.Indicator>
          <CheckIcon className={'h-8 w-8'} />
        </RCheckbox.Indicator>
      </RCheckbox.Root>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
