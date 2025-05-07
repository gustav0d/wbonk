import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
import { Schema, Types } from 'mongoose';

export type IAccount = {
  _id: Types.ObjectId;
  accountName: string;
  balance: number;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
} & Document;

const AccountSchema = new mongoose.Schema<IAccount>(
  {
    accountName: {
      type: String,
    },
    balance: {
      type: Number,
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

export const Account: Model<IAccount> = mongoose.model(
  'Account',
  AccountSchema
);
