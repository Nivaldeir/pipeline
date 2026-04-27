"use client";

import { useState } from "react";
import { Badge } from "@/src/shared/components/ui/badge";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG } from "@/shared/types";
import { ProjectCard } from "./project-card";

const STATUS_BAR_COLOR: Record<ProjectStatus, string> = {
  backlog: "bg-muted-foreground/40",
  todo: "bg-blue-500",
  "in-progress": "bg-green-500",
  review: "bg-yellow-500",
  completed: "bg-emerald-500",
};

const STATUS_GLOW: Record<ProjectStatus, string> = {
  backlog: "shadow-muted-foreground/10",
  todo: "shadow-blue-500/20",
  "in-progress": "shadow-green-500/20",
  review: "shadow-yellow-500/20",
  completed: "shadow-emerald-500/20",
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
  const barColor = STATUS_BAR_COLOR[status];
  const glowColor = STATUS_GLOW[status];

  return (
    <div
      className={[
        "flex flex-col min-w-70 max-w-[320px] rounded-xl border border-border/60 bg-secondary/20 transition-all duration-200",
        isDragOver
          ? `kanban-drop-active shadow-lg ${glowColor}`
          : "shadow-sm hover:shadow-md",
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
      {/* Barra colorida no topo */}
      <div className={`h-1 w-full rounded-t-xl ${barColor} transition-opacity duration-200 ${isDragOver ? "opacity-100" : "opacity-60"}`} />

      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm tracking-tight">{config.label}</h3>
        </div>
        <Badge
          variant="secondary"
          className="text-xs tabular-nums font-mono h-5 min-w-[1.5rem] justify-center"
        >
          {projects.length}
        </Badge>
      </div>

      <div className="h-px bg-border/50 mx-3" />

      <ScrollArea className="flex-1 p-2">
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
            <div className="flex flex-col items-center justify-center h-24 gap-1.5 text-xs text-muted-foreground/60 select-none">
              <div className={`w-6 h-0.5 rounded-full ${barColor} opacity-30`} />
              <span>Nenhum projeto</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
