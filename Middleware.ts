import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('isLoggedIn'); // بنشوف هل فيه كوكيز تثبت إنه دخل؟

  // لو بيحاول يدخل الـ dashboard ومعندوش كوكيز، نرجعه لصفحة الـ super
  if (request.nextUrl.pathname.startsWith('/admin/dashboard') && !isAuth) {
    return NextResponse.redirect(new URL('/admin/super', request.url));
  }

  return NextResponse.next();
}