import { Layout } from '../../components/Layout';
import { useFindResourcesQuery } from '../../graphql/generated/types';
import ResourceTable from '../../kit/Table';

export default function ResourcePage() {
  const { data, loading, error } = useFindResourcesQuery({
    variables: { filterResource: {} },
  });

  return (
    <Layout social={{ title: 'Vailable | Resources' }}>
      <ResourceTable
        withHeader
        rows={data?.findResources || []}
        title={'Resources'}
      />
      {loading && <>Loading...</>}
      {!loading && error && <>Error: {String(error)}</>}

      {!loading && data?.findResources?.length === 0 && (
        <button
          type="submit"
          className="bg-green-600 text-white px-10 py-3 hover:bg-green-700 shadow-lg ml-auto">
          Add your first resource
        </button>
      )}
    </Layout>
  );
}
