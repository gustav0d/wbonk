import mongoose from 'mongoose';

declare global {
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string;
}

export async function connectMongoose() {
  try {
    return await mongoose.connect(global.__MONGO_URI__, {
      connectTimeoutMS: 10000,
      dbName: global.__MONGO_DB_NAME__,
    });
  } catch (e) {
    console.error('Cannot connect to mongoose: ', e);
  }
}
