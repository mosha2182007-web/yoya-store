export const metadata = {
  title: 'يويا لمحاربة الغلاء',
  description: 'أفضل المنتجات وأدوات المكتب بأسعار تنافسية لمحاربة الغلاء - تسوق الآن من متجر يويا.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}