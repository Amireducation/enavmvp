'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/page-templates'
import { BusinessDirectory } from '@/components/b2b/business-directory'
import { ServiceListings } from '@/components/b2b/service-listings'
import { InquirySystem } from '@/components/b2b/inquiry-system'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function B2BMarketplace() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('directory')

  return (
    <ProtectedRoute requiredRoles={['partner', 'admin']}>
      <AppLayout>
        <div className="space-y-6">
          <PageHeader
            title="B2B Marketplace"
            description="Connect with businesses, discover services, and collaborate with partners"
          />

          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search businesses, services, or partners..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="directory" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="directory">Business Directory</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>

            <TabsContent value="directory" className="space-y-4">
              <BusinessDirectory searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              <ServiceListings searchQuery={searchQuery} />
            </TabsContent>

            <TabsContent value="inquiries" className="space-y-4">
              <InquirySystem />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
