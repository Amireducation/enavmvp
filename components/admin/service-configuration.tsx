'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export function ServiceConfiguration() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // Mock service configuration data
      const mockServices = [
        {
          id: '1',
          name: 'Business Registration Certificate',
          category: 'Business Registration',
          fee: 500,
          processingDays: 5,
          status: 'active',
          onlineAvailable: true,
          requiresDocuments: true,
          requirements: 5,
        },
        {
          id: '2',
          name: 'TIN Registration',
          category: 'Tax Services',
          fee: 0,
          processingDays: 3,
          status: 'active',
          onlineAvailable: true,
          requiresDocuments: true,
          requirements: 3,
        },
        {
          id: '3',
          name: 'Trade License Renewal',
          category: 'Trade & Commerce',
          fee: 1000,
          processingDays: 7,
          status: 'active',
          onlineAvailable: true,
          requiresDocuments: true,
          requirements: 4,
        },
        {
          id: '4',
          name: 'Birth Certificate',
          category: 'Civil Registration',
          fee: 100,
          processingDays: 2,
          status: 'active',
          onlineAvailable: true,
          requiresDocuments: true,
          requirements: 2,
        },
      ]
      setServices(mockServices)
    } catch (error) {
      console.error('Failed to fetch services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading services...</div>
  }

  return (
    <div className="space-y-4">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Service Catalog</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-4">
                <div>
                  <h4 className="font-semibold text-sm">{service.name}</h4>
                  <p className="text-xs text-gray-600">{service.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Fee</p>
                  <p className="font-semibold">ETB {service.fee.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Processing</p>
                  <p className="font-semibold">{service.processingDays} days</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant={service.status === 'active' ? 'secondary' : 'destructive'} className="w-fit">
                    {service.status}
                  </Badge>
                  {service.onlineAvailable && (
                    <Badge variant="outline" className="w-fit text-xs">
                      Online Available
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 pb-4 border-b">
                <div className="text-xs">
                  <p className="text-gray-600">Requirements</p>
                  <p className="font-semibold">{service.requirements}</p>
                </div>
                <div className="text-xs">
                  <p className="text-gray-600">Documents Required</p>
                  <p className="font-semibold">{service.requiresDocuments ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
