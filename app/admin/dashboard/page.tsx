'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/page-templates'
import { AnalyticsDashboard } from '@/components/admin/analytics-dashboard'
import { UserManagement } from '@/components/admin/user-management'
import { ServiceConfiguration } from '@/components/admin/service-configuration'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AdminDashboard() {
  const { user } = useAuth()

  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <AppLayout>
        <div className="space-y-6">
          <PageHeader
            title="Admin Dashboard"
            description="Manage system users, services, analytics, and configuration"
          />

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <UserManagement />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServiceConfiguration />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
