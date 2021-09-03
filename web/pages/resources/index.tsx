import { Layout } from '../../components/Layout';
import { Resource, useFindResourcesQuery } from '../../graphql/generated/types';

const ResourceListItem = ({ resource }: { resource: Resource }) => {
  return (
    <tr>
      <td>{resource.label}</td>
      <td>{resource.category || '-'}</td>
      <td>{resource.seats}</td>
      <td>{(resource.enabled && 'Yes') || 'No'}</td>
    </tr>
  );
};

export default function ResourcePage() {
  const { data, loading, error } = useFindResourcesQuery({
    variables: { filterResource: {} },
  });

  return (
    <Layout social={{ title: 'Vailable | Resources' }}>
      <h3>Ressurser</h3>
      {loading && <>Loading...</>}
      {!loading && error && <>Error: {String(error)}</>}

      {data?.findResources.length && (
        <table>
          <thead>
            <tr>
              <td>label</td>
              <td>category</td>
              <td>seats</td>
              <td>enabled</td>
            </tr>
          </thead>
          <tbody>
            {data.findResources.map(r => (
              <ResourceListItem key={r.id} resource={r} />
            ))}
          </tbody>
        </table>
      )}
      {data?.findResources.length === 0 && <>You have no resources</>}
      <table>
        <tr />
      </table>
    </Layout>
  );
}
