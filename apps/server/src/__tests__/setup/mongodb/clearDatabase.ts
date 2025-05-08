import type mongoose from 'mongoose';

async function clearDatabase(connection: mongoose.Mongoose) {
  if (connection.connection.db) {
    await connection.connection.db.dropDatabase({
      retryWrites: false,
      readConcern: 'majority',
    });
  }
}

export async function clearDbAndRestartCounters(connection: mongoose.Mongoose) {
  await clearDatabase(connection);
}
