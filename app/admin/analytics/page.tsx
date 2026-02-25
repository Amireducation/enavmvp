"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, TrendingUp, Users, FileText, Star, Download, BarChart3, ArrowLeft } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
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

interface ServiceMetric {
  serviceName: string
  serviceId: string
  totalApplications: number
  approved: number
  rejected: number
  pending: number
  averageRating: number | null
  approvalRate: number | null
}

interface UserStat {
  role: string
  total: number
  active: number
  verified: number
}

interface AppStatus {
  status: string
  count: number
}

interface FunnelStep {
  stage: string
  count: number
}

interface SatisfactionStats {
  totalFeedback: number
  averageRating: number | null
  satisfiedCount: number
  satisfactionRate: number | null
}

interface RatingDist {
  rating: number
  count: number
}

interface FeedbackByService {
  service: string
  feedbackCount: number
  averageRating: number
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  under_review: "#3b82f6",
  approved: "#10b981",
  rejected: "#ef4444",
  completed: "#6366f1",
}

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#06b6d4"]

function AnalyticsContent() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [serviceMetrics, setServiceMetrics] = useState<ServiceMetric[]>([])
  const [userStats, setUserStats] = useState<UserStat[]>([])
  const [statusDist, setStatusDist] = useState<AppStatus[]>([])
  const [funnel, setFunnel] = useState<FunnelStep[]>([])
  const [satisfaction, setSatisfaction] = useState<SatisfactionStats | null>(null)
  const [ratingDist, setRatingDist] = useState<RatingDist[]>([])
  const [feedbackByService, setFeedbackByService] = useState<FeedbackByService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllAnalytics()
  }, [])

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true)
      const [svcRes, usrRes, appRes, satRes] = await Promise.all([
        apiClient.get<{ serviceMetrics: ServiceMetric[] }>("/analytics/services"),
        apiClient.get<{ userStats: UserStat[] }>("/analytics/users"),
        apiClient.get<{ statusDistribution: AppStatus[]; funnel: FunnelStep[] }>("/analytics/applications"),
        apiClient.get<{ overallStats: SatisfactionStats; ratingDistribution: RatingDist[]; feedbackByService: FeedbackByService[] }>("/analytics/satisfaction"),
      ])
      setServiceMetrics(svcRes.serviceMetrics || [])
      setUserStats(usrRes.userStats || [])
      setStatusDist(appRes.statusDistribution || [])
      setFunnel(appRes.funnel || [])
      setSatisfaction(satRes.overallStats || null)
      setRatingDist(satRes.ratingDistribution || [])
      setFeedbackByService(satRes.feedbackByService || [])
    } catch (err) {
      console.error("Failed to fetch analytics:", err)
    } finally {
      setLoading(false)
    }
  }

  const totalUsers = userStats.reduce((sum, s) => sum + Number(s.total), 0)
  const totalApps = statusDist.reduce((sum, s) => sum + Number(s.count), 0)

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")} className="text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Analytics & Reports</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} className="text-white border-slate-600 bg-transparent hover:bg-slate-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400 animate-pulse">Loading analytics data...</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border-blue-700/50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-400/30" />
                </div>
                <p className="text-blue-300 text-xs mt-2">{userStats.find(s => s.role === 'citizen')?.total || 0} citizens</p>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border-emerald-700/50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Applications</p>
                    <p className="text-3xl font-bold text-white mt-1">{totalApps}</p>
                  </div>
                  <FileText className="w-8 h-8 text-emerald-400/30" />
                </div>
                <p className="text-emerald-300 text-xs mt-2">{statusDist.find(s => s.status === 'pending')?.count || 0} pending</p>
              </Card>

              <Card className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border-amber-700/50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Avg Rating</p>
                    <p className="text-3xl font-bold text-white mt-1">{satisfaction?.averageRating ?? "N/A"}</p>
                  </div>
                  <Star className="w-8 h-8 text-amber-400/30" />
                </div>
                <p className="text-amber-300 text-xs mt-2">{satisfaction?.totalFeedback || 0} reviews</p>
              </Card>

              <Card className="bg-gradient-to-br from-violet-900/40 to-violet-800/20 border-violet-700/50 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium">Active Services</p>
                    <p className="text-3xl font-bold text-white mt-1">{serviceMetrics.length}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-violet-400/30" />
                </div>
                <p className="text-violet-300 text-xs mt-2">{satisfaction?.satisfactionRate ?? 0}% satisfaction</p>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="services" className="space-y-6">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="services" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300">Services</TabsTrigger>
                <TabsTrigger value="applications" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300">Applications</TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-300">Users</TabsTrigger>
                <TabsTrigger value="satisfaction" className="data-[state=active]:bg-violet-500/20 data-[state=active]:text-violet-300">Satisfaction</TabsTrigger>
              </TabsList>

              {/* Services Tab */}
              <TabsContent value="services" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Service Performance</h3>
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600 bg-transparent hover:bg-slate-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  {serviceMetrics.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">No application data yet. Metrics will appear once citizens submit applications.</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={serviceMetrics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="serviceName" stroke="#94a3b8" angle={-25} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#e2e8f0" }} />
                        <Legend />
                        <Bar dataKey="approved" fill="#10b981" name="Approved" stackId="a" />
                        <Bar dataKey="pending" fill="#f59e0b" name="Pending" stackId="a" />
                        <Bar dataKey="rejected" fill="#ef4444" name="Rejected" stackId="a" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </Card>

                {/* Service Table */}
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Service Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-400">
                          <th className="text-left py-3 px-2">Service</th>
                          <th className="text-center py-3 px-2">Applications</th>
                          <th className="text-center py-3 px-2">Approval Rate</th>
                          <th className="text-center py-3 px-2">Avg Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceMetrics.map((m) => (
                          <tr key={m.serviceId} className="border-b border-slate-700/50 text-slate-300 hover:bg-slate-700/30">
                            <td className="py-3 px-2 font-medium text-white">{m.serviceName}</td>
                            <td className="text-center py-3 px-2">{m.totalApplications}</td>
                            <td className="text-center py-3 px-2">
                              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-0">
                                {m.approvalRate ?? 0}%
                              </Badge>
                            </td>
                            <td className="text-center py-3 px-2">{m.averageRating ? `${m.averageRating}/5` : "N/A"}</td>
                          </tr>
                        ))}
                        {serviceMetrics.length === 0 && (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-500">No data yet</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Status Distribution</h3>
                    {statusDist.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No applications yet</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={statusDist.map(s => ({ ...s, count: Number(s.count) }))}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ status, percent }: { status: string; percent: number }) => `${status}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={100}
                            dataKey="count"
                          >
                            {statusDist.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#e2e8f0" }} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Card>

                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Application Funnel</h3>
                    {funnel.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No funnel data yet</p>
                    ) : (
                      <div className="space-y-4 py-4">
                        {funnel.map((step, idx) => {
                          const maxCount = Math.max(...funnel.map(f => Number(f.count)), 1)
                          const width = (Number(step.count) / maxCount) * 100
                          return (
                            <div key={step.stage} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300">{step.stage}</span>
                                <span className="text-white font-medium">{step.count}</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-6">
                                <div
                                  className="h-6 rounded-full flex items-center justify-end pr-2 text-xs font-medium text-white transition-all"
                                  style={{ width: `${Math.max(width, 5)}%`, backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                                >
                                  {width > 15 ? `${width.toFixed(0)}%` : ""}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">User Breakdown by Role</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {userStats.map((stat) => (
                      <div key={stat.role} className="bg-slate-700/50 rounded-lg p-4 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-wider font-medium mb-1">{stat.role}</p>
                        <p className="text-2xl font-bold text-white">{stat.total}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 border-0 text-xs">
                            {stat.active} active
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0 text-xs">
                            {stat.verified} verified
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {userStats.length === 0 && (
                      <div className="col-span-4 text-center py-8 text-slate-500">No user data available</div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* Satisfaction Tab */}
              <TabsContent value="satisfaction" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Rating Distribution</h3>
                    {ratingDist.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No feedback received yet</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={ratingDist.map(r => ({ ...r, count: Number(r.count) }))}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                          <XAxis dataKey="rating" stroke="#94a3b8" tickFormatter={(v) => `${v} star`} />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px", color: "#e2e8f0" }} />
                          <Bar dataKey="count" fill="#f59e0b" name="Responses" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Card>

                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Satisfaction by Service</h3>
                    {feedbackByService.length === 0 ? (
                      <p className="text-slate-400 text-center py-8">No feedback by service yet</p>
                    ) : (
                      <div className="space-y-3">
                        {feedbackByService.map((f) => (
                          <div key={f.service} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <div>
                              <p className="text-white font-medium text-sm">{f.service}</p>
                              <p className="text-slate-400 text-xs">{f.feedbackCount} reviews</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= Math.round(f.averageRating) ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                                  />
                                ))}
                              </div>
                              <span className="text-white font-medium text-sm">{f.averageRating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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
