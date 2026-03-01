"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft, Users, Building2, BarChart3, Briefcase } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Client-side validation
    if (!formData.fullName || formData.fullName.length < 2) {
      setError("Full name must be at least 2 characters")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least one uppercase letter and one number")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role,
        }),
      })

      const response = await res.json()

      if (!res.ok) {
        const errorMessage = response.error?.message || response.error || "Registration failed. Please try again."
        setError(errorMessage)
        setLoading(false)
        return
      }

      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => router.push("/auth/login"), 2000)
    } catch {
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  const roleOptions = [
    {
      value: "citizen",
      label: "Citizen",
      icon: <Users className="w-4 h-4" />,
      description: "Access government services",
    },
    {
      value: "employee",
      label: "Government Employee",
      icon: <Building2 className="w-4 h-4" />,
      description: "Process applications",
    },
    {
      value: "admin",
      label: "Administrator",
      icon: <BarChart3 className="w-4 h-4" />,
      description: "Manage the platform",
    },
    {
      value: "partner",
      label: "Partner Organization",
      icon: <Briefcase className="w-4 h-4" />,
      description: "Collaborate on programs",
    },
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
            <h2 className="text-3xl font-bold text-white mb-4">Join Ethiopian Navigator</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Create your account to access government services, track applications, and receive updates in your
              preferred language.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Access 50+ government services online",
              "Track your applications in real-time",
              "Get AI-powered assistance 24/7",
              "Receive notifications in your language",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-emerald-200 text-sm">Join over 1 million Ethiopian citizens</div>
      </div>

      {/* Right side - Registration form */}
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
            <h2 className="text-2xl font-bold mb-2">Create your account</h2>
            <p className="text-muted-foreground">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <p className="text-emerald-600 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Abebe Kebede"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {roleOptions.find((r) => r.value === formData.role)?.description}
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <p className="text-muted-foreground text-sm text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
