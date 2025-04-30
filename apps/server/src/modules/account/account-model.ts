import type { Document, Model } from 'mongoose';
import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';

const Schema = new mongoose.Schema<IAccount>(
  {
    balance: {
      type: Number,
      description: 'Balance amount from account',
    },
  },
  {
    collection: 'Account',
    timestamps: true,
  }
);

export type IAccount = {
  _id: ObjectId;
  balance: number;
  createdAt: Date;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
} & Document;

export const Account: Model<IAccount> = mongoose.model('Account', Schema);
