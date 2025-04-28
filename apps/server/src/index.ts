import http from 'node:http';

import { config } from '@/config';
import { app } from '@/server/app';
import { connectDatabase } from './database';

(async () => {
  await connectDatabase();
  const server = http.createServer(app.callback());

  server.listen(config.PORT, () => {
    console.log(`Server running on port: ${config.PORT}`);
  });
})();
