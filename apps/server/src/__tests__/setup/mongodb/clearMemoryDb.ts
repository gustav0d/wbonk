import mongoose from 'mongoose';

export async function clearDatabase() {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
}

export async function clearDbAndRestartCounters() {
  await clearDatabase();
}
