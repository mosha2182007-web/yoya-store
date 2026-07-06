"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const inputStyle = { width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #3f3f46', backgroundColor: '#27272a', color: 'white', marginBottom: '15px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: 'white', padding: '50px', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: '#3f3f46', color: 'white', border: 'none', borderRadius: '8px' }}>← رجوع</button>
      <h1 style={{ color: '#ea580c', marginBottom: '30px' }}>⚙️ الإعدادات المتقدمة</h1>
      <div style={{ backgroundColor: '#18181b', padding: '40px', borderRadius: '16px', maxWidth: '600px' }}>
        <h3 style={{ color: '#ea580c' }}>أرقام وقنوات الواتساب</h3>
        <input placeholder="رقم الواتساب الأساسي" style={inputStyle} />
        <input placeholder="رقم الواتساب الإضافي" style={inputStyle} />
        <input placeholder="رابط قناة الواتساب" style={inputStyle} />
        
        <h3 style={{ color: '#ea580c', marginTop: '20px' }}>أرقام فودافون كاش</h3>
        <input placeholder="رقم كاش 1" style={inputStyle} />
        <input placeholder="رقم كاش 2" style={inputStyle} />
        
        <h3 style={{ color: '#ea580c', marginTop: '20px' }}>قنوات التليجرام</h3>
        <input placeholder="رابط قناة التليجرام" style={inputStyle} />
        
        <button style={{ width: '100%', padding: '15px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>حفظ الإعدادات بالكامل</button>
      </div>
    </div>
  );
}