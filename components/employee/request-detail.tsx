import React, { useState } from 'react';
import { ChevronDown, Send, FileText, Clock, CheckCircle2, X } from 'lucide-react';

export interface WorkflowLog {
  timestamp: string;
  action: string;
  actor: string;
  notes: string;
}

export interface RequestDetailProps {
  requestId: string;
  citizenName: string;
  email: string;
  serviceName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  submittedDate: string;
  documents: { name: string; size: string }[];
  workflowLogs: WorkflowLog[];
  onStatusUpdate?: (newStatus: string, notes: string) => void;
  onClose?: () => void;
}

export function RequestDetail({
  requestId,
  citizenName,
  email,
  serviceName,
  description,
  status,
  submittedDate,
  documents,
  workflowLogs,
  onStatusUpdate,
  onClose
}: RequestDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  const handleStatusUpdate = async () => {
    if (!notes.trim()) {
      alert('Please add notes before updating status');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onStatusUpdate?.(selectedStatus, notes);
      setNotes('');
      setShowStatusDropdown(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'created':
        return <FileText className="h-4 w-4" />;
      case 'status_updated':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'assigned':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">{requestId}</h2>
            <p className="text-sm text-muted-foreground">{serviceName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Citizen Information */}
          <div className="border-b border-border pb-6">
            <h3 className="font-semibold text-foreground mb-4">Citizen Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Name</p>
                <p className="text-foreground font-medium">{citizenName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Email</p>
                <p className="text-foreground font-medium">{email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Submitted</p>
                <p className="text-foreground font-medium">{submittedDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase">Current Status</p>
                <p className={`text-sm px-2 py-1 rounded inline-block font-medium ${getStatusColor(status)}`}>
                  {status.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Request Description */}
          <div className="border-b border-border pb-6">
            <h3 className="font-semibold text-foreground mb-3">Request Description</h3>
            <p className="text-sm text-foreground bg-muted p-4 rounded-md leading-relaxed">
              {description}
            </p>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <div className="border-b border-border pb-6">
              <h3 className="font-semibold text-foreground mb-3">Attached Documents</h3>
              <div className="space-y-2">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-primary hover:underline text-xs flex-shrink-0">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update */}
          <div className="border-b border-border pb-6">
            <h3 className="font-semibold text-foreground mb-4">Update Status</h3>

            <div className="relative mb-4">
              <button
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground text-left flex justify-between items-center hover:border-primary transition-colors"
              >
                <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(selectedStatus)}`}>
                  {selectedStatus.replace('_', ' ')}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {showStatusDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-md shadow-lg z-10">
                  {['pending', 'in_progress', 'completed', 'rejected'].map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStatus(s as any);
                        setShowStatusDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-muted transition-colors text-sm ${
                        selectedStatus === s ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`}
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this status update..."
                rows={3}
                className="w-full p-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>

            <button
              onClick={handleStatusUpdate}
              disabled={isSubmitting}
              className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? 'Updating...' : 'Update Status'}
            </button>
          </div>

          {/* Workflow History */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Activity History</h3>
            <div className="space-y-3">
              {workflowLogs.map((log, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 pt-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {getActionIcon(log.action)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground capitalize">
                      {log.action.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.actor}</p>
                    <p className="text-sm text-foreground mt-1">{log.notes}</p>
                    <p className="text-xs text-muted-foreground mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
