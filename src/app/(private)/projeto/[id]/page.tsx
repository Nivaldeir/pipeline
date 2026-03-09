"use client";

import { use } from "react";
import { useProjects } from "@/shared/context/projects-context";
import { useAuth } from "@/shared/context/auth-context";
import { ProjectChat } from "@/shared/components/project-chat";
import { ProjectFiles } from "@/shared/components/project-files";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Progress } from "@/src/shared/components/ui/progress";
import { Separator } from "@/src/shared/components/ui/separator";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { ArrowLeft, Calendar, DollarSign, User, Building, Clock, FileText } from "lucide-react";
import Link from "next/link";

interface ProjetoPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjetoPage({ params }: ProjetoPageProps) {
  const { id } = use(params);
  const { projects } = useProjects();
  const { user } = useAuth();

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-bold text-foreground mb-2">Projeto não encontrado</h1>
        <p className="text-muted-foreground mb-4">O projeto que você procura não existe.</p>
        <Link href={user?.role === "admin" ? "/admin/projetos" : user?.role === "developer" ? "/desenvolvedor" : "/cliente"}>
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[project.status];
  const priorityConfig = PRIORITY_CONFIG[project.priority];

  // Calcular progresso baseado no status
  const progressMap = {
    backlog: 0,
    todo: 20,
    "in-progress": 50,
    review: 80,
    completed: 100,
  };
  const progress = progressMap[project.status];

  const backUrl = user?.role === "admin" ? "/admin/projetos" : user?.role === "developer" ? "/desenvolvedor" : "/cliente";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={backUrl}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{project.title}</h1>
          <p className="text-muted-foreground">Detalhes do projeto</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações do Projeto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações
                </span>
                <div className="flex gap-2">
                  <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                  <Badge variant="outline" className={priorityConfig.color}>
                    {priorityConfig.label}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Descrição</h4>
                <p className="text-foreground">{project.description}</p>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">{project.projectType}</p>
                  </div>
                </div>
                {project.estimatedDeadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Prazo Estimado</p>
                      <p className="text-sm font-medium">
                        {new Date(project.estimatedDeadline).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                {project.estimatedBudget && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Orçamento</p>
                      <p className="text-sm font-medium">
                        R$ {project.estimatedBudget.toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Criado em</p>
                    <p className="text-sm font-medium">
                      {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Chat */}
          <ProjectChat projectId={project.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Arquivos */}
          <ProjectFiles projectId={project.id} />
          {/* Equipe */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Equipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-emerald-400">JS</span>
                </div>
                <div>
                  <p className="text-sm font-medium">João Silva</p>
                  <p className="text-xs text-muted-foreground">Cliente</p>
                </div>
              </div>
              {project.developerId && (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-400">MS</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Maria Santos</p>
                    <p className="text-xs text-muted-foreground">Desenvolvedor</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Atividade Recente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="text-sm">Status alterado para <span className="font-medium">{statusConfig.label}</span></p>
                    <p className="text-xs text-muted-foreground">Há 2 horas</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted mt-2" />
                  <div>
                    <p className="text-sm">Novo comentário adicionado</p>
                    <p className="text-xs text-muted-foreground">Há 1 dia</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-muted mt-2" />
                  <div>
                    <p className="text-sm">Projeto criado</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
