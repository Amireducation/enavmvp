"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Grid3x3, List, ArrowLeft, DollarSign, Clock, Eye } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface Service {
  id: string
  service_id?: string
  name: string
  category: string
  description: string
  estimated_processing_time?: string
  estimated_processing_days?: number
  service_fee: number
  online_available?: boolean
}

function ServiceBrowseContent() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [minFee, setMinFee] = useState("")
  const [maxFee, setMaxFee] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [servicesRes, categoriesRes] = await Promise.all([
        apiClient.get<Service[]>("/services"),
        apiClient.get<string[]>("/services/categories"),
      ])

      // Handle both old format (services/categories) and new format (data array)
      setServices(Array.isArray(servicesRes) ? servicesRes : (servicesRes as any).services || [])
      setCategories(Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes as any).categories || [])
    } catch (err) {
      console.error("Failed to fetch data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyClick = (serviceId: string) => {
    router.push(`/citizen/services/${serviceId}`)
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (categoryFilter !== "all") params.append("category", categoryFilter)
      if (minFee) params.append("minFee", minFee)
      if (maxFee) params.append("maxFee", maxFee)

      const res = await apiClient.get<Service[]>(`/services?${params.toString()}`)
      setServices(Array.isArray(res) ? res : (res as any).services || [])
    } catch (err) {
      console.error("Failed to search services:", err)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setMinFee("")
    setMaxFee("")
    fetchData()
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/citizen" className="text-slate-400 hover:text-white text-sm mb-3 inline-block">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Portal
          </Link>
          <h1 className="text-2xl font-bold text-white">Browse Services</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-slate-800 border-slate-700 overflow-x-auto">
              <TabsTrigger value="all" className="text-white">
                All Services
              </TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat} value={cat} className="text-white whitespace-nowrap">
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-amber-500 text-slate-900" : ""}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-amber-500 text-slate-900" : ""}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Min Fee (ETB)"
                  value={minFee}
                  onChange={(e) => setMinFee(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Fee (ETB)"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSearch} className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
                <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                  Clear
                </Button>
              </div>
            </div>
          </Card>

          <TabsContent value={categoryFilter} className="mt-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <p className="text-slate-400">No services found matching your criteria.</p>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-3"}>
                {services.map((service) =>
                  viewMode === "grid" ? (
                    <Card key={service.id || service.service_id} className="bg-slate-800 border-slate-700 p-6 hover:border-amber-500/50 transition-colors cursor-pointer" onClick={() => handleApplyClick(service.id || service.service_id || '')}>
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-amber-500/20 text-amber-200">{service.category}</Badge>
                        <Eye className="w-4 h-4 text-slate-500" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                      <div className="flex gap-3 text-sm mb-4 border-t border-slate-700 pt-4">
                        <span className="text-slate-300 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {service.estimated_processing_days || 'N/A'} days
                        </span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          ETB {Number(service.service_fee).toFixed(2)}
                        </span>
                      </div>
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                        View Details
                      </Button>
                    </Card>
                  ) : (
                    <Card key={service.id || service.service_id} className="bg-slate-800 border-slate-700 p-4 hover:border-amber-500/50 transition-colors cursor-pointer" onClick={() => handleApplyClick(service.id || service.service_id || '')}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-bold text-white">{service.name}</h3>
                            <Badge className="bg-amber-500/20 text-amber-200">{service.category}</Badge>
                          </div>
                          <p className="text-slate-400 text-sm mb-3">{service.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-slate-300 flex items-center gap-1">
                              <Clock className="w-4 h-4 text-blue-400" />
                              {service.estimated_processing_days || 'N/A'} days
                            </span>
                            <span className="text-slate-300 flex items-center gap-1">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              ETB {Number(service.service_fee).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApplyClick(service.id || service.service_id || '')
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-slate-900 ml-4 flex-shrink-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ),
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function ServiceBrowsePage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <ServiceBrowseContent />
    </ProtectedRoute>
  )
}
