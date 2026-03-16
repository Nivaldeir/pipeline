"use client";

import { use, useState } from "react";
import { useProjects } from "@/shared/context/projects-context";
import { useAuth } from "@/shared/context/auth-context";
import { ProjectChat } from "@/shared/components/project-chat";
import { ProjectFiles } from "@/shared/components/project-files";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/card";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { Progress } from "@/src/shared/components/ui/progress";
import { Separator } from "@/src/shared/components/ui/separator";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  FileText,
  Target,
  Users,
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react";
import Link from "next/link";
import { useModal } from "@/shared/context/modal-context";
import {
  ProjectAddFeatureModal,
  ProjectFeatureStatusModal,
  ProjectAssignDeveloperModal,
} from "./_components/project-modals";
import { useProjectActions } from "./hooks/project.action";
import { useProject } from "./hooks/project.hook";

interface ProjetoPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjetoPage({ params }: ProjetoPageProps) {
  const { id } = use(params);
  const { projects } = useProjects();
  const { user } = useAuth();
  const { projectDetails, activityLogs, developers } = useProject(id);
  const { addFeatureMutation, toggleFeatureMutation, updateProjectMutation } = useProjectActions(id);
  const { openModal } = useModal();

  const [selectedFeature, setSelectedFeature] = useState<
    { id: string; name: string; completedAt?: Date | string } | null
  >(null);

  const project = projects.find((p) => p.id === id) ?? (projectDetails as any);

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

  const statusConfig = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
  const priorityConfig = PRIORITY_CONFIG[project.priority as keyof typeof PRIORITY_CONFIG];

  // Calcular progresso baseado nas funcionalidades concluídas (fallback para status)
  const featureList: Array<{ completedAt?: Date | string }> =
    Array.isArray((projectDetails as any)?.features) ? (projectDetails as any).features : [];
  const totalFeatures = featureList.length;
  const completedFeatures = featureList.filter((f) => f.completedAt).length;

  const progress =
    totalFeatures > 0
      ? Math.round((completedFeatures / totalFeatures) * 100)
      : (() => {
          const progressMap = {
            backlog: 0,
            todo: 20,
            "in-progress": 50,
            review: 80,
            completed: 100,
          };
          return progressMap[project.status as keyof typeof progressMap];
        })();

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

              {/* Público, usuários e urgência */}
              {(project.targetAudience || project.expectedUsers || project.urgency) && (
                <>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-3">
                    {project.targetAudience && (
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-xs text-muted-foreground">Público-alvo</p>
                          <p className="text-sm font-medium">{project.targetAudience}</p>
                        </div>
                      </div>
                    )}
                    {project.expectedUsers && (
                      <div className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-xs text-muted-foreground">Usuários esperados</p>
                          <p className="text-sm font-medium">{project.expectedUsers}</p>
                        </div>
                      </div>
                    )}
                    {project.urgency && (
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground mt-1" />
                        <div>
                          <p className="text-xs text-muted-foreground">Urgência</p>
                          <p className="text-sm font-medium capitalize">{project.urgency}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Funcionalidades / Features */}
              {Array.isArray((projectDetails as any)?.features) &&
                (projectDetails as any).features.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Funcionalidades principais
                        </h4>
                        {user?.role === "admin" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openModal(
                                `project-add-feature-${project.id}`,
                                ProjectAddFeatureModal,
                                { projectId: project.id },
                                { size: "md", position: "center" }
                              )
                            }
                          >
                            Adicionar
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(projectDetails as any).features.map(
                          (feature: {
                            id: string;
                            name: string;
                            completedAt?: string | Date;
                          }) => (
                            <div
                              key={feature.id}
                              className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1"
                            >
                              <span className="text-xs font-medium">
                                {feature.name}
                              </span>
                              {(user?.role === "admin" ||
                                user?.role === "developer") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => {
                                    setSelectedFeature(feature);
                                    openModal(
                                      `project-feature-status-${feature.id}`,
                                      ProjectFeatureStatusModal,
                                      {
                                        projectId: project.id,
                                        featureId: feature.id,
                                        featureName: feature.name,
                                        completedAt: feature.completedAt,
                                      },
                                      { size: "sm", position: "center" }
                                    );
                                  }}
                                >
                                  {feature.completedAt ? (
                                    <CheckSquare className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Square className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </Button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                {totalFeatures > 0 && (
                  <p className="mb-1 text-xs text-muted-foreground">
                    {completedFeatures} de {totalFeatures} funcionalidades concluídas
                  </p>
                )}
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
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Equipe
                </span>
                {user?.role === "admin" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openModal(
                        `project-assign-dev-${project.id}`,
                        ProjectAssignDeveloperModal,
                        { projectId: project.id },
                        { size: "md", position: "center" }
                      );
                    }}
                  >
                    Definir responsável
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.developerId ? (
                <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
                  <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-400">
                      DEV
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {(projectDetails as any)?.developer?.name ?? "Desenvolvedor atribuído"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(projectDetails as any)?.developer?.email ?? ""}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum desenvolvedor atribuído ainda.
                </p>
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
              {activityLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma atividade registrada ainda para este projeto.
                </p>
              ) : (
                <ScrollArea className="max-h-56 pr-1 overflow-x-auto">
                  <div className="space-y-3">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-3">
                        <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm break-words">
                            <span className="font-medium">{log.action}</span>
                            {log.details && (
                              <>
                                {" "}
                                <span className="text-muted-foreground">• {log.details}</span>
                              </>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.createdAt).toLocaleString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
