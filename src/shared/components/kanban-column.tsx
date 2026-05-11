"use client";

import { useState } from "react";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG } from "@/shared/types";
import { ProjectCard } from "./project-card";

const STATUS_DOT_COLOR: Record<ProjectStatus, string> = {
  backlog: "bg-muted-foreground/50",
  todo: "bg-blue-500",
  "in-progress": "bg-green-500",
  review: "bg-yellow-500",
  completed: "bg-emerald-500",
};

interface KanbanColumnProps {
  status: ProjectStatus;
  projects: Project[];
  draggingProjectId?: string | null;
  onProjectClick?: (project: Project) => void;
  canDrag?: boolean;
  onDragStart?: (e: React.DragEvent, project: Project) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: ProjectStatus) => void;
}

export function KanbanColumn({
  status,
  projects,
  draggingProjectId,
  onProjectClick,
  canDrag = false,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const config = STATUS_CONFIG[status];
  const dotColor = STATUS_DOT_COLOR[status];

  return (
    <div
      className={[
        "flex flex-1 flex-col basis-60 min-w-60 rounded-lg transition-colors",
        isDragOver
          ? "bg-accent/40 ring-1 ring-border"
          : "bg-transparent",
      ].join(" ")}
      onDragOver={(e) => {
        onDragOver?.(e);
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        onDrop?.(e, status);
        setIsDragOver(false);
      }}
    >
      <div className="flex items-center justify-between px-1 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
          <h3 className="text-sm font-medium text-muted-foreground">
            {config.label}
          </h3>
          <span className="text-xs tabular-nums text-muted-foreground/70">
            {projects.length}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 py-1">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
            >
              <ProjectCard
                project={project}
                isDragging={draggingProjectId === project.id}
                onClick={() => onProjectClick?.(project)}
                draggable={canDrag}
                onDragStart={(e) => onDragStart?.(e, project)}
              />
            </div>
          ))}

          {projects.length === 0 && (
            <div className="flex h-20 items-center justify-center text-xs text-muted-foreground/50 select-none">
              Nenhum projeto
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
