import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../../components/Layout';
import {
  useFindBookingsLazyQuery,
} from '../../../../graphql/generated/types';
import BookingTable from '../../../../components/BookingTable';

export default function BookingList() {
  const router = useRouter();
  const [showCanceledBookings, setShowCanceledBookings] = useState(false);
  const [findBookings, { data, loading, error }] = useFindBookingsLazyQuery();

  useEffect(() => {
    if (!router.query.id || data) {
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
  }, [router.query.id]);

  return (
    <Layout social={{ title: `Vailable | Bookings` }}>
      <BookingTable
        withHeader
        rows={data?.findBookings || []}
        title={'Bookings'}
        onToggleDisabled={() => setShowCanceledBookings(t => !t)}
      />
      {loading && <>Loading...</>}
      {!loading && error && <>Error: {String(error)}</>}

      {!loading && data?.findBookings?.length === 0 && (
        <span className="bg-gray-600 text-white px-10 py-3 shadow-lg ml-auto">
          No bookings found
        </span>
      )}
    </Layout>
  );
}
