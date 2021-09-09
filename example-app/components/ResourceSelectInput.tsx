import React, { useCallback } from 'react';
import * as vailable from 'vailable';

export const ResourceSelectInput = ({
  resource,
  available,
  checked,
  onValueChange,
}: {
  resource: vailable.types.Resource;
  available: boolean;
  checked: boolean;
  onValueChange: (resourceId: string, checked: boolean) => void;
}) => {
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const isSelected = available && checked;
      if (event.target.checked !== isSelected) {
        onValueChange(resource.id, event.target.checked);
      }
    },
    [resource, onValueChange, available]
  );
  return (
    <div>
      {resource.label}
      {available && (
        <input
          type="checkbox"
          name={resource.id}
          checked={checked}
          onChange={onChange}
        />
      )}
      {!available && <span>Ikke ledig</span>}
    </div>
  );
};
