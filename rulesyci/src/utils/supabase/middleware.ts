import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Bypass Supabase completely if env variables are missing (useful for MVP Demo mode on Vercel)
        return supabaseResponse
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refreshing the auth token
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes logic
    const isAppPage = request.nextUrl.pathname.startsWith('/today') || 
                      request.nextUrl.pathname.startsWith('/diary') ||
                      request.nextUrl.pathname.startsWith('/calendar') ||
                      request.nextUrl.pathname.startsWith('/journal') ||
                      request.nextUrl.pathname.startsWith('/rules') ||
                      request.nextUrl.pathname.startsWith('/stats') ||
                      request.nextUrl.pathname.startsWith('/api-keys') ||
                      request.nextUrl.pathname.startsWith('/onboarding');

    if (!user && isAppPage) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
