"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, TrendingUp, Users, FileText, Star, Download } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import {
  LineChart,
  Line,
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

interface Overview {
  totalUsers: number
  totalServices: number
  totalApplications: number
  totalFeedback: number
}

interface ServicePopularity {
  serviceId: string
  name: string
  category: string
  applicationCount: number
}

function AnalyticsContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [overview, setOverview] = useState<Overview | null>(null)
  const [popularServices, setPopularServices] = useState<ServicePopularity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const [overviewRes, popularRes] = await Promise.all([
        apiClient.get<{ overview: Overview }>("/analytics/overview"),
        apiClient.get<{ popular: ServicePopularity[] }>("/analytics/services/popular"),
      ])

      setOverview(overviewRes.overview)
      setPopularServices(popularRes.popular || [])
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const monthlyTrends = [
    { month: "Jan", users: 120, applications: 450, services: 15 },
    { month: "Feb", users: 150, applications: 520, services: 18 },
    { month: "Mar", users: 180, applications: 600, services: 20 },
    { month: "Apr", users: 210, applications: 680, services: 22 },
    { month: "May", users: 250, applications: 750, services: 25 },
    { month: "Jun", users: 290, applications: 820, services: 28 },
  ]

  const categoryDistribution = [
    { name: "Identity", value: 35 },
    { name: "Business", value: 25 },
    { name: "Legal", value: 20 },
    { name: "Social", value: 15 },
    { name: "Other", value: 5 },
  ]

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"]

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")} className="text-white">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} className="text-white border-white bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400">Loading analytics...</p>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-2">{overview?.totalUsers || 0}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-400 opacity-20" />
                </div>
                <p className="text-blue-300 text-sm mt-3">+15% from last month</p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Total Services</p>
                    <p className="text-3xl font-bold text-white mt-2">{overview?.totalServices || 0}</p>
                  </div>
                  <FileText className="w-10 h-10 text-purple-400 opacity-20" />
                </div>
                <p className="text-purple-300 text-sm mt-3">Active services</p>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Applications</p>
                    <p className="text-3xl font-bold text-white mt-2">{overview?.totalApplications || 0}</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-green-400 opacity-20" />
                </div>
                <p className="text-green-300 text-sm mt-3">All time total</p>
              </Card>

              <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-700/50 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-300 text-sm">Feedback</p>
                    <p className="text-3xl font-bold text-white mt-2">{overview?.totalFeedback || 0}</p>
                  </div>
                  <Star className="w-10 h-10 text-amber-400 opacity-20" />
                </div>
                <p className="text-amber-300 text-sm mt-3">User responses</p>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Monthly Trends</h3>
                  <Button size="sm" variant="outline" className="text-white border-slate-600 bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="New Users" />
                    <Line type="monotone" dataKey="applications" stroke="#f59e0b" strokeWidth={2} name="Applications" />
                    <Line type="monotone" dataKey="services" stroke="#10b981" strokeWidth={2} name="Services" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Service Category Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Most Popular Services</h3>
              {popularServices.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No service data available</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={popularServices.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
                    />
                    <Bar dataKey="applicationCount" fill="#f59e0b" name="Applications" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <AnalyticsContent />
    </ProtectedRoute>
  )
}
