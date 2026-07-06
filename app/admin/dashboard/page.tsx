"use client";
import React, { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('المنتجات'); 
  
  const [settings, setSettings] = useState({ cash1: '', cash2: '', whatsapp: '', whatsapp2: '', whatsappGroup: '', telegramGroup: '', deliveryFee: 0, marqueeText: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]); 
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  const [newProd, setNewProd] = useState({ name: '', price: '', quantity: '', category: 'الروايات', imageUrl: '', rating: '5', salesCount: '0' });
  const [newSale, setNewSale] = useState({ productName: '', price: '' });
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', maxUses: '1', expiryDate: '' });

  useEffect(() => {
    const savedSet = localStorage.getItem('aya_settings_v5');
    const savedProd = localStorage.getItem('aya_products_v5');
    const savedSales = localStorage.getItem('aya_sales_v5');
    const savedOrders = localStorage.getItem('aya_orders_v5');
    const savedUsers = localStorage.getItem('aya_users_v5');
    const savedCoupons = localStorage.getItem('aya_coupons_v5');
    
    if (savedSet) setSettings(JSON.parse(savedSet));
    if (savedProd) setProducts(JSON.parse(savedProd));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
  }, []);

  const saveSettings = () => {
    localStorage.setItem('aya_settings_v5', JSON.stringify(settings));
    alert('✅ تم حفظ الإعدادات بنجاح!');
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.quantity) return alert('أكمل بيانات المنتج!');
    
    const productItem = {
      id: Date.now(),
      name: newProd.name,
      price: Number(newProd.price),
      quantity: Number(newProd.quantity),
      category: newProd.category,
      imageUrl: newProd.imageUrl || 'https://via.placeholder.com/300/1f2937/ffffff?text=No+Image',
      rating: Number(newProd.rating),
      salesCount: Number(newProd.salesCount),
      createdAt: Date.now()
    };

    const updated = [productItem, ...products];
    setProducts(updated);
    localStorage.setItem('aya_products_v5', JSON.stringify(updated));
    setNewProd({ name: '', price: '', quantity: '', category: 'الروايات', imageUrl: '', rating: '5', salesCount: '0' });
  };

  const removeProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('aya_products_v5', JSON.stringify(updated));
  };

  const updateQuantity = (id: number, amount: number) => {
    const updated = products.map(p => {
      if (p.id === id) {
        const newQuantity = p.quantity + amount;
        return { ...p, quantity: newQuantity >= 0 ? newQuantity : 0 };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('aya_products_v5', JSON.stringify(updated));
  };

  const addSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSale.productName || !newSale.price) return alert('أدخل تفاصيل المبيعة!');
    const saleItem = { id: Date.now(), productName: newSale.productName, price: Number(newSale.price), date: new Date().toLocaleDateString('ar-EG') };
    const updatedSales = [saleItem, ...sales];
    setSales(updatedSales);
    localStorage.setItem('aya_sales_v5', JSON.stringify(updatedSales));
    setNewSale({ productName: '', price: '' });
  };

  const removeSale = (id: number) => {
    const updatedSales = sales.filter(s => s.id !== id);
    setSales(updatedSales);
    localStorage.setItem('aya_sales_v5', JSON.stringify(updatedSales));
  };

  const approveOrder = (id: number) => {
    const updated = orders.map(o => o.id === id ? { ...o, status: 'مكتمل' } : o);
    setOrders(updated);
    localStorage.setItem('aya_orders_v5', JSON.stringify(updated));
  };

  const addCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newCoupon.expiryDate) return alert('يجب تحديد تاريخ الانتهاء');
    const couponItem = { 
      id: Date.now(), 
      code: newCoupon.code, 
      discount: Number(newCoupon.discount),
      maxUses: Number(newCoupon.maxUses),
      expiryDate: newCoupon.expiryDate
    };
    const updated = [...coupons, couponItem];
    setCoupons(updated);
    localStorage.setItem('aya_coupons_v5', JSON.stringify(updated));
    setNewCoupon({ code: '', discount: '', maxUses: '1', expiryDate: '' });
  };

  const removeCoupon = (id: number) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    localStorage.setItem('aya_coupons_v5', JSON.stringify(updated));
  };

  const totalStockValue = products.reduce((total, p) => total + (p.price * p.quantity), 0);
  const totalSalesRevenue = sales.reduce((total, s) => total + s.price, 0);

  const tabs = ['المنتجات', 'جرد المخزون', 'الطلبات المعلقة', 'العملاء', 'سجل المبيعات', 'الكوبونات', 'الإعدادات', 'الإدارة'];

  return (
    <div style={{ backgroundColor: '#000000', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px', direction: 'rtl' }}>
      
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '4rem', margin: '0', fontWeight: 'bold', letterSpacing: '2px' }}>MOSHA <span style={{ fontSize: '3rem' }}>🕷️</span></h1>
        <p style={{ fontStyle: 'italic', color: '#9ca3af', fontSize: '1.2rem', marginTop: '5px' }}>Nah I'd win</p>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {tabs.map((tab) => (
          <button 
            key={tab} onClick={() => setActiveTab(tab)}
            style={{ backgroundColor: activeTab === tab ? '#1a1a1a' : '#000', color: activeTab === tab ? '#10b981' : '#fff', border: `1px solid ${activeTab === tab ? '#10b981' : '#333'}`, padding: '15px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', transition: '0.3s' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'الإعدادات' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>⚙️ إعدادات الموقع وطرق الدفع</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>شريط الإعلانات والتنبيهات المتحرك للموقع</label>
              <input value={settings.marqueeText || ''} onChange={(e) => setSettings({...settings, marqueeText: e.target.value})} placeholder="مثال: خصم 20% لفترة محدودة..." style={inputStyle}/>
            </div>
            <div><label style={labelStyle}>رقم فودافون كاش (1)</label><input value={settings.cash1} onChange={(e) => setSettings({...settings, cash1: e.target.value})} style={inputStyle}/></div>
            <div><label style={labelStyle}>رقم فودافون كاش (2)</label><input value={settings.cash2} onChange={(e) => setSettings({...settings, cash2: e.target.value})} style={inputStyle}/></div>
            <div><label style={labelStyle}>رقم الواتساب (رئيسي)</label><input value={settings.whatsapp} onChange={(e) => setSettings({...settings, whatsapp: e.target.value})} style={inputStyle}/></div>
            <div><label style={labelStyle}>رقم الواتساب (دعم)</label><input value={settings.whatsapp2} onChange={(e) => setSettings({...settings, whatsapp2: e.target.value})} style={inputStyle}/></div>
            <div><label style={labelStyle}>رابط جروب الواتساب</label><input value={settings.whatsappGroup} onChange={(e) => setSettings({...settings, whatsappGroup: e.target.value})} style={inputStyle}/></div>
            <div><label style={labelStyle}>رابط قناة التليجرام</label><input value={settings.telegramGroup} onChange={(e) => setSettings({...settings, telegramGroup: e.target.value})} style={inputStyle}/></div>
          </div>
          <button onClick={saveSettings} style={{...btnStyle, width: '100%'}}>💾 حفظ الإعدادات</button>
        </div>
      )}

      {activeTab === 'المنتجات' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>📦 تأسيس منتج جديد</h2>
          <form onSubmit={addProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '15px', marginBottom: '30px', alignItems: 'end' }}>
            <div><label style={labelStyle}>اسم المنتج</label><input required value={newProd.name} onChange={(e) => setNewProd({...newProd, name: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>السعر (ج.م)</label><input required type="number" value={newProd.price} onChange={(e) => setNewProd({...newProd, price: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>الكمية</label><input required type="number" value={newProd.quantity} onChange={(e) => setNewProd({...newProd, quantity: e.target.value})} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>التصنيف</label>
              <select value={newProd.category} onChange={(e) => setNewProd({...newProd, category: e.target.value})} style={inputStyle}>
                <option value="الروايات">الروايات</option>
                <option value="نوت بوك">نوت بوك</option>
                <option value="أدوات مكتبية">أدوات مكتبية</option>
              </select>
            </div>
            <div><label style={labelStyle}>التقييم (1 لـ 5)</label><input required type="number" min="1" max="5" value={newProd.rating} onChange={(e) => setNewProd({...newProd, rating: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>تم شراءه (رقم العرض)</label><input required type="number" value={newProd.salesCount} onChange={(e) => setNewProd({...newProd, salesCount: e.target.value})} style={inputStyle} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>رابط الصورة</label><input value={newProd.imageUrl} onChange={(e) => setNewProd({...newProd, imageUrl: e.target.value})} style={inputStyle} /></div>
            <button type="submit" style={{...btnStyle, marginTop: 0, gridColumn: 'span 4'}}>➕ إضافة الكتالوج</button>
          </form>

          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#1a1a1a' }}><th style={thStyle}>المنتج</th><th style={thStyle}>التصنيف</th><th style={thStyle}>السعر</th><th style={thStyle}>المبيعات/تقييم</th><th style={thStyle}>إجراء</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.category}</td>
                  <td style={tdStyle}><span style={{ color: '#34d399' }}>{p.price} ج.م</span></td>
                  <td style={tdStyle}>⭐ {p.rating} | 🛒 {p.salesCount}</td>
                  <td style={tdStyle}><button onClick={() => removeProduct(p.id)} style={deleteBtnStyle}>مسح</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'الطلبات المعلقة' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>🛒 طلبات الزبائن من المتجر</h2>
          {orders.length === 0 ? <p style={{color: '#9ca3af'}}>لا توجد طلبات حتى الآن.</p> : orders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#111', padding: '15px', border: '1px solid #333', marginBottom: '15px', borderRadius: '8px' }}>
              <p><strong>العميل:</strong> {order.userName} - <strong>رقم الهاتف:</strong> {order.phone}</p>
              <p><strong>العنوان:</strong> {order.address}</p>
              <p><strong>الإجمالي المطلوب:</strong> <span style={{color:'#10b981'}}>{order.total} ج.م</span> | <strong>الحالة:</strong> <span style={{color: order.status === 'معلق' ? 'orange' : 'green'}}>{order.status}</span></p>
              <ul style={{color: '#d1d5db'}}>
                {order.cart?.map((item:any) => <li key={item.id}>{item.name} (الكمية المطلوبة: {item.cartQuantity})</li>)}
              </ul>
              {order.status === 'معلق' && <button onClick={() => approveOrder(order.id)} style={btnStyle}>✅ تأكيد الطلب واستلام الفلوس</button>}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'العملاء' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>👥 قاعدة بيانات العملاء</h2>
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#1a1a1a' }}><th style={thStyle}>الاسم</th><th style={thStyle}>رقم الهاتف</th><th style={thStyle}>الإيميل</th></tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #333' }}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle}>{u.phone}</td>
                  <td style={tdStyle}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'جرد المخزون' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>📊 جرد وتعديل الكميات</h2>
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#1a1a1a' }}><th style={thStyle}>المنتج</th><th style={thStyle}>الكمية الحالية</th><th style={thStyle}>تعديل سريع</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}><span style={{ color: p.quantity > 5 ? '#60a5fa' : '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>{p.quantity}</span></td>
                  <td style={tdStyle}>
                    <button onClick={() => updateQuantity(p.id, 1)} style={iconBtnStyle}>+</button>
                    <button onClick={() => updateQuantity(p.id, -1)} style={{...iconBtnStyle, backgroundColor: '#3f3f46'}}>-</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'الكوبونات' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>🎟️ إدارة الكوبونات</h2>
          <form onSubmit={addCoupon} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '15px', alignItems: 'end' }}>
            <div><label style={labelStyle}>الكود</label><input required value={newCoupon.code} onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.trim()})} style={inputStyle} /></div>
            <div><label style={labelStyle}>نسبة الخصم %</label><input required type="number" value={newCoupon.discount} onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>عدد مرات الاستخدام للفرد</label><input required type="number" min="1" value={newCoupon.maxUses} onChange={(e) => setNewCoupon({...newCoupon, maxUses: e.target.value})} style={inputStyle} /></div>
            <div><label style={labelStyle}>تاريخ الانتهاء</label><input required type="date" value={newCoupon.expiryDate} onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})} style={inputStyle} /></div>
            <button type="submit" style={{...btnStyle, marginTop: 0}}>حفظ</button>
          </form>
          
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead><tr style={{ backgroundColor: '#1a1a1a' }}><th style={thStyle}>الكود</th><th style={thStyle}>الخصم</th><th style={thStyle}>الحد للفرد</th><th style={thStyle}>ينتهي في</th><th style={thStyle}>إجراء</th></tr></thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={tdStyle}>{c.code}</td>
                  <td style={tdStyle}>{c.discount}%</td>
                  <td style={tdStyle}>{c.maxUses} مرات</td>
                  <td style={tdStyle}>{c.expiryDate}</td>
                  <td style={tdStyle}><button onClick={() => removeCoupon(c.id)} style={deleteBtnStyle}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'سجل المبيعات' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>📝 المبيعات الخارجية (اليدوية)</h2>
          <form onSubmit={addSale} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '15px', marginBottom: '30px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>المنتج</label>
              <input required list="products-list" value={newSale.productName} onChange={(e) => setNewSale({...newSale, productName: e.target.value})} style={inputStyle} />
              <datalist id="products-list">{products.map(p => <option key={p.id} value={p.name} />)}</datalist>
            </div>
            <div><label style={labelStyle}>السعر</label><input required type="number" value={newSale.price} onChange={(e) => setNewSale({...newSale, price: e.target.value})} style={inputStyle} /></div>
            <button type="submit" style={{...btnStyle, marginTop: 0}}>تسجيل</button>
          </form>
          <table style={{ width: '100%', textAlign: 'right', borderCollapse: 'collapse' }}>
            <thead><tr style={{ backgroundColor: '#1a1a1a' }}><th style={thStyle}>التاريخ</th><th style={thStyle}>المنتج</th><th style={thStyle}>المبلغ</th><th style={thStyle}>إجراء</th></tr></thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={tdStyle}>{s.date}</td>
                  <td style={tdStyle}>{s.productName}</td>
                  <td style={tdStyle}><span style={{ color: '#10b981', fontWeight: 'bold' }}>+ {s.price} ج.م</span></td>
                  <td style={tdStyle}><button onClick={() => removeSale(s.id)} style={deleteBtnStyle}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'الإدارة' && (
        <div style={sectionStyle}>
          <h2 style={{ color: '#10b981', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>📈 لوحة القيادة والإحصائيات</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div style={statBoxStyle}>
              <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '1rem' }}>أنواع المنتجات في الكتالوج</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#fff', fontWeight: 'bold' }}>{products.length}</p>
            </div>
            <div style={statBoxStyle}>
              <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '1rem' }}>رأس المال بالمخزن</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#60a5fa', fontWeight: 'bold' }}>{totalStockValue} ج.م</p>
            </div>
            <div style={statBoxStyle}>
              <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '1rem' }}>مبيعات يدوية مسجلة</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#10b981', fontWeight: 'bold' }}>{totalSalesRevenue} ج.م</p>
            </div>
            <div style={statBoxStyle}>
              <h3 style={{ color: '#9ca3af', margin: '0 0 10px 0', fontSize: '1rem' }}>أوردرات من الموقع</h3>
              <p style={{ fontSize: '2rem', margin: 0, color: '#f59e0b', fontWeight: 'bold' }}>{orders.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const sectionStyle = { backgroundColor: '#111', padding: '30px', borderRadius: '12px', border: '1px solid #222' };
const labelStyle = { display: 'block', marginBottom: '8px', color: '#9ca3af', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px', backgroundColor: '#000', color: '#fff', border: '1px solid #333', borderRadius: '8px', boxSizing: 'border-box' as const };
const btnStyle = { padding: '12px 25px', backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };
const deleteBtnStyle = { backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '8px 15px' };
const iconBtnStyle = { backgroundColor: '#10b981', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '8px 15px', marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2rem' };
const thStyle = { padding: '15px', borderBottom: '2px solid #333' };
const tdStyle = { padding: '15px', color: '#d1d5db', verticalAlign: 'middle' };
const statBoxStyle = { backgroundColor: '#0a0a0a', padding: '25px', borderRadius: '12px', border: '1px solid #222', textAlign: 'center' as const };