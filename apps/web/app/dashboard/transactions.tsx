import { Suspense, useState } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { graphql } from 'relay-runtime';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Badge } from '~/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Search, XCircle } from 'lucide-react';

import { formatCurrency, formatDate } from './transaction-item';
import type { transactionsQuery } from '~/__generated__/transactionsQuery.graphql';
import { getStatusVariant } from '~/lib/get-status-variant';

const transactionsQuery = graphql`
  query transactionsQuery($first: Int) {
    myAccount {
      id
      accountName
    }
    transactions(first: $first) {
      edges {
        node {
          id
          amount
          status
          createdAt
          paymentType
          ...transactionItem
          # Additional fields needed that aren't in the fragment
          originAccount {
            id
            accountName
          }
          receiverAccount {
            id
            accountName
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const data = useLazyLoadQuery<transactionsQuery>(
    transactionsQuery,
    { first: 50 },
    { fetchPolicy: 'store-and-network' }
  );

  const me = data?.myAccount;
  const transactions = data?.transactions?.edges || [];

  // Filter transactions
  const filteredTransactions = transactions.filter((edge) => {
    const transaction = edge?.node;
    if (!transaction) return false;

    // Apply search term filter (search in names or emails)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const originName =
        transaction.originAccount?.accountName?.toLowerCase() || '';
      const receiverName =
        transaction.receiverAccount?.accountName?.toLowerCase() || '';

      const matchesSearch =
        originName.includes(searchLower) || receiverName.includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }

    // Apply transaction type filter
    if (typeFilter !== 'all') {
      const isOutgoing = transaction.originAccount?.id === me?.id;
      if (typeFilter === 'outgoing' && !isOutgoing) return false;
      if (typeFilter === 'incoming' && isOutgoing) return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Narrow down your transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by name or email"
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="absolute right-2.5 top-2.5"
                    onClick={() => setSearchTerm('')}
                  >
                    <XCircle className="h-4 w-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="outgoing">Outgoing</SelectItem>
                  <SelectItem value="incoming">Incoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="secondary"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length}{' '}
            transactions
          </CardDescription>
        </CardHeader>
        <Suspense fallback="loading">
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Counterparty</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTransactions.map((edge) => {
                    const transaction = edge?.node;
                    if (!transaction) return null;

                    const isOutgoing = transaction.originAccount?.id === me?.id;
                    const amount = transaction.amount || 0;
                    const formattedAmount = formatCurrency(amount);

                    const counterparty = isOutgoing
                      ? transaction.receiverAccount
                      : transaction.originAccount;

                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`p-2 rounded-full mr-2 ${isOutgoing ? 'bg-red-50' : 'bg-green-50'}`}
                            >
                              {isOutgoing ? (
                                <ArrowUpRight className="h-4 w-4 text-red-500" />
                              ) : (
                                <ArrowDownLeft className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <span>{isOutgoing ? 'Sent' : 'Received'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {counterparty?.accountName || 'Unknown'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className={`font-medium ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}
                        >
                          {isOutgoing ? '-' : '+'}
                          {formattedAmount}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.paymentType || 'Standard'}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No transactions found matching your filters
              </div>
            )}
          </CardContent>
        </Suspense>
      </Card>
    </div>
  );
}
