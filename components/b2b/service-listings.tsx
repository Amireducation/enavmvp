'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Clock } from 'lucide-react'

interface ServiceListingsProps {
  searchQuery?: string
}

export function ServiceListings({ searchQuery }: ServiceListingsProps) {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      // Mock service listings data
      const mockServices = [
        {
          id: '1',
          name: 'Custom Web Application Development',
          provider: 'TechSoft Solutions',
          category: 'IT Services',
          price: 'ETB 50,000 - 200,000',
          rating: 4.8,
          reviews: 24,
          deliveryTime: '4-12 weeks',
          description: 'Professional web application development services',
        },
        {
          id: '2',
          name: 'Organic Farming Consultation',
          provider: 'GreenAgro Industries',
          category: 'Agriculture',
          price: 'ETB 10,000 per session',
          rating: 4.6,
          reviews: 18,
          deliveryTime: 'On-site/Online',
          description: 'Expert consultation on organic farming methods',
        },
        {
          id: '3',
          name: 'Commercial Building Construction',
          provider: 'BuildRight Construction',
          category: 'Construction',
          price: 'Custom Quote',
          rating: 4.9,
          reviews: 31,
          deliveryTime: '3-6 months',
          description: 'Full-service construction management',
        },
      ]
      
      let filtered = mockServices
      if (searchQuery) {
        filtered = mockServices.filter(s =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setServices(filtered)
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
    <div className="grid gap-4">
      {services.map((service) => (
        <Card key={service.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline">{service.category}</Badge>
                  <span className="text-sm font-medium">{service.provider}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="text-right">
                  <p className="text-lg font-semibold text-blue-600">{service.price}</p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-500">({service.reviews} reviews)</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{service.deliveryTime}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 border-t pt-4">
              <Button variant="outline" className="flex-1">
                View Details
              </Button>
              <Button className="flex-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Request Service
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
