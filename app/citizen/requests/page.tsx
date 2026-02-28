import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, XCircle, AlertCircle, ArrowRight, Download } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Service Requests - Ethiopian Navigator',
  description: 'Track the status of your government service applications',
}

async function getMyRequests() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/requests`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    return data.requests || []
  } catch (error) {
    console.error('Error fetching requests:', error)
    return []
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'rejected':
      return <XCircle className="w-5 h-5 text-red-500" />
    case 'pending':
    case 'pending_clarification':
      return <Clock className="w-5 h-5 text-blue-500" />
    case 'issued':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />
    default:
      return <AlertCircle className="w-5 h-5 text-amber-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-green-500/20 text-green-200'
    case 'rejected':
      return 'bg-red-500/20 text-red-200'
    case 'pending':
      return 'bg-blue-500/20 text-blue-200'
    case 'pending_clarification':
      return 'bg-amber-500/20 text-amber-200'
    case 'issued':
      return 'bg-emerald-500/20 text-emerald-200'
    default:
      return 'bg-slate-500/20 text-slate-200'
  }
}

export default async function RequestTrackerPage() {
  const requests = await getMyRequests()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Service Requests</h1>
            <p className="text-slate-400">Track the status of all your government service applications</p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-slate-800 border border-slate-700 mb-6">
              <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({requests.filter((r: any) => r.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="approved">Approved ({requests.filter((r: any) => r.status === 'approved').length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejected ({requests.filter((r: any) => r.status === 'rejected').length})</TabsTrigger>
              <TabsTrigger value="issued">Issued ({requests.filter((r: any) => r.status === 'issued').length})</TabsTrigger>
            </TabsList>

            {/* All Requests */}
            <TabsContent value="all" className="space-y-4">
              {requests.length === 0 ? (
                <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                  <p className="text-slate-400 mb-4">No service requests yet</p>
                  <Link href="/citizen/services/browse">
                    <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                      Browse Services
                    </Button>
                  </Link>
                </Card>
              ) : (
                requests.map((request: any) => (
                  <Card key={request.id} className="bg-slate-800 border-slate-700 p-6 hover:border-amber-500/50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">{getStatusIcon(request.status)}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">{request.service_name}</h3>
                          <p className="text-sm text-slate-400 mb-3">ID: {request.id.slice(0, 8)}...</p>
                          {request.variation_name && (
                            <p className="text-sm text-slate-300">Variation: {request.variation_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-slate-400 mt-2">
                          {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            {/* Pending Requests */}
            <TabsContent value="pending" className="space-y-4">
              {requests
                .filter((r: any) => r.status === 'pending')
                .map((request: any) => (
                  <Card key={request.id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{request.service_name}</h3>
                        <p className="text-sm text-slate-400">Submitted {new Date(request.created_at).toLocaleDateString()}</p>
                      </div>
                      <Link href={`/citizen/requests/${request.id}`}>
                        <Button className="bg-blue-500 hover:bg-blue-600 gap-2">
                          View <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            {/* Approved Requests */}
            <TabsContent value="approved" className="space-y-4">
              {requests
                .filter((r: any) => r.status === 'approved')
                .map((request: any) => (
                  <Card key={request.id} className="bg-slate-800 border-slate-700 p-6 border-green-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{request.service_name}</h3>
                        <p className="text-sm text-green-400">✓ Approved on {new Date(request.updated_at).toLocaleDateString()}</p>
                      </div>
                      <Button className="bg-green-500 hover:bg-green-600 gap-2">
                        <Download className="w-4 h-4" /> Download Certificate
                      </Button>
                    </div>
                  </Card>
                ))}
            </TabsContent>

            {/* Rejected & Issued tabs... */}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
