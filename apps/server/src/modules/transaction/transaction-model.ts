import mongoose, { Schema, Types, type Document, type Model } from 'mongoose';

export type TransactionStatus = 'PENDING' | 'PAID' | 'FAILED';
export type TransactionType = 'CREDIT' | 'DEBIT' | 'PIX';

export type TransactionModel = {
  _id: Types.ObjectId;
  publicId: number;
  amount: number;
  originAccount: Types.ObjectId;
  receiverAccount: Types.ObjectId;
  status: TransactionStatus;
  paymentType: TransactionType;
  createdAt: Date;
  updatedAt: Date | null;
  idempotencyKey: string;
} & Document;

const TransactionSchema = new mongoose.Schema<TransactionModel>(
  {
    publicId: Number,
    amount: Number,
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED'],
      description: 'Status from transaction: "PENDING", "FAILED" or "PAID"',
    },
    paymentType: {
      type: String,
      enum: ['PIX', 'CREDIT', 'DEBIT'],
      description: 'Type of operation "PIX", "CREDIT" or "DEBIT"',
    },
    originAccount: {
      type: Schema.Types.ObjectId,
      description: 'Origin account that will send the amount sent',
    },
    receiverAccount: {
      type: Schema.Types.ObjectId,
      description: 'Destination account that will receive the amount',
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      description: 'Unique key to ensure idempotency',
      index: true,
    },
  },
  {
    collection: 'Transaction',
    timestamps: true,
  }
);

export const Transaction: Model<TransactionModel> = mongoose.model(
  'Transaction',
  TransactionSchema
);
