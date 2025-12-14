import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 🔓 Auth sayfaları serbest
  if (pathname.startsWith('/auth')) {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return response;
  }

  // 🔐 Korumalı sayfalar
  const protectedRoutes = ['/'];

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/((?!_next|favicon.ico|api).*)',
  ],
};
