import { GraphQLObjectType } from 'graphql';
import { connectionArgs } from 'graphql-relay';

import { GraphQLContext } from '@/graphql/context';
import { nodeField, nodesField } from '@/modules/node/typeRegister';
import { AccountLoader } from '@/modules/account/account-loader';
import { AccountType } from '@/modules/account/account-type';
import { TransactionLoader } from '@/modules/transaction/transaction-loader';
import { TransactionType } from '@/modules/transaction/transaction-type';
import { UserType } from '@/modules/user/user-type';
import { UserLoader } from '@/modules/user/user-loader';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    me: {
      type: UserType,
      resolve: (_, __, ctx: GraphQLContext) => {
        return UserLoader.load(ctx, ctx.user?.id);
      },
    },
    users: {
      type: UserType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) =>
        await UserLoader.loadAll(context, args),
    },
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
