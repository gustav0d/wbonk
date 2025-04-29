import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '@/modules/loader/loaderRegister';

import { Account } from './account-model';

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
