"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import { useTheme } from "next-themes"
import "./theme-test.css"

export default function ThemeTest() {
  const { theme, setTheme } = useTheme()
  const [showBoth, setShowBoth] = useState(true)

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Theme Test Page</h1>
          <p className="text-muted-foreground">Test how the logo appears in different themes</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setShowBoth(!showBoth)}>
            {showBoth ? "Show Current Theme Only" : "Show Both Themes"}
          </Button>
          <ModeToggle />
        </div>
      </div>

      {showBoth ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ThemeCard forcedTheme="light" />
          <ThemeCard forcedTheme="dark" />
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                Current Theme: {theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}
              </CardTitle>
              <CardDescription>This is how the logo appears in your current theme</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="bg-card rounded-lg p-4 border border-border w-full max-w-xs">
                <Image
                  src="/images/logo.png"
                  alt="GrowWise Logo"
                  width={200}
                  height={80}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="mt-8">
                <p className="text-center text-sm">
                  Current theme: <strong>{theme === "system" ? "System" : theme === "dark" ? "Dark" : "Light"}</strong>
                </p>
                <div className="flex justify-center gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setTheme("light")}>
                    Light
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTheme("dark")}>
                    Dark
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setTheme("system")}>
                    System
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Sidebar Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-card p-4 light">
              <div className="bg-background rounded-lg p-3 shadow-sm border border-border">
                <Image
                  src="/images/logo.png"
                  alt="GrowWise Logo"
                  width={180}
                  height={60}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-medium">AI Teacher Toolkit</p>
                <p className="text-xs text-muted-foreground mt-1">Unbox Potential</p>
              </div>
              <p className="text-center mt-4 text-xs">Light Mode Sidebar</p>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden border border-border">
            <div className="bg-card p-4 dark">
              <div className="bg-background rounded-lg p-3 shadow-sm border border-border">
                <Image
                  src="/images/logo.png"
                  alt="GrowWise Logo"
                  width={180}
                  height={60}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <div className="text-center mt-2">
                <p className="text-sm font-medium">AI Teacher Toolkit</p>
                <p className="text-xs text-muted-foreground mt-1">Unbox Potential</p>
              </div>
              <p className="text-center mt-4 text-xs">Dark Mode Sidebar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThemeCard({ forcedTheme }: { forcedTheme: "light" | "dark" }) {
  return (
    <Card className={forcedTheme}>
      <CardHeader>
        <CardTitle>{forcedTheme === "light" ? "Light" : "Dark"} Theme</CardTitle>
        <CardDescription>Logo appearance in {forcedTheme} mode</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className={`bg-background rounded-lg p-4 border border-border w-full max-w-xs ${forcedTheme}`}>
          <Image
            src="/images/logo.png"
            alt="GrowWise Logo"
            width={200}
            height={80}
            className="h-auto w-full"
            priority
          />
        </div>
      </CardContent>
    </Card>
  )
}
