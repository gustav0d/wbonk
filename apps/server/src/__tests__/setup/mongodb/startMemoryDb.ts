import { randomUUID } from 'node:crypto';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const startMemoryDb = async () => {
  const name = randomUUID();
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        dbName: name,
        storageEngine: 'wiredTiger',
      },
      binary: {
        version: '4.0.12',
      },
    });
    await mongoServer.ensureInstance();
  }
  global.__MONGO_URI__ = mongoServer.getUri();
  console.log(name, global.__MONGO_URI__);

  return mongoServer;
};
