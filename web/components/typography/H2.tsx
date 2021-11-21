import React from 'react';

export default function H2(
  props: React.DetailsHTMLAttributes<HTMLHeadingElement>
) {
  // eslint-disable-next-line jsx-a11y/heading-has-content
  return <h2 className={'text-2xl mb-5'} {...props} />;
}
