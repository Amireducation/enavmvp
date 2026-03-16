'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Globe, Mail, Phone, MapPin, Users } from 'lucide-react'

interface BusinessDirectoryProps {
  searchQuery?: string
}

export function BusinessDirectory({ searchQuery }: BusinessDirectoryProps) {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      // Mock business directory data
      const mockBusinesses = [
        {
          id: '1',
          name: 'TechSoft Solutions',
          sector: 'Technology',
          employees: 150,
          description: 'Leading IT solutions and software development company',
          website: 'www.techsoft.et',
          email: 'contact@techsoft.et',
          phone: '+251-11-123-4567',
          location: 'Addis Ababa',
          verified: true,
          services: 'Web Development, Cloud Solutions',
        },
        {
          id: '2',
          name: 'GreenAgro Industries',
          sector: 'Agriculture',
          employees: 320,
          description: 'Agricultural products and organic farming solutions',
          website: 'www.greenagroet.com',
          email: 'info@greenagroet.com',
          phone: '+251-11-456-7890',
          location: 'Adama',
          verified: true,
          services: 'Farming Solutions, Organic Products',
        },
        {
          id: '3',
          name: 'BuildRight Construction',
          sector: 'Construction',
          employees: 280,
          description: 'Commercial and residential construction services',
          website: 'www.buildright.et',
          email: 'projects@buildright.et',
          phone: '+251-11-789-0123',
          location: 'Addis Ababa',
          verified: true,
          services: 'Construction, Project Management',
        },
      ]
      
      let filtered = mockBusinesses
      if (searchQuery) {
        filtered = mockBusinesses.filter(b => 
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.sector.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      setBusinesses(filtered)
    } catch (error) {
      console.error('Failed to fetch businesses:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading businesses...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {businesses.map((business) => (
        <Card key={business.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription>{business.description}</CardDescription>
              </div>
              {business.verified && (
                <Badge className="bg-green-100 text-green-800">Verified</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="outline">{business.sector}</Badge>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span>{business.employees} employees</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{business.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <a href={`mailto:${business.email}`} className="text-blue-600 hover:underline">
                  {business.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{business.phone}</span>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" size="sm">
                View Profile
              </Button>
              <Button className="flex-1" size="sm">
                Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
