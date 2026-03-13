'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/protected-route'
import { useAuth } from '@/components/auth-provider'
import { apiClient } from '@/lib/api-client'
import { PageContainer, PageLayout, PageLoading, PageError } from '@/components/page-templates'
import { StatsCard, ActionCard } from '@/components/dashboard-cards'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  Download,
} from 'lucide-react'

interface Application {
  id: string
  service_name: string
  tracking_number: string
  status: 'pending' | 'approved' | 'rejected' | 'in_progress'
  created_at: string
  updated_at: string
}

interface Service {
  id: string
  name: string
  category: string
  description: string
  processing_time: string
}

function CitizenDashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [recentServices, setRecentServices] = useState<Service[]>([])
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [appData, svcData] = await Promise.all([
          apiClient.get<{ applications: Application[] }>('/applications').catch(() => ({ applications: [] })),
          apiClient.get<{ services: Service[] }>('/services').catch(() => ({ services: [] })),
        ])

        const apps = appData.applications || []
        setApplications(apps)
        setRecentServices((svcData.services || []).slice(0, 5))

        // Calculate stats
        setStats({
          totalApplications: apps.length,
          pendingApplications: apps.filter(a => a.status === 'pending').length,
          approvedApplications: apps.filter(a => a.status === 'approved').length,
        })
      } catch (err) {
        console.error('Failed to fetch data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <PageLoading title="Loading your dashboard..." />
  if (error) return <PageError message={error} onRetry={() => window.location.reload()} />

  const filteredApplications = applications.filter(app =>
    app.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.tracking_number.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    approved: 'bg-emerald-100 text-emerald-800',
    rejected: 'bg-red-100 text-red-800',
  }

  const applicationColumns = [
    {
      key: 'service_name' as const,
      label: 'Service',
    },
    {
      key: 'tracking_number' as const,
      label: 'Tracking Number',
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (status: string) => (
        <Badge className={statusColors[status] || 'bg-gray-100 text-gray-800'}>
          {status.replace('_', ' ')}
        </Badge>
      ),
    },
    {
      key: 'created_at' as const,
      label: 'Submitted',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'id' as const,
      label: 'Actions',
      render: (id: string) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/citizen/applications/${id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageLayout
        title={`Welcome, ${user?.full_name || 'Citizen'}`}
        description="Manage your service applications and track their progress"
        actions={
          <Button
            onClick={() => router.push('/citizen/services')}
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        }
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatsCard
            icon={FileText}
            label="Total Applications"
            value={stats.totalApplications}
            description="All your submitted applications"
          />
          <StatsCard
            icon={Clock}
            label="Pending"
            value={stats.pendingApplications}
            description="Waiting for processing"
            trend={{ value: stats.pendingApplications > 0 ? 5 : 0, isPositive: false }}
          />
          <StatsCard
            icon={CheckCircle2}
            label="Approved"
            value={stats.approvedApplications}
            description="Successfully completed"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        {/* Applications Tab */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by service or tracking number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DataTable
              columns={applicationColumns}
              data={filteredApplications.filter(a => a.status !== 'rejected')}
              emptyMessage="No active applications. Start a new one!"
            />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <DataTable
              columns={applicationColumns}
              data={filteredApplications}
              emptyMessage="No applications found."
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <DataTable
              columns={applicationColumns}
              data={filteredApplications.filter(a => a.status === 'approved' || a.status === 'rejected')}
              emptyMessage="No completed applications."
            />
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-12 space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ActionCard
              title="Browse All Services"
              description="Explore available government services"
              icon={FileText}
              href="/citizen/services"
            />
            <ActionCard
              title="Download Documents"
              description="Get copies of your submitted documents"
              icon={Download}
              onClick={() => router.push('/citizen/documents')}
            />
          </div>
        </div>
      </PageLayout>
    </PageContainer>
  )
}

export default function CitizenPage() {
  return (
    <ProtectedRoute requiredRole="citizen">
      <CitizenDashboardContent />
    </ProtectedRoute>
  )
}
