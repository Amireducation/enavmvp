"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  LogOut,
  FileText,
  Clock,
  CheckCircle2,
  Search,
  TrendingUp,
  Users,
  Eye,
  CheckCheck,
  XCircle,
  Bell,
  Settings,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface EmployeeApplication {
  application_id: string
  id: string
  service: string
  applicant: string
  email: string
  submitted: string
  status: string
  priority: string
  notes: string
}

interface EmployeeStats {
  pending: number
  underReview: number
  approved: number
  todayProcessed: number
}

const chartData = [
  { day: "Mon", received: 45, processed: 38 },
  { day: "Tue", received: 52, processed: 45 },
  { day: "Wed", received: 48, processed: 50 },
  { day: "Thu", received: 61, processed: 55 },
  { day: "Fri", received: 55, processed: 52 },
  { day: "Sat", received: 32, processed: 30 },
  { day: "Sun", received: 18, processed: 20 },
]

const weeklyTrend = [
  { week: "Week 1", applications: 280 },
  { week: "Week 2", applications: 320 },
  { week: "Week 3", applications: 310 },
  { week: "Week 4", applications: 380 },
]

function EmployeePortalContent() {
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState<EmployeeApplication[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<EmployeeStats>({ pending: 0, underReview: 0, approved: 0, todayProcessed: 0 })

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiClient.get<{ applications: EmployeeApplication[]; stats: EmployeeStats }>("/employee/applications")
        setApplications(data.applications || [])
        setStats(data.stats || { pending: 0, underReview: 0, approved: 0, todayProcessed: 0 })
      } catch (err) {
        console.error("Failed to fetch employee data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/employee/applications/${appId}/status`, { status: newStatus })
      setApplications((prev) => prev.map((app) => (app.application_id === appId || app.id === appId ? { ...app, status: newStatus } : app)))
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.service.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      under_review: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
    }
    return styles[status] || styles.pending
  }

  const getPriorityBadge = (priority: string) => {
    const styles: Record<string, string> = {
      urgent: "bg-red-500 text-white",
      high: "bg-amber-500 text-white",
      normal: "bg-muted text-muted-foreground",
    }
    return styles[priority] || styles.normal
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center font-bold text-white">
                  EN
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold leading-none">Employee Portal</h1>
                  <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase() || "E"}
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
        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Pending Review", value: stats.pending, icon: <Clock className="w-5 h-5" />, color: "amber" },
            { label: "Under Review", value: stats.underReview, icon: <Eye className="w-5 h-5" />, color: "blue" },
            {
              label: "Approved Today",
              value: stats.approved,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "emerald",
            },
            {
              label: "Processed Today",
              value: stats.todayProcessed,
              icon: <TrendingUp className="w-5 h-5" />,
              color: "purple",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="applications" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Applications</span>
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="queue" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">My Queue</span>
            </TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            {/* Search and Filter */}
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID, name, or service..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {["all", "pending", "under_review", "approved"].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className="capitalize"
                    >
                      {status.replace("_", " ")}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Applications List */}
            <div className="space-y-3">
              {filteredApplications.map((app) => (
                <Card key={app.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{app.service}</h4>
                          <Badge className={`text-xs ${getPriorityBadge(app.priority)}`}>{app.priority}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.applicant} • {app.email}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ID: {app.id} • Submitted: {app.submitted}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-16 lg:ml-0">
                      <Badge className={getStatusBadge(app.status)}>{app.status.replace("_", " ")}</Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 bg-transparent"
                          onClick={() => handleStatusChange(app.id, "under_review")}
                        >
                          <Eye className="w-3 h-3" />
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-emerald-600 hover:text-emerald-700 bg-transparent"
                          onClick={() => handleStatusChange(app.id, "approved")}
                        >
                          <CheckCheck className="w-3 h-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleStatusChange(app.id, "rejected")}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Daily Applications (This Week)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="received" fill="#3b82f6" name="Received" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="processed" fill="#10b981" name="Processed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Weekly Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: "#3b82f6" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue" className="space-y-4">
            <Card className="p-6 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Your Processing Queue</h3>
              <p className="text-muted-foreground mb-4">
                You have {stats.pending + stats.underReview} applications assigned to you.
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white">
                Start Processing
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function EmployeePage() {
  return (
    <ProtectedRoute requiredRoles={["employee"]}>
      <EmployeePortalContent />
    </ProtectedRoute>
  )
}
