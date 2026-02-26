"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import { ThumbsUp, ThumbsDown, Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface ExpansionRequest {
  id: string
  serviceName: string
  category: string
  description: string
  userVotes: number
  upvotes: number
  downvotes: number
  status: string
  createdBy: string
  createdAt: string
  userVoted?: string | null
}

interface FormData {
  serviceName: string
  category: string
  description: string
}

function ServiceExpansionContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [requests, setRequests] = useState<ExpansionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<FormData>({ serviceName: "", category: "", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all")

  useEffect(() => {
    fetchExpansionRequests()
  }, [])

  const fetchExpansionRequests = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<{ requests: ExpansionRequest[] }>("/service-expansion")
      setRequests(data.requests || [])
    } catch (err) {
      console.error("Failed to fetch expansion requests:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.serviceName || !formData.description) return

    setSubmitting(true)
    try {
      await apiClient.post("/service-expansion", {
        serviceName: formData.serviceName,
        category: formData.category || "Other",
        description: formData.description,
      })

      setFormData({ serviceName: "", category: "", description: "" })
      setShowForm(false)
      await fetchExpansionRequests()
    } catch (err) {
      console.error("Failed to submit request:", err)
      alert("Failed to submit service expansion request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (id: string, voteType: "upvote" | "downvote") => {
    try {
      const res = await apiClient.post(`/service-expansion/${id}/vote`, { voteType })

      setRequests((prev) =>
        prev.map((req) =>
          req.id === id
            ? {
                ...req,
                upvotes: res.upvotes,
                downvotes: res.downvotes,
                userVoted: req.userVoted === voteType ? null : voteType,
              }
            : req
        )
      )
    } catch (err) {
      console.error("Failed to vote:", err)
    }
  }

  const filteredRequests = requests.filter((r) => {
    if (filter === "all") return true
    return r.status === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/citizen")} className="text-white hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Service Expansion</h1>
              <p className="text-slate-400 text-sm">Suggest new services for Ethiopia Navigator</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Suggest Service
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Submission Form */}
        {showForm && (
          <Card className="bg-slate-800 border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Suggest a New Service</h2>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Service Name</label>
                  <Input
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="e.g., Digital Notarization"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-medium block mb-2">Category</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Digital Services"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-white text-sm font-medium block mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain why this service is needed and what problems it would solve..."
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowForm(false)} className="border-slate-600 text-white bg-transparent hover:bg-slate-700">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {submitting ? "Submitting..." : "Submit Suggestion"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              onClick={() => setFilter(f)}
              className={f === filter ? "bg-emerald-600 text-white" : "border-slate-600 text-slate-300 bg-transparent hover:bg-slate-700"}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Requests List */}
        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400">Loading service expansion requests...</p>
          </Card>
        ) : filteredRequests.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400">No {filter === "all" ? "" : filter} service expansion requests yet. Be the first to suggest one!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <Card key={req.id} className="bg-slate-800 border-slate-700 p-6 hover:border-slate-600 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-white">{req.serviceName}</h3>
                    <p className="text-slate-400 text-sm">
                      Suggested by {req.createdBy} • {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                      {req.category}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={
                        req.status === "approved"
                          ? "bg-emerald-500/20 text-emerald-300 border-0"
                          : "bg-amber-500/20 text-amber-300 border-0"
                      }
                    >
                      {req.status === "approved" ? "Approved" : "Under Review"}
                    </Badge>
                  </div>
                </div>

                <p className="text-slate-300 mb-4">{req.description}</p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(req.id, "upvote")}
                      className={`border-0 ${
                        req.userVoted === "upvote"
                          ? "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {req.upvotes}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(req.id, "downvote")}
                      className={`border-0 ${
                        req.userVoted === "downvote"
                          ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      <ThumbsDown className="w-4 h-4 mr-1" />
                      {req.downvotes}
                    </Button>
                  </div>
                  <span className="text-slate-400 text-sm ml-auto">{req.userVotes} people interested</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServiceExpansionPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <ServiceExpansionContent />
    </ProtectedRoute>
  )
}
