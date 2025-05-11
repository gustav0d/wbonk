import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { accountDetail$key } from '~/__generated__/accountDetail.graphql';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const AccountDetailFragment = graphql`
  fragment accountDetail on Account {
    id
    accountName
    balance
    _id
    createdAt
    updatedAt
  }
`;

type Props = { account: accountDetail$key };

export function AccountDetail(props: Props) {
  const account = useFragment<accountDetail$key>(
    AccountDetailFragment,
    props.account
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Account Name:</span>{' '}
            {account.accountName}
          </p>
          <p>
            <span className="font-medium">Balance:</span> ${account.balance}
          </p>
          <p>
            <span className="font-medium">Account ID:</span> {account._id}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
