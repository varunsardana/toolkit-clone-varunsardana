"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { MobileSidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, GraduationCap } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="header">
      <div className="flex items-center justify-between h-full">
        {/* Left section - Mobile menu + Title */}
        <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
          <MobileSidebar />

          <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
            <div className="hidden sm:flex p-2.5 rounded-xl bg-gradient-to-br from-growwise-navy/10 to-growwise-orange/10 border border-growwise-orange/20">
              <GraduationCap className="h-5 w-5 lg:h-6 lg:w-6 text-growwise-navy dark:text-growwise-orange" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base lg:text-lg font-bold text-foreground truncate">
                <span className="hidden sm:inline">Welcome to </span>GrowWise
              </h2>
              <p className="text-xs lg:text-sm text-muted-foreground font-medium truncate hidden sm:block">
                Unbox Potential with our AI Teacher Toolkit
              </p>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-2 lg:space-x-3">
          {/* Desktop actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <Button variant="ghost" size="icon" className="btn-enhanced relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-growwise-orange rounded-full border-2 border-background animate-pulse"></span>
            </Button>
            <Button variant="ghost" size="icon" className="btn-enhanced">
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          <ModeToggle />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full btn-enhanced">
                <Avatar className="h-9 w-9 lg:h-10 lg:w-10 ring-2 ring-growwise-orange/30 ring-offset-2 ring-offset-background">
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-growwise-navy to-growwise-orange text-white font-bold text-sm">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none truncate">{session?.user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile-only menu items */}
              <div className="md:hidden">
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>

              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
