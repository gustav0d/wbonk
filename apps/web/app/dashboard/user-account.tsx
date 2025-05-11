import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { userAccountQuery } from '~/__generated__/userAccountQuery.graphql';
import { UserDetail } from './user-detail';
import { AccountDetail } from './account-detail';

const userAccountQuery = graphql`
  query userAccountQuery {
    me {
      id
      ...userDetail
    }
    myAccount {
      id
      ...accountDetail
    }
  }
`;

export default function UserAccount() {
  const data = useLazyLoadQuery<userAccountQuery>(
    userAccountQuery,
    {},
    { fetchPolicy: 'store-and-network' }
  );

  const user = data?.me;
  const account = data?.myAccount;

  return (
    <div className="space-y-6">
      {user ? (
        <UserDetail user={user} />
      ) : (
        <div className="rounded-lg border border-muted p-6 shadow-sm">
          <h3 className="font-semibold">User Profile</h3>
          <p className="text-muted-foreground">
            User information not available
          </p>
        </div>
      )}

      {account ? (
        <AccountDetail account={account} />
      ) : (
        <div className="rounded-lg border border-muted p-6 shadow-sm">
          <h3 className="font-semibold">Account Information</h3>
          <p className="text-muted-foreground">
            No account information available
          </p>
        </div>
      )}
    </div>
  );
}
