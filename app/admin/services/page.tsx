"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Edit2, Archive, TrendingUp, DollarSign, Clock } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface Service {
  id: string
  name: string
  name_am?: string
  name_or?: string
  category: string
  category_id?: string
  description: string
  description_am?: string
  description_or?: string
  agency: string
  estimated_processing_days: number
  min_processing_days?: number
  max_processing_days?: number
  service_fee: number
  requirements: string[]
  status: string
  online_available?: boolean
  target_audience?: string
  contact_email?: string
  contact_phone?: string
  created_at?: string
  updated_at?: string
}

interface ServiceRequirement {
  id: string
  requirement_name: string
  requirement_type: string
  is_mandatory: boolean
  description?: string
}

interface ServiceVariation {
  id: string
  variation_name: string
  variation_type: string
  fee_adjustment_percentage: number
  processing_days_min: number
  processing_days_max: number
}

interface ServiceStats {
  applications: Array<{ status: string; total: number }>
  avgRating: number
  totalFeedback: number
}

function ServiceManagementContent() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [serviceStats, setServiceStats] = useState<ServiceStats | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    name_am: "",
    category: "",
    description: "",
    description_am: "",
    responsible_agency: "",
    estimated_processing_days: 7,
    min_processing_days: 5,
    max_processing_days: 14,
    service_fee: 0,
    requirements: "",
    online_available: true,
    target_audience: "all",
    contact_email: "",
    contact_phone: "",
  })
  const [statusFilter, setStatusFilter] = useState("active")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [serviceRequirements, setServiceRequirements] = useState<ServiceRequirement[]>([])
  const [serviceVariations, setServiceVariations] = useState<ServiceVariation[]>([])
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchData()
  }, [categoryFilter])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, categoriesRes] = await Promise.all([
        apiClient.get<Service[]>(
          `/services${categoryFilter !== "all" ? `?category=${categoryFilter}` : ""}`,
        ),
        apiClient.get<Array<{ name: string }>>("/services/categories"),
      ])

      setServices(Array.isArray(servicesRes) ? servicesRes : [])
      setCategories(Array.isArray(categoriesRes) ? categoriesRes.map((c) => c.name) : [])
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await apiClient.post("/services", {
        ...formData,
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
      })
      setIsCreateModalOpen(false)
      setFormData({
        name: "",
        name_am: "",
        category: "",
        description: "",
        description_am: "",
        responsible_agency: "",
        estimated_processing_days: 7,
        min_processing_days: 5,
        max_processing_days: 14,
        service_fee: 0,
        requirements: "",
        online_available: true,
        target_audience: "all",
        contact_email: "",
        contact_phone: "",
      })
      fetchData()
    } catch (err) {
      console.error("Failed to create service:", err)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return

    try {
      await apiClient.patch(`/services/${selectedService.id}`, {
        ...formData,
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
      })
      setIsEditModalOpen(false)
      setSelectedService(null)
      fetchData()
    } catch (err) {
      console.error("Failed to update service:", err)
    }
  }

  const handleArchiveService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to archive this service?")) return

    try {
      await apiClient.delete(`/services/${serviceId}`)
      fetchData()
    } catch (err) {
      console.error("Failed to archive service:", err)
    }
  }

  const openEditModal = async (service: Service) => {
    setSelectedService(service)
    setFormData({
      name: service.name,
      name_am: service.name_am || "",
      category: service.category || "",
      description: service.description || "",
      description_am: service.description_am || "",
      responsible_agency: service.agency || "",
      estimated_processing_days: service.estimated_processing_days || 7,
      min_processing_days: service.min_processing_days || 5,
      max_processing_days: service.max_processing_days || 14,
      service_fee: service.service_fee || 0,
      requirements: Array.isArray(service.requirements) ? service.requirements.join("\n") : "",
      online_available: service.online_available !== false,
      target_audience: service.target_audience || "all",
      contact_email: service.contact_email || "",
      contact_phone: service.contact_phone || "",
    })

    // Fetch service stats
    try {
      const statsRes = await apiClient.get<{ stats: ServiceStats }>(`/services/${service.id}/stats`)
      setServiceStats(statsRes.stats)
    } catch (err) {
      console.error("Failed to fetch stats:", err)
      setServiceStats(null)
    }

    setIsEditModalOpen(true)
  }

  const viewServiceDetails = async (service: Service) => {
    setSelectedService(service)
    setShowDetailsModal(true)
    setLoadingDetails(true)
    
    try {
      const [reqRes, varRes, statsRes] = await Promise.all([
        apiClient.get<ServiceRequirement[]>(`/services/${service.id}/requirements`).catch(() => []),
        apiClient.get<ServiceVariation[]>(`/services/${service.id}/variations`).catch(() => []),
        apiClient.get<{ stats: ServiceStats }>(`/services/${service.id}/stats`).catch(() => null),
      ])
      setServiceRequirements(Array.isArray(reqRes) ? reqRes : [])
      setServiceVariations(Array.isArray(varRes) ? varRes : [])
      if (statsRes?.stats) setServiceStats(statsRes.stats)
    } catch (err) {
      console.error("Failed to fetch service details:", err)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleStatusToggle = async (serviceId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "deprecated" : "active"
    try {
      await apiClient.patch(`/services/${serviceId}`, { status: newStatus })
      fetchData()
    } catch (err) {
      console.error("Failed to update status:", err)
    }
  }

  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <Link href="/admin" className="text-slate-400 hover:text-white text-sm">
              ← Back to Admin Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-white mt-2">Service Management</h1>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
            <Plus className="w-4 h-4 mr-2" />
            Add New Service
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400">No services found.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => (
              <Card key={service.id} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{service.name}</h3>
                      <p className="text-amber-400 text-sm">{service.category || "General"}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        service.status === "active" 
                          ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}>
                        {service.status || "active"}
                      </span>
                      {service.online_available && (
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{service.description}</p>
                  <div className="space-y-2 py-3 border-y border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>{service.estimated_processing_days} days</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span>ETB {Number(service.service_fee || 0).toFixed(2)}</span>
                      </div>
                    </div>
                    {service.agency && (
                      <p className="text-slate-500 text-xs">{service.agency}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewServiceDetails(service)}
                      className="flex-1 text-slate-300 border-slate-600 hover:bg-slate-700"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => openEditModal(service)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusToggle(service.id, service.status)}
                      variant="outline"
                      className={service.status === "active" 
                        ? "border-red-600 text-red-400 hover:bg-red-600/20"
                        : "border-green-600 text-green-400 hover:bg-green-600/20"
                      }
                    >
                      {service.status === "active" ? <Archive className="w-4 h-4" /> : "Activate"}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Service Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Service</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateService} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Service Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Responsible Agency</Label>
                <Input
                  required
                  value={formData.responsible_agency}
                  onChange={(e) => setFormData({ ...formData, responsible_agency: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Service Fee (ETB)</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.service_fee}
                  onChange={(e) => setFormData({ ...formData, service_fee: Number.parseFloat(e.target.value) })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Estimated Processing Time</Label>
              <Input
                required
                value={formData.estimated_processing_time}
                onChange={(e) => setFormData({ ...formData, estimated_processing_time: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                placeholder="e.g., 5-7 business days"
              />
            </div>

            <div>
              <Label className="text-white">Requirements (one per line)</Label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                rows={4}
                placeholder="National ID&#10;Birth Certificate&#10;Proof of Address"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
                Create Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Service</DialogTitle>
          </DialogHeader>

          {serviceStats && (
            <Card className="bg-slate-700 border-slate-600 p-4 mb-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Service Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-white">
                    {serviceStats.applications.reduce((sum, a) => sum + Number.parseInt(a.total), 0)}
                  </p>
                  <p className="text-slate-400 text-sm">Total Apps</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">{serviceStats.avgRating.toFixed(1)}</p>
                  <p className="text-slate-400 text-sm">Avg Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{serviceStats.totalFeedback}</p>
                  <p className="text-slate-400 text-sm">Feedback</p>
                </div>
              </div>
            </Card>
          )}

          <form onSubmit={handleEditService} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Service Name</Label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white">Description</Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-white">Responsible Agency</Label>
                <Input
                  required
                  value={formData.responsible_agency}
                  onChange={(e) => setFormData({ ...formData, responsible_agency: e.target.value })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Service Fee (ETB)</Label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.service_fee}
                  onChange={(e) => setFormData({ ...formData, service_fee: Number.parseFloat(e.target.value) })}
                  className="mt-2 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-white">Estimated Processing Time</Label>
              <Input
                required
                value={formData.estimated_processing_time}
                onChange={(e) => setFormData({ ...formData, estimated_processing_time: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Requirements (one per line)</Label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                rows={4}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
                Update Service
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Service Details</DialogTitle>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-6">
              {/* Service Info Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedService.name}</h3>
                  {selectedService.name_am && (
                    <p className="text-slate-400">{selectedService.name_am}</p>
                  )}
                  <p className="text-amber-400 text-sm mt-1">{selectedService.category || "General"}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded ${
                    selectedService.status === "active" 
                      ? "bg-green-500/20 text-green-300" 
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    {selectedService.status || "active"}
                  </span>
                  {selectedService.online_available && (
                    <span className="px-3 py-1 text-sm font-medium rounded bg-blue-500/20 text-blue-300">
                      Online Available
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-slate-300">{selectedService.description}</p>
                {selectedService.description_am && (
                  <p className="text-slate-400 mt-2 text-sm italic">{selectedService.description_am}</p>
                )}
              </div>

              {/* Key Info Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{selectedService.estimated_processing_days}</p>
                  <p className="text-slate-400 text-sm">Processing Days</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">ETB {Number(selectedService.service_fee || 0).toFixed(2)}</p>
                  <p className="text-slate-400 text-sm">Service Fee</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">
                    {serviceStats?.applications.reduce((sum, a) => sum + Number(a.total), 0) || 0}
                  </p>
                  <p className="text-slate-400 text-sm">Total Applications</p>
                </div>
              </div>

              {/* Agency & Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Responsible Agency</h4>
                  <p className="text-slate-300">{selectedService.agency || "Not specified"}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">Contact</h4>
                  <p className="text-slate-300">{selectedService.contact_email || "N/A"}</p>
                  <p className="text-slate-400 text-sm">{selectedService.contact_phone || ""}</p>
                </div>
              </div>

              {/* Requirements */}
              {loadingDetails ? (
                <div className="text-center py-4">
                  <p className="text-slate-400">Loading details...</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-3">Requirements</h4>
                    {serviceRequirements.length > 0 ? (
                      <div className="space-y-2">
                        {serviceRequirements.map((req) => (
                          <div key={req.id} className="flex items-center gap-3 p-2 bg-slate-600/50 rounded">
                            <span className={`px-2 py-0.5 text-xs rounded ${
                              req.is_mandatory ? "bg-red-500/20 text-red-300" : "bg-slate-500/20 text-slate-300"
                            }`}>
                              {req.is_mandatory ? "Required" : "Optional"}
                            </span>
                            <span className="text-white">{req.requirement_name}</span>
                            <span className="text-slate-500 text-sm">({req.requirement_type})</span>
                          </div>
                        ))}
                      </div>
                    ) : selectedService.requirements && Array.isArray(selectedService.requirements) && selectedService.requirements.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedService.requirements.map((req, i) => (
                          <li key={i} className="text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-slate-400">No requirements specified</p>
                    )}
                  </div>

                  {/* Variations */}
                  {serviceVariations.length > 0 && (
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h4 className="text-white font-semibold mb-3">Service Variations</h4>
                      <div className="space-y-2">
                        {serviceVariations.map((variation) => (
                          <div key={variation.id} className="flex items-center justify-between p-2 bg-slate-600/50 rounded">
                            <div>
                              <span className="text-white">{variation.variation_name}</span>
                              <span className="text-slate-500 text-sm ml-2">({variation.variation_type})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-amber-400">
                                {variation.fee_adjustment_percentage > 0 ? "+" : ""}{variation.fee_adjustment_percentage}%
                              </span>
                              <span className="text-slate-500 text-sm ml-2">
                                {variation.processing_days_min}-{variation.processing_days_max} days
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false)
                    openEditModal(selectedService)
                  }}
                  className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Service
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusToggle(selectedService.id, selectedService.status)}
                  className={selectedService.status === "active" 
                    ? "flex-1 text-red-400 border-red-400 hover:bg-red-400/10"
                    : "flex-1 text-green-400 border-green-400 hover:bg-green-400/10"
                  }
                >
                  {selectedService.status === "active" ? "Archive Service" : "Activate Service"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      </div>
  )
  }
  
export default function ServiceManagementPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <ServiceManagementContent />
    </ProtectedRoute>
  )
}
