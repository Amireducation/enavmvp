'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle2, AlertCircle, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Document {
  id: string
  fileName: string
  fileSize: number
  url: string
  documentType: string
  status: string
  createdAt: string
}

interface FileUploadWidgetProps {
  applicationId: string
  onUploadComplete?: (doc: Document) => void
}

const DOCUMENT_TYPES = [
  { value: 'identity', label: 'Identity Document' },
  { value: 'residence_proof', label: 'Residence Proof' },
  { value: 'business_plan', label: 'Business Plan' },
  { value: 'medical_report', label: 'Medical Report' },
  { value: 'educational_cert', label: 'Educational Certificate' },
  { value: 'other', label: 'Other' },
]

export function FileUploadWidget({ applicationId, onUploadComplete }: FileUploadWidgetProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [error, setError] = useState('')
  const [selectedType, setSelectedType] = useState('other')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB')
      return
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: PDF, JPEG, PNG, DOC, DOCX')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('application_id', applicationId)
      formData.append('document_type', selectedType)

      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      const newDoc: Document = {
        id: data.document.url,
        fileName: data.document.fileName,
        fileSize: data.document.size,
        url: data.document.url,
        documentType: selectedType,
        status: 'uploaded',
        createdAt: new Date().toISOString(),
      }

      setDocuments([newDoc, ...documents])
      onUploadComplete?.(newDoc)
    } catch (err) {
      setError('Upload failed. Please try again.')
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleDeleteDocument = async (url: string) => {
    try {
      const res = await fetch('/api/documents/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (res.ok) {
        setDocuments(documents.filter((d) => d.url !== url))
      } else {
        setError('Failed to delete document')
      }
    } catch (err) {
      setError('Delete failed')
      console.error(err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Document Type Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Document Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-background"
        >
          {DOCUMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Area */}
      <Card
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 text-center cursor-pointer transition ${dragActive ? 'border-primary bg-primary/5' : 'border-dashed'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />

        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="font-medium mb-1">Drag and drop your file here</p>
        <p className="text-sm text-muted-foreground mb-4">or</p>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
        >
          {uploading ? 'Uploading...' : 'Browse Files'}
        </Button>
        <p className="text-xs text-muted-foreground mt-4">Max 10MB • PDF, JPEG, PNG, DOC, DOCX</p>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Uploaded Documents</h4>
          {documents.map((doc) => (
            <Card key={doc.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <File className="w-4 h-4 flex-shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{doc.fileName}</p>
                  <p className="text-xs text-muted-foreground">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <button
                  onClick={() => handleDeleteDocument(doc.url)}
                  className="p-1 hover:bg-destructive/10 rounded-lg transition"
                >
                  <X className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
