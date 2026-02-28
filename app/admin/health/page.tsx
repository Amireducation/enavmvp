'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

interface HealthMetrics {
  database: {
    status: 'healthy' | 'warning' | 'critical'
    responseTime: number
    connectionCount: number
    maxConnections: number
  }
  api: {
    status: 'healthy' | 'warning' | 'critical'
    requestsPerMinute: number
    errorRate: number
    avgResponseTime: number
  }
  cache: {
    status: 'healthy' | 'warning' | 'critical'
    hitRate: number
    missRate: number
  }
  storage: {
    status: 'healthy' | 'warning' | 'critical'
    usedGB: number
    totalGB: number
    percentUsed: number
  }
  notifications: {
    queued: number
    processed: number
    failed: number
  }
  timestamp: string
  totalResponseTime: number
}

function StatusIcon({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="w-5 h-5 text-green-400" />
    case 'warning':
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    case 'critical':
      return <AlertCircle className="w-5 h-5 text-red-400" />
  }
}

function StatusBadge({ status }: { status: 'healthy' | 'warning' | 'critical' }) {
  const styles = {
    healthy: 'bg-green-500/20 text-green-200',
    warning: 'bg-yellow-500/20 text-yellow-200',
    critical: 'bg-red-500/20 text-red-200',
  }
  return <Badge className={styles[status]}>{status.toUpperCase()}</Badge>
}

export default function HealthDashboard() {
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/admin/health')
        if (!response.ok) throw new Error('Failed to fetch health metrics')
        const data = await response.json()
        setMetrics(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return (
      <div className="p-6 bg-slate-900 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Link href="/admin" className="text-amber-400 hover:text-amber-300">
              ← Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4">System Health Dashboard</h1>
          </div>
          <Card className="bg-red-500/10 border-red-500/30 p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="text-amber-400 hover:text-amber-300">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4">System Health Dashboard</h1>
          {metrics && (
            <p className="text-slate-400 mt-2">
              Last updated: {new Date(metrics.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <p className="text-slate-400 mt-4">Loading health metrics...</p>
          </div>
        ) : metrics ? (
          <div className="space-y-6">
            {/* Database Health */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <StatusIcon status={metrics.database.status} />
                  <h2 className="text-xl font-bold text-white">Database</h2>
                </div>
                <StatusBadge status={metrics.database.status} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Response Time</p>
                  <p className="text-2xl font-bold text-white">{metrics.database.responseTime}ms</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Connections</p>
                  <p className="text-2xl font-bold text-white">
                    {metrics.database.connectionCount}/{metrics.database.maxConnections}
                  </p>
                </div>
              </div>
            </Card>

            {/* API Health */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <StatusIcon status={metrics.api.status} />
                  <h2 className="text-xl font-bold text-white">API Performance</h2>
                </div>
                <StatusBadge status={metrics.api.status} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Requests/min</p>
                  <p className="text-2xl font-bold text-white">{metrics.api.requestsPerMinute}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Error Rate</p>
                  <p className="text-2xl font-bold text-white">{metrics.api.errorRate.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{metrics.api.avgResponseTime.toFixed(0)}ms</p>
                </div>
              </div>
            </Card>

            {/* Cache & Storage */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={metrics.cache.status} />
                    <h3 className="text-lg font-bold text-white">Cache</h3>
                  </div>
                  <StatusBadge status={metrics.cache.status} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hit Rate</span>
                    <span className="text-white font-semibold">{metrics.cache.hitRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Miss Rate</span>
                    <span className="text-white font-semibold">{metrics.cache.missRate}%</span>
                  </div>
                </div>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <StatusIcon status={metrics.storage.status} />
                    <h3 className="text-lg font-bold text-white">Storage</h3>
                  </div>
                  <StatusBadge status={metrics.storage.status} />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Usage</span>
                    <span className="text-white font-semibold">
                      {metrics.storage.usedGB.toFixed(1)}/{metrics.storage.totalGB}GB
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: `${metrics.storage.percentUsed}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Notifications Queue */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Notification Queue</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Queued</p>
                  <p className="text-2xl font-bold text-blue-400">{metrics.notifications.queued}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Processed</p>
                  <p className="text-2xl font-bold text-green-400">{metrics.notifications.processed}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Failed</p>
                  <p className="text-2xl font-bold text-red-400">{metrics.notifications.failed}</p>
                </div>
              </div>
            </Card>
          </div>
        ) : null}
      </div>
    </div>
  )
}
