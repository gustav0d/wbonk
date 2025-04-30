import { TransactionType, TransactionConnection } from './transaction-type';
import { TransactionLoader } from './transaction-loader';
import { connectionArgs } from 'graphql-relay';

export const transactionField = (key: string) => ({
  [key]: {
    type: TransactionType,
    resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
      await TransactionLoader.load(context, obj[key] as string),
  },
});

export const transactionConnectionField = (key: string) => ({
  [key]: {
    type: TransactionConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (_: any, args: any, context: any) =>
      await TransactionLoader.loadAll(context, args),
  },
});