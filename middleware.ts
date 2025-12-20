import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  console.log("Middleware token:", token)
  const isAuthenticated = !!token

  // List of public paths that don't require authentication
  const publicPaths = ["/auth/signin", "/auth/error", "/debug", "/api/auth", "/images"]
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If user is not authenticated and trying to access a protected route, redirect to signin
  if (!isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
} 