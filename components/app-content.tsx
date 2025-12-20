"use client"

import type React from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Loader2, GraduationCap } from "lucide-react"

interface AppContentProps {
  children: React.ReactNode
}

export function AppContent({ children }: AppContentProps) {
  const { data: session, status } = useSession()
  const rawPathname = usePathname()
  const pathname = rawPathname || ""

  // Don't show sidebar/header on auth pages or debug page
  const isAuthPage = pathname.startsWith("/auth") || pathname === "/debug"

  // Enhanced loading state with responsive design
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background gradient-bg px-4">
        <div className="text-center space-y-6 max-w-sm mx-auto">
          <div className="relative">
            <div className="p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-growwise-navy/10 to-growwise-orange/10 border border-growwise-orange/20 mb-6">
              <GraduationCap className="h-10 w-10 lg:h-12 lg:w-12 text-growwise-navy dark:text-growwise-orange mx-auto" />
            </div>
            <Loader2 className="h-6 w-6 lg:h-8 lg:w-8 animate-spin mx-auto text-growwise-orange" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg lg:text-xl font-bold text-foreground">Loading GrowWise</h3>
            <p className="text-sm lg:text-base text-muted-foreground font-medium">
              Preparing your AI teaching tools...
            </p>
            <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
              <span className="animate-pulse-growwise">●</span>
              <span className="animate-pulse-growwise" style={{ animationDelay: "0.2s" }}>
                ●
              </span>
              <span className="animate-pulse-growwise" style={{ animationDelay: "0.4s" }}>
                ●
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If no session and not on auth page, show auth pages
  if (!session && !isAuthPage) {
    return <div className="min-h-screen bg-background gradient-bg">{children}</div>
  }

  // If on auth page, show without sidebar/header
  if (isAuthPage) {
    return <div className="min-h-screen bg-background gradient-bg">{children}</div>
  }

  // Authenticated layout with responsive design
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background relative z-0">
          <div className="container-responsive py-4 lg:py-6 relative z-0">{children}</div>
        </main>
      </div>
    </div>
  )
}
