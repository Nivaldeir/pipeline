"use client";

import { Card, CardContent } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import type { Project } from "@/shared/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { formatDate } from "@/shared/utils";
import { Calendar, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-muted-foreground/50",
  medium: "bg-amber-400",
  high: "bg-red-500",
  urgent: "bg-red-600",
};

export function ProjectCard({
  project,
  onClick,
  draggable,
  isDragging = false,
  onDragStart,
}: ProjectCardProps) {
  const priorityConfig = PRIORITY_CONFIG[project.priority];
  const statusConfig = STATUS_CONFIG[project.status];

  return (
    <Card
      className={[
        "group relative cursor-pointer border border-border/60 bg-card shadow-sm",
        "transition-all duration-200 ease-out py-0",
        "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5",
        isDragging ? "card-dragging" : "",
      ].join(" ")}
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {/* Linha de prioridade no topo do card */}
      <div
        className={[
          "absolute top-0 left-4 right-4 h-px rounded-full transition-opacity duration-200",
          PRIORITY_DOT[project.priority] ?? "bg-muted-foreground/30",
          "opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      <CardContent className="space-y-2.5 p-3">
        {/* Título + descrição */}
        <div className="space-y-1 pr-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {project.title}
          </p>
          {project.description && (
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1">
          {project.projectType && (
            <Badge variant="secondary" className="text-[10px] font-medium h-4.5 px-1.5">
              {project.projectType}
            </Badge>
          )}
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold uppercase h-4.5 px-1.5 ${statusConfig.color}`}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Rodapé: prioridade + data + ID */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[project.priority] ?? "bg-muted-foreground/50"}`} />
            <span>{priorityConfig.label}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>
        </div>
      </CardContent>

      {/* Hover reveal — "Ver detalhes" desliza de baixo */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out px-3 pb-3">
        <div className="flex items-center justify-center gap-1.5 rounded-md bg-primary/90 py-1.5 text-[11px] font-semibold text-primary-foreground shadow backdrop-blur-sm">
          Ver detalhes
          <ArrowRight className="h-3 w-3" />
        </div>
      </div>

      {/* Espaço reservado para o hover reveal não cortar */}
      <div className="h-0 group-hover:h-8 transition-all duration-200" />
    </Card>
  );
}
