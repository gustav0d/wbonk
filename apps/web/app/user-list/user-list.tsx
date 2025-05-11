import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import { UserListItem } from './user-list-item';
import type { userListQuery } from '~/__generated__/userListQuery.graphql';

const userListQuery = graphql`
  query userListQuery {
    users {
      edges {
        cursor
        node {
          id
          ...userListItem
        }
      }
    }
  }
`;

export function UserList() {
  // Use a fetch policy that will check for updated data
  // This ensures the component will refresh when store is invalidated
  const data = useLazyLoadQuery<userListQuery>(
    userListQuery,
    {},
    { fetchPolicy: 'store-and-network' }
  );

  const { edges } = data?.users;
  return (
    <div>
      <h2>Users</h2>
      {Array.isArray(edges) ? (
        <ul>
          {edges.length > 0 ? (
            edges.map((edge) => {
              if (!edge.node) {
                return null;
              }
              return <UserListItem key={edge.node.id} user={edge.node} />;
            })
          ) : (
            <li>No users found</li>
          )}
        </ul>
      ) : (
        <p>No users data available</p>
      )}
    </div>
  );
}
