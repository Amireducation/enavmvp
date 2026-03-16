'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import { ProtectedRoute } from '@/components/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { PageHeader } from '@/components/page-templates'
import { WorkspaceProjects } from '@/components/g2g/workspace-projects'
import { TaskBoard } from '@/components/g2g/task-board'
import { DocumentVault } from '@/components/g2g/document-vault'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function G2GWorkspace() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('projects')
  const [loading, setLoading] = useState(false)

  return (
    <ProtectedRoute requiredRoles={['admin', 'employee']}>
      <AppLayout>
        <div className="space-y-6">
          <PageHeader
            title="Inter-Agency Collaboration Workspace"
            description="Collaborate with other government agencies on joint initiatives and policy development"
            action={
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            }
          />

          <Tabs defaultValue="projects" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <WorkspaceProjects />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <TaskBoard />
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <DocumentVault />
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </ProtectedRoute>
  )
}
