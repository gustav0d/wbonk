import jwt from 'jsonwebtoken';

import { config } from './config';
import { UserDocument, UserModel } from './modules/user/user-model';
import { getGraphQLHttpHeaders } from './utils/get-graphql-http-headers';
import { RequestGraphQLContext } from './get-context';

interface DecodedToken {
  id: string;
}

interface GetUserResult {
  user: UserDocument | null;
}

async function getUser(ctx: RequestGraphQLContext): Promise<GetUserResult> {
  const authHeader = getGraphQLHttpHeaders(ctx, 'authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null };
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    const user = await UserModel.findOne({
      _id: (decodedToken as DecodedToken).id,
    });

    return { user };
  } catch (err) {
    return { user: null };
  }
}

function generateToken(user: UserDocument) {
  return jwt.sign({ id: user._id }, config.JWT_SECRET);
}

export { getUser, generateToken };
