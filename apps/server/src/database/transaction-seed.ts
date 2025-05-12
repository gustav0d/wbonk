import { v4 as uuidv4 } from 'uuid';
import { connectDatabase } from './database';
import { Account } from '../modules/account/account-model';
import {
  Ledger,
  generateIdempotencyKeySuffixForReceiver,
  generateIdempotencyKeySuffixForSender,
} from '../modules/ledger/ledger-model';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../modules/transaction/transaction-model';

// create sample transactions between accounts and corresponding ledger entries
export const createTransactionSeeds = async () => {
  console.log('Checking for existing transaction data...');

  // check if transactions already exist
  const existingTransactions = await Transaction.countDocuments();
  if (existingTransactions > 0) {
    console.log(
      `Found ${existingTransactions} existing transactions. Skipping transaction seed.`
    );
    return;
  }

  console.log('Creating transaction seeds...');

  // find accounts to use for transactions
  const accounts = await Account.find().limit(5);

  if (!accounts) {
    console.error('An account must be created to run the transaction seed.');
    return;
  }

  if (accounts.length < 2) {
    console.error(
      'Not enough accounts found to create transactions. Please run account seeds first.'
    );
    return;
  }

  const transactionsToCreate = [
    {
      publicId: Math.floor(100000000 + Math.random() * 900000000), // 9-digit random number
      amount: 5000, // $50.00
      status: 'PAID' as TransactionStatus,
      paymentType: 'PIX' as TransactionType,
      originAccount: accounts[0]?._id,
      receiverAccount: accounts[1]?._id,
      idempotencyKey: uuidv4(),
    },
    {
      publicId: Math.floor(100000000 + Math.random() * 900000000),
      amount: 20000, // $200.00
      status: 'PAID' as TransactionStatus,
      paymentType: 'PIX' as TransactionType,
      originAccount: accounts[1]?._id,
      receiverAccount: accounts[0]?._id,
      idempotencyKey: uuidv4(),
    },
  ];

  try {
    // Create transactions
    const createdTransactions =
      await Transaction.insertMany(transactionsToCreate);
    console.log(`Created ${createdTransactions.length} sample transactions`);

    // Create ledger entries for each PAID transaction
    const ledgerEntries = [];

    for (const transaction of createdTransactions) {
      // Only create ledger entries for PAID transactions
      if (transaction.status === 'PAID') {
        // Get accounts involved
        const originAccount = await Account.findById(transaction.originAccount);
        const receiverAccount = await Account.findById(
          transaction.receiverAccount
        );

        if (!originAccount || !receiverAccount) {
          console.error(
            `Could not find accounts for transaction ${transaction._id}`
          );
          continue;
        }

        // calculate new balances
        const originBalance = originAccount.balance - transaction.amount;
        const receiverBalance = receiverAccount.balance + transaction.amount;

        // create debit entry for origin account
        ledgerEntries.push({
          transactionId: transaction._id,
          accountId: originAccount._id,
          description: `Payment to ${receiverAccount.accountName || 'account'}`,
          amount: -transaction.amount, // negative for debit
          balance: originBalance,
          transactionType: 'DEBIT',
          idempotencyKey: generateIdempotencyKeySuffixForSender(
            transaction.idempotencyKey
          ),
        });

        // Create credit entry for receiver account
        ledgerEntries.push({
          transactionId: transaction._id,
          accountId: receiverAccount._id,
          description: `Payment from ${originAccount.accountName || 'account'}`,
          amount: transaction.amount, // positive for credit
          balance: receiverBalance,
          transactionType: 'CREDIT',
          idempotencyKey: generateIdempotencyKeySuffixForReceiver(
            transaction.idempotencyKey
          ),
        });

        // Update account balances
        await Account.findByIdAndUpdate(originAccount._id, {
          balance: originBalance,
        });
        await Account.findByIdAndUpdate(receiverAccount._id, {
          balance: receiverBalance,
        });
      }
    }

    if (ledgerEntries.length > 0) {
      const createdLedgerEntries = await Ledger.insertMany(ledgerEntries);
      console.log(`Created ${createdLedgerEntries.length} ledger entries`);
    }

    console.log('Transaction seed completed successfully');
  } catch (error) {
    console.error('Error creating transaction seeds:', error);
  }
};

export const runTransactionSeeds = async () => {
  await connectDatabase();
  await createTransactionSeeds();
};

if (require.main === module) {
  runTransactionSeeds()
    .then(() => {
      console.log('Transaction seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Transaction seeding failed:', error);
      process.exit(1);
    });
}
