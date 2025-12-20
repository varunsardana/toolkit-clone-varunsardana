"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log("ProtectedRoute - Status:", status, "Session:", !!session, "Pathname:", pathname)

    // Don't redirect if we're already on an auth page or debug page
    if (pathname.startsWith("/auth") || pathname === "/debug") {
      return
    }

    // Only redirect if we're sure there's no session (not loading)
    if (status === "unauthenticated") {
      console.log("Redirecting to signin")
      router.push("/auth/signin")
    }
  }, [session, status, router, pathname])

  // Always render children - let AppContent handle the layout
  return <>{children}</>
}
