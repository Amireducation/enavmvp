"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  LogOut,
  Handshake,
  FileText,
  Users,
  TrendingUp,
  Search,
  Bell,
  Settings,
  Building2,
  Download,
  ExternalLink,
  Calendar,
  Globe,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data for partner portal
const mockPartnerships = [
  {
    id: "PTR-001",
    organization: "Ethiopian Red Cross Society",
    type: "NGO",
    status: "active",
    since: "2024-03-15",
    services: 5,
    impact: "25,000+ citizens served",
  },
  {
    id: "PTR-002",
    organization: "Commercial Bank of Ethiopia",
    type: "Financial",
    status: "active",
    since: "2024-06-01",
    services: 3,
    impact: "Payment processing integration",
  },
  {
    id: "PTR-003",
    organization: "Ethio Telecom",
    type: "Technology",
    status: "active",
    since: "2024-01-20",
    services: 2,
    impact: "SMS notification services",
  },
]

const mockPrograms = [
  {
    id: "PRG-001",
    name: "Digital Literacy Initiative",
    description: "Teaching digital skills to rural communities for accessing e-government services",
    status: "active",
    participants: 2500,
    startDate: "2025-01-01",
    endDate: "2025-12-31",
  },
  {
    id: "PRG-002",
    name: "Service Accessibility Program",
    description: "Bringing government services to underserved areas through mobile units",
    status: "active",
    participants: 1800,
    startDate: "2025-02-15",
    endDate: "2025-11-30",
  },
  {
    id: "PRG-003",
    name: "Youth Employment Support",
    description: "Helping young citizens access employment and business registration services",
    status: "planning",
    participants: 0,
    startDate: "2026-03-01",
    endDate: "2026-12-31",
  },
]

const impactData = [
  { month: "Aug", citizens: 3200 },
  { month: "Sep", citizens: 4100 },
  { month: "Oct", citizens: 5500 },
  { month: "Nov", citizens: 6200 },
  { month: "Dec", citizens: 7800 },
  { month: "Jan", citizens: 8500 },
]

function PartnerPortalContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  const stats = {
    activePartnerships: mockPartnerships.filter((p) => p.status === "active").length,
    totalPrograms: mockPrograms.length,
    activePrograms: mockPrograms.filter((p) => p.status === "active").length,
    totalParticipants: mockPrograms.reduce((sum, p) => sum + p.participants, 0),
  }

  const filteredPartnerships = mockPartnerships.filter(
    (p) =>
      p.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center font-bold text-white">
                  EN
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold leading-none">Partner Portal</h1>
                  <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </Link>
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.[0]?.toUpperCase() || "P"}
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
            {
              label: "Active Partnerships",
              value: stats.activePartnerships,
              icon: <Handshake className="w-5 h-5" />,
              color: "emerald",
            },
            {
              label: "Total Programs",
              value: stats.totalPrograms,
              icon: <FileText className="w-5 h-5" />,
              color: "blue",
            },
            {
              label: "Active Programs",
              value: stats.activePrograms,
              icon: <TrendingUp className="w-5 h-5" />,
              color: "purple",
            },
            {
              label: "Total Participants",
              value: stats.totalParticipants.toLocaleString(),
              icon: <Users className="w-5 h-5" />,
              color: "amber",
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

        <Tabs defaultValue="partnerships" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="partnerships" className="gap-2">
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">Partnerships</span>
            </TabsTrigger>
            <TabsTrigger value="programs" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Programs</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Impact</span>
            </TabsTrigger>
          </TabsList>

          {/* Partnerships Tab */}
          <TabsContent value="partnerships" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search partnerships..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white">
                  <Handshake className="w-4 h-4 mr-2" />
                  New Partnership
                </Button>
              </div>
            </Card>

            <div className="space-y-3">
              {filteredPartnerships.map((partnership) => (
                <Card key={partnership.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{partnership.organization}</h4>
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                            {partnership.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{partnership.impact}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {partnership.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Since {partnership.since}
                          </span>
                          <span>{partnership.services} integrated services</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-16 lg:ml-0">
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <ExternalLink className="w-3 h-3" />
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Programs Tab */}
          <TabsContent value="programs" className="space-y-4">
            <div className="space-y-3">
              {mockPrograms.map((program) => (
                <Card key={program.id} className="p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{program.name}</h4>
                          <Badge
                            className={
                              program.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            }
                          >
                            {program.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {program.participants.toLocaleString()} participants
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {program.startDate} - {program.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className={
                        program.status === "active"
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white"
                          : "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
                      }
                    >
                      {program.status === "active" ? "View Progress" : "Join Waitlist"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Impact Tab */}
          <TabsContent value="impact" className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Citizens Reached Through Programs (6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="citizens" fill="hsl(var(--chart-2))" name="Citizens Reached" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Impact Reports</h3>
              <div className="space-y-3">
                {[
                  { title: "Q4 2025 Partnership Impact Report", date: "January 2026", size: "2.4 MB" },
                  { title: "Annual Program Assessment 2025", date: "December 2025", size: "4.1 MB" },
                  { title: "Community Outreach Summary", date: "November 2025", size: "1.8 MB" },
                ].map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{report.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.date} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function PartnerPage() {
  return (
    <ProtectedRoute requiredRoles={["partner", "admin"]}>
      <PartnerPortalContent />
    </ProtectedRoute>
  )
}
