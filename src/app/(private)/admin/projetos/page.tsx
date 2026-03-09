"use client";

import { useState } from "react";
import { useProjects } from "@/shared/context/projects-context";
import { KanbanBoard } from "@/shared/components";
import type { Project, ProjectStatus } from "@/shared/types";
import { STATUS_CONFIG, PRIORITY_CONFIG } from "@/shared/types";
import { formatDate } from "@/shared/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/components/ui/dialog";
import { Badge } from "@/src/shared/components/ui/badge";
import { Button } from "@/src/shared/components/ui/button";
import { ScrollArea } from "@/src/shared/components/ui/scroll-area";
import { Separator } from "@/src/shared/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { Calendar, FileText, Clock } from "lucide-react";
import { toast } from "sonner";

const ALL_COLUMNS: ProjectStatus[] = [
  "backlog",
  "todo",
  "in-progress",
  "review",
  "completed",
];

export default function AdminProjetosPage() {
  const { projects, moveProject, updateProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleMoveProject = (projectId: string, newStatus: ProjectStatus) => {
    moveProject(projectId, newStatus);
    toast.success("Status do projeto atualizado");
  };

  const handlePriorityChange = (projectId: string, priority: string) => {
    updateProject(projectId, { priority: priority as Project["priority"] });
    if (selectedProject?.id === projectId) {
      setSelectedProject({
        ...selectedProject,
        priority: priority as Project["priority"],
      });
    }
    toast.success("Prioridade atualizada");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os projetos do sistema
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {projects.length} projetos no total
        </div>
      </div>

      {/* Kanban Board - Admin pode arrastar todos */}
      <div className="rounded-lg border border-border bg-card/50 p-4">
        <KanbanBoard
          projects={projects}
          onProjectClick={setSelectedProject}
          onMoveProject={handleMoveProject}
          canDrag={true}
          visibleColumns={ALL_COLUMNS}
        />
      </div>

      {/* Modal de detalhes do projeto */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>Gerenciar projeto</DialogDescription>
          </DialogHeader>

          {selectedProject && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className={STATUS_CONFIG[selectedProject.status].color}
                  >
                    {STATUS_CONFIG[selectedProject.status].label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={PRIORITY_CONFIG[selectedProject.priority].color}
                  >
                    {PRIORITY_CONFIG[selectedProject.priority].label}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Descrição</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProject.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Data de Criação</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedProject.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedProject.estimatedDeadline && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Prazo Estimado</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedProject.estimatedDeadline)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Ações administrativas */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Alterar Prioridade</p>
                    <Select
                      value={selectedProject.priority}
                      onValueChange={(value) =>
                        handlePriorityChange(selectedProject.id, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Alterar Status</p>
                    <div className="flex flex-wrap gap-2">
                      {ALL_COLUMNS.filter(
                        (s) => s !== selectedProject.status
                      ).map((status) => (
                        <Button
                          key={status}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            handleMoveProject(selectedProject.id, status);
                            setSelectedProject({
                              ...selectedProject,
                              status,
                            });
                          }}
                        >
                          {STATUS_CONFIG[status].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
