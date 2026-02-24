"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, FileText, Clock, CheckCircle2, XCircle, Search, Eye, Download } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface Application {
  application_id: string
  service_id: string
  service_name?: string
  status: string
  form_data: any
  created_at: string
  updated_at: string
  notes?: string
}

function ApplicationsManagementContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApps, setFilteredApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{ applications: Application[] }>("/applications/my")
      setApplications(res.applications || [])
    } catch (err) {
      console.error("Failed to fetch applications:", err)
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.application_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.service_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter)
    }

    setFilteredApps(filtered)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-5 h-5 text-blue-400" />
      case "processing":
        return <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
      case "approved":
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-400" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return <FileText className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500/20 text-blue-200 border-blue-500/50"
      case "processing":
        return "bg-amber-500/20 text-amber-200 border-amber-500/50"
      case "approved":
      case "completed":
        return "bg-green-500/20 text-green-200 border-green-500/50"
      case "rejected":
        return "bg-red-500/20 text-red-200 border-red-500/50"
      default:
        return "bg-slate-500/20 text-slate-200 border-slate-500/50"
    }
  }

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    processing: applications.filter((a) => a.status === "processing").length,
    completed: applications.filter((a) => a.status === "completed" || a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/citizen")} className="text-white">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-white">My Applications</h1>
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
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Total Applications</p>
            <p className="text-2xl font-bold text-white mt-1">{statusCounts.all}</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">In Progress</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{statusCounts.submitted + statusCounts.processing}</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Completed</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{statusCounts.completed}</p>
          </Card>
          <Card className="bg-slate-800 border-slate-700 p-4">
            <p className="text-slate-400 text-sm">Rejected</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{statusCounts.rejected}</p>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by application ID or service name..."
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white rounded px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="processing">Processing</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </Card>

        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400">Loading applications...</p>
          </Card>
        ) : filteredApps.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "No applications match your search criteria."
                : "You haven't submitted any applications yet."}
            </p>
            <Button onClick={() => router.push("/citizen/services/browse")} className="bg-amber-500 hover:bg-amber-600">
              Browse Services
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredApps.map((app) => (
              <Card
                key={app.application_id}
                className="bg-slate-800 border-slate-700 p-5 hover:border-amber-500/50 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getStatusIcon(app.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">{app.service_name || "Service Application"}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">App ID: {app.application_id.slice(0, 12)}...</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Submitted: {new Date(app.created_at).toLocaleDateString()}</span>
                        <span>Updated: {new Date(app.updated_at).toLocaleDateString()}</span>
                      </div>
                      {app.notes && (
                        <p className="text-slate-300 text-sm mt-2 p-2 bg-slate-700/50 rounded">Note: {app.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedApp(app)}
                      className="text-white border-slate-600"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedApp && (
          <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApp(null)}
          >
            <Card
              className="bg-slate-800 border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Application Details</h2>
                  <Button variant="ghost" onClick={() => setSelectedApp(null)} className="text-white">
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">Application ID</p>
                      <p className="text-white font-mono text-sm">{selectedApp.application_id}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-semibold border ${getStatusColor(selectedApp.status)}`}
                      >
                        {selectedApp.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Submitted Date</p>
                      <p className="text-white">{new Date(selectedApp.created_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Last Updated</p>
                      <p className="text-white">{new Date(selectedApp.updated_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedApp.notes && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Employee Notes</p>
                      <div className="p-3 bg-slate-700 rounded">
                        <p className="text-white text-sm">{selectedApp.notes}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-slate-400 text-sm mb-2">Form Data</p>
                    <div className="p-3 bg-slate-700 rounded">
                      <pre className="text-white text-xs overflow-x-auto">
                        {JSON.stringify(selectedApp.form_data, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <Button className="flex-1 bg-amber-500 hover:bg-amber-600">
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedApp(null)}
                    className="text-white border-slate-600"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ApplicationsPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <ApplicationsManagementContent />
    </ProtectedRoute>
  )
}
