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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os projetos do sistema
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {projects.length} projetos no total
        </div>
      </div>

      {/* Kanban Board - Admin pode arrastar todos */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <KanbanBoard
          projects={projects}
          onProjectClick={handleProjectClick}
          onMoveProject={handleMoveProject}
          canDrag={true}
          visibleColumns={ALL_COLUMNS}
        />
      </div>
    </div>
  );
}
