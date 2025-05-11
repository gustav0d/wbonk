import { Environment, RecordSource, Store } from 'relay-runtime';

import { createNetwork } from './network';

const IS_SERVER = typeof window === typeof undefined;
const CLIENT_DEBUG = import.meta.env.DEV;
const SERVER_DEBUG = import.meta.env.DEV;

function createEnvironment() {
  const network = createNetwork();
  const environment = new Environment({
    network,
    store: new Store(new RecordSource(), {}),
    isServer: IS_SERVER,
    log(event) {
      if ((IS_SERVER && SERVER_DEBUG) || (!IS_SERVER && CLIENT_DEBUG)) {
        console.debug('[relay environment event]', event);
      }
    },
  });

  return environment;
}

export { createEnvironment };
