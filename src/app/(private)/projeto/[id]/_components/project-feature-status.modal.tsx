"use client";

import type { ModalProps } from "@/shared/types/modal";
import { Button } from "@/src/shared/components/ui/button";
import { useProjectActions } from "../hooks/project.action";

interface FeatureStatusData {
  projectId: string;
  featureId: string;
  featureName: string;
  completedAt?: string | Date;
}

export function ProjectFeatureStatusModal({
  data,
  onClose,
}: ModalProps<FeatureStatusData>) {
  if (!data) return null;

  const { toggleFeatureMutation } = useProjectActions(data.projectId);
  const isCompleted = !!data.completedAt;

  return (
    <div className="w-full max-w-md space-y-4 p-4">
      <h2 className="text-lg font-semibold">
        {isCompleted ? "Reabrir funcionalidade" : "Concluir funcionalidade"}
      </h2>
      <p className="text-sm text-muted-foreground">{data.featureName}</p>
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
          className="cursor-pointer"
          onClick={async () => {
            await toggleFeatureMutation.mutateAsync({
              id: data.featureId,
              completed: !isCompleted,
            });
            onClose();
          }}
        >
          {isCompleted ? "Reabrir" : "Marcar como concluída"}
        </Button>
      </div>
    </div>
  );
}

