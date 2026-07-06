"use client";
import React, { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({ cash1: '', cash2: '', whatsapp: '' });
  const [step, setStep] = useState('cart'); 
  const [formData, setFormData] = useState({ userName: '', phone: '', address: '' });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('aya_cart_v5') || '[]'));
    setSettings(JSON.parse(localStorage.getItem('aya_settings_v5') || '{}'));
  }, []);

  const deliveryFee = 50;
  const subTotal = cart.reduce((a, b) => a + (b.price * b.cartQuantity), 0);
  const total = subTotal + deliveryFee;

  const updateCartQty = (id: number, delta: number) => {
    const updated = cart.map(item => item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) } : item);
    setCart(updated);
    localStorage.setItem('aya_cart_v5', JSON.stringify(updated));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter(i => i.id !== id);
    setCart(updated);
    localStorage.setItem('aya_cart_v5', JSON.stringify(updated));
  };

  const confirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem('aya_products_v5') || '[]');
    const updatedProducts = products.map((p: any) => {
      const cartItem = cart.find(c => c.id === p.id);
      return cartItem ? { ...p, quantity: p.quantity - cartItem.cartQuantity } : p;
    });
    localStorage.setItem('aya_products_v5', JSON.stringify(updatedProducts));
    
    const order = { id: Date.now(), ...formData, cart, total: total, status: 'معلق' };
    localStorage.setItem('aya_orders_v5', JSON.stringify([order, ...JSON.parse(localStorage.getItem('aya_orders_v5') || '[]')]));
    
    localStorage.setItem('aya_sales_v5', JSON.stringify([...cart.map(c => ({ id: Date.now(), productName: c.name, price: c.price * c.cartQuantity, date: new Date().toLocaleDateString('ar-EG') })), ...JSON.parse(localStorage.getItem('aya_sales_v5') || '[]')]));
    
    setStep('success');
  };

  if (step === 'success') return (
    <div style={{ textAlign: 'center', color: '#fff', padding: '40px', backgroundColor: '#050505', minHeight: '100vh', direction: 'rtl' }}>
      <h1 style={{ color: '#10b981' }}>✅ تم استلام طلبك بنجاح!</h1>
      <p style={{ fontSize: '1.2rem' }}>يرجى التحويل على فودافون كاش لتأكيد الطلب</p>
      
      <div style={{ border: '2px dashed #10b981', padding: '20px', borderRadius: '15px', display: 'inline-block', marginTop: '20px', textAlign: 'right' }}>
        <h3 style={{ color: '#10b981', marginTop: 0 }}>بيانات الدفع:</h3>
        <p>💰 فودافون كاش (1): <strong>{settings.cash1}</strong></p>
        <p>💰 فودافون كاش (2): <strong>{settings.cash2}</strong></p>
        <a href={`https://wa.me/${settings.whatsapp}`} style={{ color: '#25d366', fontWeight: 'bold', textDecoration: 'none' }}>
           💬 اضغط هنا لإرسال سكرين التحويل على الواتساب
        </a>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '40px', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🛒 السلة</h1>
      {cart.length === 0 ? <p style={{ textAlign: 'center' }}>السلة فارغة</p> : (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
          {cart.map((item: any) => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #222' }}>
              <div>
                <h4 style={{ margin: 0 }}>{item.name}</h4>
                <p style={{ color: '#888', fontSize: '0.9rem' }}>{item.price} ج.م</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => updateCartQty(item.id, -1)} style={cirleBtn}>-</button>
                <span>{item.cartQuantity}</span>
                <button onClick={() => updateCartQty(item.id, 1)} style={cirleBtn}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '5px' }}>حذف</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: '20px', textAlign: 'center', backgroundColor: '#111', padding: '20px', borderRadius: '10px' }}>
            <p>المنتجات: {subTotal} ج.م</p>
            <p>مصاريف التوصيل: {deliveryFee} ج.م</p>
            <h2 style={{ color: '#10b981' }}>الإجمالي: {total} ج.م</h2>
            <button onClick={() => setStep('form')} style={{ padding: '15px 40px', backgroundColor: '#10b981', borderRadius: '50px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>تأكيد البيانات</button>
          </div>
        </div>
      )}
      {step === 'form' && (
        <form onSubmit={confirmBooking} style={{ maxWidth: '400px', margin: '30px auto' }}>
          <input required placeholder="الاسم" onChange={e => setFormData({...formData, userName: e.target.value})} style={inputStyle} />
          <input required placeholder="الهاتف" onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
          <input required placeholder="العنوان" onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#10b981', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>شراء الآن</button>
        </form>
      )}
    </div>
  );
}

const cirleBtn = { backgroundColor: '#333', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' };
const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', borderRadius: '5px' };