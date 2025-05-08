import type MongoMemoryServer from 'mongodb-memory-server-core';
import type mongoose from 'mongoose';

export const disconnectMemoryDb = (db: MongoMemoryServer) => db.stop();
export const disconnectMongoose = async (connection: mongoose.Mongoose) => {
  await connection.connection.close();
};
