import * as React from 'react';
import classNames from 'classnames';

export default function InputError(
  props: React.HTMLAttributes<HTMLSpanElement>
) {
  if (!props.children) {
    return null;
  }
  return (
    <span
      className={classNames(
        'text-red-700 bg-red-50 px-3 block py-1 mt-3 border-red-600 border-solid border-b',
        !props.children && 'invisible'
      )}
      {...props}
    />
  );
}
