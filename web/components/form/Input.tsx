import * as React from 'react';
import { LegacyRef } from 'react';

const Input = React.forwardRef(
  (
    props: React.InputHTMLAttributes<HTMLInputElement>,
    ref: LegacyRef<HTMLInputElement>
  ) => {
    return <input className={'px-3 py-2'} {...props} ref={ref} />;
  }
);
Input.displayName = 'Input';

export default Input;
