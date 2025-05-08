import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';
import { connectionDefinitions, globalIdField } from 'graphql-relay';
import {
  objectIdResolver,
  timestampResolver,
} from '@entria/graphql-mongo-helpers';

import { nodeInterface, registerTypeLoader } from '@/modules/node/typeRegister';
import { LedgerModel } from './ledger-model';
import { LedgerLoader } from './ledger-loader';
import { UserLoader } from '../user/user-loader';
import { UserType } from '../user/user-type';
import { TransactionLoader } from '../transaction/transaction-loader';
import { TransactionType } from '../transaction/transaction-type';

const LedgerType = new GraphQLObjectType<LedgerModel>({
  name: 'Ledger',
  description: 'Represents a ledger entry for financial transactions',
  fields: () => ({
    id: globalIdField('Ledger'),
    description: {
      type: GraphQLString,
      resolve: (ledger) => ledger.description,
    },
    amount: {
      type: GraphQLInt,
      description:
        'Amount of the transaction (positive for credit, negative for debit)',
      resolve: (ledger) => ledger.amount,
    },
    balance: {
      type: GraphQLInt,
      description: 'Account balance after this transaction',
      resolve: (ledger) => ledger.balance,
    },
    transactionType: {
      type: GraphQLString,
      description: 'Type of ledger entry (CREDIT or DEBIT)',
      resolve: (ledger) => ledger.transactionType,
    },
    transaction: {
      type: TransactionType,
      description: 'The transaction associated with this ledger entry',
      resolve: async (ledger, _, ctx) => {
        return TransactionLoader.load(ctx, ledger.transactionId);
      },
    },
    account: {
      type: UserType,
      description: 'The account associated with this ledger entry',
      resolve: async (ledger, _, ctx) => {
        return UserLoader.load(ctx, ledger.accountId);
      },
    },
    ...objectIdResolver,
    ...timestampResolver,
  }),
  interfaces: () => [nodeInterface],
});

const LedgerConnection = connectionDefinitions({
  name: 'Ledger',
  nodeType: LedgerType,
});

registerTypeLoader(LedgerType, LedgerLoader.load);

export { LedgerType, LedgerConnection };
