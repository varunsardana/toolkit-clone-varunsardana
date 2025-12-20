"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  BookOpen,
  FileText,
  Video,
  Edit3,
  PresentationIcon as PresentationChart,
  GraduationCap,
  FileCheck,
  ClipboardList,
  Home,
  Menu,
  TestTube,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "MCQ Generator", href: "/mcq-generator", icon: ClipboardList },
  { name: "YouTube Generator", href: "/youtube-generator", icon: Video },
  { name: "Text Summarizer", href: "/text-summarizer", icon: FileText },
  { name: "Text Rewriter", href: "/text-rewriter", icon: Edit3 },
  { name: "Lesson Plan", href: "/lesson-plan", icon: BookOpen },
  { name: "PPT Generator", href: "/ppt-generator", icon: PresentationChart },
  { name: "Essay Grader", href: "/essay-grader", icon: GraduationCap },
  { name: "Worksheet Generator", href: "/worksheet-generator", icon: FileCheck }
]

interface SidebarProps {
  className?: string
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link href="/" className="block mb-4 group" onClick={onNavigate}>
          <div className="logo-container group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/images/logo.png"
              alt="GrowWise - AI Teacher Toolkit"
              width={180}
              height={60}
              className="h-auto w-full"
              priority
            />
          </div>
        </Link>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-foreground">AI Teacher Toolkit</p>
          <p className="text-xs text-muted-foreground font-medium tracking-wider uppercase">Unbox Potential</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 w-full",
                    isActive
                      ? "nav-item-active"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}

// Desktop Sidebar
export function DesktopSidebar({ className }: SidebarProps) {
  return (
    <div className={cn("hidden lg:flex lg:flex-col lg:w-64 sidebar", className)}>
      <SidebarContent />
    </div>
  )
}

// Mobile Sidebar
export function MobileSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden btn-enhanced" aria-label="Open navigation menu">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-64">
        <SidebarContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

// Main Sidebar component that handles responsive behavior
export function Sidebar({ className }: SidebarProps) {
  return <DesktopSidebar className={className} />
}
