import { Types } from 'mongoose';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { successField } from '@entria/graphql-mongo-helpers';
import { mutationWithClientMutationId } from 'graphql-relay';

import { UserType } from '../user-type';
import { UserModel } from '../user-model';
import { UserLoader } from '../user-loader';
import { GraphQLContext } from '../../../graphql/context';
import { fieldError } from '../../../utils/field-error';
import { generateToken } from '../../../auth';
import { FieldErrorField } from '../../field-error/field-error-field';

type UserSignInMutationArgs = {
  email: string;
  password: string;
};

const UserSignInMutation = mutationWithClientMutationId({
  name: 'UserSignInMutation',
  inputFields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  mutateAndGetPayload: async (
    args: UserSignInMutationArgs,
    { ctx }: GraphQLContext
  ) => {
    const { email, password } = {
      password: args.password.trim(),
      email: args.email.trim().toLowerCase(),
    };

    const user = await UserModel.findOne({ email });

    if (!user) {
      return { ...fieldError('email', 'User not found'), success: false };
    }

    const isPasswordCorrect = user.authenticate(password);

    if (!isPasswordCorrect) {
      return { ...fieldError('password', 'Wrong password'), success: false };
    }

    const token = generateToken(user);

    return {
      id: user._id,
      token,
      success: 'Sign In successful',
    };
  },
  outputFields: {
    me: {
      type: UserType,
      resolve: async ({ id }, _, context) => {
        return UserLoader.load(context, id as Types.ObjectId);
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

export { UserSignInMutation };
