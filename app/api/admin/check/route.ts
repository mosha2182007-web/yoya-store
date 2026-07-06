import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    // هنا تقدر تحط الباسورد اللي أنت عايزه
    if (password === "Mosha@2026") {
      const response = NextResponse.json({ message: "Success" });

      // إضافة الـ Cookie اللي الحارس (Middleware) بيستناها
      response.cookies.set('isLoggedIn', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // يوم كامل
        path: '/'
      });

      return response;
    }

    return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}