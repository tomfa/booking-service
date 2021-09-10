import { Spinner } from '../components/Spinner';
import { TimeSlot } from '../graphql/generated/types';
import { DisplayError } from '../components/DisplayError';

type ResourceSelectorProps = {
  isLoading: boolean;
  slots?: TimeSlot[];
};
export const ResourceSelector = (props: ResourceSelectorProps) => {
  if (props.isLoading) {
    return <Spinner />;
  }
  if (!props.slots?.length) {
    return <DisplayError>Unable to find available slots</DisplayError>;
  }
  return <div>Found some slots</div>;
};
