"use client";

import { useState, useCallback } from "react";
import type { Project, ProjectStatus } from "@/shared/types";
import { KanbanColumn } from "./kanban-column";

const COLUMN_ORDER: ProjectStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "completed",
];

interface KanbanBoardProps {
  projects: Project[];
  onMoveProject?: (projectId: string, newStatus: ProjectStatus) => void;
  onProjectClick?: (project: Project) => void;
  canDrag?: boolean;
  visibleColumns?: ProjectStatus[];
}

export function KanbanBoard({
  projects,
  onMoveProject,
  onProjectClick,
  canDrag = false,
  visibleColumns = COLUMN_ORDER,
}: KanbanBoardProps) {
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent, project: Project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: ProjectStatus) => {
      e.preventDefault();
      if (draggedProject && draggedProject.status !== status) {
        onMoveProject?.(draggedProject.id, status);
      }
      setDraggedProject(null);
    },
    [draggedProject, onMoveProject]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedProject(null);
  }, []);

  const getProjectsByStatus = (status: ProjectStatus) =>
    projects.filter((p) => p.status === status);

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-4 h-[calc(100vh-200px)]"
      onDragEnd={handleDragEnd}
    >
      {visibleColumns.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          projects={getProjectsByStatus(status)}
          draggingProjectId={draggedProject?.id ?? null}
          onProjectClick={onProjectClick}
          canDrag={canDrag}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
