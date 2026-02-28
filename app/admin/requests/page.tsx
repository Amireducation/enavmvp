import { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Clock, CheckCircle, UserCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Request Queue - Admin Dashboard',
  description: 'Manage and approve service requests',
}

async function getRequestQueue() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/admin/requests/queue?status=pending`, {
      headers: {
        'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
      },
    })
    if (!res.ok) throw new Error('Failed to fetch')
    return await res.json()
  } catch (error) {
    console.error('Error fetching queue:', error)
    return { requests: [], summary: {} }
  }
}

export default async function AdminRequestQueuePage() {
  const { requests, summary } = await getRequestQueue()

  const breached = requests.filter((r: any) => (r.days_pending || 0) > 10)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Request Queue</h1>
          <p className="text-slate-400">Manage pending service applications</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-500/10 border-blue-500/30 p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-sm text-slate-400">Total Pending</p>
                <p className="text-2xl font-bold text-white">{summary.total || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30 p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-sm text-slate-400">SLA Breached</p>
                <p className="text-2xl font-bold text-amber-300">{summary.breached || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600 p-6">
            <div className="flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-sm text-slate-400">Avg Days Pending</p>
                <p className="text-2xl font-bold text-white">{(summary.avgDaysPending || 0).toFixed(1)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-green-500/10 border-green-500/30 p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-sm text-slate-400">On Track</p>
                <p className="text-2xl font-bold text-green-300">{(summary.total || 0) - (summary.breached || 0)}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Request List */}
        <Card className="bg-slate-800 border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700 bg-slate-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Applicant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Service</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Days Pending</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {requests.map((request: any) => (
                  <tr key={request.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-white">{request.full_name}</p>
                        <p className="text-xs text-slate-400">{request.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white">{request.service_name}</td>
                    <td className="px-6 py-4 text-slate-400">{new Date(request.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${(request.days_pending || 0) > 10 ? 'text-red-400' : 'text-green-400'}`}>
                        {(request.days_pending || 0).toFixed(0)} days
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-blue-500/20 text-blue-200">{request.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/requests/${request.id}`}>
                        <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
