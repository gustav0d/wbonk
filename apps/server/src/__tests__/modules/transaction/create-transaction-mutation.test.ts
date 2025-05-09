import { describe, it, expect } from '@jest/globals';
import request from 'supertest-graphql';

import { gql } from '../../setup/utils/gql';
import { getTestAccounts } from '../../setup/fixtures/accounts';
import { getTestUsers } from '../../setup/fixtures/users';
import { generateUniqueIntId } from '../../setup/utils/generateUniqueIntId';
import { Account } from '../../../modules/account/account-model';
import { Transaction } from '../../../modules/transaction/transaction-model';
import { generateToken } from '../../../auth';
import { setupTestApp } from '../../setup/utils/setupTestApp';

describe('CreateTransactionMutation', () => {
  // it('should create a transaction successfully with valid inputs', async () => {
  //   // Setup test accounts and user context
  //   const accounts = await getTestAccounts();
  //   const users = await getTestUsers();
  //   const senderAccount = accounts[0]; // Account with $100.00 balance
  //   const receiverAccount = accounts[1]; // Account with $250.00 balance
  //   const user = users[0];

  //   const initialSenderBalance = senderAccount.balance;
  //   const initialReceiverBalance = receiverAccount.balance;
  //   const transferAmount = 2000; // $20.00

  //   const mutation = gql`
  //     mutation CreateTransaction($input: CreateTransactionInput!) {
  //       createTransaction(input: $input) {
  //         success
  //         transaction {
  //           id
  //           amount
  //           status
  //           paymentType
  //         }
  //         originAccountUpdatedBalance
  //         error {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       amount: transferAmount,
  //       receiverAccountId: receiverAccount._id.toString(),
  //       idempotencyKey: `test-transaction-${generateUniqueIntId()}`,
  //       clientMutationId: '1',
  //     },
  //   };

  //   // Generate a valid auth token for the sender user
  //   const authToken = generateToken(user);

  //   const app = await setupTestApp();
  //   const result = await request(app.callback())
  //     .query(mutation)
  //     .variables(variables)
  //     .set({ Authorization: `Bearer ${authToken}` })
  //     .end();

  //   expect(result.errors).toBeUndefined();
  //   expect((result.data as any)?.createTransaction.success).toBe(
  //     'Transaction created successfully'
  //   );
  //   expect((result.data as any)?.createTransaction.transaction).toBeTruthy();
  //   expect((result.data as any)?.createTransaction.transaction.amount).toBe(
  //     transferAmount
  //   );
  //   expect((result.data as any)?.createTransaction.transaction.status).toBe(
  //     'PAID'
  //   );
  //   expect(
  //     (result.data as any)?.createTransaction.originAccountUpdatedBalance
  //   ).toBe(initialSenderBalance - transferAmount);

  //   // Verify the database was updated correctly
  //   const updatedSenderAccount = await Account.findById(senderAccount._id);
  //   const updatedReceiverAccount = await Account.findById(receiverAccount._id);

  //   expect(updatedSenderAccount?.balance).toBe(
  //     initialSenderBalance - transferAmount
  //   );
  //   expect(updatedReceiverAccount?.balance).toBe(
  //     initialReceiverBalance + transferAmount
  //   );
  // });

  // it('should prevent transaction when sender has insufficient balance', async () => {
  //   // Setup test accounts and user context
  //   const accounts = await getTestAccounts();
  //   const users = await getTestUsers();
  //   const senderAccount = accounts[0];
  //   const receiverAccount = accounts[1];
  //   const user = users[0];

  //   // Try to transfer more than the sender has
  //   const transferAmount = senderAccount.balance + 1000; // $10.00 more than available

  //   const mutation = gql`
  //     mutation CreateTransaction($input: CreateTransactionInput!) {
  //       createTransaction(input: $input) {
  //         success
  //         transaction {
  //           id
  //         }
  //         error {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       amount: transferAmount,
  //       receiverAccountId: receiverAccount._id.toString(),
  //       idempotencyKey: `test-transaction-${generateUniqueIntId()}`,
  //       clientMutationId: '1',
  //     },
  //   };

  //   // Generate a valid auth token for the sender user
  //   const authToken = generateToken(user);

  //   const app = await setupTestApp();
  //   const result = await request(app.callback())
  //     .query(mutation)
  //     .variables(variables)
  //     .set({ Authorization: `Bearer ${authToken}` })
  //     .end();

  //   expect(result.errors).toBeUndefined();
  //   expect((result.data as any)?.createTransaction.success).toBe('false');
  //   expect((result.data as any)?.createTransaction.error.field).toBe('amount');
  //   expect((result.data as any)?.createTransaction.error.message).toContain(
  //     'Not enough balance'
  //   );
  // });

  // it('should prevent transaction with negative amount', async () => {
  //   // Setup test accounts and user context
  //   const accounts = await getTestAccounts();
  //   const users = await getTestUsers();
  //   const receiverAccount = accounts[1];
  //   const user = users[0];

  //   const transferAmount = -1000; // Trying to transfer negative amount

  //   const mutation = gql`
  //     mutation CreateTransaction($input: CreateTransactionInput!) {
  //       createTransaction(input: $input) {
  //         success
  //         transaction {
  //           id
  //         }
  //         error {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       amount: transferAmount,
  //       receiverAccountId: receiverAccount._id.toString(),
  //       idempotencyKey: `test-transaction-${generateUniqueIntId()}`,
  //       clientMutationId: '1',
  //     },
  //   };

  //   // Generate a valid auth token for the sender user
  //   const authToken = generateToken(user);

  //   const app = await setupTestApp();
  //   const result = await request(app.callback())
  //     .query(mutation)
  //     .variables(variables)
  //     .set({ Authorization: `Bearer ${authToken}` })
  //     .end();

  //   expect(result.errors).toBeUndefined();
  //   expect((result.data as any)?.createTransaction.success).toBe('false');
  //   expect((result.data as any)?.createTransaction.error.field).toBe('amount');
  //   expect((result.data as any)?.createTransaction.error.message).toContain(
  //     "you're funny"
  //   );
  // });

  // it('should prevent duplicate transactions with same idempotency key', async () => {
  //   // Setup test accounts and user context
  //   const accounts = await getTestAccounts();
  //   const users = await getTestUsers();
  //   const senderAccount = accounts[0];
  //   const receiverAccount = accounts[1];
  //   const user = users[0];

  //   const transferAmount = 1000; // $10.00
  //   const idempotencyKey = `test-transaction-${generateUniqueIntId()}`;

  //   const mutation = gql`
  //     mutation CreateTransaction($input: CreateTransactionInput!) {
  //       createTransaction(input: $input) {
  //         success
  //         transaction {
  //           id
  //           amount
  //         }
  //         originAccountUpdatedBalance
  //         error {
  //           field
  //           message
  //         }
  //       }
  //     }
  //   `;

  //   const variables = {
  //     input: {
  //       amount: transferAmount,
  //       receiverAccountId: receiverAccount._id.toString(),
  //       idempotencyKey,
  //       clientMutationId: '1',
  //     },
  //   };

  //   // Generate a valid auth token for the sender user
  //   const authToken = generateToken(user);

  //   const app = await setupTestApp();

  //   // First transaction
  //   const result1 = await request(app.callback())
  //     .query(mutation)
  //     .variables(variables)
  //     .set({ Authorization: `Bearer ${authToken}` })
  //     .end();

  //   expect((result1.data as any)?.createTransaction.success).toBe(
  //     'Transaction created successfully'
  //   );

  //   // Try to create the same transaction again with the same idempotency key
  //   const result2 = await request(app.callback())
  //     .query(mutation)
  //     .variables(variables)
  //     .set({ Authorization: `Bearer ${authToken}` })
  //     .end();

  //   expect(result2.errors).toBeUndefined();
  //   expect((result2.data as any)?.createTransaction.success).toBe(
  //     'Transaction already processed with the same idempotency key'
  //   );

  //   // Check that no new transaction was created in the database
  //   const transactionsWithIdempotencyKey = await Transaction.find({
  //     idempotencyKey,
  //   });
  //   expect(transactionsWithIdempotencyKey.length).toBe(1); // Only one transaction should exist
  // });

  it('should reject transaction for non-existent receiver account', async () => {
    // Setup test accounts and user context
    const users = await getTestUsers();
    const accounts = await getTestAccounts();
    const senderAccount = accounts[0];
    const user = users[0];

    const transferAmount = 1000;
    const nonExistentAccountId = '60f1b5b5b5b5b5b5b5b5b5b5'; // fake ObjectId

    const mutation = gql`
      mutation CreateTransaction($input: CreateTransactionInput!) {
        createTransaction(input: $input) {
          success
          transaction {
            id
          }
          error {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        amount: transferAmount,
        receiverAccountId: nonExistentAccountId,
        idempotencyKey: `test-transaction-${generateUniqueIntId()}`,
      },
    };

    // Generate a valid auth token for the sender user
    const authToken = generateToken(user);

    const app = await setupTestApp();

    const result = await request(app.callback())
      .query(mutation)
      .variables(variables)
      .set({ Authorization: `Bearer ${authToken}` })
      .end();

    expect(result.errors).toBeUndefined();
    expect((result.data as any)?.createTransaction.success).toBe('false');
    expect((result.data as any)?.createTransaction.error.field).toBe(
      'receiverAccountId'
    );
    expect((result.data as any)?.createTransaction.error.message).toBe(
      'receiverAccountId does not exist'
    );
  });
});
