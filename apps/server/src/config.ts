import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
  path: root('.env'),
  sample: root('.env.example'),
});

const ENV = process.env;

const config = {
  PORT: ENV.PORT ?? 3000,
  MONGO_URI: ENV.MONGO_URI ?? '',
  JWT_SECRET: ENV.JWT_SECRET ?? 'test',
};

export { config };
