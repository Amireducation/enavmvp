"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Users,
  Building2,
  BarChart3,
  Briefcase,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { auth as authLib } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const demoCredentials = {
    citizen: { email: "citizen@ethionavigator.gov.et", password: "Demo@123" },
    employee: { email: "employee@ethionavigator.gov.et", password: "Demo@123" },
    admin: { email: "admin@ethionavigator.gov.et", password: "Demo@123" },
    partner: { email: "partner@ethionavigator.gov.et", password: "Demo@123" },
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Client-side validation
    if (!email || !password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const response = await res.json()

      if (!res.ok) {
        const errorMessage = response.error?.message || response.error || "Login failed. Please check your credentials."
        setError(errorMessage)
        setLoading(false)
        return
      }

      // Handle new standardized response format
      const userData = response.data || response
      if (userData.token && userData.user) {
        authLib.setToken(userData.token)
        authLib.setUser(userData.user)
        setUser(userData.user)
        router.push(`/${userData.user.role}/dashboard`)
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (role: keyof typeof demoCredentials) => {
    setEmail(demoCredentials[role].email)
    setPassword(demoCredentials[role].password)
  }

  const demoAccounts = [
    { role: "citizen" as const, label: "Citizen", icon: <Users className="w-4 h-4" />, color: "emerald" },
    { role: "employee" as const, label: "Employee", icon: <Building2 className="w-4 h-4" />, color: "blue" },
    { role: "admin" as const, label: "Admin", icon: <BarChart3 className="w-4 h-4" />, color: "red" },
    { role: "partner" as const, label: "Partner", icon: <Briefcase className="w-4 h-4" />, color: "amber" },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-amber-400 to-red-400" />
        </div>

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center font-bold text-emerald-700 text-2xl shadow-xl">
              EN
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Ethiopian Navigator</h1>
              <p className="text-emerald-200">Government Services Portal</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Welcome to the MVP Demo</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Experience the full potential of Ethiopian Navigator. All features are functional and ready for
              stakeholder review.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Services Available", value: "50+" },
              { label: "Languages", value: "3" },
              { label: "Response Time", value: "<1s" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/10 rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-emerald-200 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-emerald-200 text-sm">Trusted by government agencies across Ethiopia</div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center font-bold text-white">
              EN
            </div>
            <h1 className="text-xl font-bold">Ethiopian Navigator</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to access your portal</p>
          </div>

          {/* Demo Account Quick Select */}
          <Card className="p-4 mb-6 bg-muted/50 border-dashed">
            <p className="text-sm font-medium mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Quick Demo Login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <Button
                  key={account.role}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(account.role)}
                  className="justify-start gap-2 text-xs"
                >
                  {account.icon}
                  {account.label}
                </Button>
              ))}
            </div>
          </Card>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-muted-foreground text-sm text-center">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary font-medium hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
