"use client";
import React, { useState, useEffect } from 'react';

const inputStyle = { padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '15px', width: '100%', boxSizing: 'border-box' as const, fontSize: '1rem', outline: 'none' };
const btnStyle = { padding: '12px 20px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: '0.2s' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto', position: 'relative' as const, zIndex: 1 };
const footerLinkStyle = { color: '#fff', textDecoration: 'none', fontSize: '1.1rem', backgroundColor: '#1f2937', padding: '10px 20px', borderRadius: '8px', border: '1px solid #374151' };
const paginationBtnStyle = { padding: '10px 20px', margin: '0 10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' };

interface Product {
  id: number; name: string; price: number; quantity: number; category: string; imageUrl: string; rating?: number; salesCount?: number;
}

const ProductCard = ({ p, onAdd, discount, isDark }: { p: Product, onAdd: (p: Product) => void, discount: number, isDark: boolean }) => {
  const finalPrice = discount > 0 ? p.price - (p.price * discount / 100) : p.price;
  const stars = Number(p.rating || 5);
  
  return (
    <div style={{ backgroundColor: isDark ? '#1f2937' : '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.2)', border: isDark ? '1px solid #374151' : '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '220px', backgroundImage: `url(${p.imageUrl || 'https://via.placeholder.com/300?text=بدون+صورة'})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f3f4f6' }}></div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: '10px' }}>{p.category}</span>
        
        <h3 style={{ margin: '0 0 5px 0', color: isDark ? '#f9fafb' : '#1f2937' }}>{p.name}</h3>
        
        {/* النجوم وتقييم المبيعات */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px' }}>
          <span style={{ color: '#fbbf24', fontSize: '1.1rem', letterSpacing: '2px' }}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </span>
          <span style={{ fontSize: '0.85rem', color: isDark ? '#9ca3af' : '#6b7280', marginRight: '5px' }}>
            (اشتراه {p.salesCount || 0} شخص)
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          {discount > 0 ? (
            <>
              <span style={{ textDecoration: 'line-through', color: '#ef4444', marginRight: '10px', fontSize: '1rem' }}>{p.price} ج.م</span>
              <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>{finalPrice} ج.م</span>
            </>
          ) : (
            <p style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.4rem', margin: 0 }}>{p.price} ج.م</p>
          )}
        </div>
        <div style={{ marginTop: 'auto' }}>
          {p.quantity > 0 ? (
            <button onClick={() => onAdd(p)} style={{...btnStyle, width: '100%'}}>أضف للسلة 🛒</button>
          ) : (
            <button disabled style={{...btnStyle, width: '100%', backgroundColor: '#d1d5db', color: '#6b7280', cursor: 'not-allowed'}}>نفذت الكمية ❌</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function StorePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('الكل');
  const [user, setUser] = useState<any>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', phone: '', email: '' });
  const [settings, setSettings] = useState<any>({});
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [activeDiscount, setActiveDiscount] = useState(0);

  const [showEditUser, setShowEditUser] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });

  // 🟢 نظام الصفحات 🟢
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedProducts = localStorage.getItem('aya_products_v5');
      const savedUser = localStorage.getItem('aya_currentUser_v5');
      const savedSettings = localStorage.getItem('aya_settings_v5');
      const savedTheme = localStorage.getItem('yoya_theme');
      
      if (savedProducts) setProducts(JSON.parse(savedProducts));
      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedTheme === 'dark') setIsDarkMode(true);
    } catch (error) { console.error("خطأ", error); }
  }, []);

  // ترصيت الصفحة لـ 1 لو الزائر غير القسم أو بحث
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeCat]);

  const handleLoginRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let users = JSON.parse(localStorage.getItem('aya_users_v5') || '[]');
    const existing = users.find((u:any) => u.phone === authForm.phone);
    if (!existing) {
      users.push(authForm);
      localStorage.setItem('aya_users_v5', JSON.stringify(users));
    } else {
      setAuthForm(existing); 
    }
    localStorage.setItem('aya_currentUser_v5', JSON.stringify(authForm));
    setUser(authForm);
    setShowLogin(false);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('aya_currentUser_v5', JSON.stringify(editForm));
    setUser(editForm);
    let users = JSON.parse(localStorage.getItem('aya_users_v5') || '[]');
    const updatedUsers = users.map((u:any) => u.phone === user.phone ? editForm : u);
    localStorage.setItem('aya_users_v5', JSON.stringify(updatedUsers));
    setShowEditUser(false);
    alert('✅ تم تحديث بياناتك بنجاح!');
  };

  const handleLogout = () => {
    localStorage.removeItem('aya_currentUser_v5');
    setUser(null);
    setShowUserMenu(false);
  };

  // 🟢 تطبيق الكوبون الجديد (مدة ومستخدمين) 🟢
  const applyCoupon = () => {
    if (!user) return alert('❌ يجب تسجيل الدخول أولاً لتتمكن من استخدام كود الخصم');
    if (!coupon.trim()) return alert('الرجاء كتابة كود الخصم أولاً');
    
    const savedCoupons = JSON.parse(localStorage.getItem('aya_coupons_v5') || '[]');
    const validCoupon = savedCoupons.find((c: any) => c.code.toUpperCase() === coupon.trim().toUpperCase());

    if (!validCoupon) {
      setActiveDiscount(0);
      return alert('❌ كود الخصم غير صحيح');
    }

    // التأكد من التاريخ
    const today = new Date().toISOString().split('T')[0];
    if (validCoupon.expiryDate && validCoupon.expiryDate < today) {
      return alert('❌ عذراً، هذا الكوبون منتهي الصلاحية');
    }

    // التأكد من مرات الاستخدام للمستخدم ده بالتحديد
    const usagesDB = JSON.parse(localStorage.getItem('aya_coupon_usages_v5') || '{}');
    const userUsages = usagesDB[user.phone] || {};
    const timesUsed = userUsages[validCoupon.code] || 0;

    if (timesUsed >= validCoupon.maxUses) {
      return alert(`❌ لقد استنفذت الحد الأقصى لاستخدام هذا الكوبون (${validCoupon.maxUses} مرات)`);
    }

    // إذا كله سليم نطبق الخصم ونسجل أنه تم الاستخدام عشان الكود ميضربش تاني
    userUsages[validCoupon.code] = timesUsed + 1;
    usagesDB[user.phone] = userUsages;
    localStorage.setItem('aya_coupon_usages_v5', JSON.stringify(usagesDB));

    setActiveDiscount(validCoupon.discount);
    alert(`🎉 مبروك! تم تفعيل خصم ${validCoupon.discount}% بنجاح!`);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('yoya_theme', newTheme ? 'dark' : 'light');
  };

  const addToCart = (prod: Product) => {
    try {
      let cart = JSON.parse(localStorage.getItem('aya_cart_v5') || '[]');
      const exists = cart.find((i:any) => i.id === prod.id);
      const finalPrice = activeDiscount > 0 ? prod.price - (prod.price * activeDiscount / 100) : prod.price;
      
      if (exists) exists.cartQuantity += 1;
      else cart.push({ ...prod, cartQuantity: 1, price: finalPrice }); 
      
      localStorage.setItem('aya_cart_v5', JSON.stringify(cart));
      alert('✅ تم الإضافة للسلة بنجاح!');
    } catch (error) {}
  };

  if (!isMounted) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', backgroundColor: '#064e3b', color: '#fff' }}>جاري التحميل... ⏳</div>;

  const theme = { bg: isDarkMode ? '#111827' : '#064e3b', headerBg: isDarkMode ? '#1f2937' : '#064e3b', marqueeBg: isDarkMode ? '#374151' : '#047857', text: isDarkMode ? '#f9fafb' : '#ffffff' };
  const categories = ['الكل', 'أدوات مكتبية', 'الروايات', 'نوت بوك'];
  
  // فلترة المنتجات الأساسية
  const filteredProducts = products.filter(p => (activeCat === 'الكل' || p.category === activeCat) && (p.name ? p.name.includes(search) : false));

  // حساب نظام الصفحات (الباجينيشن)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const displayedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '100vh', direction: 'rtl', fontFamily: 'sans-serif', color: theme.text, position: 'relative' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url("/WhatsApp Image 2026-07-05 at 12.27.18 PM.jpeg")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05, zIndex: 0, pointerEvents: 'none' }}></div>

      <style>{`.marquee-container { background-color: ${theme.marqueeBg}; color: #fff; padding: 10px; overflow: hidden; white-space: nowrap; border-bottom: 2px solid #059669; position: relative; zIndex: 2; } .marquee-content { display: inline-block; animation: marquee 15s linear infinite; font-weight: bold; } @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>

      <div className="marquee-container"><div className="marquee-content">{settings.marqueeText || '✨ استقبال من بتاع توفير.. أفضل المنتجات بأفضل الأسعار لكسر الغلاء! ✨'}</div></div>

      <div style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.headerBg, borderBottom: '1px solid #047857', flexWrap: 'wrap', gap: '15px', position: 'relative', zIndex: 2 }}>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleTheme} style={{ background: 'none', border: '1px solid #fff', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', color: '#fff' }}>{isDarkMode ? '☀️' : '🌙'}</button>
          
          {user ? (
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '20px' }}>
                <span style={{ fontWeight: 'bold', color: theme.text }}>أهلاً يا {user.name} 👋</span>
                <span style={{ fontSize: '1.5rem', marginLeft: '5px', fontWeight: 'bold' }}>⋮</span>
              </div>
              
              {showUserMenu && (
                <div style={{ position: 'absolute', top: '50px', right: 0, backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000', padding: '15px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', width: '200px', zIndex: 100 }}>
                  <p style={{ margin: '0 0 10px 0', borderBottom: '1px solid #ccc', paddingBottom: '10px', fontSize: '0.9rem' }}><strong>{user.name}</strong><br/><span style={{color: '#888'}}>{user.phone}</span></p>
                  <button onClick={() => { setEditForm(user); setShowEditUser(true); setShowUserMenu(false); }} style={{ width: '100%', padding: '8px', marginBottom: '5px', background: 'none', border: 'none', textAlign: 'right', cursor: 'pointer', color: isDarkMode ? '#fff' : '#000' }}>✏️ تعديل بياناتي</button>
                  <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'none', border: 'none', textAlign: 'right', cursor: 'pointer', color: '#ef4444', fontWeight: 'bold' }}>🚪 تسجيل خروج</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{...btnStyle, backgroundColor: '#ffffff', color: '#064e3b'}}>تسجيل الدخول</button>
          )}
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="/WhatsApp Image 2026-07-05 at 12.27.18 PM.jpeg" alt="Logo" style={{ width: '60px', height: '60px', borderRadius: '50%', marginLeft: '15px', border: '2px solid #fff' }} />
          <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2.5rem' }}>يويا لمحاربة الغلاء 💚✨</h1>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
          <input type="text" placeholder="كود الخصم" value={coupon} onChange={e => setCoupon(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', width: '120px', textAlign: 'center' }} />
          <button onClick={applyCoupon} style={{ padding: '10px 15px', backgroundColor: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>تفعيل</button>
          <a href="/checkout" style={{...btnStyle, backgroundColor: '#000', color: '#fff', display: 'inline-block', textDecoration: 'none'}}>السلة 🛒</a>
        </div>
      </div>

      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleLoginRegister} style={{ backgroundColor: theme.headerBg, border: '2px solid #10b981', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '350px' }}>
            <h3 style={{marginTop: 0, color: '#ffffff'}}>إنشاء حساب / دخول</h3>
            <input required placeholder="الاسم ثلاثي" onChange={e => setAuthForm({...authForm, name: e.target.value})} style={inputStyle} />
            <input required placeholder="رقم الهاتف (للتواصل)" onChange={e => setAuthForm({...authForm, phone: e.target.value})} style={inputStyle} />
            <input required type="email" placeholder="الإيميل" onChange={e => setAuthForm({...authForm, email: e.target.value})} style={inputStyle} />
            <button type="submit" style={{...btnStyle, width: '100%'}}>دخول 🚀</button>
            <button type="button" onClick={() => setShowLogin(false)} style={{...btnStyle, backgroundColor: '#ef4444', width: '100%', marginTop: '10px'}}>إغلاق ❌</button>
          </form>
        </div>
      )}

      {showEditUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <form onSubmit={handleEditUser} style={{ backgroundColor: theme.headerBg, border: '2px solid #10b981', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '350px' }}>
            <h3 style={{marginTop: 0, color: '#ffffff'}}>تعديل بيانات الحساب</h3>
            <label style={{color: '#fff', display:'block', marginBottom: '5px'}}>الاسم</label>
            <input required value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={inputStyle} />
            <label style={{color: '#fff', display:'block', marginBottom: '5px'}}>رقم الهاتف</label>
            <input required value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} style={inputStyle} />
            <label style={{color: '#fff', display:'block', marginBottom: '5px'}}>الإيميل</label>
            <input required type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} style={inputStyle} />
            <button type="submit" style={{...btnStyle, width: '100%', backgroundColor: '#f59e0b'}}>حفظ التعديلات 💾</button>
            <button type="button" onClick={() => setShowEditUser(false)} style={{...btnStyle, backgroundColor: '#ef4444', width: '100%', marginTop: '10px'}}>إلغاء ❌</button>
          </form>
        </div>
      )}

      <div style={{ padding: '40px', position: 'relative', zIndex: 1, minHeight: '60vh' }}>

        <h2 style={{ color: theme.text }}>📚 تصفح الأقسام</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCat(cat)} style={{ padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: activeCat === cat ? '#10b981' : (isDarkMode ? '#374151' : '#ffffff'), color: activeCat === cat ? '#ffffff' : (isDarkMode ? '#fff' : '#064e3b'), cursor: 'pointer', fontWeight: 'bold' }}>{cat}</button>
          ))}
        </div>
        
        <input type="text" placeholder="🔍 ابحث عن منتج هنا..." value={search} onChange={e => setSearch(e.target.value)} style={{...inputStyle, width: '100%', maxWidth: '500px', marginBottom: '30px', borderRadius: '30px', padding: '15px', backgroundColor: isDarkMode ? '#374151' : '#fff', color: isDarkMode ? '#fff' : '#000', border: 'none' }} />

        {displayedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', color: theme.text, fontSize: '1.5rem', marginTop: '30px' }}>لا توجد منتجات مطابقة في هذه الصفحة.</div>
        ) : (
          <>
            <div style={gridStyle}>
              {displayedProducts.map(p => <ProductCard key={p.id} p={p} onAdd={addToCart} discount={activeDiscount} isDark={isDarkMode} />)}
            </div>
            
            {/* 🟢 زراير الصفحات (Pagination) 🟢 */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
                disabled={currentPage === 1}
                style={{ ...paginationBtnStyle, backgroundColor: currentPage === 1 ? '#d1d5db' : '#10b981', color: currentPage === 1 ? '#6b7280' : '#fff' }}
              >
                ⬅️ السابق
              </button>
              
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: theme.text }}>
                صفحة {currentPage} من {totalPages}
              </span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
                disabled={currentPage === totalPages}
                style={{ ...paginationBtnStyle, backgroundColor: currentPage === totalPages ? '#d1d5db' : '#10b981', color: currentPage === totalPages ? '#6b7280' : '#fff' }}
              >
                التالي ➡️
              </button>
            </div>
          </>
        )}
      </div>

      <footer style={{ backgroundColor: isDarkMode ? '#030712' : '#022c22', color: '#fff', padding: '40px', textAlign: 'center', marginTop: '40px', borderTop: '2px solid #047857', position: 'relative', zIndex: 1 }}>
        <h3 style={{ color: '#10b981' }}>تواصل معنا 📞</h3>
        <p style={{ color: '#d1d5db', marginBottom: '20px' }}>نحن هنا لخدمتك على مدار الساعة، انضم لمجتمعنا لمعرفة أحدث العروض!</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {settings.whatsappGroup && <a href={settings.whatsappGroup} target="_blank" rel="noreferrer" style={footerLinkStyle}>📱 جروب الواتساب</a>}
          {settings.telegramGroup && <a href={settings.telegramGroup} target="_blank" rel="noreferrer" style={footerLinkStyle}>✈️ قناة التليجرام</a>}
          {settings.whatsapp && <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" style={footerLinkStyle}>💬 رقم الدعم الفني</a>}
        </div>
      </footer>
    </div>
  );
}