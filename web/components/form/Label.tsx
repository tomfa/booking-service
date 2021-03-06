import * as RLabel from '@radix-ui/react-label';
import * as React from 'react';
import { LabelProps } from '@radix-ui/react-label';
import classNames from 'classnames';

export default function Label({
  className,
  ...props
}: LabelProps & React.RefAttributes<HTMLSpanElement>) {
  return (
    <RLabel.Root
      className={classNames('font-bold text-gray-700', className)}
      {...props}
    />
  );
}
