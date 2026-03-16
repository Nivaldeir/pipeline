"use client";

import { useProjects } from "@/shared/context/projects-context";
import { STATUS_CONFIG } from "@/shared/types";
import type { ProjectStatus } from "@/shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Progress } from "@/src/shared/components/ui/progress";
import {
  FolderKanban,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";

const STATUS_ORDER: ProjectStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "completed",
];

const STATUS_LABELS: Record<ProjectStatus, string> = {
  backlog: "Backlog",
  todo: "Arquitetura",
  "in-progress": "Em Andamento",
  review: "Revisão",
  completed: "Concluído",
};

export default function AdminDashboard() {
  const { projects, requests } = useProjects();

  const stats = {
    total: projects.length,
    backlog: projects.filter((p) => p.status === "backlog").length,
    inProgress: projects.filter((p) => p.status === "in-progress").length,
    review: projects.filter((p) => p.status === "review").length,
    completed: projects.filter((p) => p.status === "completed").length,
    pendingRequests: requests.length,
    highPriority: projects.filter((p) => p.priority === "high" || p.priority === "urgent").length,
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const totalMax = Math.max(stats.total, 1);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Visão geral dos projetos e métricas
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">
                {stats.pendingRequests} pendentes
              </p>
            </div>
            <FolderKanban className="h-8 w-8 text-muted-foreground/50" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Em Desenvolvimento</p>
              <p className="text-xl font-bold text-amber-500">{stats.inProgress}</p>
              <p className="text-xs text-muted-foreground">{stats.review} em revisão</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500/50" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Concluídos</p>
              <p className="text-xl font-bold text-emerald-500">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">{completionRate}% conclusão</p>
            </div>
            <CheckCircle className="h-8 w-8 text-emerald-500/50" />
          </CardContent>
        </Card>
        <Card className="bg-card">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Alta Prioridade</p>
              <p className="text-xl font-bold text-destructive">{stats.highPriority}</p>
              <p className="text-xs text-muted-foreground">requerem atenção</p>
            </div>
            <AlertCircle className="h-8 w-8 text-destructive/50" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {STATUS_ORDER.map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs">{STATUS_LABELS[status]}</span>
                  <Progress
                    value={(count / totalMax) * 100}
                    className="h-1.5 flex-1"
                  />
                  <span className="w-6 shrink-0 text-right text-xs text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1.5">
              {projects.slice(0, 5).map((project) => {
                const config = STATUS_CONFIG[project.status] ?? {
                  label: project.status,
                  color: "bg-muted text-muted-foreground",
                };
                return (
                  <div
                    key={project.id}
                    className="flex items-center justify-between gap-2 rounded-md bg-secondary/30 px-2.5 py-1.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{project.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {project.projectType}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 text-xs px-1.5 py-0.5 rounded ${config.color}`}
                    >
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
