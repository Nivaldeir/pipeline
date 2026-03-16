"use client";

import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import type { Project } from "@/shared/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { formatDate } from "@/shared/utils";
import { Calendar } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

export function ProjectCard({
  project,
  onClick,
  draggable,
  onDragStart,
}: ProjectCardProps) {
  const priorityConfig = PRIORITY_CONFIG[project.priority];
  const statusConfig = STATUS_CONFIG[project.status];

  return (
    <Card
      className="cursor-pointer border border-border/70 bg-card/95 shadow-sm transition-all hover:border-primary/60 hover:shadow-md py-0"
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <CardContent className="space-y-3 p-3">
        {/* Título */}
        <div className="space-y-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {project.title}
          </p>
          {project.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {project.description}
            </p>
          )}
        </div>

        {/* Prioridade + data */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium ${priorityConfig.color}`}>
              <span>●</span>
              <span>{priorityConfig.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5">
          {project.projectType && (
            <Badge variant="secondary" className="text-[10px] font-medium">
              {project.projectType}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold uppercase ${statusConfig.color}`}
          >
            {statusConfig.label}
          </Badge>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
            {project.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* Ação principal */}
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-1 h-7 w-full justify-center text-[11px]"
        >
          Ver detalhes do projeto
        </Button>
      </CardContent>
    </Card>
  );
}
