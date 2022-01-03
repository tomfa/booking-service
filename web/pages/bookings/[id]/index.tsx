import { useRouter } from 'next/router';
import { useMemo } from 'react';
import {
  Booking,
  useGetBookingByIdQuery,
} from '../../../graphql/generated/types';
import { Layout } from '../../../components/Layout';
import InputError from '../../../components/form/InputError';
import BookingDetails from '../../../components/BookingDetails';

export default function BookingPage() {
  const router = useRouter();
  const id = useMemo(() => String(router.query.id), [router.query]);
  const { data, error } = useGetBookingByIdQuery({
    variables: { id },
  });
  const booking: Booking | undefined = useMemo(
    () => data?.getBookingById || undefined,
    [data]
  );

  return (
    <Layout social={{ title: 'Vailable | Resource' }}>
      {booking && <BookingDetails booking={booking} />}
      {error && <InputError>{error.message}</InputError>}
    </Layout>
  );
}
