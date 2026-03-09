"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import { Avatar, AvatarFallback } from "@/src/shared/components/ui/avatar";
import type { Project } from "@/shared/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { formatDate, getInitials } from "@/shared/utils";
import { Calendar, User } from "lucide-react";

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
      className="cursor-pointer transition-all hover:ring-1 hover:ring-primary/50 bg-card"
      onClick={onClick}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-tight">
            {project.title}
          </CardTitle>
          <Badge
            variant="secondary"
            className={`text-xs shrink-0 ${priorityConfig.color}`}
          >
            {priorityConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(project.createdAt)}</span>
          </div>

          {project.developerId && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <Badge variant="outline" className={`text-xs ${statusConfig.color}`}>
          {statusConfig.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
