import { useNavigate } from 'react-router';
import { Button } from '~/components/ui/button';
import { Plus } from 'lucide-react';

interface WelcomeHeaderProps {
  userName?: string | null;
}

export function WelcomeHeader({ userName }: WelcomeHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userName || 'User'}</h1>
        <p className="text-gray-500">Here's an overview of your finances</p>
      </div>
      <Button
        onClick={() => navigate('/dashboard/create-transaction')}
        className="mt-4 md:mt-0"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Transaction
      </Button>
    </div>
  );
}
