import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';

export type AccountDocument = {
  _id: Types.ObjectId;
  accountName: string;
  balance: number;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
} & Document;

const AccountSchema = new mongoose.Schema<AccountDocument>(
  {
    accountName: {
      type: String,
    },
    balance: {
      type: Number,
      default: 0,
      description: 'Balance amount from account',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      description: 'The owner of this account',
    },
  },
  {
    collection: 'Account',
    timestamps: true,
  }
);

export const Account: Model<AccountDocument> = mongoose.model(
  'Account',
  AccountSchema
);
