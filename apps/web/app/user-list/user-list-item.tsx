import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { userListItem$key } from '~/__generated__/userListItem.graphql';

const UserListFragment = graphql`
  fragment userListItem on User {
    id
    name
    email
    _id
    createdAt
    updatedAt
  }
`;

type Props = { user: userListItem$key };
export function UserListItem(props: Props) {
  const user = useFragment<userListItem$key>(UserListFragment, props.user);
  return (
    <li key={user.id}>
      {user.name} ({user.email})
    </li>
  );
}
