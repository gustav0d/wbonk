import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { userAccountQuery } from '~/__generated__/userAccountQuery.graphql';
import { UserDetail } from './user-detail';
import { AccountDetail } from './account-detail';
import { TypographyH3 } from '~/components/ui/typography/h3';

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
          <TypographyH3>User Profile</TypographyH3>
          <p className="text-muted-foreground">
            User information not available
          </p>
        </div>
      )}

      {account ? (
        <AccountDetail account={account} />
      ) : (
        <div className="rounded-lg border border-muted p-6 shadow-sm">
          <TypographyH3>Account Information</TypographyH3>
          <p className="text-muted-foreground">
            No account information available
          </p>
        </div>
      )}
    </div>
  );
}
