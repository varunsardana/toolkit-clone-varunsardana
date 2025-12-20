"use client"

import { signIn, getProviders, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Chrome, GraduationCap } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (status === "authenticated") {
      console.log("User is authenticated, redirecting to home")
      router.push("/")
      return
    }

    const setAuthProviders = async () => {
      try {
        const res = await getProviders()
        console.log("Available providers:", res)
        setProviders(res)
      } catch (err) {
        console.error("Error getting providers:", err)
        setError("Failed to load authentication providers")
      }
    }
    setAuthProviders()

    // Check for error in URL
    const error = searchParams.get("error")
    if (error) {
      console.error("Auth error:", error)
      setError("Authentication failed. Please try again.")
    }
  }, [searchParams, status, router])

  const handleSignIn = async (providerId: string) => {
    try {
      console.log("Attempting to sign in with:", providerId)
      await signIn(providerId, { 
        callbackUrl: "/",
        redirect: true
      })
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Failed to sign in. Please try again.")
    }
  }

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg px-4 safe-area-inset">
      <Card className="w-full max-w-md card-enhanced">
        <CardHeader className="text-center space-y-4 p-4 lg:p-6">
          <div className="flex justify-center mb-4">
            <div className="logo-container">
              <Image
                src="/images/logo.png"
                alt="GrowWise - AI Teacher Toolkit"
                width={200}
                height={80}
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-xl lg:text-2xl font-bold">Welcome to GrowWise</CardTitle>
            <CardDescription className="text-sm lg:text-base">AI Teacher Toolkit - Unbox Potential</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-4 lg:p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground space-y-3">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <GraduationCap className="h-5 w-5 text-growwise-orange" />
              <span className="font-medium">For K-12 Educators</span>
            </div>
            <p className="leading-relaxed">Sign in to access all AI-powered educational tools designed for teachers.</p>
          </div>

          {providers &&
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                onClick={() => handleSignIn(provider.id)}
                className="w-full btn-enhanced bg-gradient-to-r from-growwise-navy to-growwise-orange hover:from-growwise-orange hover:to-growwise-navy text-white"
                size="lg"
              >
                <Chrome className="mr-2 h-5 w-5" />
                Sign in with {provider.name}
              </Button>
            ))}

          <div className="text-xs text-center text-muted-foreground space-y-2">
            <p>By signing in, you agree to our Terms of Service and Privacy Policy.</p>
            <p className="font-medium text-growwise-orange">Authorized educators only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
