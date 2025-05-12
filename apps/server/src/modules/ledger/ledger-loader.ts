import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '../loader/loaderRegister';

import { Ledger } from './ledger-model';

const loaderName = 'LedgerLoader';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: Ledger,
  loaderName,
});

registerLoader(loaderName, getLoader);

export const LedgerLoader = {
  Ledger: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};
