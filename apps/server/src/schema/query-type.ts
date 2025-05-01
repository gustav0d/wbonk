import { GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';
import { GraphQLContext } from '@/graphql/context';
import { nodeField, nodesField } from '@/modules/node/typeRegister';
import { AccountLoader } from '@/modules/account/account-loader';
import { AccountType } from '@/modules/account/account-type';
import { TransactionLoader } from '@/modules/transaction/transaction-loader';
import { TransactionType } from '@/modules/transaction/transaction-type';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    accounts: {
      type: AccountType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) =>
        await AccountLoader.loadAll(context, args),
    },
    transactions: {
      type: TransactionType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) =>
        await TransactionLoader.loadAll(context, args),
    },
  }),
});
