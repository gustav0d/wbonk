import mongoose, { Schema, Types, type Document, type Model } from 'mongoose';

export type LedgerModel = {
  _id: Types.ObjectId;
  transactionId: Types.ObjectId;
  accountId: Types.ObjectId;
  description: string;
  amount: number;
  balance: number;
  transactionType: 'CREDIT' | 'DEBIT';
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date | null;
} & Document;

const LedgerSchema = new mongoose.Schema<LedgerModel>(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      description: 'Reference to the transaction',
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
      description: 'Account related to this ledger entry',
    },
    description: {
      type: String,
      required: true,
      description: 'Description of the ledger entry',
    },
    amount: {
      type: Number,
      required: true,
      description:
        'Amount of the transaction (positive for credit, negative for debit)',
    },
    balance: {
      type: Number,
      required: true,
      description: 'Account balance after this transaction',
    },
    transactionType: {
      type: String,
      enum: ['CREDIT', 'DEBIT'],
      required: true,
      description: 'Type of ledger entry',
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
    collection: 'Ledger',
    timestamps: true,
  }
);

// create index for fast lookups by account ID and timestamp
LedgerSchema.index({ accountId: 1, createdAt: -1 });

export const generateIdempotencyKeySuffixForReceiver = (
  idempotencyKey: string
) => {
  return `${idempotencyKey}-receiver`;
};
export const generateIdempotencyKeySuffixForSender = (
  idempotencyKey: string
) => {
  return `${idempotencyKey}-origin`;
};

export const Ledger: Model<LedgerModel> = mongoose.model(
  'Ledger',
  LedgerSchema
);
