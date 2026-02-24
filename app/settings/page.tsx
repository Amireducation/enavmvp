"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, User, Lock, Bell, Globe, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ProtectedRoute } from "@/components/protected-route"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

interface Profile {
  full_name?: string
  phone?: string
  date_of_birth?: string
  address?: string
  city?: string
  region?: string
  language_preference?: string
  profile_picture_url?: string
  notification_preferences?: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

function SettingsContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile>({})
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await apiClient.get<{ profile: Profile }>("/profile")
      setProfile(data.profile || {})
    } catch (err) {
      console.error("Failed to fetch profile:", err)
    }
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await apiClient.put("/profile", profile)
      setMessage({ type: "success", text: "Profile updated successfully" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile" })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (passwords.new.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setLoading(true)

    try {
      await apiClient.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      })
      setMessage({ type: "success", text: "Password changed successfully" })
      setPasswords({ current: "", new: "", confirm: "" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to change password" })
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setLoading(true)
    setMessage(null)

    try {
      await apiClient.patch("/profile/notifications", {
        preferences: profile.notification_preferences,
      })
      setMessage({ type: "success", text: "Notification preferences updated" })
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update preferences" })
    } finally {
      setLoading(false)
    }
  }

  const getBackLink = () => {
    const roleMap: Record<string, string> = {
      citizen: "/citizen",
      employee: "/employee",
      admin: "/admin",
      partner: "/partner",
    }
    return roleMap[user?.role || "citizen"] || "/"
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-700 bg-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={getBackLink()}>
              <Button variant="outline" size="sm" className="text-white border-slate-600 bg-transparent">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          </div>
          <span className="text-slate-300 text-sm">{user?.email}</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="profile" className="text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white">
              <Lock className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="text-white">
              <Globe className="w-4 h-4 mr-2" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Personal Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Full Name</Label>
                    <Input
                      value={profile.full_name || ""}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Phone Number</Label>
                    <Input
                      value={profile.phone || ""}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="+251..."
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-white">Address</Label>
                  <Input
                    value={profile.address || ""}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    placeholder="Street address"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">City</Label>
                    <Input
                      value={profile.city || ""}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Region</Label>
                    <Input
                      value={profile.region || ""}
                      onChange={(e) => setProfile({ ...profile, region: e.target.value })}
                      className="mt-2 bg-slate-700 border-slate-600 text-white"
                      placeholder="Region"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label className="text-white">Current Password</Label>
                  <Input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white">New Password</Label>
                  <Input
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <Label className="text-white">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="mt-2 bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-700 rounded">
                  <div>
                    <p className="text-white font-semibold">Email Notifications</p>
                    <p className="text-slate-400 text-sm">Receive updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notification_preferences?.email || false}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        notification_preferences: {
                          ...profile.notification_preferences,
                          email: e.target.checked,
                          sms: profile.notification_preferences?.sms || false,
                          push: profile.notification_preferences?.push || false,
                        },
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700 rounded">
                  <div>
                    <p className="text-white font-semibold">SMS Notifications</p>
                    <p className="text-slate-400 text-sm">Receive updates via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notification_preferences?.sms || false}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        notification_preferences: {
                          email: profile.notification_preferences?.email || false,
                          sms: e.target.checked,
                          push: profile.notification_preferences?.push || false,
                        },
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-700 rounded">
                  <div>
                    <p className="text-white font-semibold">Push Notifications</p>
                    <p className="text-slate-400 text-sm">Receive browser notifications</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.notification_preferences?.push || false}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        notification_preferences: {
                          email: profile.notification_preferences?.email || false,
                          sms: profile.notification_preferences?.sms || false,
                          push: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5"
                  />
                </div>

                <Button
                  onClick={handleNotificationUpdate}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-lg font-bold text-white mb-6">Language & Region</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Preferred Language</Label>
                  <Select
                    value={profile.language_preference || "en"}
                    onValueChange={(value) => setProfile({ ...profile, language_preference: value })}
                  >
                    <SelectTrigger className="mt-2 bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="en" className="text-white">
                        English
                      </SelectItem>
                      <SelectItem value="am" className="text-white">
                        Amharic (አማርኛ)
                      </SelectItem>
                      <SelectItem value="or" className="text-white">
                        Oromo (Afaan Oromoo)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
                >
                  Save Language Preference
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  )
}
