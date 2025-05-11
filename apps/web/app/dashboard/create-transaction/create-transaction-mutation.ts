import { graphql } from 'relay-runtime';
import { commitMutation } from 'react-relay';
import type { Environment } from 'relay-runtime';
import type {
  createTransactionMutation as CreateTransactionMutationType,
  createTransactionMutation$data,
} from '~/__generated__/createTransactionMutation.graphql';

const mutation = graphql`
  mutation createTransactionMutation($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      transaction {
        id
        amount
        status
        paymentType
        createdAt
      }
      originAccountUpdatedBalance
      error {
        field
        message
      }
      success
    }
  }
`;

export function commitCreateTransactionMutation(
  environment: Environment,
  amount: number,
  receiverAccountId: string,
  idempotencyKey: string
): Promise<createTransactionMutation$data> {
  const variables = {
    input: {
      amount,
      receiverAccountId,
      idempotencyKey,
      clientMutationId: '',
    },
  };

  return new Promise((resolve, reject) => {
    commitMutation<CreateTransactionMutationType>(environment, {
      mutation,
      variables,
      onCompleted: (response, errors) => {
        if (errors) {
          return reject(errors);
        }
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
}
