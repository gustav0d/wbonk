import { GraphQLObjectType } from 'graphql';
import { connectionArgs, withFilter } from '@entria/graphql-mongo-helpers';

import { GraphQLContext } from '@/graphql/context';
import { nodeField, nodesField } from '@/modules/node/typeRegister';
import { AccountLoader } from '@/modules/account/account-loader';
import { AccountConnection, AccountType } from '@/modules/account/account-type';
import { TransactionLoader } from '@/modules/transaction/transaction-loader';
import { TransactionConnection } from '@/modules/transaction/transaction-type';
import { UserConnection, UserType } from '@/modules/user/user-type';
import { UserLoader } from '@/modules/user/user-loader';
import { Account } from '@/modules/account/account-model';
import { LedgerLoader } from '@/modules/ledger/ledger-loader';
import { LedgerConnection } from '@/modules/ledger/ledger-type';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Queries',
  fields: () => ({
    node: nodeField,
    nodes: nodesField,
    me: {
      type: UserType,
      resolve: async (_, __, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        return await UserLoader.load(context, context.user._id);
      },
    },
    myAccount: {
      type: AccountType,
      resolve: async (_, __, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        const account = await Account.findOne({ user: context.user._id });

        if (!account) return null;

        return await AccountLoader.load(context, account._id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        // withFilter builds the condition filter like this: [field]_[operator]
        // from: https://github.com/woovibr/graphql-mongo-helpers/blob/main/src/buildMongoConditionsFromFilters.ts
        const argsOrArgsWithFilter = context.user
          ? withFilter(args, { _id_ne: context.user._id })
          : args;
        return await UserLoader.loadAll(context, argsOrArgsWithFilter);
      },
    },
    accounts: {
      type: AccountConnection.connectionType,
      args: connectionArgs,
      resolve: async (_, args, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        return await AccountLoader.loadAll(
          context,
          withFilter(args, { user_ne: context.user._id })
        );
      },
    },
    transactions: {
      type: TransactionConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        const account = await Account.findOne({ user: context.user._id });

        return await TransactionLoader.loadAll(
          context,
          withFilter(args, {
            $or: [
              { originAccount: account?._id },
              { receiverAccount: account?._id },
            ],
          })
        );
      },
    },
    ledgerEntries: {
      type: LedgerConnection.connectionType,
      args: {
        ...connectionArgs,
      },
      resolve: async (_, args, context: GraphQLContext) => {
        if (!context.user) {
          throw new Error('Unauthorized');
        }

        return await LedgerLoader.loadAll(
          context,
          withFilter(args, { accountId: context.user._id })
        );
      },
    },
  }),
});
