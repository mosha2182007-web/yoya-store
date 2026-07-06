"use client";
import React, { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [user, setUser] = useState<any>(null);
  const [address, setAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('aya_cart_v5') || '[]'));
    setUser(JSON.parse(localStorage.getItem('aya_currentUser_v5') || 'null'));
    setSettings(JSON.parse(localStorage.getItem('aya_settings_v5') || '{}'));
  }, []);

  const updateQty = (id: number, amount: number) => {
    let updated = cart.map(item => {
      if (item.id === id) {
        const newQ = item.cartQuantity + amount;
        return { ...item, cartQuantity: newQ > 0 ? newQ : 1 };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('aya_cart_v5', JSON.stringify(updated));
  };

  const remove = (id: number) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    localStorage.setItem('aya_cart_v5', JSON.stringify(updated));
  };

  const applyCoupon = () => {
    const coupons = JSON.parse(localStorage.getItem('aya_coupons_v5') || '[]');
    const valid = coupons.find((c:any) => c.code === couponCode);
    if (valid) {
      setDiscount(valid.discount);
      alert(`✅ تم تفعيل الكوبون بخصم ${valid.discount}%`);
    } else {
      alert('❌ الكوبون غير صحيح!');
      setDiscount(0);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);
  const finalTotal = subtotal - (subtotal * (discount / 100));

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('برجاء تسجيل الدخول أولاً من الصفحة الرئيسية!');
    if (cart.length === 0) return alert('السلة فارغة!');

    // 1. تسجيل الطلب في الإدارة
    const orders = JSON.parse(localStorage.getItem('aya_orders_v5') || '[]');
    const newOrder = {
      id: Date.now(),
      userId: user.phone,
      userName: user.name,
      phone: user.phone,
      address,
      cart,
      total: finalTotal,
      status: 'معلق',
      date: new Date().toLocaleDateString()
    };
    localStorage.setItem('aya_orders_v5', JSON.stringify([newOrder, ...orders]));

    // 2. خصم الكميات من المخزن تلقائياً
    let products = JSON.parse(localStorage.getItem('aya_products_v5') || '[]');
    cart.forEach(cartItem => {
      let pIndex = products.findIndex((p:any) => p.id === cartItem.id);
      if (pIndex !== -1) {
        products[pIndex].quantity -= cartItem.cartQuantity;
      }
    });
    localStorage.setItem('aya_products_v5', JSON.stringify(products));

    // 3. تفريغ السلة وإظهار صفحة الدفع
    localStorage.removeItem('aya_cart_v5');
    setCart([]);
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif', direction: 'rtl' }}>
        <h1 style={{ color: '#10b981' }}>✅ تم تسجيل طلبك بنجاح!</h1>
        <h2>المبلغ المطلوب: {finalTotal} ج.م</h2>
        <div style={{ backgroundColor: '#f3f4f6', padding: '20px', borderRadius: '10px', display: 'inline-block', marginTop: '20px' }}>
          <h3>لإتمام الطلب، برجاء التحويل على فودافون كاش:</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{settings.cash1}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{settings.cash2}</p>
          <hr />
          <p>ثم أرسل سكرين شوت للتحويل على الواتساب:</p>
          <a href={`https://wa.me/${settings.whatsapp}`} style={{...btnStyle, display: 'inline-block'}}>تأكيد الدفع واتساب 💬</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h2>🛒 سلة المشتريات</h2>
      {cart.length === 0 ? <p>سلتك فاضية يا بطل!</p> : (
        <>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
              <div>
                <h4>{item.name}</h4>
                <p>{item.price} ج.م</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => updateQty(item.id, 1)} style={iconBtn}>+</button>
                <span>{item.cartQuantity}</span>
                <button onClick={() => updateQty(item.id, -1)} style={iconBtn}>-</button>
                <button onClick={() => remove(item.id)} style={{...iconBtn, backgroundColor: '#ef4444', color: '#fff'}}>🗑️</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <input placeholder="أدخل كود الخصم (اختياري)" value={couponCode} onChange={e => setCouponCode(e.target.value)} style={inputStyle} />
            <button onClick={applyCoupon} style={btnStyle}>تفعيل الكوبون</button>
          </div>

          <form onSubmit={placeOrder} style={{ marginTop: '30px', backgroundColor: '#f9fafb', padding: '20px', borderRadius: '10px' }}>
            <h3>تفاصيل التوصيل 📍</h3>
            <p><strong>الاسم:</strong> {user?.name || 'يرجى تسجيل الدخول أولاً'}</p>
            <p><strong>الرقم:</strong> {user?.phone}</p>
            <textarea required placeholder="اكتب العنوان بالتفصيل هنا..." value={address} onChange={e => setAddress(e.target.value)} style={{...inputStyle, height: '100px'}} />
            
            <h2 style={{ color: '#064e3b', marginTop: '20px' }}>الإجمالي بعد الخصم: {finalTotal} ج.م</h2>
            
            <button type="submit" style={{...btnStyle, width: '100%', fontSize: '1.2rem', padding: '15px', marginTop: '10px'}}>إتمام الطلب والدفع 🚀</button>
          </form>
        </>
      )}
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #ccc', borderRadius: '8px', width: '100%', boxSizing: 'border-box' as const };
const btnStyle = { padding: '10px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const iconBtn = { padding: '5px 15px', border: '1px solid #ccc', borderRadius: '5px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' };