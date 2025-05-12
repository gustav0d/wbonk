import { Types } from 'mongoose';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { successField } from '@entria/graphql-mongo-helpers';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserType } from '../user-type';
import { UserModel } from '../user-model';
import { UserLoader } from '../user-loader';
import { GraphQLContext } from '../../../graphql/context';
import {
  NewUserArgs,
  validateAndSanitizeNewUser,
} from '../../../utils/validate-user';
import { Account } from '../../account/account-model';
import { generateToken } from '../../../auth';
import { AccountLoader } from '../../account/account-loader';
import { FieldErrorField } from '../../field-error/field-error-field';
import { AccountType } from '../../account/account-type';
import { fieldError } from '../../../utils/field-error';

type UserSignUpMutationArgs = NewUserArgs;

const UserSignUpMutation = mutationWithClientMutationId({
  name: 'UserSignUpMutation',
  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    args: UserSignUpMutationArgs,
    { ctx }: GraphQLContext
  ) => {
    const { name, email, password, error } = validateAndSanitizeNewUser(args);

    if (error) {
      return { ...error, success: false };
    }

    const isEmailInUse = await UserModel.exists({ email });

    if (isEmailInUse) {
      return { ...fieldError('email', 'Email already in use'), success: false };
    }

    const user = await new UserModel({
      name,
      email,
      password,
    }).save();

    // create an account for the user
    const account = await new Account({
      // for now, set a default accountName like this (maybe ask to the user later?)
      accountName: `${user.name}-${new Types.ObjectId().toString()}`,
      user: user._id,
      balance: 0, // default balance
    }).save();

    const token = generateToken(user);

    return {
      token,
      id: user._id,
      accountId: account._id,
      success: 'User successfully signed up',
    };
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: async ({ id }, _, context) => {
        return UserLoader.load(context, id as Types.ObjectId);
      },
    },
    account: {
      type: AccountType,
      resolve: async ({ accountId }, _, context) => {
        return AccountLoader.load(context, accountId as Types.ObjectId);
      },
    },
    token: {
      type: GraphQLString,
      resolve: ({ token }) => token,
    },
    ...FieldErrorField,
    ...successField,
  },
});

export { UserSignUpMutation };
