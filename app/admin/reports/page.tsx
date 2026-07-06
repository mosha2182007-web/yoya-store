"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();
  const [stock, setStock] = useState([]);
  const [newName, setNewName] = useState('');
  const [newQty, setNewQty] = useState('');

  // تحميل البيانات
  useEffect(() => {
    const saved = localStorage.getItem('moshaStock');
    setStock(saved ? JSON.parse(saved) : []);
  }, []);

  // دالة الحفظ
  const saveStock = (data: any) => {
    setStock(data);
    localStorage.setItem('moshaStock', JSON.stringify(data));
  };

  // إضافة منتج جديد
  const addProduct = () => {
    if (!newName || !newQty) return alert("اكتب اسم المنتج والكمية!");
    const newItem = { id: Date.now(), name: newName, qty: parseInt(newQty) };
    saveStock([...stock, newItem]);
    setNewName('');
    setNewQty('');
  };

  // حذف منتج
  const deleteProduct = (id: number) => {
    if (confirm("أكيد عاوز تحذف المنتج ده؟")) {
      saveStock(stock.filter((item: any) => item.id !== id));
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#09090b', color: 'white', minHeight: '100vh' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', padding: '10px' }}>← رجوع</button>
      <h1 style={{ color: '#ea580c' }}>📊 جرد المخزون</h1>

      {/* فورم الإضافة */}
      <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '16px', marginBottom: '30px', display: 'flex', gap: '10px' }}>
        <input placeholder="اسم المنتج" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ padding: '10px', color: 'black' }} />
        <input type="number" placeholder="الكمية" value={newQty} onChange={(e) => setNewQty(e.target.value)} style={{ padding: '10px', color: 'black' }} />
        <button onClick={addProduct} style={{ padding: '10px 20px', backgroundColor: '#ea580c', color: 'white', border: 'none', cursor: 'pointer' }}>إضافة منتج</button>
      </div>

      {/* الجدول */}
      <div style={{ backgroundColor: '#18181b', padding: '20px', borderRadius: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #3f3f46', textAlign: 'right' }}>
              <th style={{ padding: '15px' }}>المنتج</th>
              <th style={{ padding: '15px' }}>الكمية</th>
              <th style={{ padding: '15px' }}>تحكم</th>
            </tr>
          </thead>
          <tbody>
            {stock.map((item: any) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #27272a' }}>
                <td style={{ padding: '15px' }}>{item.name}</td>
                <td style={{ padding: '15px' }}>{item.qty}</td>
                <td style={{ padding: '15px' }}>
                  <button onClick={() => deleteProduct(item.id)} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>حذف</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}