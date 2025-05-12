import { join } from 'node:path';

const cwd = process.cwd();

const root = join.bind(cwd);

const logEnvironments = ['production', 'development', 'prod', 'dev'];

if (process.env.NODE_ENV !== 'production') {
  const { config } = require('dotenv-safe');
  config({
    path: root('.env'),
    sample: root('.env.example'),
  });
}

const ENV = process.env;

const config = {
  NODE_ENV: ENV.NODE_ENV ?? '',
  PORT: ENV.PORT ?? 3000,
  MONGO_URI: ENV.MONGO_URI ?? '',
  JWT_SECRET: ENV.JWT_SECRET ?? 'test',
};

export { config, logEnvironments };
