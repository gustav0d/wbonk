import { AccountType, AccountConnection } from './account-type';
import { AccountLoader } from './account-loader';
import { connectionArgs } from 'graphql-relay';

export const accountField = (key: string) => ({
  [key]: {
    type: AccountType,
    resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
      await AccountLoader.load(context, obj[key] as string),
  },
});

export const accountConnectionField = (key: string) => ({
  [key]: {
    type: AccountConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (_: any, args: any, context: any) =>
      await AccountLoader.loadAll(context, args),
  },
});
