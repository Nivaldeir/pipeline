"use client";

import { useState } from "react";
import { useAuth } from "@/shared/context/auth-context";
import { useProjects } from "@/shared/context/projects-context";
import { KanbanBoard } from "@/shared/components";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { formatDate } from "@/shared/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Badge } from "@/src/shared/components/ui/badge";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import { Separator } from "@/src/shared/components/ui/separator";
import { Calendar, User, FileText, Clock } from "lucide-react";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const clientProjects = projects;

  const stats = {
    total: clientProjects.length,
    backlog: clientProjects.filter((p) => p.status === "backlog").length,
    inProgress: clientProjects.filter((p) => p.status === "in-progress").length,
    completed: clientProjects.filter((p) => p.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Meus Projetos</h1>
        <p className="text-muted-foreground">
          Acompanhe o andamento dos seus projetos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Total de Projetos</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Backlog</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.backlog}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
          <p className="text-2xl font-bold text-amber-500">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Concluídos</p>
          <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
        </div>
      </div>

      {/* Kanban Board - Somente visualização para cliente */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <KanbanBoard
          projects={clientProjects}
          onProjectClick={setSelectedProject}
          canDrag={false}
        />
      </div>

      {/* Modal de detalhes do projeto */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>Detalhes do projeto</DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={STATUS_CONFIG[selectedProject.status].color}
                  >
                    {STATUS_CONFIG[selectedProject.status].label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={PRIORITY_CONFIG[selectedProject.priority].color}
                  >
                    {PRIORITY_CONFIG[selectedProject.priority].label}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Descrição</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data de Criação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedProject.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedProject.estimatedDeadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Prazo Estimado</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedProject.estimatedDeadline)}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedProject.developerId && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Desenvolvedor</p>
                        <p className="text-sm text-muted-foreground">
                          Desenvolvedor Atribuído
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
