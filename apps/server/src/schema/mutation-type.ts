import { GraphQLObjectType } from 'graphql';
import { UserSignUpMutation } from '@/modules/user/mutations/user-sign-up-mutation';
import { UserSignInMutation } from '@/modules/user/mutations/user-sign-in-mutation';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userSignUp: UserSignUpMutation,
    userSignIn: UserSignInMutation,
  }),
});
