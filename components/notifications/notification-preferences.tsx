'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Clock, Save, AlertCircle } from 'lucide-react';

interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  emailFrequency: 'immediate' | 'daily' | 'weekly';
  applicationUpdates: boolean;
  systemAlerts: boolean;
  marketingEmails: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  notificationTypes: {
    [key: string]: boolean;
  };
}

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    userId: '',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    emailFrequency: 'immediate',
    applicationUpdates: true,
    systemAlerts: true,
    marketingEmails: false,
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '08:00',
    },
    notificationTypes: {
      applicationStatus: true,
      paymentConfirmation: true,
      documentRequired: true,
      serviceNews: true,
      promotions: false,
      reminders: true,
      g2gUpdates: true,
      partnerUpdates: true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences');
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleChannel = (channel: keyof NotificationPreferences) => {
    setPreferences({
      ...preferences,
      [channel]: !preferences[channel],
    });
  };

  const toggleNotificationType = (type: string) => {
    setPreferences({
      ...preferences,
      notificationTypes: {
        ...preferences.notificationTypes,
        [type]: !preferences.notificationTypes[type],
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Notification Preferences</h2>
        <p className="text-gray-600 mt-1">Manage how and when you receive notifications</p>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="channels" className="gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Channels</span>
          </TabsTrigger>
          <TabsTrigger value="types" className="gap-2">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">Types</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
        </TabsList>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>Choose how you'd like to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div>
                    <Label className="font-medium cursor-pointer">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive important updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={() => toggleChannel('emailNotifications')}
                />
              </div>

              {/* SMS */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <div>
                    <Label className="font-medium cursor-pointer">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive urgent updates via SMS</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={() => toggleChannel('smsNotifications')}
                />
              </div>

              {/* Push */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-500" />
                  <div>
                    <Label className="font-medium cursor-pointer">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive real-time alerts in your browser</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={() => toggleChannel('pushNotifications')}
                />
              </div>

              {/* Email Frequency */}
              {preferences.emailNotifications && (
                <div className="p-4 border rounded-lg bg-gray-50">
                  <Label className="font-medium mb-2 block">Email Frequency</Label>
                  <Select value={preferences.emailFrequency} onValueChange={(value: any) =>
                    setPreferences({ ...preferences, emailFrequency: value })
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Send immediately</SelectItem>
                      <SelectItem value="daily">Daily digest</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Types Tab */}
        <TabsContent value="types" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Types</CardTitle>
              <CardDescription>Select which types of notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(preferences.notificationTypes).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                  <Label className="font-medium capitalize cursor-pointer">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    checked={enabled}
                    onCheckedChange={() => toggleNotificationType(type)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiet Hours</CardTitle>
              <CardDescription>Pause notifications during specific times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="font-medium">Enable Quiet Hours</Label>
                  <p className="text-sm text-gray-600">No notifications during this time</p>
                </div>
                <Switch
                  checked={preferences.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    setPreferences({
                      ...preferences,
                      quietHours: { ...preferences.quietHours, enabled: checked },
                    })
                  }
                />
              </div>

              {preferences.quietHours.enabled && (
                <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Start Time</Label>
                      <Input
                        type="time"
                        value={preferences.quietHours.startTime}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            quietHours: {
                              ...preferences.quietHours,
                              startTime: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-sm">End Time</Label>
                      <Input
                        type="time"
                        value={preferences.quietHours.endTime}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            quietHours: {
                              ...preferences.quietHours,
                              endTime: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700">
                      Critical alerts will still reach you during quiet hours
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Section */}
      <div className="flex gap-2 justify-end">
        {saved && (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Preferences saved successfully
          </Badge>
        )}
        <Button onClick={handleSavePreferences} disabled={saving} className="gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
