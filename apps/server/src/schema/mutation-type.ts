import { GraphQLObjectType } from 'graphql';
import {
  UserSignUpMutation,
  UserSignInMutation,
} from '@/modules/user/user-mutations';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userSignUp: UserSignUpMutation,
    userSignIn: UserSignInMutation,
  }),
});
