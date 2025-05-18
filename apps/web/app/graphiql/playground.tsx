import { GraphiQL } from 'graphiql';
import 'graphiql/style.css';

import { GRAPHQL_ENDPOINT } from '~/relay/network';

export default function GraphiQLPage() {
  return (
    <div style={{ height: '100vh' }}>
      <GraphiQL
        fetcher={async (graphQLParams) => {
          const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(graphQLParams),
          });
          return response.json();
        }}
      />
    </div>
  );
}
