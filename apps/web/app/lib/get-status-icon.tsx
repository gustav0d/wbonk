import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const StatusIcon = ({
  status,
}: {
  status: string | null | undefined;
}) => {
  const icons: Record<string, React.ReactNode> = {
    PAID: <CheckCircle className="w-3 h-3 mr-1" />,
    PENDING: <Clock className="w-3 h-3 mr-1" />,
    FAILED: <AlertCircle className="w-3 h-3 mr-1" />,
  };

  return icons[status || ''] || null;
};
