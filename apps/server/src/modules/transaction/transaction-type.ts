import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { globalIdField } from 'graphql-relay';
import { TransactionModel } from './transaction-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './transaction-loader';
import {
  connectionDefinitions,
  objectIdResolver,
  timestampResolver,
} from '@entria/graphql-mongo-helpers';
import { AccountType } from '../account/account-type';
import { AccountLoader } from '../account/account-loader';

const TransactionType = new GraphQLObjectType<TransactionModel>({
  name: 'Transaction',
  description: 'Represents a transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    amount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Total amount of the transaction in cents',
      resolve: (transaction) => transaction.amount,
    },
    originAccount: {
      type: AccountType,
      resolve: async (transaction, _, ctx) => {
        return await AccountLoader.load(ctx, transaction.originAccount);
      },
    },
    receiverAccount: {
      type: AccountType,
      resolve: async (transaction, _, ctx) => {
        return await AccountLoader.load(ctx, transaction.receiverAccount);
      },
    },
    status: {
      type: GraphQLString,
      resolve: (transaction) => transaction.status,
    },
    paymentType: {
      type: GraphQLString,
      resolve: (transaction) => transaction.paymentType,
    },
    ...objectIdResolver,
    ...timestampResolver,
  }),
  interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };
