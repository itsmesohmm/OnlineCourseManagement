import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDB() {
  const uri = process.env.MONGODB_ATLAS_MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error('MongoDB connection is not configured. Connect MongoDB Atlas or provide MONGODB_URI.');
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri).then((m) => m);
  try { cached.conn = await cached.promise; }
  catch (error) { cached.promise = null; throw error; }
  return cached.conn;
}
