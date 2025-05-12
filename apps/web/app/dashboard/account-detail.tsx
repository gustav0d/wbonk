import { useFragment, useLazyLoadQuery } from 'react-relay';
import { useNavigate } from 'react-router';
import { graphql } from 'relay-runtime';
import type { accountDetail$key } from '~/__generated__/accountDetail.graphql';
import type { accountDetailTransactionsQuery } from '~/__generated__/accountDetailTransactionsQuery.graphql';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Calendar, Plus } from 'lucide-react';

import {
  TransactionItem,
  formatCurrency,
  formatDate,
} from './transaction-item';
import { TypographyH3 } from '~/components/ui/typography/h3';

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

const accountDetailTransactionsQuery = graphql`
  query accountDetailTransactionsQuery($first: Int) {
    transactions(first: $first) {
      edges {
        node {
          id
          originAccount {
            id
          }
          receiverAccount {
            id
          }
          ...transactionItem
        }
      }
    }
    myAccount {
      id
    }
  }
`;

type Props = { account: accountDetail$key };

export function AccountDetail(props: Props) {
  const navigate = useNavigate();
  const account = useFragment<accountDetail$key>(
    AccountDetailFragment,
    props.account
  );

  const transactionData = useLazyLoadQuery<accountDetailTransactionsQuery>(
    accountDetailTransactionsQuery,
    { first: 3 },
    { fetchPolicy: 'store-and-network' }
  );

  const currentAccountId = transactionData?.myAccount?.id;
  const transactions = transactionData?.transactions?.edges || [];
  const recentTransactions = transactions.slice(0, 3);

  const accountAge = account.createdAt
    ? Math.floor(
        (new Date().getTime() - new Date(account.createdAt).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const outgoingCount = transactions.filter(
    (edge) => edge?.node?.originAccount?.id === currentAccountId
  ).length;

  const incomingCount = transactions.filter(
    (edge) => edge?.node?.receiverAccount?.id === currentAccountId
  ).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Information</CardTitle>
          <CardDescription>Your financial account details</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <TypographyH3>ACCOUNT NAME</TypographyH3>
              <p className="text-lg font-semibold">
                {account.accountName || 'My Account'}
              </p>
            </div>

            <div>
              <TypographyH3>ACCOUNT ID</TypographyH3>
              <p className="text-lg font-mono">{account._id}</p>
            </div>

            <div>
              <TypographyH3>ACCOUNT AGE</TypographyH3>
              <p className="text-lg font-semibold">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {accountAge} days (Created {formatDate(account.createdAt)})
                </div>
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <TypographyH3>CURRENT BALANCE</TypographyH3>
              <p className="text-3xl font-bold">
                {formatCurrency(parseInt(account.balance || '0', 10))}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex items-center p-3 bg-green-50 rounded-md">
                <ArrowDownLeft className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-xs text-green-700">Incoming</p>
                  <p className="font-semibold">{incomingCount}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-red-50 rounded-md">
                <ArrowUpRight className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <p className="text-xs text-red-700">Outgoing</p>
                  <p className="font-semibold">{outgoingCount}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button
            className="mr-2"
            onClick={() => navigate('/dashboard/create-transaction')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/transactions')}
          >
            View All Transactions
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activities</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((edge) => {
                const transaction = edge?.node;
                if (!transaction) return null;

                return (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    currentAccountId={currentAccountId}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recent transactions found
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/transactions')}
          >
            View All Transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
