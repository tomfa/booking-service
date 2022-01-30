import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import {
  Resource,
  useFindAvailabilityLazyQuery,
  useGetResourceByIdLazyQuery,
} from '../../../../graphql/generated/types';
import { Layout } from '../../../../components/Layout';
import { DisplayError } from '../../../../components/DisplayError';
import AddBookingForm from '../../../../components/AddBookingForm';
import { toGQLDate } from '../../../../utils/date.utils';

export default function BookingPage() {
  const router = useRouter();

  const [
    getResourceById,
    { data: resourceData, error },
  ] = useGetResourceByIdLazyQuery();

  useEffect(() => {
    if (!router.query.id || resourceData) {
      return;
    }
    getResourceById({ variables: { id: String(router.query.id) } });
  }, [resourceData, getResourceById, router.query]);

  const resource: Resource | undefined = useMemo(
    () => resourceData?.getResourceById || undefined,
    [resourceData]
  );
  const [fetchAvailability, { data }] = useFindAvailabilityLazyQuery();
  useEffect(
    () =>
      resource &&
      fetchAvailability({
        variables: {
          filterAvailability: {
            resourceIds: [resource.id],
            to: toGQLDate(new Date(Date.now() + 21 * 24 * 3600 * 1000)),
          },
        },
      }),
    [resource, fetchAvailability]
  );

  if (error) {
    return (
      <Layout social={{ title: 'Vailable | Add booking' }}>
        <DisplayError>{error.message}</DisplayError>
      </Layout>
    );
  }

  if (!resource) {
    return (
      <Layout social={{ title: 'Vailable | Add booking' }}>
        <>Loading</>
      </Layout>
    );
  }

  return (
    <Layout social={{ title: 'Vailable | Add booking' }} crumbs>
      <AddBookingForm
        resource={resource}
        availableSlots={data?.findAvailability}
      />
    </Layout>
  );
}
