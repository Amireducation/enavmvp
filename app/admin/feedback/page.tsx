"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { LogOut, MessageSquare, Star, TrendingUp, Download } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface Feedback {
  feedback_id: string
  user_id: string
  service_id?: string
  rating: number
  comments: string
  category: string
  created_at: string
  user_name?: string
  service_name?: string
}

function FeedbackManagementContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    fetchFeedback()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [feedbackList, searchTerm, ratingFilter, categoryFilter])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<{ feedback: Feedback[] } | Feedback[]>("/feedback")
      // Handle both direct array and wrapped response
      const feedbackData = Array.isArray(res) ? res : (res.feedback || [])
      setFeedbackList(feedbackData)
    } catch (err) {
      console.error("Failed to fetch feedback:", err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = feedbackList

    if (searchTerm) {
      filtered = filtered.filter((f) => f.comments.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((f) => f.rating === Number.parseInt(ratingFilter))
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((f) => f.category === categoryFilter)
    }

    setFilteredFeedback(filtered)
  }

  const avgRating =
    feedbackList.length > 0 ? feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbackList.filter((f) => f.rating === rating).length,
    percentage:
      feedbackList.length > 0
        ? (feedbackList.filter((f) => f.rating === rating).length / feedbackList.length) * 100
        : 0,
  }))

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/admin")} className="text-white">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Feedback Management</h1>
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
          <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Feedback</p>
                <p className="text-3xl font-bold text-white mt-2">{feedbackList.length}</p>
              </div>
              <MessageSquare className="w-10 h-10 text-amber-400 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/30 border-green-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm">Average Rating</p>
                <p className="text-3xl font-bold text-white mt-2">{avgRating.toFixed(1)}</p>
              </div>
              <Star className="w-10 h-10 text-green-400 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm">5-Star Ratings</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {feedbackList.filter((f) => f.rating === 5).length}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-400 opacity-20" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-900/30 to-red-800/30 border-red-700/50 p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-300 text-sm">Low Ratings (1-2)</p>
                <p className="text-3xl font-bold text-white mt-2">{feedbackList.filter((f) => f.rating <= 2).length}</p>
              </div>
              <Star className="w-10 h-10 text-red-400 opacity-20" />
            </div>
          </Card>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-4">
                <div className="w-16 text-white text-sm flex items-center gap-1">
                  {item.rating} <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                </div>
                <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all" style={{ width: `${item.percentage}%` }} />
                </div>
                <div className="w-20 text-right text-slate-400 text-sm">
                  {item.count} ({item.percentage.toFixed(0)}%)
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-slate-800 border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search feedback comments..."
              className="flex-1 bg-slate-700 border-slate-600 text-white"
            />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="service">Service</option>
              <option value="technical">Technical</option>
            </select>
            <Button variant="outline" className="text-white border-slate-600 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400">Loading feedback...</p>
          </Card>
        ) : filteredFeedback.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No feedback found.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredFeedback.map((feedback) => (
              <Card key={feedback.feedback_id} className="bg-slate-800 border-slate-700 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= feedback.rating ? "fill-amber-500 text-amber-500" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-slate-400 text-sm">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-300 rounded text-xs">
                        {feedback.category}
                      </span>
                    </div>
                    <p className="text-white">{feedback.comments}</p>
                    <p className="text-slate-500 text-xs mt-2">User ID: {feedback.user_id.slice(0, 12)}...</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FeedbackPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <FeedbackManagementContent />
    </ProtectedRoute>
  )
}
