/* This example requires Tailwind CSS v2.0+ */
import { CheckCircleIcon } from '@heroicons/react/solid';
import React from 'react';

export const SuccessMessage = ({
  children,
}: {
  children: string | React.ReactNode;
}) => {
  return (
    <div className="rounded-md bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Order completed
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{children}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
