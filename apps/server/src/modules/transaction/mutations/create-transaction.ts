import { successField } from '@entria/graphql-mongo-helpers';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '@/graphql/context';
import { AccountLoader } from '@/modules/account/account-loader';
import { Account } from '@/modules/account/account-model';
import { FieldErrorField } from '@/modules/field-error/field-error-field';
import {
  generateIdempotencyKeySuffixForReceiver,
  generateIdempotencyKeySuffixForSender,
  Ledger,
} from '@/modules/ledger/ledger-model';
import { fieldError } from '@/utils/field-error';
import { Transaction } from '../transaction-model';
import { TransactionType } from '../transaction-type';
import { TransactionLoader } from '../transaction-loader';

type CreateTransactionArgs = {
  amount: number;
  receiverAccountId: string;
  idempotencyKey: string;
};

const CreateTransactionFromSignedInUserMutation = mutationWithClientMutationId({
  name: 'CreateTransaction',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    receiverAccountId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    idempotencyKey: {
      type: GraphQLString,
      description:
        'Unique key to prevent duplicate transactions. If not provided, one will be generated.',
    },
  },
  mutateAndGetPayload: async (
    { amount, receiverAccountId, idempotencyKey }: CreateTransactionArgs,
    ctx: GraphQLContext
  ) => {
    if (!ctx.user) {
      throw new Error('Unauthorized');
    }

    // check if the transaction with this idempotencyKey already exists
    const existingTransaction = await Transaction.findOne({ idempotencyKey });

    // if the transaction already exists, return it
    if (existingTransaction) {
      const originAccount = await AccountLoader.load(
        ctx,
        existingTransaction.originAccount
      );

      return {
        transaction: existingTransaction,
        originAccountUpdatedBalance: originAccount?.balance ?? 0,
        success: 'Transaction already processed with the same idempotency key',
      };
    }

    const [originAccount, receiverAccount] = await Promise.all([
      AccountLoader.load(ctx, ctx.user._id),
      Account.findOne({ _id: receiverAccountId }),
    ]);

    if (!originAccount) {
      // this will probably never happen because ctx.user
      // is fetched on each request (as in app.ts in getUser)
      throw new Error('Origin account does not exist');
    }

    if (!receiverAccount) {
      return {
        ...fieldError('receiverAccountId', 'receiverAccountId does not exist'),
        success: false,
      };
    }

    if (amount < 0) {
      return {
        ...fieldError(
          'amount',
          "Haha, you're funny... trying to steal from others, right? Cops arriving at your location in 5 minutes."
        ),
        success: false,
      };
    }

    if (originAccount.balance < amount) {
      return {
        ...fieldError(
          'amount',
          `Not enough balance (your current balance is ${originAccount.balance})`
        ),
        success: false,
      };
    }

    // transferring...
    originAccount.balance -= amount;
    receiverAccount.balance += amount;

    // create transaction with idempotency key
    const transaction = new Transaction({
      amount,
      originAccount: originAccount._id,
      receiverAccount: receiverAccount._id,
      status: 'PAID',
      paymentType: 'PIX',
      idempotencyKey,
    });

    // create ledger entries for both accounts
    const [originLedger, receiverLedger] = await Promise.all([
      // find the latest ledger entry for origin account
      Ledger.findOne({ accountId: originAccount._id }).sort({ createdAt: -1 }),
      // find the latest ledger entry for receiver account
      Ledger.findOne({ accountId: receiverAccount._id }).sort({
        createdAt: -1,
      }),
    ]);

    const originLastBalance = originLedger
      ? originLedger.balance
      : originAccount.balance + amount;
    const receiverLastBalance = receiverLedger
      ? receiverLedger.balance
      : receiverAccount.balance - amount;

    // create the ledger entries
    await Promise.all([
      transaction.save(),
      // update accounts
      originAccount.save(),
      receiverAccount.save(),
      // create ledger entries
      new Ledger({
        transactionId: transaction._id,
        accountId: originAccount._id,
        description: `Sent ${amount} to account ${receiverAccount._id}`,
        amount: -amount, // Negative for debit
        balance: originLastBalance - amount,
        transactionType: 'DEBIT',
        idempotencyKey: generateIdempotencyKeySuffixForSender(idempotencyKey),
      }).save(),
      new Ledger({
        transactionId: transaction._id,
        accountId: receiverAccount._id,
        description: `Received ${amount} from account ${originAccount._id}`,
        amount: amount, // positive for credit
        balance: receiverLastBalance + amount,
        transactionType: 'CREDIT',
        idempotencyKey: generateIdempotencyKeySuffixForReceiver(idempotencyKey),
      }).save(),
    ]);

    return {
      transaction,
      originAccountUpdatedBalance: originAccount.balance,
      success: 'Transaction created successfully',
    };
  },
  outputFields: {
    transaction: {
      type: TransactionType,
      resolve: async ({ transaction }, _, context) => {
        if (!transaction) return null;
        return TransactionLoader.load(context, transaction._id);
      },
    },
    originAccountUpdatedBalance: {
      type: GraphQLInt,
      resolve: ({ originAccountUpdatedBalance }) => originAccountUpdatedBalance,
    },
    ...FieldErrorField,
    ...successField,
  },
});

export { CreateTransactionFromSignedInUserMutation as CreateTransactionMutation };
