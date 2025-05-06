import { UserType, UserConnection } from './user-type';
import { UserLoader } from './user-loader';
import { connectionArgs } from 'graphql-relay';

export const userField = (key: string) => ({
  [key]: {
    type: UserType,
    resolve: async (obj: Record<string, unknown>, _: any, context: any) =>
      await UserLoader.load(context, obj[key] as string),
  },
});

export const userConnectionField = (key: string) => ({
  [key]: {
    type: UserConnection.connectionType,
    args: {
      ...connectionArgs,
    },
    resolve: async (_: any, args: any, context: any) =>
      await UserLoader.loadAll(context, args),
  },
});
