import { Types } from 'mongoose';
import {
  Account,
  type UserDocument,
} from '../../../modules/account/account-model';
import { user1Id, user2Id, getTestUsers } from './users';

// fixed ObjectId references for consistent test data
export const account1Id = new Types.ObjectId();
export const account2Id = new Types.ObjectId();

export const testAccounts: Partial<UserDocument>[] = [
  {
    _id: account1Id,
    accountName: 'Account-1',
    balance: 10000, // $100.00
    user: user1Id,
  },
  {
    _id: account2Id,
    accountName: 'Account-2',
    balance: 25000, // $250.00
    user: user2Id,
  },
];

export const createTestAccounts = async (): Promise<UserDocument[]> => {
  await getTestUsers();

  const createdAccounts = [] as UserDocument[];

  for (const accountData of testAccounts) {
    let account = await Account.findOne({
      accountName: accountData.accountName,
    });

    if (!account) {
      account = new Account(accountData);
      await account.save();
    }

    createdAccounts.push(account);
  }

  return createdAccounts;
};

export const getTestAccounts = async (): Promise<UserDocument[]> => {
  return createTestAccounts();
};
