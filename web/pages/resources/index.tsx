import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { useFindResourcesQuery } from '../../graphql/generated/types';
import ResourceTable from '../../kit/Table';

export default function ResourcePage() {
  const [showDisabledResources, setShowDisabledResources] = useState(false);
  const { data, loading, error } = useFindResourcesQuery({
    variables: { filterResource: { enabled: !showDisabledResources } },
  });

  return (
    <Layout social={{ title: 'Vailable | Resources' }} crumbs>
      <ResourceTable
        withHeader
        rows={data?.findResources || []}
        title={'Resources'}
        onToggleDisabled={() => setShowDisabledResources(t => !t)}
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
