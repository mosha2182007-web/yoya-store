"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CouponsPage() {
  const router = useRouter();
  const [coupon, setCoupon] = useState({ code: '', discount: '' });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: '1px solid #3f3f46', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
        ← رجوع
      </button>
      
      <h1 style={{ color: '#ea580c', marginBottom: '30px' }}>إدارة الكوبونات والعروض</h1>

      <div style={{ backgroundColor: '#18181b', padding: '25px', borderRadius: '12px', maxWidth: '500px' }}>
        {/* كود الكوبون */}
        <input 
          placeholder="كود الكوبون (مثال: MOSHA20)" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setCoupon({...coupon, code: e.target.value.toUpperCase()})}
        />
        
        {/* نسبة الخصم */}
        <input 
          type="number" 
          placeholder="نسبة الخصم (%)" 
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setCoupon({...coupon, discount: e.target.value})}
        />

        <button style={{ width: '100%', padding: '12px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          حفظ الكوبون وتفعيله
        </button>
      </div>

      <div style={{ marginTop: '40px', color: '#a1a1aa' }}>
        <h3>الكوبونات النشطة حالياً:</h3>
        <p>لا توجد كوبونات مضافة بعد.</p>
      </div>
    </div>
  );
}