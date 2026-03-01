"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  LogOut,
  MessageCircle,
  Settings,
  Package,
  Bell,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Star,
  Globe,
  HelpCircle,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface Service {
  service_id: string
  name: string
  category: string
  description: string
  service_fee: number
  estimated_processing_time: string
}

interface Application {
  application_id: string
  service_name: string
  tracking_number: string
  status: string
  notes: string
  created_at: string
}

interface Notification {
  notification_id: string
  is_read: boolean
}

function CitizenPortalContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [applyingService, setApplyingService] = useState<string | null>(null)
  const [feedback, setFeedback] = useState({ rating: 5, comments: "" })
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [svcData, appData, notifData] = await Promise.all([
          apiClient.get<{ services: Service[] }>("/services"),
          apiClient.get<{ applications: Application[] }>("/applications").catch(() => ({ applications: [] })),
          apiClient.get<{ notifications: Notification[] }>("/notifications").catch(() => ({ notifications: [] })),
        ])
        setServices(svcData.services || [])
        setApplications(appData.applications || [])
        setNotifications(notifData.notifications || [])
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categories = ["all", ...new Set(services.map((s) => s.category).filter(Boolean))]

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleApply = async (serviceId: string) => {
    setApplyingService(serviceId)
    try {
      await apiClient.post("/applications", { service_id: serviceId })
      const appData = await apiClient.get<{ applications: Application[] }>("/applications").catch(() => ({ applications: [] }))
      setApplications(appData.applications || [])
      alert("Application submitted successfully! Check 'My Applications' tab for status updates.")
    } catch (err) {
      alert("Failed to submit application. Please try again.")
      console.error("Apply error:", err)
    } finally {
      setApplyingService(null)
    }
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedback({ rating: 5, comments: "" })
      setFeedbackSubmitted(false)
    }, 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case "processing":
        return <Clock className="w-4 h-4 text-amber-500" />
      case "submitted":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      case "processing":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      case "submitted":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      default:
        return "bg-red-500/10 text-red-600 border-red-500/20"
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.is_read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center font-bold text-white">
                  EN
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold leading-none">Citizen Portal</h1>
                  <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/citizen/chatbot">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">AI Assistant</span>
                </Button>
              </Link>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>

              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </div>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">
            Access government services, track applications, and get help in your language.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <Package className="w-5 h-5" />,
              label: "Browse Services",
              count: `${services.length} Available`,
              href: "#services",
              color: "emerald",
            },
            {
              icon: <FileText className="w-5 h-5" />,
              label: "My Applications",
              count: `${applications.length} Active`,
              href: "#applications",
              color: "blue",
            },
            {
              icon: <MessageCircle className="w-5 h-5" />,
              label: "AI Assistant",
              count: "24/7 Support",
              href: "/citizen/chatbot",
              color: "purple",
            },
            {
              icon: <Globe className="w-5 h-5" />,
              label: "Language",
              count: "EN / አማ / Oro",
              href: "/settings",
              color: "amber",
            },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-600`}
                  >
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.count}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="services" className="gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" id="services" className="space-y-6">
            {/* Search and Filter */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(cat)}
                      className="capitalize"
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Services Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredServices.length === 0 ? (
              <Card className="p-12 text-center">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No services found matching your search.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map((service) => (
                  <Card key={service.service_id} className="overflow-hidden group hover:shadow-lg transition-all">
                    <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600" />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                        <span className="text-sm font-semibold text-emerald-600">ETB {service.service_fee}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Clock className="w-3 h-3" />
                        {service.estimated_processing_time}
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
                        onClick={() => handleApply(service.service_id)}
                        disabled={applyingService === service.service_id}
                      >
                        {applyingService === service.service_id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications" id="applications" className="space-y-4">
            {applications.length === 0 ? (
              <Card className="p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No applications yet. Start by applying for a service!</p>
              </Card>
            ) : (
              applications.map((app) => (
                <Card key={app.application_id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{app.service_name}</h4>
                        <p className="text-sm text-muted-foreground">Tracking: {app.tracking_number}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted: {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={`gap-1 ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        <span className="capitalize">{app.status}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                  {app.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Latest update:</span> {app.notes}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Share Your Feedback</h3>
              <p className="text-muted-foreground mb-6">Help us improve our services by sharing your experience.</p>

              {feedbackSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold mb-2">Thank you for your feedback!</p>
                  <p className="text-muted-foreground">Your input helps us improve our services.</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-3">How would you rate your experience?</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedback({ ...feedback, rating })}
                          className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                            feedback.rating >= rating
                              ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {feedback.rating <= 2
                        ? "We're sorry to hear that"
                        : feedback.rating <= 3
                          ? "Thanks for the feedback"
                          : feedback.rating <= 4
                            ? "Great!"
                            : "Excellent!"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tell us more (optional)</label>
                    <textarea
                      value={feedback.comments}
                      onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                      className="w-full min-h-[120px] rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Share your thoughts, suggestions, or concerns..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
                  >
                    Submit Feedback
                  </Button>
                </form>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function CitizenPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <CitizenPortalContent />
    </ProtectedRoute>
  )
}
