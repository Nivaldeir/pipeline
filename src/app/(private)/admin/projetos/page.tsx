"use client";

import { useProjects } from "@/shared/context/projects-context";
import { KanbanBoard } from "@/shared/components";
import type { Project, ProjectStatus } from "@/shared/types";
import { useModal } from "@/shared/context/modal-context";
import { toast } from "sonner";
import { ProjectDetailsModal } from "./_components/project-details.modal";

const ALL_COLUMNS: ProjectStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "completed",
];

export default function AdminProjetosPage() {
  const { projects, moveProject } = useProjects();
  const { openModal } = useModal();

  const handleMoveProject = (projectId: string, newStatus: ProjectStatus) => {
    moveProject(projectId, newStatus);
    toast.success("Status do projeto atualizado");
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
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projetos</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os projetos do sistema
          </p>
        </div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {projects.length}{" "}
          {projects.length === 1 ? "projeto" : "projetos"}
        </p>
      </header>

      <KanbanBoard
        projects={projects}
        onProjectClick={handleProjectClick}
        onMoveProject={handleMoveProject}
        canDrag={true}
        visibleColumns={ALL_COLUMNS}
      />
    </div>
  );
}
