import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { userDetail$key } from '~/__generated__/userDetail.graphql';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const UserDetailFragment = graphql`
  fragment userDetail on User {
    id
    name
    email
    _id
    createdAt
    updatedAt
  }
`;

type Props = { user: userDetail$key };

export function UserDetail(props: Props) {
  const user = useFragment<userDetail$key>(UserDetailFragment, props.user);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Name:</span> {user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium">User ID:</span> {user._id}
          </p>
          <p>
            <span className="font-medium">Joined:</span>{' '}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'Unknown'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
