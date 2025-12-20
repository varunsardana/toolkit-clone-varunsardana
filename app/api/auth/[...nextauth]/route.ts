import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"
import { isUserAuthorized, isUserDomainAuthorized } from "@/lib/auth-config"
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
export const authOptions: NextAuthOptions = {
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt:", { user, account, profile })
      
      // In development, allow all users
      if (process.env.NODE_ENV === "development") {
        console.log("Development mode: allowing sign in for:", user.email)
        return true
      }

      // Check if user is authorized
      const isAuthorized = isUserAuthorized(user.email) || isUserDomainAuthorized(user.email)
      console.log("Checking authorization for:", user.email, "Result:", isAuthorized)
      return isAuthorized
    },
    async session({ session, token, user }) {
      console.log("Session callback:", { session, token, user })
      if (token) {
        session.user = token.user as any
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      console.log("JWT callback:", { token, user, account, profile })
      if (user) {
        token.user = user
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect callback:", { url, baseUrl })
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  debug: true, // Enable debug mode
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
