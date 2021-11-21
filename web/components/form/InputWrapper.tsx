import React from 'react';

export default function InputWrapper(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return <div className={'flex flex-col my-4'} {...props} />;
}
