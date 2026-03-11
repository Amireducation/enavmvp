"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
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
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Upload,
  Loader2,
  X,
  BarChart3,
  PieChart,
  Briefcase,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface BusinessProfile {
  id: string
  businessName: string
  businessNameAm?: string
  description?: string
  businessType: string
  tin: string
  email: string
  phone?: string
  verificationStatus: string
  sector?: { name: string; code: string }
  createdAt: string
}

interface ServiceRequest {
  id: string
  trackingNumber: string
  serviceName: string
  status: string
  createdAt: string
}

function PartnerPortalContent() {
  const { user, logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [businessProfiles, setBusinessProfiles] = useState<BusinessProfile[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [sectors, setSectors] = useState<{ id: string; name: string; code: string }[]>([])
  const [entityTypes, setEntityTypes] = useState<{ id: string; name: string }[]>([])
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessNameAm: "",
    businessDescription: "",
    businessType: "private",
    tin: "",
    registrationNumber: "",
    tradeLicenseNumber: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    sectorId: "",
    entityTypeId: "",
    numberOfEmployees: "",
    annualRevenue: "",
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const [profilesData, sectorsData, entityTypesData] = await Promise.all([
          apiClient.get<{ data: BusinessProfile[] }>("/b2b/business-profiles").catch(() => ({ data: [] })),
          apiClient.get<{ data: { id: string; name: string; code: string }[] }>("/g2b/sectors").catch(() => ({ data: [] })),
          apiClient.get<{ data: { id: string; name: string }[] }>("/g2b/entity-types").catch(() => ({ data: [] })),
        ])
        setBusinessProfiles(profilesData.data || [])
        setSectors(sectorsData.data || [])
        setEntityTypes(entityTypesData.data || [])
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRegisterBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const result = await apiClient.post("/b2b/business-profiles", {
        ...formData,
        numberOfEmployees: formData.numberOfEmployees ? parseInt(formData.numberOfEmployees) : null,
        annualRevenue: formData.annualRevenue ? parseFloat(formData.annualRevenue) : null,
      })
      
      // Refresh profiles
      const profilesData = await apiClient.get<{ data: BusinessProfile[] }>("/b2b/business-profiles").catch(() => ({ data: [] }))
      setBusinessProfiles(profilesData.data || [])
      
      setShowRegisterForm(false)
      setFormData({
        businessName: "",
        businessNameAm: "",
        businessDescription: "",
        businessType: "private",
        tin: "",
        registrationNumber: "",
        tradeLicenseNumber: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        sectorId: "",
        entityTypeId: "",
        numberOfEmployees: "",
        annualRevenue: "",
      })
      alert("Business registered successfully! Your profile is pending verification.")
    } catch (err: any) {
      console.error("Registration error:", err)
      alert(err.message || "Failed to register business. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const stats = {
    totalBusinesses: businessProfiles.length,
    verifiedBusinesses: businessProfiles.filter(b => b.verificationStatus === "verified").length,
    pendingVerification: businessProfiles.filter(b => b.verificationStatus === "pending").length,
    totalRequests: serviceRequests.length,
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" />Verified</Badge>
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const impactData = [
    { month: "Aug", revenue: 125000 },
    { month: "Sep", revenue: 142000 },
    { month: "Oct", revenue: 168000 },
    { month: "Nov", revenue: 185000 },
    { month: "Dec", revenue: 210000 },
    { month: "Jan", revenue: 238000 },
  ]

  const serviceUsageData = [
    { name: "Business License", count: 45 },
    { name: "Tax Clearance", count: 38 },
    { name: "Import Permit", count: 22 },
    { name: "Export License", count: 18 },
    { name: "Work Permit", count: 12 },
  ]

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
                  <h1 className="text-lg font-bold leading-none">B2B Partner Portal</h1>
                  <p className="text-xs text-muted-foreground">Ethiopian Navigator</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Business Partner Dashboard</h2>
          <p className="text-muted-foreground">
            Manage your business profiles, access B2B services, and track your applications.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Businesses",
              value: stats.totalBusinesses,
              icon: <Building2 className="w-5 h-5" />,
              color: "amber",
            },
            {
              label: "Verified",
              value: stats.verifiedBusinesses,
              icon: <CheckCircle2 className="w-5 h-5" />,
              color: "emerald",
            },
            {
              label: "Pending Verification",
              value: stats.pendingVerification,
              icon: <Clock className="w-5 h-5" />,
              color: "blue",
            },
            {
              label: "Active Services",
              value: "12",
              icon: <Briefcase className="w-5 h-5" />,
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

        <Tabs defaultValue="businesses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="businesses" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Businesses</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
          </TabsList>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-4">
            <Card className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses by name or TIN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => setShowRegisterForm(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Business
                </Button>
              </div>
            </Card>

            {/* Business Registration Form Modal */}
            {showRegisterForm && (
              <Card className="p-6 border-2 border-amber-500/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Register New Business</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowRegisterForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <form onSubmit={handleRegisterBusiness} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="businessName">Business Name (English) *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Enter business name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessNameAm">Business Name (Amharic)</Label>
                      <Input
                        id="businessNameAm"
                        value={formData.businessNameAm}
                        onChange={(e) => setFormData({ ...formData, businessNameAm: e.target.value })}
                        placeholder="Enter business name in Amharic"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      placeholder="Describe your business activities..."
                      rows={3}
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tin">TIN (Tax ID) *</Label>
                      <Input
                        id="tin"
                        value={formData.tin}
                        onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                        placeholder="0000000000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number</Label>
                      <Input
                        id="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                        placeholder="REG-XXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tradeLicenseNumber">Trade License Number</Label>
                      <Input
                        id="tradeLicenseNumber"
                        value={formData.tradeLicenseNumber}
                        onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                        placeholder="TL-XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Business Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+251-XXX-XXX-XXX"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sectorId">Business Sector</Label>
                      <Select value={formData.sectorId} onValueChange={(v) => setFormData({ ...formData, sectorId: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sector" />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessType">Business Type</Label>
                      <Select value={formData.businessType} onValueChange={(v) => setFormData({ ...formData, businessType: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private">Private Limited Company</SelectItem>
                          <SelectItem value="plc">Public Limited Company</SelectItem>
                          <SelectItem value="sole">Sole Proprietorship</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="cooperative">Cooperative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                      <Input
                        id="numberOfEmployees"
                        type="number"
                        value={formData.numberOfEmployees}
                        onChange={(e) => setFormData({ ...formData, numberOfEmployees: e.target.value })}
                        placeholder="e.g., 50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRevenue">Annual Revenue (ETB)</Label>
                      <Input
                        id="annualRevenue"
                        type="number"
                        value={formData.annualRevenue}
                        onChange={(e) => setFormData({ ...formData, annualRevenue: e.target.value })}
                        placeholder="e.g., 5000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Full business address..."
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowRegisterForm(false)} className="bg-transparent">
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Register Business
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Business Profiles List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : businessProfiles.length === 0 ? (
              <Card className="p-12 text-center">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Businesses Registered</h3>
                <p className="text-muted-foreground mb-4">
                  Register your first business to access B2B services and government partnerships.
                </p>
                <Button 
                  onClick={() => setShowRegisterForm(true)}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Register Your First Business
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                {businessProfiles
                  .filter(b => 
                    b.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.tin.includes(searchTerm)
                  )
                  .map((business) => (
                  <Card key={business.id} className="p-5 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{business.businessName}</h4>
                            {getStatusBadge(business.verificationStatus)}
                          </div>
                          {business.businessNameAm && (
                            <p className="text-sm text-muted-foreground mb-1">{business.businessNameAm}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>TIN: {business.tin}</span>
                            {business.sector && <span>Sector: {business.sector.name}</span>}
                            <span>Type: {business.businessType}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-16 lg:ml-0">
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <FileText className="w-3 h-3" />
                          Documents
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          <ExternalLink className="w-3 h-3" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Business License Renewal", category: "Licensing", fee: "2,500 ETB", time: "3-5 days" },
                { name: "Tax Clearance Certificate", category: "Tax", fee: "500 ETB", time: "1-2 days" },
                { name: "Import/Export Permit", category: "Trade", fee: "5,000 ETB", time: "5-7 days" },
                { name: "Work Permit Application", category: "Employment", fee: "3,500 ETB", time: "7-14 days" },
                { name: "Company Name Registration", category: "Registration", fee: "1,500 ETB", time: "2-3 days" },
                { name: "VAT Registration", category: "Tax", fee: "Free", time: "1-2 days" },
              ].map((service, i) => (
                <Card key={i} className="p-5 hover:shadow-lg transition-all">
                  <Badge variant="secondary" className="mb-3">{service.category}</Badge>
                  <h4 className="font-semibold mb-2">{service.name}</h4>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{service.fee}</span>
                    <span>{service.time}</span>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white">
                    Apply Now
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Revenue Trend (6 Months)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip
                      formatter={(value: number) => [`${value.toLocaleString()} ETB`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-2))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Service Usage</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={serviceUsageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={120} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Business Documents</h3>
              <div className="space-y-3">
                {[
                  { title: "Trade License 2025", date: "Valid until Dec 2025", size: "1.2 MB", status: "active" },
                  { title: "TIN Certificate", date: "Issued Jan 2024", size: "0.8 MB", status: "active" },
                  { title: "VAT Registration", date: "Issued Mar 2024", size: "0.5 MB", status: "active" },
                  { title: "Company Registration", date: "Issued 2020", size: "1.5 MB", status: "active" },
                ].map((doc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.date} - {doc.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{doc.status}</Badge>
                      <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 gap-2 bg-transparent">
                <Upload className="w-4 h-4" />
                Upload New Document
              </Button>
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
