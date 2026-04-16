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
import { Button } from "@/src/shared/components/ui/button";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import { Separator } from "@/src/shared/components/ui/separator";
import { Calendar, FileText, Clock, AlertTriangle, LayoutList } from "lucide-react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

const DEVELOPER_COLUMNS: ProjectStatus[] = [
  "todo",
  "in-progress",
  "review",
  "completed",
];

export default function DesenvolvedorDashboard() {
  const { user } = useAuth();
  const { projects, moveProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const assignedBacklog = projects.filter(
    (p) =>
      p.status === "backlog" &&
      user?.id != null &&
      p.developerId === user.id
  );

  const hasAssignedBacklog = assignedBacklog.length > 0;
  const visibleColumns: ProjectStatus[] = hasAssignedBacklog
    ? (["backlog", ...DEVELOPER_COLUMNS] as ProjectStatus[])
    : DEVELOPER_COLUMNS;

  const devProjects = [
    ...assignedBacklog,
    ...projects.filter((p) => p.status !== "backlog"),
  ];

  const stats = {
    assigned: projects.filter((p) => p.developerId === user?.id).length,
    inProgress: projects.filter(
      (p) => p.developerId === user?.id && p.status === "in-progress"
    ).length,
    review: projects.filter(
      (p) => p.developerId === user?.id && p.status === "review"
    ).length,
  };

  const handleMoveProject = (projectId: string, newStatus: ProjectStatus) => {
    const project = projects.find((p) => p.id === projectId);

    // Desenvolvedor não pode mover para/de backlog
    if (project?.status === "backlog" || newStatus === "backlog") {
      toast.error("Apenas administradores podem mover projetos do Backlog");
      return;
    }

    moveProject(projectId, newStatus);
    toast.success("Status do projeto atualizado");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Projetos</h1>
        <p className="text-muted-foreground">
          Gerencie e atualize o status dos projetos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Projetos Atribuídos</p>
          <p className="text-2xl font-bold">{stats.assigned}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
          <p className="text-2xl font-bold text-amber-500">{stats.inProgress}</p>
        </div>
        <div className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm text-muted-foreground">Em Revisão</p>
          <p className="text-2xl font-bold text-purple-500">{stats.review}</p>
        </div>
      </div>

      {/* Aviso */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500 text-sm">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        Arraste os cards entre as colunas para atualizar o status. A coluna
        Backlog mostra apenas projetos atribuídos a você; sair do Backlog
        (para Arquitetura etc.) continua sendo feito pelo administrador.
      </div>

      {/* Kanban Board - Desenvolvedor pode arrastar */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <KanbanBoard
          projects={devProjects}
          onProjectClick={setSelectedProject}
          onMoveProject={handleMoveProject}
          canDrag={true}
          visibleColumns={visibleColumns}
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
            <DialogDescription>Detalhes e ações do projeto</DialogDescription>
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
                </div>

                <Separator />

                {/* Link para especificação */}
                <Link
                  href={`/desenvolvedor/projetos/${selectedProject.id}/especificacao`}
                  onClick={() => setSelectedProject(null)}
                >
                  <Button variant="outline" className="w-full gap-2">
                    <LayoutList className="h-4 w-4" />
                    Ver especificação e registrar horas
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Button>
                </Link>

                <Separator />

                {/* Ações rápidas de status */}
                <div>
                  <p className="text-sm font-medium mb-2">Alterar status</p>
                  {selectedProject.status === "backlog" ? (
                    <p className="text-sm text-muted-foreground">
                      Projetos no backlog só avançam quando um administrador
                      alterar o status.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {visibleColumns
                        .filter((s) => s !== selectedProject.status)
                        .filter((s) => s !== "backlog")
                        .map((status) => (
                          <Button
                            key={status}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              handleMoveProject(selectedProject.id, status);
                              setSelectedProject({
                                ...selectedProject,
                                status,
                              });
                            }}
                          >
                            {STATUS_CONFIG[status].label}
                          </Button>
                        ))}
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
