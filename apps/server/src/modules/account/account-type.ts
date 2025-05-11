import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { AccountDocument } from './account-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './account-loader';
import { UserType } from '../user/user-type';
import { UserLoader } from '../user/user-loader';
import {
  connectionDefinitions,
  objectIdResolver,
  timestampResolver,
} from '@entria/graphql-mongo-helpers';

const AccountType = new GraphQLObjectType<AccountDocument>({
  name: 'Account',
  description: 'Represents an account with balance',
  fields: () => ({
    id: globalIdField('Account'),
    accountName: {
      type: GraphQLString,
      resolve: (account) => account.accountName,
    },
    balance: {
      type: GraphQLString,
      resolve: (account) => account.balance,
    },
    user: {
      type: new GraphQLNonNull(UserType),
      resolve: async (account, _, ctx) => {
        return UserLoader.load(ctx, account.user);
      },
    },
    deletedAt: {
      type: GraphQLString,
      resolve: (account) =>
        account.deletedAt ? account.deletedAt.toISOString() : null,
    },
    ...objectIdResolver,
    ...timestampResolver,
  }),
  interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
