import type MongoMemoryServer from 'mongodb-memory-server-core';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, beforeEach } from '@jest/globals';
import { clearDbAndRestartCounters } from './mongodb/clearDatabase';
import { connectMongoose } from './mongodb/connectMemoryDb';
import { disconnectMongoose } from './mongodb/disconnectMemoryDb';
import { startMemoryDb } from './mongodb/startMemoryDb';

let mongod: MongoMemoryServer | null;
let connection: mongoose.Mongoose;

// Configure Jest timeout
jest.setTimeout(50000);

beforeAll(async () => {
  mongod = await startMemoryDb();
});

beforeEach(async () => {
  connection = await connectMongoose();
  await clearDbAndRestartCounters(connection);
});

afterEach(async () => {
  await disconnectMongoose(connection);
});

afterAll(() => {
  if (!mongod) return;
  mongod.stop();
  mongod = null;
});
