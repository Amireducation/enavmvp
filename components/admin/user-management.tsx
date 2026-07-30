'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Edit, Lock, Unlock } from 'lucide-react'

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRole, setFilterRole] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      // Mock user data
      const mockUsers = [
        {
          id: '1',
          email: 'citizen@demo.enav',
          fullName: 'Demo Citizen User',
          role: 'citizen',
          status: 'active',
          created: '2024-01-15',
          lastLogin: '2024-03-15',
        },
        {
          id: '2',
          email: 'employee@demo.enav',
          fullName: 'Demo Employee User',
          role: 'employee',
          status: 'active',
          created: '2024-01-20',
          lastLogin: '2024-03-14',
        },
        {
          id: '3',
          email: 'partner@demo.enav',
          fullName: 'Demo Partner User',
          role: 'partner',
          status: 'active',
          created: '2024-02-01',
          lastLogin: '2024-03-13',
        },
        {
          id: '4',
          email: 'admin@demo.enav',
          fullName: 'Demo Admin User',
          role: 'admin',
          status: 'active',
          created: '2024-01-01',
          lastLogin: '2024-03-15',
        },
      ]
      setUsers(mockUsers)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesRole && matchesSearch
  })

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      employee: 'bg-blue-100 text-blue-800',
      partner: 'bg-green-100 text-green-800',
      citizen: 'bg-gray-100 text-gray-800',
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search users by email or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="partner">Partner</SelectItem>
            <SelectItem value="citizen">Citizen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    <Badge variant={user.status === 'active' ? 'secondary' : 'destructive'}>
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Joined: {user.created} • Last Login: {user.lastLogin}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
