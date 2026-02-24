"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Users,
  Building2,
  BarChart3,
  Briefcase,
  MessageCircle,
  Shield,
  Globe,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Play,
} from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null)

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual Support",
      description: "Access services in Amharic, Oromo, and English with seamless language switching.",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "AI-Powered Assistant",
      description: "Get instant help with our intelligent chatbot available 24/7 in your language.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security protects your personal data and documents.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Track Applications",
      description: "Real-time status updates on all your government service applications.",
    },
  ]

  const portals = [
    {
      id: "citizen",
      href: "/citizen",
      icon: <Users className="w-8 h-8" />,
      title: "Citizen Portal",
      description: "Discover services, submit applications, track progress, and provide feedback.",
      gradient: "from-emerald-500 to-emerald-700",
      hoverGradient: "from-emerald-400 to-emerald-600",
      stats: "1M+ Citizens Served",
    },
    {
      id: "employee",
      href: "/employee",
      icon: <Building2 className="w-8 h-8" />,
      title: "Employee Portal",
      description: "Manage services, process applications, and serve citizens efficiently.",
      gradient: "from-blue-500 to-blue-700",
      hoverGradient: "from-blue-400 to-blue-600",
      stats: "500+ Employees",
    },
    {
      id: "admin",
      href: "/admin",
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Admin Dashboard",
      description: "Monitor system health, manage users, and oversee platform operations.",
      gradient: "from-red-500 to-red-700",
      hoverGradient: "from-red-400 to-red-600",
      stats: "99.9% Uptime",
    },
    {
      id: "partner",
      href: "/partner",
      icon: <Briefcase className="w-8 h-8" />,
      title: "Partner Portal",
      description: "Collaborate with government agencies and manage partnership programs.",
      gradient: "from-amber-500 to-amber-700",
      hoverGradient: "from-amber-400 to-amber-600",
      stats: "50+ Partners",
    },
  ]

  const stats = [
    { value: "50+", label: "Government Services" },
    { value: "1M+", label: "Citizens Served" },
    { value: "99.9%", label: "System Uptime" },
    { value: "3", label: "Languages" },
  ]

  const testimonials = [
    {
      quote:
        "Ethiopian Navigator has transformed how I access government services. What used to take days now takes minutes.",
      author: "Abebe Bikila",
      role: "Citizen, Addis Ababa",
      rating: 5,
    },
    {
      quote: "As a government employee, this platform has streamlined our workflow and improved citizen satisfaction.",
      author: "Tigist Haile",
      role: "Service Officer, Ministry of Revenue",
      rating: 5,
    },
    {
      quote: "The multilingual support means I can help my parents access services in their preferred language.",
      author: "Meron Tadesse",
      role: "Citizen, Oromia Region",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/25">
                EN
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold leading-none">Ethiopian Navigator</h1>
                <p className="text-xs text-muted-foreground">Government Services Portal</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#portals"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Portals
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Testimonials
              </a>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              MVP Demo - Ready for Stakeholder Review
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Navigate Government Services{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-amber-500 to-red-500 bg-clip-text text-transparent">
                with Ease
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              A multilingual, AI-powered platform connecting Ethiopian citizens with government services in Amharic,
              Oromo, and English.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white px-8 h-12 text-base shadow-xl shadow-emerald-500/25"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Demo Now
                </Button>
              </Link>
              <Link href="#portals">
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-12 text-base bg-transparent">
                  Explore Portals
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Demo credentials hint */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Demo accounts available for all portals - No registration required
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Ethiopian Navigator?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Modern technology meets traditional values to deliver seamless government services to every citizen.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section id="portals" className="py-20 md:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Portal</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Access the right portal based on your role. All portals are fully functional in this MVP demo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {portals.map((portal) => (
              <Link key={portal.id} href={portal.href}>
                <Card
                  className="h-full overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  onMouseEnter={() => setHoveredPortal(portal.id)}
                  onMouseLeave={() => setHoveredPortal(null)}
                >
                  <div
                    className={`h-2 bg-gradient-to-r ${hoveredPortal === portal.id ? portal.hoverGradient : portal.gradient} transition-all duration-300`}
                  />
                  <div className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${portal.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      {portal.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{portal.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{portal.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">{portal.stats}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Citizens Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Hear from citizens and employees who use Ethiopian Navigator every day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-card">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <blockquote className="text-foreground mb-4 leading-relaxed">"{testimonial.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-medium text-sm">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.author}</p>
                    <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-8 md:p-12 text-white text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Experience the Future of Government Services?
              </h2>
              <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                This MVP demonstrates the full potential of Ethiopian Navigator. Try all features now with demo
                accounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/login">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-700 hover:bg-emerald-50 px-8">
                    Start Demo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white text-white hover:bg-white/10 px-8 bg-transparent"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-white">
                  EN
                </div>
                <span className="font-bold">Ethiopian Navigator</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Simplifying government services for all Ethiopian citizens.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Portals</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/citizen" className="hover:text-foreground transition-colors">
                    Citizen
                  </Link>
                </li>
                <li>
                  <Link href="/employee" className="hover:text-foreground transition-colors">
                    Employee
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground transition-colors">
                    Admin
                  </Link>
                </li>
                <li>
                  <Link href="/partner" className="hover:text-foreground transition-colors">
                    Partner
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Accessibility
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Ethiopian Navigator MVP &copy; {new Date().getFullYear()}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
