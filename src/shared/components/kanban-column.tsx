"use client";

import { Badge } from "@/src/shared/components/ui/badge";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG } from "@/shared/types";
import { ProjectCard } from "./project-card";

interface KanbanColumnProps {
  status: ProjectStatus;
  projects: Project[];
  onProjectClick?: (project: Project) => void;
  canDrag?: boolean;
  onDragStart?: (e: React.DragEvent, project: Project) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, status: ProjectStatus) => void;
}

export function KanbanColumn({
  status,
  projects,
  onProjectClick,
  canDrag = false,
  onDragStart,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div
      className="flex flex-col min-w-[280px] max-w-[320px] bg-secondary/30 rounded-lg"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop?.(e, status)}
    >
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color.replace('/20', '')}`} />
          <h3 className="font-medium text-sm">{config.label}</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {projects.length}
        </Badge>
      </div>

      <ScrollArea className="flex-1 p-2">
        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => onProjectClick?.(project)}
              draggable={canDrag}
              onDragStart={(e) => onDragStart?.(e, project)}
            />
          ))}

          {projects.length === 0 && (
            <div className="flex items-center justify-center h-24 text-xs text-muted-foreground">
              Nenhum projeto
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
