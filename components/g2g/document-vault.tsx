'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Share2, Lock } from 'lucide-react'

export function DocumentVault() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      // Mock document data
      const mockDocs = [
        {
          id: '1',
          name: 'Service Integration Framework v2.1',
          type: 'pdf',
          size: '2.4 MB',
          uploadedBy: 'Finance Ministry',
          uploadedDate: '2024-03-10',
          status: 'shared',
          versions: 3,
        },
        {
          id: '2',
          name: 'Data Standards Specification',
          type: 'docx',
          size: '1.8 MB',
          uploadedBy: 'Statistics Office',
          uploadedDate: '2024-03-05',
          status: 'confidential',
          versions: 1,
        },
        {
          id: '3',
          name: 'Budget Allocation Proposal',
          type: 'xlsx',
          size: '0.9 MB',
          uploadedBy: 'Planning Commission',
          uploadedDate: '2024-03-08',
          status: 'shared',
          versions: 2,
        },
      ]
      setDocuments(mockDocs)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading documents...</div>
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <FileText className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{doc.name}</h3>
                  <div className="flex flex-wrap gap-2 items-center mt-2 text-sm text-gray-600">
                    <span>{doc.uploadedBy}</span>
                    <span>•</span>
                    <span>{doc.uploadedDate}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>v{doc.versions}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={doc.status === 'confidential' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {doc.status === 'confidential' ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Confidential
                    </>
                  ) : (
                    'Shared'
                  )}
                </Badge>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
