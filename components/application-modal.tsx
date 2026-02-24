"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { FileUploadWidget } from "@/components/file-upload-widget"

interface ApplicationModalProps {
  isOpen: boolean
  serviceId: string
  serviceName: string
  applicationId?: string
  onClose: () => void
  onSuccess: () => void
}

export function ApplicationModal({ isOpen, serviceId, serviceName, applicationId, onClose, onSuccess }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    idNumber: "",
    additionalInfo: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await apiClient.post("/applications", {
        service_id: serviceId,
        submitted_data: formData,
      })

      setSuccess(true)
      setTimeout(() => {
        onClose()
        onSuccess()
        setFormData({ fullName: "", phone: "", idNumber: "", additionalInfo: "" })
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Apply for {serviceName}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Fill in the required information to submit your application.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 flex flex-col items-center gap-4">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
            <p className="text-white font-semibold text-center">Application Submitted!</p>
            <p className="text-slate-400 text-sm text-center">
              Your application has been successfully submitted. You can track it in "My Applications".
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div>
              <Label className="text-white">Full Name</Label>
              <Input
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                placeholder="Your full name"
              />
            </div>

            <div>
              <Label className="text-white">Phone Number</Label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                placeholder="+251 9XX XXX XXX"
              />
            </div>

            <div>
              <Label className="text-white">ID Number</Label>
              <Input
                required
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                placeholder="Your ID number"
              />
            </div>

            <div>
              <Label className="text-white">Additional Information</Label>
              <Textarea
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                className="mt-2 bg-slate-700 border-slate-600 text-white"
                placeholder="Any additional details..."
                rows={3}
              />
            </div>

            {applicationId && (
              <div>
                <Label className="text-white mb-2 block">Upload Required Documents</Label>
                <FileUploadWidget applicationId={applicationId} />
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 text-white border-slate-600 bg-transparent hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
