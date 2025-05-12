import { Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRelayEnvironment } from 'react-relay';
import { v4 as uuidv4 } from 'uuid';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { commitCreateTransactionMutation } from './create-transaction-mutation';
import { ReceiverAccountSelect } from '~/dashboard/create-transaction/receiver-account-select';

// Create a schema for form validation
const transactionSchema = z.object({
  receiverAccountId: z.string().min(1, {
    message: 'Receiver account ID is required',
  }),
  amount: z.coerce
    .number()
    .positive({ message: 'Amount must be positive' })
    .int({ message: 'Amount must be a whole number' }),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function NewTransaction() {
  const navigate = useNavigate();
  const environment = useRelayEnvironment();
  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      receiverAccountId: '',
      amount: 0,
    },
  });

  async function onSubmit(data: TransactionFormValues) {
    setIsSubmitting(true);
    setGeneralError(null);
    setSuccess(false);

    try {
      const response = await commitCreateTransactionMutation(
        environment,
        data.amount,
        data.receiverAccountId,
        idempotencyKey
      );

      // Check for validation errors from the server
      const mutationResponse = response.createTransaction;
      if (!mutationResponse) {
        setGeneralError('Something went wrong. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (mutationResponse.error) {
        const { field, message } = mutationResponse.error;
        if (field) {
          form.setError(field as any, { message: message ?? '' });
        } else {
          setGeneralError(
            message || 'An error occurred during transaction creation'
          );
        }
        setIsSubmitting(false);
        return;
      }

      // Handle successful transaction
      if (mutationResponse.transaction?.id) {
        setSuccess(true);
        setTransactionId(mutationResponse.transaction.id);
        setIdempotencyKey(uuidv4());
        form.reset(); // Reset the form on success
      } else {
        setGeneralError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Transaction error:', error);
      setGeneralError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Create New Transaction
          </CardTitle>
          <CardDescription>Transfer funds to another account</CardDescription>
        </CardHeader>
        <Suspense fallback="loading">
          <CardContent>
            {success && (
              <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Transaction Successful</AlertTitle>
                <AlertDescription>
                  Your transaction has been processed successfully.
                  {transactionId && (
                    <div className="text-xs mt-1">
                      Transaction ID: {transactionId}
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <Link
                      to="/dashboard/transactions"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Click here to go see to your transactions
                    </Link>
                  </div>
                  <div className="mt-4 text-center">
                    Or send money to someone else!
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {generalError && (
              <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="receiverAccountId"
                  disabled={success}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Account</FormLabel>
                      <FormControl>
                        <ReceiverAccountSelect
                          value={field.value}
                          onChange={field.onChange}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormDescription>
                        The account ID of the recipient
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  disabled={success}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Amount in cents (whole number)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || success}
                >
                  {isSubmitting ? 'Processing...' : 'Send Money'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Suspense>
        <CardFooter className="flex justify-end">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
