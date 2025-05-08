import { Types } from 'mongoose';
import { UserModel, type UserDocument } from '../../../modules/user/user-model';

// fixed ObjectId references for consistent test data
export const user1Id = new Types.ObjectId();
export const user2Id = new Types.ObjectId();

export const testUsers: Partial<UserDocument>[] = [
  {
    _id: user1Id,
    name: 'Test User One',
    email: 'user1@example.com',
    password: 'password123',
  },
  {
    _id: user2Id,
    name: 'Test User Two',
    email: 'user2@example.com',
    password: 'password456',
  },
];

export const createTestUsers = async (): Promise<UserDocument[]> => {
  const createdUsers = [] as UserDocument[];

  for (const userData of testUsers) {
    let user = await UserModel.findOne({ email: userData.email });
    if (!user) {
      user = new UserModel(userData);
      await user.save();
    }

    createdUsers.push(user);
  }

  return createdUsers;
};

export const getTestUsers = async (): Promise<UserDocument[]> => {
  return createTestUsers();
};
