'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export function TaskBoard() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      // Mock task data
      const mockTasks = [
        {
          id: '1',
          title: 'Draft service integration framework',
          status: 'completed',
          priority: 'high',
          assignee: 'Finance Ministry',
          dueDate: '2024-03-15',
          description: 'Create unified framework for service integration',
        },
        {
          id: '2',
          title: 'Review data harmonization standards',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Statistics Office',
          dueDate: '2024-03-20',
          description: 'Review and approve proposed data standards',
        },
        {
          id: '3',
          title: 'Stakeholder consultation round',
          status: 'pending',
          priority: 'medium',
          assignee: 'Planning Commission',
          dueDate: '2024-04-01',
          description: 'Conduct stakeholder consultation meetings',
        },
      ]
      setTasks(mockTasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return null
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading tasks...</div>
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-semibold">{task.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="text-xs">{task.assignee}</Badge>
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {task.priority}
                  </Badge>
                  <span className="text-xs text-gray-500">Due: {task.dueDate}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Update
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
