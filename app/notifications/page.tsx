"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { LogOut, Bell, Check } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

function NotificationsContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get<Notification[]>("/notifications")
      setNotifications(Array.isArray(res) ? res : [])
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter((n) => !n.is_read).map((n) => apiClient.patch(`/notifications/${n.id}/read`)),
      )
      fetchNotifications()
    } catch (err) {
      console.error("Failed to mark all as read:", err)
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getNotificationIcon = (type: string) => {
    return <Bell className="w-5 h-5 text-amber-500" />
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()} className="text-white">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-amber-500 text-slate-900 rounded text-xs font-bold">{unreadCount} new</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={logout} className="text-white border-white bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {unreadCount > 0 && (
          <div className="mb-4 flex justify-end">
            <Button size="sm" onClick={markAllAsRead} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          </div>
        )}

        {loading ? (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-slate-400">Loading notifications...</p>
          </Card>
        ) : notifications.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <Card
                key={notif.id}
                className={`border-slate-700 p-4 transition-all ${
                  notif.is_read ? "bg-slate-800" : "bg-slate-800/80 border-l-4 border-l-amber-500"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-white font-semibold">{notif.title}</h3>
                      {!notif.is_read && (
                        <span className="px-2 py-0.5 bg-amber-500 text-slate-900 rounded text-xs font-bold flex-shrink-0">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mb-2">{notif.message}</p>
                    <p className="text-slate-500 text-xs">{new Date(notif.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    {!notif.is_read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notif.id)}
                        className="text-white"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <ProtectedRoute requiredRoles={["citizen", "employee", "admin", "partner"]}>
      <NotificationsContent />
    </ProtectedRoute>
  )
}
