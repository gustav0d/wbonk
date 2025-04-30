import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '@/modules/loader/loaderRegister';

import { Transaction } from './transaction-model';

const loaderName = 'TransactionLoader';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: Transaction,
  loaderName,
});

registerLoader(loaderName, getLoader);

export const TransactionLoader = {
  Transaction: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};