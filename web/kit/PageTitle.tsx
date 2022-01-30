import Link from 'next/link';
import React from 'react';
import FormSubscribe from './FormSubscribe';

export const PageTitle = (props: {
  title: string | undefined;
  onFilter?: (val: string) => void;
  buttons: Array<{
    label: string;
    onClick?: () => any;
    href?: string;
  }>;
}) => (
  <div>
    <div className="flex flex-col md:flex-row mb-1 sm:mb-0 justify-between w-full">
      <div
        className={
          'flex flex-col md:flex-row mb-3 space-between md:items-center'
        }>
        {props.title && (
          <h2 className="text-2xl md:mr-5 leading-tight mb-2 md:mb-0 ">
            {props.title}
          </h2>
        )}
      </div>

      <div>
        {props.buttons.map(button => {
          if (button.href) {
            return (
              <Link href={button.href} passHref key={button.label}>
                <a
                  href={'/'}
                  className="inline-block py-2 px-3 bg-gray-100 text-sm hover:bg-gray-200 shadow-lg ml-auto">
                  {button.label}
                </a>
              </Link>
            );
          }
          return (
            <button
              key={button.label}
              onClick={button.onClick}
              className="inline-block py-2 px-3 ml-1 bg-gray-100 text-sm hover:bg-gray-200 shadow-lg ml-auto">
              {button.label}
            </button>
          );
        })}
      </div>
    </div>
    {props.onFilter && (
      <FormSubscribe
        placeholder="Filter"
        label="Filter"
        onChange={props.onFilter}
      />
    )}
  </div>
);
