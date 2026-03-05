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
  category: string
  description: string
  agency: string
  estimated_processing_days: number
  service_fee: number
  requirements: string[]
  status: string
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
    category: "",
    description: "",
    responsible_agency: "",
    estimated_processing_time: "",
    service_fee: 0,
    requirements: "",
  })

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
        category: "",
        description: "",
        responsible_agency: "",
        estimated_processing_time: "",
        service_fee: 0,
        requirements: "",
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
      category: service.category || "",
      description: service.description || "",
      responsible_agency: service.agency || "",
      estimated_processing_time: `${service.estimated_processing_days || 7} days`,
      service_fee: service.service_fee || 0,
      requirements: Array.isArray(service.requirements) ? service.requirements.join("\n") : "",
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
              <Card key={service.id} className="bg-slate-800 border-slate-700 p-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    <p className="text-amber-400 text-sm">{service.category || "General"}</p>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2">{service.description}</p>
                  <div className="space-y-2 py-3 border-y border-slate-700">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{service.estimated_processing_days} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      <span>ETB {Number(service.service_fee || 0).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
                      onClick={() => handleArchiveService(service.id)}
                      variant="outline"
                      className="flex-1 border-red-600 text-red-400 hover:bg-red-600/20"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
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
