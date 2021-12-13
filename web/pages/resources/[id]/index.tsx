import { useRouter } from 'next/router';
import { useMemo } from 'react';
import Link from 'next/link';
import {
  HourSchedule,
  Resource,
  Schedule,
  useGetResourceByIdQuery,
} from '../../../graphql/generated/types';
import { Layout } from '../../../components/Layout';

const OpeningHours = ({
  hours,
  label,
}: {
  hours: HourSchedule;
  label: string;
}) => {
  return (
    <li>
      {label}: {hours.start} - {hours.end}{' '}
      <small> – {hours.slotDurationMinutes}min slots</small>
    </li>
  );
};

const WeekSchedule = ({ schedule }: { schedule: Schedule }) => (
  <ul>
    <OpeningHours hours={schedule.mon} label={'Monday'} />
    <OpeningHours hours={schedule.tue} label={'Tueday'} />
    <OpeningHours hours={schedule.wed} label={'Wednesday'} />
    <OpeningHours hours={schedule.thu} label={'Thursday'} />
    <OpeningHours hours={schedule.fri} label={'Friday'} />
    <OpeningHours hours={schedule.sat} label={'Saturday'} />
    <OpeningHours hours={schedule.sun} label={'Sunday'} />
  </ul>
);

export default function ResourcePage() {
  const router = useRouter();

  const { data } = useGetResourceByIdQuery({
    variables: { id: String(router.query.id) },
  });
  const resource: Resource | undefined = useMemo(
    () => data?.getResourceById || undefined,
    [data]
  );

  return (
    <Layout social={{ title: 'Vailable | Resource' }}>
      {!resource && <>Loading...</>}
      {resource && (
        <div>
          <h3>{resource.label}</h3>
          <Link href={`/resources/${resource.id}/book`}>Book</Link>
          <ul>
            <li>Status: {(!resource.enabled && 'Disabled') || 'Enabled'}</li>
            <li>Seats: {resource.seats}</li>
            <li>Category: {resource.category || '(Not set)'}</li>
            <li>id: {resource.id}</li>
          </ul>
          <h4>Opening hours</h4>
          <WeekSchedule schedule={resource.schedule} />
        </div>
      )}
    </Layout>
  );
}
