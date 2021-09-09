import { Spinner } from '../components/Spinner';
import { FindAvailabilityQuery } from '../graphql/generated/types';
import { DisplayError } from '../components/DisplayError';

type ResourceSelectorProps = {
  isLoading: boolean;
  availability?: FindAvailabilityQuery;
};
export const ResourceSelector = (props: ResourceSelectorProps) => {
  if (props.isLoading) {
    return <Spinner />;
  }
  const slots = props.availability?.findAvailability || [];
  if (!slots.length) {
    return <DisplayError>Unable to find available slots</DisplayError>;
  }
  return <div>Found some slots</div>;
};
