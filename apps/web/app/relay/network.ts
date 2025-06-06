import {
  Network,
  QueryResponseCache,
  type CacheConfig,
  type ConcreteRequest,
  type RequestParameters,
  type Variables,
} from 'relay-runtime';
import { getToken } from '~/auth/security';

const ONE_MINUTE_IN_MS = 60 * 1000;

function createNetwork() {
  const responseCache = new QueryResponseCache({
    size: 100,
    ttl: ONE_MINUTE_IN_MS,
  });

  async function fetchResponse(
    operation: RequestParameters,
    variables: Variables,
    cacheConfig: CacheConfig
  ) {
    const { id } = operation;

    const isQuery = operation.operationKind === 'query';
    const isMutation = operation.operationKind === 'mutation';
    const forceFetch = cacheConfig && cacheConfig.force;

    if (!isMutation && isQuery && !forceFetch && id) {
      const fromCache = responseCache.get(id, variables);
      if (!!fromCache) {
        return Promise.resolve(fromCache);
      }
    }

    const response = await networkFetch(operation, variables);

    if (isQuery && id) {
      responseCache.set(id, variables, response);
    }

    return response;
  }

  // Use fetchResponse instead of networkFetch to enable caching
  const network = Network.create(fetchResponse);
  return network;
}

// dev: http://127.0.0.1:3000/graphql
export const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_API_ENDPOINT;

async function networkFetch(params: RequestParameters, variables: Variables) {
  const authToken = getToken();
  const authorization = authToken ? `Bearer ${authToken}` : '';
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      authorization,
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  // Get the response as JSON
  const json = await response.json();

  // GraphQL returns exceptions (for example, a missing required variable) in the "errors"
  // property of the response. If any exceptions occurred when processing the request,
  // throw an error to indicate to the developer what went wrong.
  if (Array.isArray(json.errors)) {
    throw new Error(
      `Error fetching GraphQL query '${params.name}' with variables '${JSON.stringify(variables)}': ${JSON.stringify(
        json.errors
      )}`
    );
  }

  // Otherwise, return the full payload.
  return json;
}

async function getPreloadedQuery(
  { params }: ConcreteRequest,
  variables: Variables
) {
  const response = await networkFetch(params, variables);
  return {
    params,
    variables,
    response,
  };
}

export { createNetwork, getPreloadedQuery };
