import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("The MONGODB_URI environment variable is not defined.");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as typeof globalThis & { mongooseCache?: MongooseCache };

if (!globalWithMongoose.mongooseCache) {
  globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (globalWithMongoose.mongooseCache?.conn) {
    return globalWithMongoose.mongooseCache.conn;
  }

  if (!globalWithMongoose.mongooseCache?.promise) {
    globalWithMongoose.mongooseCache.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  globalWithMongoose.mongooseCache.conn = await globalWithMongoose.mongooseCache.promise;
  return globalWithMongoose.mongooseCache.conn;
}
