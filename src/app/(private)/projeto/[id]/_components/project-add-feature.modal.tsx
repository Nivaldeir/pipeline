"use client";

import { useState } from "react";
import type { ModalProps } from "@/shared/types/modal";
import { Button } from "@/src/shared/components/ui/button";
import { Input } from "@/src/shared/components/ui/input";
import { useProjectActions } from "../hooks/project.action";

interface AddFeatureData {
  projectId: string;
}

export function ProjectAddFeatureModal({
  data,
  onClose,
}: ModalProps<AddFeatureData>) {
  const [name, setName] = useState("");

  if (!data) return null;

  const { addFeatureMutation } = useProjectActions(data.projectId);

  return (
    <div className="w-full max-w-md space-y-4 p-4">
      <h2 className="text-lg font-semibold">Adicionar funcionalidade</h2>
      <p className="text-sm text-muted-foreground">
        Descreva a funcionalidade que será desenvolvida neste projeto.
      </p>
      <Input
        placeholder="Ex: Cadastro de clientes, Dashboard financeiro..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          className="cursor-pointer"
          type="button"
          onClick={() => {
            setName("");
            onClose();
          }}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="cursor-pointer"
          onClick={async () => {
            const trimmed = name.trim();
            if (!trimmed) return;
            await addFeatureMutation.mutateAsync({
              projectId: data.projectId,
              name: trimmed,
            });
            setName("");
            onClose();
          }}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}

