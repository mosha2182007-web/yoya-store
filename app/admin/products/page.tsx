"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
  const [product, setProduct] = useState({ 
    name: '', 
    category: '', 
    subCategory: '', // التصنيف الفرعي
    price: '', 
    imageUrl: '' // رابط الصورة
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#09090b', color: 'white', padding: '40px', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.back()} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: '1px solid #3f3f46', color: 'white', padding: '5px 10px', borderRadius: '5px' }}>
        ← رجوع
      </button>
      
      <h1 style={{ color: '#ea580c', marginBottom: '30px' }}>إضافة منتج جديد</h1>

      <div style={{ backgroundColor: '#18181b', padding: '25px', borderRadius: '12px', maxWidth: '500px' }}>
        {/* اسم المنتج */}
        <input 
          placeholder="اسم المنتج" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setProduct({...product, name: e.target.value})}
        />
        
        {/* التصنيف الرئيسي */}
        <select 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setProduct({...product, category: e.target.value})}
        >
          <option>التصنيف الرئيسي (كتب، روايات..)</option>
          <option value="books">كتب</option>
          <option value="novels">روايات</option>
        </select>

        {/* التصنيف الفرعي (الجديد) */}
        <input 
          placeholder="التصنيف الفرعي (مثال: مغامرات، أطفال، رعب)" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setProduct({...product, subCategory: e.target.value})}
        />

        {/* رابط الصورة */}
        <input 
          placeholder="رابط الصورة (URL)" 
          style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setProduct({...product, imageUrl: e.target.value})}
        />

        {/* السعر */}
        <input 
          type="number" 
          placeholder="السعر" 
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: 'none', backgroundColor: '#27272a', color: 'white' }}
          onChange={(e) => setProduct({...product, price: e.target.value})}
        />

        <button style={{ width: '100%', padding: '12px', backgroundColor: '#ea580c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          حفظ المنتج في المتجر
        </button>
      </div>
    </div>
  );
}