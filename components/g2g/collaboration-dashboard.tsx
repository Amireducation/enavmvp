'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Clock, AlertCircle, FileText, Plus, Users, Send } from 'lucide-react';

interface G2GWorkflow {
  id: string;
  workflowType: string;
  fromAgency: string;
  toAgency: string;
  serviceId?: string;
  description: string;
  priority: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export function G2GCollaborationDashboard() {
  const [workflows, setWorkflows] = useState<G2GWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    workflowType: '',
    toAgency: '',
    serviceId: '',
    description: '',
    priority: 'normal'
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const response = await fetch('/api/g2g/workflows');
      if (response.ok) {
        const data = await response.json();
        setWorkflows(data.workflows || []);
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/g2g/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setWorkflows([data.workflow, ...workflows]);
        setShowCreateDialog(false);
        setFormData({
          workflowType: '',
          toAgency: '',
          serviceId: '',
          description: '',
          priority: 'normal'
        });
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const handleApproveWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/g2g/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', comments: '' })
      });

      if (response.ok) {
        fetchWorkflows();
      }
    } catch (error) {
      console.error('Error approving workflow:', error);
    }
  };

  const handleRejectWorkflow = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/g2g/workflows/${workflowId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', comments: 'Rejected' })
      });

      if (response.ok) {
        fetchWorkflows();
      }
    } catch (error) {
      console.error('Error rejecting workflow:', error);
    }
  };

  const filteredWorkflows = workflows.filter(w =>
    filterStatus === 'all' || w.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'pending_review':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'normal':
        return 'bg-blue-100 text-blue-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Government-to-Government Collaboration</h2>
          <p className="text-gray-600 mt-1">Manage inter-agency workflows and approvals</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Initiate a new inter-agency collaboration workflow
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateWorkflow} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workflow Type</label>
                <Select value={formData.workflowType} onValueChange={(value) =>
                  setFormData({ ...formData, workflowType: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workflow type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document_approval">Document Approval</SelectItem>
                    <SelectItem value="service_request">Service Request</SelectItem>
                    <SelectItem value="data_sharing">Data Sharing</SelectItem>
                    <SelectItem value="joint_initiative">Joint Initiative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Target Agency</label>
                <Input
                  placeholder="Enter target agency name"
                  value={formData.toAgency}
                  onChange={(e) => setFormData({ ...formData, toAgency: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe the workflow..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="w-4 h-4" />
                  Create Workflow
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{workflows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {workflows.filter(w => w.status === 'pending_review').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {workflows.filter(w => w.status === 'approved').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {workflows.filter(w => w.status === 'rejected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilterStatus('all')}>All</TabsTrigger>
          <TabsTrigger value="pending_review" onClick={() => setFilterStatus('pending_review')}>Pending</TabsTrigger>
          <TabsTrigger value="approved" onClick={() => setFilterStatus('approved')}>Approved</TabsTrigger>
          <TabsTrigger value="rejected" onClick={() => setFilterStatus('rejected')}>Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="space-y-4 mt-4">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Loading workflows...</p>
            </Card>
          ) : filteredWorkflows.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No workflows found</p>
            </Card>
          ) : (
            filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getStatusIcon(workflow.status)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{workflow.workflowType}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          From: <span className="font-medium">{workflow.fromAgency}</span> To: <span className="font-medium">{workflow.toAgency}</span>
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getPriorityColor(workflow.priority)}>
                        {workflow.priority}
                      </Badge>
                      <Badge variant="outline">
                        {workflow.status === 'pending_review' ? 'Pending Review' :
                          workflow.status === 'approved' ? 'Approved' :
                          workflow.status === 'rejected' ? 'Rejected' : workflow.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {workflow.status === 'pending_review' && (
                  <CardContent className="border-t pt-4 flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectWorkflow(workflow.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApproveWorkflow(workflow.id)}
                    >
                      Approve
                    </Button>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
