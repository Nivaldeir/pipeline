import { trpc } from "@/shared/trpc/client";

export function useProjectActions(projectId: string) {
  const utils = trpc.useUtils();

  const addFeatureMutation = trpc.feature.create.useMutation({
    onSuccess: () => {
      utils.project.byId.invalidate({ id: projectId });
    },
  });

  const toggleFeatureMutation = trpc.feature.toggleComplete.useMutation({
    onSuccess: () => {
      utils.project.byId.invalidate({ id: projectId });
    },
  });

  const updateProjectMutation = trpc.project.update.useMutation({
    onSuccess: () => {
      utils.project.byId.invalidate({ id: projectId });
      utils.project.list.invalidate();
    },
  });

  return {
    addFeatureMutation,
    toggleFeatureMutation,
    updateProjectMutation,
  };
}

