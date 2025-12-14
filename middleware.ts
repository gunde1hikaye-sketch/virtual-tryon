import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabase client (server-side)
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 🔓 Auth sayfaları serbest
  if (pathname.startsWith('/auth')) {
    if (session) {
      // login olmuş kullanıcı auth sayfasına girmesin
      return NextResponse.redirect(new URL('/', req.url));
    }
    return res;
  }

  // 🔐 Korumalı alanlar
  const protectedRoutes = ['/'];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return res;
}

// Middleware hangi yolları kapsasın?
export const config = {
  matcher: [
    '/',                // ana sayfa
    '/((?!_next|favicon.ico|api).*)',
  ],
};
