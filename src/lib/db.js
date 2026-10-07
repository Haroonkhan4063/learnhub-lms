import mongoose from "mongoose";

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}
