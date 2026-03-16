'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, Users, FileText, Calendar } from 'lucide-react'

export function WorkspaceProjects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      // Mock data for G2G projects
      const mockProjects = [
        {
          id: '1',
          name: 'Integrated Service Delivery Initiative',
          description: 'Multi-ministry coordination for seamless citizen services',
          agencies: ['Finance Ministry', 'Trade Ministry', 'Civil Service'],
          status: 'active',
          startDate: '2024-01-15',
          targetDate: '2024-12-31',
          progress: 65,
        },
        {
          id: '2',
          name: 'Data Harmonization Project',
          description: 'Standardizing data formats across government agencies',
          agencies: ['Statistics Office', 'Finance Ministry', 'Planning Commission'],
          status: 'active',
          startDate: '2024-02-01',
          targetDate: '2024-09-30',
          progress: 45,
        },
      ]
      setProjects(mockProjects)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <Card key={project.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span>{project.agencies.length} Agencies Involved</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.agencies.map((agency) => (
                <Badge key={agency} variant="outline" className="text-xs">
                  {agency}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
