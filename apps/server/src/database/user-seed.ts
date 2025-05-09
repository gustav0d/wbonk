import { connectDatabase } from './database';
import { Account } from '../modules/account/account-model';
import { UserModel } from '../modules/user/user-model';

// Define test user details
const user1Email = 'user1@example.com';
const user2Email = 'user2@example.com';

// Define test account names
const account1Name = 'Account-1';
const account2Name = 'Account-2';

const usersAlreadyExist = async (
  userEmails: string[],
  accountNames: string[]
) => {
  try {
    // check if users exist by email
    const userPromises = userEmails.map((email) =>
      UserModel.findOne({ email })
    );

    // check if accounts exist by accountName
    const accountPromises = accountNames.map((accountName) =>
      Account.findOne({ accountName })
    );

    const results = await Promise.all([...userPromises, ...accountPromises]);

    // if all users and accounts exist, return true
    return results.every((result) => result !== null);
  } catch (error) {
    console.error('Error checking existing entities:', error);
    return false;
  }
};

export const runUserSeeds = async () => {
  await connectDatabase();

  console.log('Checking if seed data already exists...');

  if (
    await usersAlreadyExist(
      [user1Email, user2Email],
      [account1Name, account2Name]
    )
  ) {
    console.log('Seed data already exists. Skipping seed creation.');
    return true;
  }

  console.log('Creating seed data...');

  try {
    // Create users
    const user1 = new UserModel({
      name: 'TestUserOne',
      email: user1Email,
      password: 'password123',
    });

    const user2 = new UserModel({
      name: 'TestUserTwo',
      email: user2Email,
      password: 'password456',
    });

    // Save users
    const [savedUser1, savedUser2] = await Promise.all([
      user1.save(),
      user2.save(),
    ]);

    console.log(`Created users: ${savedUser1.name}, ${savedUser2.name}`);

    // Create accounts
    const account1 = new Account({
      accountName: account1Name,
      balance: 10000, // $100.00
      user: savedUser1._id,
    });

    const account2 = new Account({
      accountName: account2Name,
      balance: 25000, // $250.00
      user: savedUser2._id,
    });

    // Save accounts
    const [savedAccount1, savedAccount2] = await Promise.all([
      account1.save(),
      account2.save(),
    ]);

    console.log(
      `Created accounts: ${savedAccount1.accountName} (balance: $${savedAccount1.balance / 100}), ${savedAccount2.accountName} (balance: $${savedAccount2.balance / 100})`
    );

    console.log('Seed completed successfully!');
    return true;
  } catch (error) {
    console.error('Error during seed process:', error);
    return false;
  }
};

// Run seeds if called directly
if (require.main === module) {
  runUserSeeds()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
