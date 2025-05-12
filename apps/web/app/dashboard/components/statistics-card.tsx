import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, BarChart3 } from 'lucide-react';

interface StatisticsCardsProps {
  outgoingTransactionsCount: number;
  incomingTransactionsCount: number;
  totalTransactionsCount: number;
}

export function StatisticsCards({
  outgoingTransactionsCount,
  incomingTransactionsCount,
  totalTransactionsCount,
}: StatisticsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Outgoing
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <ArrowUpRight className="h-4 w-4 text-red-500 mr-2" />
          <div className="text-2xl font-semibold">
            {outgoingTransactionsCount}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Incoming
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <ArrowDownLeft className="h-4 w-4 text-green-500 mr-2" />
          <div className="text-2xl font-semibold">
            {incomingTransactionsCount}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center">
          <BarChart3 className="h-4 w-4 text-blue-500 mr-2" />
          <div className="text-2xl font-semibold">{totalTransactionsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
