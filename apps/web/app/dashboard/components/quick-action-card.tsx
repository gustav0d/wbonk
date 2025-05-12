import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { ArrowUpRight, History, CreditCard } from 'lucide-react';

export function QuickActionsCard() {
  const navigate = useNavigate();

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Manage your account with these shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24"
            onClick={() => navigate('/dashboard/create-transaction')}
          >
            <ArrowUpRight className="h-6 w-6 mb-2" />
            <span>Send Money</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24"
            onClick={() => navigate('/dashboard/transactions')}
          >
            <History className="h-6 w-6 mb-2" />
            <span>Transaction History</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24"
            onClick={() => navigate('/dashboard/account')}
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span>Account Details</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
