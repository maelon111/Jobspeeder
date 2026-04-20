import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = ['/dashboard', '/cv', '/applications', '/job-offers', '/settings', '/onboarding', '/coachs', '/ats-plus', '/coach']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Admin routes — protected by admin_token cookie, not Supabase auth
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()
    const adminToken = request.cookies.get('admin_token')?.value
    if (adminToken !== process.env.ADMIN_SECRET) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // Coach login is public
  if (pathname === '/coach/login') return NextResponse.next()

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getSession() reads JWT from cookie — no network call, reliable on Edge
  const { data: { session } } = await supabase.auth.getSession()

  // /cv/[id] is a public share page — only protect /cv exactly (the list page)
  // /coach/register is accessible to any logged-in user (not just coaches)
  const isProtected = protectedRoutes.some((route: string) => {
    if (route === '/cv') return pathname === '/cv'
    return pathname === route || pathname.startsWith(route + '/')
  })
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons/|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt)$).*)',
  ],
}
