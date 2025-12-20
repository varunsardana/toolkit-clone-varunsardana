"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function DebugPage() {
  const { data: session, status } = useSession()
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch("/api/debug-env")
      .then(res => res.json())
      .then(data => setEnvVars(data))
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">   Information</h1>
      
      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Session:</strong></p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            {Object.entries(envVars).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Required Configuration</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Google OAuth Configuration</h3>
              <p>Required Redirect URIs:</p>
              <ul className="list-disc list-inside ml-4">
                <li>http://localhost:3000/api/auth/callback/google</li>
                <li>http://localhost:3000/api/auth/callback/google?next=/</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Environment Variables</h3>
              <ul className="list-disc list-inside ml-4">
                <li>GOOGLE_CLIENT_ID</li>
                <li>GOOGLE_CLIENT_SECRET</li>
                <li>NEXTAUTH_SECRET</li>
                <li>NEXTAUTH_URL (optional in development)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Check if all required environment variables are set</li>
            <li>Verify Google OAuth credentials in Google Cloud Console</li>
            <li>Ensure redirect URIs are properly configured</li>
            <li>Check browser console for any errors</li>
            <li>Verify that cookies are being set properly</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
