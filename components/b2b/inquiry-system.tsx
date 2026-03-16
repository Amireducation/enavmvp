'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Mail, Phone, Calendar } from 'lucide-react'

export function InquirySystem() {
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      // Mock inquiry data
      const mockInquiries = [
        {
          id: '1',
          from: 'ABC Trading Company',
          subject: 'Bulk Software License Purchase',
          message: 'Interested in enterprise software licenses for 50+ users',
          date: '2024-03-15',
          status: 'pending',
          priority: 'high',
        },
        {
          id: '2',
          from: 'XYZ Agriculture Cooperative',
          subject: 'Partnership for Organic Certification',
          message: 'Looking to partner for organic farming certification program',
          date: '2024-03-14',
          status: 'responded',
          priority: 'medium',
        },
        {
          id: '3',
          from: 'BuildNext Ltd',
          subject: 'Construction Project Consultation',
          message: 'Need consultation for upcoming infrastructure project',
          date: '2024-03-13',
          status: 'pending',
          priority: 'medium',
        },
      ]
      setInquiries(mockInquiries)
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'responded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
  }

  if (loading) {
    return <div className="text-center py-8">Loading inquiries...</div>
  }

  return (
    <div className="space-y-4">
      {inquiries.map((inquiry) => (
        <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-semibold text-lg">{inquiry.subject}</h3>
                <p className="text-sm text-gray-600">From: {inquiry.from}</p>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(inquiry.status)}>
                  {inquiry.status}
                </Badge>
                <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'secondary'}>
                  {inquiry.priority}
                </Badge>
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{inquiry.message}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{inquiry.date}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Mail className="w-4 h-4" />
                Email Reply
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="w-4 h-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
