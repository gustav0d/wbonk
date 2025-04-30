import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type TransactionStatus = 'PENDING' | 'PAID' | 'FAILED';
export type TransactionType = 'CREDIT' | 'DEBIT' | 'PIX';

export type TransactionModel = {
  publicId: number;
  amount: number;
  originSenderAccountId: mongoose.Types.ObjectId;
  destinationReceiverAccountId: mongoose.Types.ObjectId;
  status: TransactionStatus;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date | null;
  idempotencyKey: string;
};

export type TransactionModelDocument = TransactionModel & Document;

const transactionSchema = new mongoose.Schema<TransactionModelDocument>(
  {
    publicId: Number,
    amount: Number,
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      description: 'Status from transaction: "PENDING", "FAILED" or "PAID"',
    },
    type: {
      type: String,
      enum: ['PIX', 'CREDIT', 'DEBIT'],
      description: 'Type of operation "PIX", "CREDIT" or "DEBIT"',
    },
    destinationReceiverAccountId: {
      type: Schema.Types.ObjectId,
      description: 'Destination account that will receive the amount',
    },
    originSenderAccountId: {
      type: Schema.Types.ObjectId,
      description: 'Origin account that will send the amount sent',
    },
    idempotencyKey: {
      type: String,
      description: 'The unique Idempotency key to identify the transaction',
    },
  },
  {
    collection: 'Transaction',
    timestamps: true,
  }
);

export const Transaction: Model<TransactionModelDocument> = mongoose.model(
  'Transaction',
  transactionSchema
);
