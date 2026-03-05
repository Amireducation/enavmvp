"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  LogOut,
  Users,
  Package,
  Activity,
  Server,
  TrendingUp,
  MessageSquare,
  Settings,
  Bell,
  Shield,
  Database,
  Zap,
  CheckCircle2,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

const statusDistribution = [
  { name: "Completed", value: 3444333, color: "#10b981" },
  { name: "Processing", value: 8456, color: "#f59e0b" },
  { name: "Pending", value: 3800, color: "#3b82f6" },
  { name: "Rejected", value: 200, color: "#ef4444" },
]

const monthlyGrowth = [
  { month: "Aug", users: 980000, applications: 280000 },
  { month: "Sep", users: 1050000, applications: 310000 },
  { month: "Oct", users: 1120000, applications: 340000 },
  { month: "Nov", users: 1180000, applications: 360000 },
  { month: "Dec", users: 1220000, applications: 385000 },
  { month: "Jan", users: 1247893, applications: 410000 },
]

const systemStatus = [
  { name: "API Gateway", status: "operational", uptime: "99.99%" },
  { name: "Database Cluster", status: "operational", uptime: "99.97%" },
  { name: "AI Service", status: "operational", uptime: "99.95%" },
  { name: "Search Index", status: "operational", uptime: "99.98%" },
  { name: "Auth Service", status: "operational", uptime: "99.99%" },
  { name: "File Storage", status: "operational", uptime: "99.96%" },
]

interface AdminStats {
  totalUsers: number
  totalServices: number
  totalApplications: number
  citizenSatisfaction: string
  uptime: string
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
}

interface RecentFeedback {
  id: string
  user: string
  service: string
  rating: number
  comment: string
  date: string
}

function AdminDashboardContent() {
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalServices: 0, totalApplications: 0, citizenSatisfaction: "0.0", uptime: "99.97%" })
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([])

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await apiClient.get<{ stats: AdminStats; recentUsers: RecentUser[]; recentFeedback: RecentFeedback[] }>("/admin/stats")
        setStats(data.stats)
        setRecentUsers(data.recentUsers || [])
        setRecentFeedback(data.recentFeedback || [])
      } catch (err) {
        console.error("Failed to fetch admin stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center font-bold text-white">
                  EN
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold leading-none">Admin Dashboard</h1>
                  <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    5
                  </span>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase() || "A"}
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
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats.totalUsers.toLocaleString(),
              icon: <Users className="w-5 h-5" />,
              color: "blue",
              change: "+12.5%",
            },
            {
              label: "Total Services",
              value: stats.totalServices.toString(),
              icon: <Package className="w-5 h-5" />,
              color: "purple",
              change: "+3",
            },
            {
              label: "Applications",
              value: stats.totalApplications.toLocaleString(),
              icon: <Activity className="w-5 h-5" />,
              color: "emerald",
              change: "+8.2%",
            },
            {
              label: "System Uptime",
              value: stats.uptime,
              icon: <Server className="w-5 h-5" />,
              color: "amber",
              change: "Stable",
            },
          ].map((stat, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600`}
                >
                  {stat.icon}
                </div>
                <Badge variant="secondary" className="text-xs font-normal">
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Feedback</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="gap-2">
              <Server className="w-4 h-4" />
              <span className="hidden sm:inline">System</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Manage Users", icon: <Users className="w-5 h-5" />, href: "/admin/users", color: "blue" },
                {
                  label: "Manage Services",
                  icon: <Package className="w-5 h-5" />,
                  href: "/admin/services",
                  color: "purple",
                },
                {
                  label: "View Feedback",
                  icon: <MessageSquare className="w-5 h-5" />,
                  href: "/admin/feedback",
                  color: "amber",
                },
                {
                  label: "Analytics",
                  icon: <TrendingUp className="w-5 h-5" />,
                  href: "/admin/analytics",
                  color: "emerald",
                },
              ].map((action, i) => (
                <Link key={i} href={action.href}>
                  <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-600 group-hover:scale-110 transition-transform`}
                      >
                        {action.icon}
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Application Status Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => value.toLocaleString()}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Platform Growth (6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyGrowth}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip
                      formatter={(value: number) => value.toLocaleString()}
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="users" fill="#3b82f6" name="Users" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="applications" fill="#10b981" name="Applications" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Users</h3>
                <Link href="/admin/users">
                  <Button size="sm">View All Users</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-medium">
                        {u.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-sm text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="capitalize">
                        {u.role}
                      </Badge>
                      <Link href="/admin/users">
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Recent Feedback</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-amber-500">{stats.citizenSatisfaction}</span>
                  <span className="text-sm text-muted-foreground">/ 5.0 avg</span>
                </div>
              </div>
              <div className="space-y-4">
                {recentFeedback.map((fb) => (
                  <div key={fb.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{fb.user}</span>
                        <Badge variant="secondary">{fb.service}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < fb.rating ? "bg-amber-500" : "bg-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{fb.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">{fb.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">System Status</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {systemStatus.map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-xs text-muted-foreground">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Database className="w-5 h-5" />
                  <span>Backup Database</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Shield className="w-5 h-5" />
                  <span>Security Scan</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
                  <Zap className="w-5 h-5" />
                  <span>Clear Cache</span>
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AdminDashboardContent />
    </ProtectedRoute>
  )
}
