"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminDashboard() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setStatus("جاري التحقق...");
    
    try {
      const response = await fetch('/api/admin/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        setStatus("✅ تم الدخول بنجاح! جاري التوجيه...");
        setTimeout(() => router.push('/admin/dashboard'), 1000); 
      } else {
        setStatus("❌ كلمة المرور غير صحيحة");
      }
    } catch (error) {
      setStatus("⚠️ خطأ في الاتصال");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center" dir="rtl">
      <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-700 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">لوحة تحكم MOSHA</h1>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="كلمة السر" 
          className="w-full p-3 bg-zinc-800 rounded border border-zinc-600 mb-4 text-white"
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-500 transition"
        >
          دخول
        </button>
        <p className="mt-4 text-center text-sm text-zinc-400">{status}</p>
      </div>
    </main>
  );
}