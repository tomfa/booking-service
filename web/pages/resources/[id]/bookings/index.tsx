import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../../components/Layout';
import { useFindBookingsLazyQuery } from '../../../../graphql/generated/types';
import BookingTable from '../../../../components/BookingTable';

export default function BookingList() {
  const router = useRouter();
  const [showCanceledBookings, setShowCanceledBookings] = useState(false);
  const [findBookings, { data, loading, error }] = useFindBookingsLazyQuery();

  useEffect(() => {
    if (!router.query.id) {
      return;
    }
    findBookings({
      variables: {
        filterBookings: {
          includeCanceled: showCanceledBookings,
          resourceIds: [String(router.query.id || '')],
        },
      },
    });
  }, [router.query.id, showCanceledBookings]);

  const resource = useMemo(() => {
    if (data?.findBookings?.length) {
      return data?.findBookings[0].resource;
    }
    return undefined;
  }, [data]);
  const tableLabel = resource ? `Bookings for ${resource.label}` : `Bookings`;

  return (
    <Layout social={{ title: `Vailable | Bookings` }} crumbs>
      <BookingTable
        withHeader
        rows={data?.findBookings || []}
        resourceId={String(router.query.id)}
        title={tableLabel}
        onToggleDisabled={() => setShowCanceledBookings(t => !t)}
        error={error?.message}
      />
      {loading && <>Loading...</>}
    </Layout>
  );
}
