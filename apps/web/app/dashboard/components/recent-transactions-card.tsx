import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { TransactionItem } from '../transaction-item';
import type { dashboardHomeQuery$data } from '~/__generated__/dashboardHomeQuery.graphql';

// Type for the 'transactions' field from the GraphQL data
type TransactionsGraphQLField = dashboardHomeQuery$data['transactions'];

// Directly infer the type of an edge from the transactions data structure
// Handles cases where 'transactions' or 'edges' could be null/undefined before accessing.
type TransactionEdgesArray = NonNullable<TransactionsGraphQLField>['edges'];
type TransactionEdge =
  TransactionEdgesArray extends ReadonlyArray<infer Item> ? Item : never;

interface TransactionsListProps {
  transactions: ReadonlyArray<TransactionEdge | null | undefined>;
  currentAccountId?: string | null;
}

function TransactionsList({
  transactions,
  currentAccountId,
}: TransactionsListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((edge) => {
        const transaction = edge?.node;
        if (!transaction) return null;

        return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            currentAccountId={currentAccountId}
            compact={true}
          />
        );
      })}
    </div>
  );
}

interface RecentTransactionsCardProps {
  transactions: ReadonlyArray<TransactionEdge | null | undefined>;
  outgoingTransactions: ReadonlyArray<TransactionEdge | null | undefined>;
  incomingTransactions: ReadonlyArray<TransactionEdge | null | undefined>;
  currentAccountId?: string | null;
}

export function RecentTransactionsCard({
  transactions,
  outgoingTransactions,
  incomingTransactions,
  currentAccountId,
}: RecentTransactionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TransactionsList
              transactions={transactions}
              currentAccountId={currentAccountId}
            />
          </TabsContent>

          <TabsContent value="outgoing" className="mt-4">
            <TransactionsList
              transactions={outgoingTransactions}
              currentAccountId={currentAccountId}
            />
          </TabsContent>

          <TabsContent value="incoming" className="mt-4">
            <TransactionsList
              transactions={incomingTransactions}
              currentAccountId={currentAccountId}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="outline" asChild>
          <Link to="/dashboard/transactions">View All Transactions</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
