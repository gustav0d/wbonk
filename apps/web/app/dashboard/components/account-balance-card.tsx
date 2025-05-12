import { Link } from 'react-router';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '../transaction-item'; // Assuming formatCurrency is here

interface AccountBalanceCardProps {
  balance: number;
  accountId?: string | null;
}

export function AccountBalanceCard({
  balance,
  accountId,
}: AccountBalanceCardProps) {
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-500">
          Current Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{formatCurrency(balance)}</div>
        <div className="text-sm text-gray-500 mt-1">
          Account ID: {accountId || 'N/A'}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/dashboard/account">
            View Account Details
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
