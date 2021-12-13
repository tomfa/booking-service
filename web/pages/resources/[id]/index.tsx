import { useRouter } from 'next/router';
import { useMemo } from 'react';
import {
  Resource,
  useGetResourceByIdQuery,
} from '../../../graphql/generated/types';
import { Layout } from '../../../components/Layout';
import ResourceDetails from '../../../kit/Details';
import InputError from '../../../components/form/InputError';

export default function ResourcePage() {
  const router = useRouter();
  const id = useMemo(() => String(router.query.id), [router.query]);
  const { data, error } = useGetResourceByIdQuery({
    variables: { id },
  });
  const resource: Resource | undefined = useMemo(
    () => data?.getResourceById || undefined,
    [data]
  );

  return (
    <Layout social={{ title: 'Vailable | Resource' }}>
      {resource && <ResourceDetails resource={resource} />}
      {error && <InputError>{error.message}</InputError>}
    </Layout>
  );
}
