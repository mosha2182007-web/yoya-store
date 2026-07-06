import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// التأكد من أن رابط قاعدة البيانات موجود في ملف الإعدادات
if (!MONGODB_URI) {
  throw new Error("رجاءً قم بتعريف متغير MONGODB_URI داخل ملف .env.local");
}

// كود لحفظ الاتصال (Caching) عشان Next.js ما يفتحش كذا كنيكشن في نفس الوقت أثناء التطوير
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      console.log("✅ تم الاتصال بقاعدة بيانات Yoya World بنجاح");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;