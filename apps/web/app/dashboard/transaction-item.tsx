import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { format } from 'date-fns';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import type { transactionItem$key } from '~/__generated__/transactionItem.graphql';
import { getStatusVariant } from '~/lib/get-status-variant';
import { StatusIcon } from '~/lib/get-status-icon';

const TransactionItemFragment = graphql`
  fragment transactionItem on Transaction {
    id
    amount
    status
    paymentType
    createdAt
    originAccount {
      id
      accountName
    }
    receiverAccount {
      id
      accountName
    }
  }
`;

// Format currency in cents to dollars with 2 decimal places
export const formatCurrency = (cents: number | null | undefined) => {
  if (cents == null) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
};

// Format date from ISO string to human-readable format
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Unknown date';

  try {
    return format(new Date(dateString), 'MMM dd, yyyy • h:mm aaa');
  } catch (e) {
    return dateString;
  }
};

type TransactionItemProps = {
  transaction: transactionItem$key;
  currentAccountId: string | null | undefined;
  compact?: boolean;
};

export function TransactionItem({
  transaction,
  currentAccountId,
  compact = false,
}: TransactionItemProps) {
  const data = useFragment<transactionItem$key>(
    TransactionItemFragment,
    transaction
  );

  const isOutgoing = data.originAccount?.id === currentAccountId;
  const amount = data.amount || 0;
  const formattedAmount = formatCurrency(amount);

  const counterparty = isOutgoing ? data.receiverAccount : data.originAccount;

  const counterpartyName = counterparty?.accountName || 'Unknown';

  if (compact) {
    // Compact version for dashboard
    return (
      <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
        <div
          className={`p-2 rounded-full mr-4 ${isOutgoing ? 'bg-red-50' : 'bg-green-50'}`}
        >
          {isOutgoing ? (
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          ) : (
            <ArrowDownLeft className="h-5 w-5 text-green-500" />
          )}
        </div>

        <div className="flex-1">
          <p className="font-medium">
            {isOutgoing
              ? `Sent to ${counterpartyName}`
              : `Received from ${counterpartyName}`}
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <span className="mr-2">{data.paymentType || 'Payment'}</span>•
            <span className="ml-2">{formatDate(data.createdAt)}</span>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`font-semibold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}
          >
            {isOutgoing ? '-' : '+'}
            {formattedAmount}
          </div>
          <div className="flex items-center justify-end mt-1">
            <StatusIcon status={data.status} />
            <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
          </div>
        </div>
      </div>
    );
  }

  // Detailed version
  return (
    <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
      <div
        className={`p-3 rounded-full mr-4 ${isOutgoing ? 'bg-red-50' : 'bg-green-50'}`}
      >
        {isOutgoing ? (
          <ArrowUpRight className="h-5 w-5 text-red-500" />
        ) : (
          <ArrowDownLeft className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium">
            {isOutgoing ? 'Payment to' : 'Payment from'} {counterpartyName}
          </p>
          <p
            className={`font-semibold ${isOutgoing ? 'text-red-600' : 'text-green-600'}`}
          >
            {isOutgoing ? '-' : '+'}
            {formattedAmount}
          </p>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm text-gray-500">
            {formatDate(data.createdAt)}
          </div>
          <Badge variant={getStatusVariant(data.status)}>
            <StatusIcon status={data.status} />
            {data.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}
