import { GraphQLObjectType } from 'graphql';
import { UserSignUpMutation } from '@/modules/user/mutations/user-sign-up-mutation';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userSignUp: UserSignUpMutation,
  }),
});
