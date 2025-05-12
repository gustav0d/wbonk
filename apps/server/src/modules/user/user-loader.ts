import { createLoader } from '@entria/graphql-mongo-helpers';

import { registerLoader } from '../loader/loaderRegister';

import { UserModel } from './user-model';

const loaderName = 'UserLoader';

const { Wrapper, getLoader, clearCache, load, loadAll } = createLoader({
  model: UserModel,
  loaderName,
});

registerLoader(loaderName, getLoader);

export const UserLoader = {
  User: Wrapper,
  getLoader,
  clearCache,
  load,
  loadAll,
};
