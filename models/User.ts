import mongoose, { Schema, model, models } from "mongoose";

// تحديد شكل البيانات لكل مستخدم في الموقع
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    whatsapp: { type: String, required: false }, // رقم الواتساب الخاص بالعميل لشحن الطلبات
    
    // تحديد الرتبة: عميل عادي، أدمن بصلاحيات، أو سوبر أدمن (MOSHA)
    role: {
      type: String,
      enum: ["user", "admin", "super-admin"],
      default: "user",
    },
    
    // الصلاحيات المخصصة للأدمن الفرعي (مثال: التحكم في الكوبونات فقط أو الكتب فقط)
    permissions: {
      type: [String],
      default: [], // مثال: ['manage_books', 'manage_coupons', 'manage_orders']
    },
  },
  { timestamps: true } // بيسجل تلقائياً وقت إنشاء الحساب ووقت تعديله
);

// التأكد من عدم إعادة إنشاء الموديل لو كان موجوداً بالفعل في Next.js
const User = models.User || model("User", UserSchema);

export default User;
