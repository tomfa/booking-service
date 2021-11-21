import * as React from 'react';

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return <input className={'px-3 py-2'} {...props} />;
}
