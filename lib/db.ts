import mongoose from 'mongoose';

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_ATLAS_MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MongoDB connection is not configured. Connect MongoDB Atlas or provide MONGODB_URI.');
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri);
  try {
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
