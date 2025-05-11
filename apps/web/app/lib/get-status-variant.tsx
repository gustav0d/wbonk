// Get status badge variant based on transaction status
export type StatusVariants =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline';
export const getStatusVariant = (
  status: string | null | undefined
): StatusVariants => {
  const variants: Record<string, StatusVariants> = {
    PAID: 'default' as const,
    PENDING: 'secondary',
    FAILED: 'destructive',
  };

  return variants[status || ''] || 'outline';
};
