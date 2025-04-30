import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { TransactionModel } from './transaction-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { TransactionLoader } from './transaction-loader';

const TransactionType = new GraphQLObjectType<TransactionModel>({
  name: 'Transaction',
  description: 'Represents a transaction',
  fields: () => ({
    id: globalIdField('Transaction'),
    amount: {
      type: GraphQLString,
      resolve: (transaction) => transaction.amount,
    },
    status: {
      type: GraphQLString,
      resolve: (transaction) => transaction.status,
    },
    type: {
      type: GraphQLString,
      resolve: (transaction) => transaction.type,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (transaction) => transaction.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (transaction) => transaction.updatedAt?.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const TransactionConnection = connectionDefinitions({
  name: 'Transaction',
  nodeType: TransactionType,
});

registerTypeLoader(TransactionType, TransactionLoader.load);

export { TransactionType, TransactionConnection };