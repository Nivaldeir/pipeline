"use client";

import { useAuth } from "@/shared/context/auth-context";
import { useProjects } from "@/shared/context/projects-context";
import { KanbanBoard } from "@/shared/components";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG } from "@/shared/types";
import { useModal } from "@/shared/context/modal-context";
import { ProjectDetailsModal } from "../admin/projetos/_components/project-details.modal";
import { User } from "lucide-react";

export default function ClienteDashboard() {
  const { user } = useAuth();
  const { projects } = useProjects();
  const { openModal } = useModal();

  const clientProjects = projects;

  const visibleColumns: ProjectStatus[] = ["backlog", "in-progress", "completed"];

  const stats = {
    total: clientProjects.length,
    backlog: clientProjects.filter((p) => p.status === "backlog").length,
    inProgress: clientProjects.filter((p) => p.status === "in-progress").length,
    completed: clientProjects.filter((p) => p.status === "completed").length,
  };

  const handleProjectClick = (project: Project) => {
    openModal(
      `project-details-${project.id}`,
      ProjectDetailsModal,
      { project },
      {
        size: "md",
        position: "center",
      }
    );
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
          onProjectClick={handleProjectClick}
          canDrag={false}
          visibleColumns={visibleColumns}
        />
      </div>
    </div>
  );
}
