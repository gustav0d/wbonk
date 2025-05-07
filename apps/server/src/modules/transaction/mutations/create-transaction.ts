import { successField } from '@entria/graphql-mongo-helpers';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId } from 'graphql-relay';

import { GraphQLContext } from '@/graphql/context';
import { AccountLoader } from '@/modules/account/account-loader';
import { Account } from '@/modules/account/account-model';
import { FieldErrorField } from '@/modules/field-error/field-error-field';
import { fieldError } from '@/utils/field-error';
import { Transaction } from '../transaction-model';
import { TransactionType } from '../transaction-type';
import { TransactionLoader } from '../transaction-loader';

type CreateTransactionArgs = {
  amount: number;
  receiverAccountId: string;
};

const CreateTransactionMutation = mutationWithClientMutationId({
  name: 'CreateTransaction',
  inputFields: {
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    senderAccountId: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    { amount, receiverAccountId }: CreateTransactionArgs,
    ctx: GraphQLContext
  ) => {
    if (!ctx.user) {
      throw new Error('Unauthorized');
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
    // maybe add some lock timestamp here?
    const [transaction] = await Promise.all([
      new Transaction({
        amount,
        originAccount: originAccount._id,
        receiverAccount: receiverAccount._id,
        status: 'PAID',
        type: 'PIX',
      }).save(),
      originAccount.save(),
      receiverAccount.save(),
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

export { CreateTransactionMutation };
