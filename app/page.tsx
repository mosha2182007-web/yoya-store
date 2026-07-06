"use client"; // لازم دي تكون أول سطر
import React, { useState, useEffect } from 'react';

export default function VisitorShop() {
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isLoaded, setIsLoaded] = useState(false); // دي أهم حاجة

  useEffect(() => {
    // الكود ده مش هيشتغل إلا لما الصفحة تفتح في المتصفح
    const savedProd = localStorage.getItem('aya_products_v5');
    const savedSet = localStorage.getItem('aya_settings_v5');
    
    if (savedProd) setProducts(JSON.parse(savedProd));
    if (savedSet) setSettings(JSON.parse(savedSet));
    
    setIsLoaded(true); // عرفنا الصفحة إن الداتا خلاص جهزت
  }, []);

  // لو الصفحة لسه بتحمل، مش هنعرض حاجة (عشان نتفادى مشكلة الـ Hydration)
  if (!isLoaded) return <div style={{backgroundColor: '#000', height: '100vh', color: '#fff', textAlign: 'center', paddingTop: '50px'}}>جاري تحميل المتجر...</div>;

  return (
    <div style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', direction: 'rtl' }}>
      <header style={{ textAlign: 'center', padding: '40px 0' }}>
        <h1 style={{ fontSize: '3rem', color: '#10b981' }}>MOSHA 🕷️</h1>
        {settings.marqueeText && <p style={{ color: '#aaa', marginTop: '10px' }}>{settings.marqueeText}</p>}
      </header>

      {products.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px', color: '#666' }}>
            <h2>لا توجد منتجات حالياً</h2>
            <p>يرجى إضافة منتجات من لوحة تحكم الأدمن.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: '1px solid #333', padding: '15px', borderRadius: '12px', backgroundColor: '#111' }}>
              <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
              <h3 style={{ margin: '15px 0 5px' }}>{p.name}</h3>
              <p style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>{p.price} ج.م</p>
              <button 
                onClick={() => window.open(`https://wa.me/${settings.whatsapp}?text=أريد شراء: ${p.name}`, '_blank')}
                style={{ width: '100%', padding: '10px', backgroundColor: '#25D366', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', marginTop: '10px' }}
              >
                اطلب عبر واتساب
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}