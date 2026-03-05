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
  status: string
  preferred_language?: string
  city?: string
  region?: string
  address?: string
  avatar_url?: string
  email_verified?: boolean
  last_login_at?: string
  created_at: string
  updated_at?: string
}

interface UserFormData {
  email: string
  password?: string
  role: string
  full_name?: string
  phone?: string
  status?: string
  preferred_language?: string
  city?: string
  region?: string
  address?: string
}

interface LoginHistory {
  id: string
  user_id: string
  status: string
  ip_address: string
  user_agent: string
  created_at: string
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
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let filtered = users
    
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.phone?.includes(searchQuery),
      )
    }
    
    if (roleFilter !== "all") {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((u) => u.status === statusFilter)
    }
    
    setFilteredUsers(filtered)
  }, [searchQuery, users, roleFilter, statusFilter])

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
      status: "active",
      preferred_language: "en",
      city: "",
      region: "",
      address: "",
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
      status: user.status || "active",
      preferred_language: user.preferred_language || "en",
      city: user.city || "",
      region: user.region || "",
      address: user.address || "",
    })
    setShowModal(true)
  }
  
  const viewUserDetails = async (user: User) => {
    setSelectedUser(user)
    setShowDetailsModal(true)
    setLoadingHistory(true)
    try {
      const history = await apiClient.get<LoginHistory[]>(`/users/${user.id}/login-history`)
      setLoginHistory(Array.isArray(history) ? history : [])
    } catch (err) {
      console.error("Failed to fetch login history:", err)
      setLoginHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/users/${userId}/status`, { status: newStatus })
      setMessage({ type: "success", text: `User status changed to ${newStatus}` })
      fetchUsers()
    } catch (err) {
      setMessage({ type: "error", text: "Failed to change status" })
    }
  }
  
  const handleResetPassword = async (userId: string) => {
    if (!confirm("Send password reset email to this user?")) return
    try {
      await apiClient.post(`/users/${userId}/reset-password`)
      setMessage({ type: "success", text: "Password reset email sent" })
    } catch (err) {
      setMessage({ type: "error", text: "Failed to send password reset" })
    }
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
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
              <Input
                placeholder="Search by email, name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Roles</SelectItem>
                <SelectItem value="citizen" className="text-white">Citizens</SelectItem>
                <SelectItem value="employee" className="text-white">Employees</SelectItem>
                <SelectItem value="admin" className="text-white">Admins</SelectItem>
                <SelectItem value="partner" className="text-white">Partners</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="active" className="text-white">Active</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="suspended" className="text-white">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
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
              <Card key={user.id} className="bg-slate-800 border-slate-700 p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-lg flex-shrink-0">
                      {(user.full_name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{user.full_name || "No Name"}</p>
                      <p className="text-slate-400 text-sm truncate">{user.email}</p>
                      {user.phone && <p className="text-slate-500 text-xs">{user.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      user.role === "admin" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                      user.role === "employee" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                      user.role === "partner" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                      "bg-slate-600/50 text-slate-300 border border-slate-500/30"
                    }`}>{user.role}</span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                      user.status === "active" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                      user.status === "pending" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" :
                      "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}>{user.status || "active"}</span>
                    <div className="text-right hidden sm:block">
                      <p className="text-slate-500 text-xs">Joined</p>
                      <p className="text-slate-400 text-sm">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    {user.last_login_at && (
                      <div className="text-right hidden md:block">
                        <p className="text-slate-500 text-xs">Last Login</p>
                        <p className="text-slate-400 text-sm">{new Date(user.last_login_at).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => viewUserDetails(user)}
                      className="text-slate-300 border-slate-600 hover:bg-slate-700"
                    >
                      View
                    </Button>
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

                {editingUser && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="active" className="text-white">Active</SelectItem>
                          <SelectItem value="pending" className="text-white">Pending</SelectItem>
                          <SelectItem value="suspended" className="text-white">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Language</Label>
                      <Select value={formData.preferred_language} onValueChange={(value) => setFormData({ ...formData, preferred_language: value })}>
                        <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="en" className="text-white">English</SelectItem>
                          <SelectItem value="am" className="text-white">Amharic</SelectItem>
                          <SelectItem value="or" className="text-white">Oromiffa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">City</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Region</Label>
                    <Input
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="Region"
                    />
                  </div>
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

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">User Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white border-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center font-bold text-slate-900 text-2xl">
                  {(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{selectedUser.full_name || "No Name"}</h4>
                  <p className="text-slate-400">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      selectedUser.role === "admin" ? "bg-purple-500/20 text-purple-300" :
                      selectedUser.role === "employee" ? "bg-blue-500/20 text-blue-300" :
                      selectedUser.role === "partner" ? "bg-amber-500/20 text-amber-300" :
                      "bg-slate-600/50 text-slate-300"
                    }`}>{selectedUser.role}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded capitalize ${
                      selectedUser.status === "active" ? "bg-green-500/20 text-green-300" :
                      selectedUser.status === "pending" ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-red-500/20 text-red-300"
                    }`}>{selectedUser.status || "active"}</span>
                    {selectedUser.email_verified && (
                      <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/20 text-green-300">
                        <CheckCircle2 className="w-3 h-3 inline mr-1" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Details Grid */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white">{selectedUser.phone || "Not provided"}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Preferred Language</p>
                  <p className="text-white capitalize">{selectedUser.preferred_language || "English"}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Location</p>
                  <p className="text-white">{[selectedUser.city, selectedUser.region].filter(Boolean).join(", ") || "Not provided"}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Address</p>
                  <p className="text-white">{selectedUser.address || "Not provided"}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Joined</p>
                  <p className="text-white">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Last Login</p>
                  <p className="text-white">{selectedUser.last_login_at ? new Date(selectedUser.last_login_at).toLocaleString() : "Never"}</p>
                </div>
              </div>

              {/* Login History */}
              <div className="border-t border-slate-700 pt-4">
                <h4 className="text-lg font-semibold text-white mb-4">Login History</h4>
                {loadingHistory ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-amber-500 mx-auto" />
                  </div>
                ) : loginHistory.length === 0 ? (
                  <p className="text-slate-400 text-center py-4">No login history found</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {loginHistory.slice(0, 10).map((login) => (
                      <div key={login.id} className="bg-slate-700/50 rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{login.ip_address}</p>
                          <p className="text-slate-400 text-xs truncate max-w-xs">{login.user_agent}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-0.5 text-xs rounded ${
                            login.status === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                          }`}>{login.status}</span>
                          <p className="text-slate-400 text-xs mt-1">{new Date(login.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={() => handleResetPassword(selectedUser.id)}
                  className="flex-1 text-amber-400 border-amber-400 hover:bg-amber-400/10"
                >
                  Reset Password
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailsModal(false)
                    openEditModal(selectedUser)
                  }}
                  className="flex-1 text-blue-400 border-blue-400 hover:bg-blue-400/10"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                {selectedUser.status === "active" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedUser.id, "suspended")}
                    className="flex-1 text-red-400 border-red-400 hover:bg-red-400/10"
                  >
                    Suspend
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange(selectedUser.id, "active")}
                    className="flex-1 text-green-400 border-green-400 hover:bg-green-400/10"
                  >
                    Activate
                  </Button>
                )}
              </div>
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
