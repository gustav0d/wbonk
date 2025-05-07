import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';
import { UserDocument } from './user-model';
import { nodeInterface, registerTypeLoader } from '../node/typeRegister';
import { UserLoader } from './user-loader';
import {
  connectionDefinitions,
  objectIdResolver,
  timestampResolver,
} from '@entria/graphql-mongo-helpers';

const UserType = new GraphQLObjectType<UserDocument>({
  name: 'User',
  description: 'Represents a user',
  fields: () => ({
    id: globalIdField('User'),
    username: {
      type: GraphQLString,
      resolve: (user) => user.username,
    },
    email: {
      type: GraphQLString,
      resolve: (user) => user.email,
    },
    ...objectIdResolver,
    ...timestampResolver,
  }),
  interfaces: () => [nodeInterface],
});

const UserConnection = connectionDefinitions({
  name: 'User',
  nodeType: UserType,
});

registerTypeLoader(UserType, UserLoader.load);

export { UserType, UserConnection };
