import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { TransactionModel } from './transaction-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './transaction-loader';
import {
  objectIdResolver,
  timestampResolver,
} from '@entria/graphql-mongo-helpers';
import { UserType } from '../user/user-type';
import { UserLoader } from '../user/user-loader';

const TransactionType = new GraphQLObjectType<TransactionModel>({
  name: 'Transaction',
  description: 'Represents a transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    amount: {
      type: GraphQLString,
      description: 'Total amount of the transaction in cents',
      resolve: (transaction) => transaction.amount,
    },
    originAccount: {
      type: new GraphQLNonNull(UserType),
      resolve: async (transaction, _, ctx) => {
        return UserLoader.load(ctx, transaction.originAccount);
      },
    },
    receiverAccount: {
      type: new GraphQLNonNull(UserType),
      resolve: async (transaction, _, ctx) => {
        return UserLoader.load(ctx, transaction.receiverAccount);
      },
    },
    status: {
      type: GraphQLString,
      resolve: (transaction) => transaction.status,
    },
    type: {
      type: GraphQLString,
      resolve: (transaction) => transaction.type,
    },
    idempotencyKey: {
      type: GraphQLString,
      resolve: (transaction) => transaction.idempotencyKey,
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
