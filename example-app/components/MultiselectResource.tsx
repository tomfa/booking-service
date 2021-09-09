import React from 'react';
import { types } from 'vailable';
import { ResourceSelectInput } from './ResourceSelectInput';

export const MultiselectResource = ({
  resources,
}: {
  resources: Array<{
    resource: types.Resource;
    available: boolean;
    checked: boolean;
  }>;
}) => {
  const onChange = (resourceId: string, checked: boolean) => {
    console.log(`resourceId`, resourceId, 'checked=', checked);
  };
  return (
    <div>
      {resources.map(({ resource, available, checked }) => (
        <ResourceSelectInput
          resource={resource}
          key={resource.id}
          available={available}
          checked={checked}
          onValueChange={onChange}
        />
      ))}
    </div>
  );
};
