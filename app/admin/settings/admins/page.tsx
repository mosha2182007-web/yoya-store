"use client";
import { useState } from 'react';

export default function AdminSettings() {
  const [password, setPassword] = useState('');

  const saveAdminSettings = () => {
    localStorage.setItem('adminPass', password);
    alert("تم تحديث صلاحيات الدخول للأدمن بنجاح!");
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#09090b', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#ea580c' }}>🛡️ صلاحيات التحكم (الأدمن)</h1>
      <div style={{ backgroundColor: '#18181b', padding: '30px', borderRadius: '16px', maxWidth: '400px' }}>
        <p>كلمة سر الدخول للوحة التحكم:</p>
        <input 
          type="password" 
          placeholder="كلمة السر الجديدة" 
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#27272a', border: 'none', color: 'white', borderRadius: '5px' }} 
        />
        <button onClick={saveAdminSettings} style={{ width: '100%', padding: '12px', backgroundColor: '#ea580c', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>حفظ الإعدادات</button>
      </div>
    </div>
  );
}