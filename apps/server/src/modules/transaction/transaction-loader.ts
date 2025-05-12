import { createLoader } from '@entria/graphql-mongo-helpers';

import { Transaction } from './transaction-model';
import { registerLoader } from '../loader/loaderRegister';

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
