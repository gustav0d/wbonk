import { GraphQLObjectType, GraphQLString } from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import { IAccount } from './account-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { AccountLoader } from './account-loader';

const AccountType = new GraphQLObjectType<IAccount>({
  name: 'Account',
  description: 'Represents an account with balance',
  fields: () => ({
    id: globalIdField('Account'),
    balance: {
      type: GraphQLString,
      resolve: (account) => account.balance,
    },
    deletedAt: {
      type: GraphQLString,
      resolve: (account) =>
        account.deletedAt ? account.deletedAt.toISOString() : null,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (account) => account.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (account) => account.updatedAt?.toISOString(),
    },
  }),
  interfaces: () => [nodeInterface],
});

const AccountConnection = connectionDefinitions({
  name: 'Account',
  nodeType: AccountType,
});

registerTypeLoader(AccountType, AccountLoader.load);

export { AccountType, AccountConnection };
