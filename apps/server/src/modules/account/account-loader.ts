import { createLoader } from '@entria/graphql-mongo-helpers';

import { Account } from './account-model';
import { registerLoader } from '../loader/loaderRegister';

const loaderName = 'AccountLoader';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: Account,
  loaderName,
});

registerLoader(loaderName, getLoader);

export const AccountLoader = {
  Account: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};
