"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem('moshaSales');
    setSales(data ? JSON.parse(data) : []);
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#09090b', color: 'white', minHeight: '100vh' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', padding: '10px' }}>← رجوع</button>
      <h1 style={{ color: '#ea580c' }}>📜 سجل المبيعات الكامل</h1>
      <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '16px' }}>
        {sales.length === 0 ? <p>لا توجد مبيعات حالياً.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3f3f46' }}>
                <th style={{ padding: '15px', textAlign: 'right' }}>المنتج</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>الكمية</th>
                <th style={{ padding: '15px', textAlign: 'right' }}>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s: any, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #27272a' }}>
                  <td style={{ padding: '15px' }}>{s.name}</td>
                  <td style={{ padding: '15px' }}>{s.qty}</td>
                  <td style={{ padding: '15px' }}>{s.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}