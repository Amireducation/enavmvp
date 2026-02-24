import React, { useState, useEffect } from 'react';
import { Users, Activity, TrendingUp, AlertCircle, BarChart3, PieChart, Calendar, Download } from 'lucide-react';

export interface DashboardMetrics {
  totalUsers: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  averageProcessingTime: number;
  completionRate: number;
  userGrowth: number;
  systemHealth: number;
}

export interface AdminDashboardProps {
  onExportData?: () => void;
  onViewReports?: () => void;
}

export function AdminDashboard({ onExportData, onViewReports }: AdminDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 2847,
    totalRequests: 5642,
    completedRequests: 4521,
    pendingRequests: 1121,
    averageProcessingTime: 5.8,
    completionRate: 80.2,
    userGrowth: 12.5,
    systemHealth: 99.2
  });

  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [serviceStats, setServiceStats] = useState([
    { name: 'Health Insurance', requests: 1250, completed: 1050, pending: 200 },
    { name: 'Business License', requests: 890, completed: 650, pending: 240 },
    { name: 'Passport', requests: 1520, completed: 1420, pending: 100 },
    { name: 'Land Registration', requests: 560, completed: 380, pending: 180 },
    { name: 'Scholarship', requests: 450, completed: 420, pending: 30 }
  ]);

  const [userStats, setUserStats] = useState({
    citizens: 2100,
    employees: 420,
    partners: 327,
    newUsersThisMonth: 342
  });

  const MetricCard = ({ icon: Icon, label, value, unit = '', trend }: any) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <p className="text-3xl font-bold text-foreground">
            {value.toLocaleString()}{unit}
          </p>
          {trend && (
            <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and analytics</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="yearly">This year</option>
          </select>

          <button
            onClick={onExportData}
            className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Users}
          label="Total Users"
          value={metrics.totalUsers}
          trend={metrics.userGrowth}
        />
        <MetricCard
          icon={Activity}
          label="Total Requests"
          value={metrics.totalRequests}
          trend={8.3}
        />
        <MetricCard
          icon={TrendingUp}
          label="Completion Rate"
          value={metrics.completionRate}
          unit="%"
          trend={5.2}
        />
        <MetricCard
          icon={AlertCircle}
          label="System Health"
          value={metrics.systemHealth}
          unit="%"
          trend={0.5}
        />
      </div>

      {/* Request Status Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Request Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">Completed</span>
                  <span className="text-sm text-muted-foreground">
                    {metrics.completedRequests} ({((metrics.completedRequests / metrics.totalRequests) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(metrics.completedRequests / metrics.totalRequests) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">Pending</span>
                  <span className="text-sm text-muted-foreground">
                    {metrics.pendingRequests} ({((metrics.pendingRequests / metrics.totalRequests) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(metrics.pendingRequests / metrics.totalRequests) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-muted rounded-md">
              <span className="text-sm text-foreground">Average Processing Time</span>
              <span className="font-semibold text-foreground">{metrics.averageProcessingTime} days</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-md">
              <span className="text-sm text-foreground">Completion Rate</span>
              <span className="font-semibold text-green-600">{metrics.completionRate}%</span>
            </div>
            <button
              onClick={onViewReports}
              className="w-full mt-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors text-sm font-medium"
            >
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Service Performance</h2>
        <div className="space-y-4">
          {serviceStats.map((service, idx) => (
            <div key={idx} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground">{service.name}</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                  {service.completed}/{service.requests}
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">Overall Progress</p>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(service.completed / service.requests) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Completed: {service.completed}</span>
                <span>Pending: {service.pending}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* User Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Breakdown</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span className="text-sm text-foreground">Citizens</span>
              <span className="font-semibold text-foreground">{userStats.citizens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span className="text-sm text-foreground">Employees</span>
              <span className="font-semibold text-foreground">{userStats.employees.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded-md">
              <span className="text-sm text-foreground">Partners</span>
              <span className="font-semibold text-foreground">{userStats.partners.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-primary bg-primary/5 rounded-md">
              <span className="text-sm text-foreground font-medium">New This Month</span>
              <span className="font-semibold text-primary">{userStats.newUsersThisMonth.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Alerts</h2>
          <div className="space-y-2">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">High Request Volume</p>
                <p className="text-xs text-yellow-800">250 requests pending review</p>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">System Maintenance</p>
                <p className="text-xs text-blue-800">Scheduled for 2024-02-25</p>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex gap-3">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">All Systems Operational</p>
                <p className="text-xs text-green-800">No critical issues detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
