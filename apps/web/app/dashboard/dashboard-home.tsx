import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';
import type { dashboardHomeQuery } from '~/__generated__/dashboardHomeQuery.graphql';

import { WelcomeHeader } from './components/welcome-header';
import { AccountBalanceCard } from './components/account-balance-card';
import { QuickActionsCard } from './components/quick-action-card';
import { StatisticsCards } from './components/statistics-card';
import { RecentTransactionsCard } from './components/recent-transactions-card';
import { Suspense } from 'react';

const dashboardQuery = graphql`
  query dashboardHomeQuery {
    me {
      id
      name
      email
    }
    myAccount {
      id
      accountName
      balance
      _id
    }
    transactions {
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
  }
`;

export default function DashboardHome() {
  const data = useLazyLoadQuery<dashboardHomeQuery>(
    dashboardQuery,
    {},
    { fetchPolicy: 'store-and-network' }
  );

  const myUserData = data?.me;
  const myAccount = data?.myAccount;
  const transactions = data?.transactions?.edges || [];

  // Calculate some basic stats from transactions
  const outgoingTransactions = transactions.filter(
    (edge) => edge?.node && edge?.node?.originAccount?.id === myAccount?.id
  );

  const incomingTransactions = transactions.filter(
    (edge) => edge?.node && edge?.node?.receiverAccount?.id === myAccount?.id
  );

  const balance = myAccount?.balance ? parseInt(myAccount.balance, 10) : 0;

  return (
    <Suspense fallback="loading...">
      <div className="container mx-auto py-8">
        <WelcomeHeader userName={myUserData?.name} />

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <AccountBalanceCard balance={balance} accountId={myAccount?._id} />
          <QuickActionsCard />
        </div>

        <StatisticsCards
          outgoingTransactionsCount={outgoingTransactions.length}
          incomingTransactionsCount={incomingTransactions.length}
          totalTransactionsCount={transactions.length}
        />

        <RecentTransactionsCard
          transactions={transactions}
          outgoingTransactions={outgoingTransactions}
          incomingTransactions={incomingTransactions}
          currentAccountId={myAccount?.id}
        />
      </div>
    </Suspense>
  );
}
