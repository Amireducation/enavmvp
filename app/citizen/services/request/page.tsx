"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckCircle2, Loader2, FileText } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

const CATEGORIES = [
  "Identification Documents",
  "Business & Commerce",
  "Legal & Judicial",
  "Property & Land",
  "Health & Social Services",
  "Transportation",
  "Education",
  "Utilities",
  "Agriculture",
  "Social Welfare",
  "Licensing",
  "Permits & Approvals",
]

function ServiceRequestContent() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    service_name: "",
    service_description: "",
    category_suggestion: "",
    justification: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await apiClient.post("/service-requests", formData)
      setSuccess(true)
      setTimeout(() => {
        setFormData({
          service_name: "",
          service_description: "",
          category_suggestion: "",
          justification: "",
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/citizen" className="text-slate-400 hover:text-white text-sm mb-3 inline-block">
            <ArrowLeft className="w-4 h-4 inline mr-2" />
            Back to Portal
          </Link>
          <h1 className="text-2xl font-bold text-white">Request New Service</h1>
          <p className="text-slate-400 mt-2">
            Can't find the service you need? Request it here and our team will review your submission.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
            <p className="text-slate-400 mb-6">
              Thank you for your request. Our team will review it and get back to you soon.
            </p>
            <Link href="/citizen">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">Return to Portal</Button>
            </Link>
          </Card>
        ) : (
          <Card className="bg-slate-800 border-slate-700 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded">
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div>
                <Label className="text-white text-lg font-semibold">Service Name</Label>
                <p className="text-slate-400 text-sm mb-3">What service would you like to request?</p>
                <Input
                  required
                  value={formData.service_name}
                  onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="e.g., Professional License Registration"
                />
              </div>

              <div>
                <Label className="text-white text-lg font-semibold">Category</Label>
                <p className="text-slate-400 text-sm mb-3">Which category does this service belong to?</p>
                <Select
                  value={formData.category_suggestion}
                  onValueChange={(value) => setFormData({ ...formData, category_suggestion: value })}
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white text-lg font-semibold">Service Description</Label>
                <p className="text-slate-400 text-sm mb-3">
                  Provide a detailed description of what this service would offer
                </p>
                <Textarea
                  required
                  value={formData.service_description}
                  onChange={(e) => setFormData({ ...formData, service_description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={5}
                  placeholder="Describe the service, who needs it, and what it provides..."
                />
              </div>

              <div>
                <Label className="text-white text-lg font-semibold">Justification</Label>
                <p className="text-slate-400 text-sm mb-3">Why is this service needed? How would it help citizens?</p>
                <Textarea
                  required
                  value={formData.justification}
                  onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  rows={4}
                  placeholder="Explain the need for this service and its potential impact..."
                />
              </div>

              <div className="pt-6 border-t border-slate-700">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Submit Service Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function ServiceRequestPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen"]}>
      <ServiceRequestContent />
    </ProtectedRoute>
  )
}
