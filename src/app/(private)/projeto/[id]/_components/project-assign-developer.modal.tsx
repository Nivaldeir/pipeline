"use client";

import { useState } from "react";
import type { ModalProps } from "@/shared/types/modal";
import { Button } from "@/src/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";
import { useProjectActions } from "../hooks/project.action";
import { useProject } from "../hooks/project.hook";

interface AssignDeveloperData {
  projectId: string;
}

export function ProjectAssignDeveloperModal({
  data,
  onClose,
}: ModalProps<AssignDeveloperData>) {
  if (!data) return null;

  const { developers } = useProject(data.projectId);
  const { updateProjectMutation } = useProjectActions(data.projectId);
  const [selectedDevId, setSelectedDevId] = useState<string | undefined>();

  return (
    <div className="w-full max-w-md space-y-4 p-4">
      <h2 className="text-lg font-semibold">Definir desenvolvedor responsável</h2>
      <p className="text-sm text-muted-foreground">
        Selecione quem será o responsável técnico por este projeto.
      </p>

      {developers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum desenvolvedor cadastrado ou disponível no momento.
        </p>
      ) : (
        <Select
          value={selectedDevId ?? ""}
          onValueChange={(value) => setSelectedDevId(value || undefined)}
        >
          <SelectTrigger className="cursor-pointer w-full">
            <SelectValue placeholder="Selecione um desenvolvedor" className="cursor-pointer w-full" />
          </SelectTrigger>
          <SelectContent>
            {developers.map((dev) => (
              <SelectItem key={dev.id} value={dev.id} className="cursor-pointer w-full">
                {dev.name} ({dev.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          type="button"
          className="cursor-pointer"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          disabled={!selectedDevId}
          className="cursor-pointer"
          onClick={async () => {
            if (!selectedDevId) return;
            await updateProjectMutation.mutateAsync({
              id: data.projectId,
              developerId: selectedDevId,
            });
            onClose();
          }}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}

