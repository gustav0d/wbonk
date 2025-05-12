import { GraphQLObjectType } from 'graphql';
import {
  UserSignUpMutation,
  UserSignInMutation,
} from '../modules/user/user-mutations';
import { CreateTransactionMutation } from '../modules/transaction/transaction-mutations';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userSignUp: UserSignUpMutation,
    userSignIn: UserSignInMutation,
    createTransaction: CreateTransactionMutation,
  }),
});
