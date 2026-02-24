"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, UserPlus, Edit2, Trash2, Loader2, AlertCircle, CheckCircle2, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface User {
  id: string
  email: string
  role: string
  full_name?: string
  phone?: string
  created_at: string
}

interface UserFormData {
  email: string
  password?: string
  role: string
  full_name?: string
  phone?: string
}

function UserManagementContent() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    password: "",
    role: "citizen",
    full_name: "",
    phone: "",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<{ users: User[] }>("/users")
      setUsers(data.users || [])
      setFilteredUsers(data.users || [])
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load users" })
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    setEditingUser(null)
    setFormData({
      email: "",
      password: "",
      role: "citizen",
      full_name: "",
      phone: "",
    })
    setShowModal(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      role: user.role,
      full_name: user.full_name || "",
      phone: user.phone || "",
    })
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    try {
      if (editingUser) {
        await apiClient.put(`/users/${editingUser.id}`, formData)
        setMessage({ type: "success", text: "User updated successfully" })
      } else {
        await apiClient.post("/users", formData)
        setMessage({ type: "success", text: "User created successfully" })
      }
      setShowModal(false)
      fetchUsers()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Operation failed" })
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      await apiClient.delete(`/users/${userId}`)
      setMessage({ type: "success", text: "User deleted successfully" })
      fetchUsers()
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to delete user" })
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="text-white border-slate-600 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
          </div>
          <Button onClick={openCreateModal} className="bg-green-600 hover:bg-green-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex gap-3 ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/50"
                : "bg-red-500/10 border border-red-500/50"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <p className={message.type === "success" ? "text-green-300" : "text-red-300"}>{message.text}</p>
          </div>
        )}

        <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
            />
          </div>
        </Card>

        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
            <p className="text-slate-400">Loading users...</p>
          </Card>
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400">No users found</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-slate-800 border-slate-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.full_name || user.email}</p>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-slate-700 text-white text-sm rounded capitalize">{user.role}</span>
                    <span className="text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditModal(user)}
                        className="text-blue-400 border-blue-400 hover:bg-blue-400/10"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="text-red-400 border-red-400 hover:bg-red-400/10 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">{editingUser ? "Edit User" : "Create New User"}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="text-white border-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                    disabled={!!editingUser}
                  />
                </div>

                {!editingUser && (
                  <div>
                    <Label className="text-white">Password</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                )}

                <div>
                  <Label className="text-white">Role</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="citizen" className="text-white">
                        Citizen
                      </SelectItem>
                      <SelectItem value="employee" className="text-white">
                        Employee
                      </SelectItem>
                      <SelectItem value="admin" className="text-white">
                        Admin
                      </SelectItem>
                      <SelectItem value="partner" className="text-white">
                        Partner
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Full Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-white">Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    className="flex-1 text-white border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
                    {editingUser ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default function UserManagementPage() {
  return (
    <ProtectedRoute requiredRoles={["admin"]}>
      <UserManagementContent />
    </ProtectedRoute>
  )
}
