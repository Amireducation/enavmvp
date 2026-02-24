"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
import { Menu, Bell, Settings, LogOut, User, ChevronDown, Sun, Moon, Globe, Home } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "next-themes"

interface NavItem {
  label: string
  href: string
  icon?: React.ReactNode
}

interface NavbarProps {
  portalName: string
  portalColor: "green" | "yellow" | "red" | "blue"
  navItems?: NavItem[]
  showLanguageSelector?: boolean
}

const colorMap = {
  green: {
    bg: "bg-emerald-600 dark:bg-emerald-700",
    hover: "hover:bg-emerald-700 dark:hover:bg-emerald-600",
    border: "border-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  yellow: {
    bg: "bg-amber-500 dark:bg-amber-600",
    hover: "hover:bg-amber-600 dark:hover:bg-amber-500",
    border: "border-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  red: {
    bg: "bg-red-600 dark:bg-red-700",
    hover: "hover:bg-red-700 dark:hover:bg-red-600",
    border: "border-red-500",
    text: "text-red-600 dark:text-red-400",
  },
  blue: {
    bg: "bg-blue-600 dark:bg-blue-700",
    hover: "hover:bg-blue-700 dark:hover:bg-blue-600",
    border: "border-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
}

export function Navbar({ portalName, portalColor, navItems = [], showLanguageSelector = true }: NavbarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = React.useState("en")
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const colors = colorMap[portalColor]

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "am", name: "አማርኛ", flag: "🇪🇹" },
    { code: "or", name: "Afaan Oromoo", flag: "🇪🇹" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full glass">
      {/* Ethiopian flag stripe */}
      <div className="h-1 eth-stripe" />

      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <nav className="flex flex-col gap-4 mt-8">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 transition-colors",
                    pathname === item.href
                      ? colors.text + " font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mr-6">
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white", colors.bg)}>
            EN
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-none">{portalName}</h1>
            <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? cn(colors.bg, "text-white")
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Language selector */}
          {showLanguageSelector && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">{languages.find((l) => l.code === language)?.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(language === lang.code && "bg-muted")}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Link href="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              <span className="sr-only">Notifications</span>
            </Button>
          </Link>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                    colors.bg,
                  )}
                >
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
