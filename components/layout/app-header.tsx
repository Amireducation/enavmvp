"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Menu, Settings, LogOut, User, ChevronDown, Globe, Moon, Sun, Search } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { NotificationCenter } from "@/components/notification-center"
import { useState } from "react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface AppHeaderProps {
  portalName: string
  portalColor: "emerald" | "blue" | "red" | "amber"
  navItems: NavItem[]
  showSearch?: boolean
}

const colorMap = {
  emerald: "from-emerald-500 to-emerald-700",
  blue: "from-blue-500 to-blue-700",
  red: "from-red-500 to-red-700",
  amber: "from-amber-500 to-amber-700",
}

const accentColorMap = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  red: "bg-red-500/10 text-red-600 dark:text-red-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function AppHeader({ portalName, portalColor, navItems, showSearch = true }: AppHeaderProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      citizen: "Citizen",
      employee: "Government Employee",
      admin: "Administrator",
      partner: "Partner Organization",
    }
    return labels[role] || role
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Ethiopian flag accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo and Portal Name */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg bg-gradient-to-br",
                colorMap[portalColor]
              )}>
                EN
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base font-bold leading-none">{portalName}</h1>
                <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && accentColorMap[portalColor]
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Search (Desktop) */}
            {showSearch && (
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-48 lg:w-64 pl-9 pr-4 rounded-lg border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>አማርኛ (Amharic)</DropdownMenuItem>
                <DropdownMenuItem>Afaan Oromoo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden sm:flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <NotificationCenter />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium bg-gradient-to-br",
                    colorMap[portalColor]
                  )}>
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium leading-none">{user?.email?.split("@")[0] || "User"}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-xs text-muted-foreground">{getRoleLabel(user?.role || "")}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br",
                      colorMap[portalColor]
                    )}>
                      EN
                    </div>
                    <div>
                      <h2 className="font-bold">{portalName}</h2>
                      <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                    </div>
                  </div>

                  {/* Mobile Search */}
                  {showSearch && (
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full h-10 pl-9 pr-4 rounded-lg border bg-muted/50 text-sm"
                      />
                    </div>
                  )}

                  {/* Mobile Nav Items */}
                  <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start gap-3",
                              isActive && accentColorMap[portalColor]
                            )}
                          >
                            {item.icon}
                            {item.label}
                          </Button>
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Mobile Footer */}
                  <div className="pt-4 border-t mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                        {theme === "dark" ? "Light" : "Dark"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Globe className="w-4 h-4 mr-2" />
                        Language
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
