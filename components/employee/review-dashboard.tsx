import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle, ChevronRight, Filter, Download } from 'lucide-react';

export interface ReviewItem {
  id: string;
  requestId: string;
  citizenName: string;
  serviceName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedDate: string;
  priority: 'low' | 'normal' | 'high';
  assignedTo?: string;
}

export interface ReviewDashboardProps {
  onSelectRequest?: (requestId: string) => void;
  onStatusChange?: (requestId: string, status: string) => void;
}

export function ReviewDashboard({ onSelectRequest, onStatusChange }: ReviewDashboardProps) {
  const [requests, setRequests] = useState<ReviewItem[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ReviewItem[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  });

  // Mock data
  useEffect(() => {
    const mockRequests: ReviewItem[] = [
      {
        id: '1',
        requestId: 'SR-001',
        citizenName: 'Abebe Kebede',
        serviceName: 'Health Insurance Registration',
        status: 'pending',
        submittedDate: '2024-02-18',
        priority: 'high',
        assignedTo: 'Unassigned'
      },
      {
        id: '2',
        requestId: 'SR-002',
        citizenName: 'Almaz Getnet',
        serviceName: 'Business License',
        status: 'in_progress',
        submittedDate: '2024-02-16',
        priority: 'normal',
        assignedTo: 'You'
      },
      {
        id: '3',
        requestId: 'SR-003',
        citizenName: 'Girma Assefa',
        serviceName: 'Passport Application',
        status: 'pending',
        submittedDate: '2024-02-17',
        priority: 'normal',
        assignedTo: 'Unassigned'
      },
      {
        id: '4',
        requestId: 'SR-004',
        citizenName: 'Marta Tadesse',
        serviceName: 'Land Registration',
        status: 'in_progress',
        submittedDate: '2024-02-15',
        priority: 'low',
        assignedTo: 'You'
      },
      {
        id: '5',
        requestId: 'SR-005',
        citizenName: 'Solomon Yohannes',
        serviceName: 'Driving License',
        status: 'completed',
        submittedDate: '2024-02-10',
        priority: 'normal',
        assignedTo: 'You'
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);

    // Calculate stats
    const newStats = {
      pending: mockRequests.filter(r => r.status === 'pending').length,
      inProgress: mockRequests.filter(r => r.status === 'in_progress').length,
      completed: mockRequests.filter(r => r.status === 'completed').length,
      rejected: mockRequests.filter(r => r.status === 'rejected').length
    };
    setStats(newStats);
    setLoading(false);
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = requests;

    if (filterStatus) {
      filtered = filtered.filter(r => r.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter(r => r.priority === filterPriority);
    }

    setFilteredRequests(filtered);
  }, [filterStatus, filterPriority, requests]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 font-semibold';
      case 'normal':
        return 'text-orange-600';
      case 'low':
        return 'text-green-600';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Service Request Review</h1>
        <p className="text-muted-foreground">Manage and process citizen service requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{requests.length}</p>
            </div>
            <ChevronRight className="h-8 w-8 text-muted-foreground opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2 items-center">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="flex-1 flex gap-2 items-center">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="flex-1 px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="normal">Normal</option>
            <option value="low">Low</option>
          </select>
        </div>

        <button className="px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors flex items-center gap-2 text-sm">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No requests found</h3>
          <p className="text-muted-foreground">No service requests match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map(request => (
            <div
              key={request.id}
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => onSelectRequest?.(request.requestId)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="font-semibold text-foreground truncate">{request.citizenName}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 truncate">{request.serviceName}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${getStatusBadgeClass(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded bg-muted ${getPriorityClass(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className="px-2 py-1 rounded bg-muted text-muted-foreground">
                      {request.requestId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end text-right text-xs text-muted-foreground flex-shrink-0">
                  <p>{request.submittedDate}</p>
                  <p>{request.assignedTo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
