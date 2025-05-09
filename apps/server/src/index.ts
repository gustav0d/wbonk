import http from 'node:http';

import { config, logEnvironments } from './config';
import { app } from './server/app';

import { connectDatabase } from './database/database';
import { runUserSeeds } from './database/user-seed';
import { runTransactionSeeds } from './database/transaction-seed';

(async () => {
  await connectDatabase();

  // run seeds on the following environments
  if (logEnvironments.includes(config.NODE_ENV)) {
    await runUserSeeds();
    await runTransactionSeeds();
  }
  const server = http.createServer(app.callback());

  server.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
  });
})();
