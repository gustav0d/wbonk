declare global {
  namespace NodeJS {
    interface Global {
      __COUNTERS__: Record<string, 0>;
      __MONGO_URI__: string;
      __MONGO_DB_NAME__: string;
    }
  }

  interface GlobalThis {
    __COUNTERS__: Record<string, number>;
  }
  var __COUNTERS__: Record<string, number>;
}
