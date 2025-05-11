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
          ...userListItem
        }
      }
    }
  }
`;

export function UserList() {
  const data = useLazyLoadQuery<userListQuery>(userListQuery, {});

  const { edges } = data?.users;
  return (
    <div>
      <h2>Users</h2>
      {Array.isArray(edges) ? (
        <ul>
          {edges.length > 0 ? (
            edges.map((edge) => {
              if (edge.node) return <UserListItem key={edge.id} user={edge} />;
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
