import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  Transaction,
  type TransactionModel,
} from '../../../modules/transaction/transaction-model';
import { account1Id, account2Id, getTestAccounts } from './accounts';
import { generateUniqueIntId } from '../utils/generateUniqueIntId';

// fixed ObjectId references for consistent test data
export const transaction1Id = new Types.ObjectId();
export const transaction2Id = new Types.ObjectId();

export const testTransactions: Partial<TransactionModel>[] = [
  {
    _id: transaction1Id,
    amount: 5000, // $50.00
    originAccount: account1Id,
    receiverAccount: account2Id,
    status: 'PAID',
    paymentType: 'PIX',
    idempotencyKey: uuidv4(),
  },
  {
    _id: transaction2Id,
    amount: 2500, // $25.00
    originAccount: account2Id,
    receiverAccount: account1Id,
    status: 'PAID',
    paymentType: 'CREDIT',
    idempotencyKey: uuidv4(),
  },
];

export const createTestTransactions = async (): Promise<TransactionModel[]> => {
  await getTestAccounts();

  const createdTransactions = [] as TransactionModel[];

  for (const transactionData of testTransactions) {
    let transaction = await Transaction.findById(transactionData._id);
    if (!transaction) {
      if (!transactionData.publicId) {
        transactionData.publicId = generateUniqueIntId();
      }

      transaction = new Transaction(transactionData);
      await transaction.save();
    }

    createdTransactions.push(transaction);
  }

  return createdTransactions;
};

export const getTestTransactions = async (): Promise<TransactionModel[]> => {
  return createTestTransactions();
};
