import { trpc } from "@/shared/trpc/client";

export function useProject(id: string) {
  const { data: projectDetails } = trpc.project.byId.useQuery({ id });
  const { data: activityLogs = [] } = trpc.activity.byProject.useQuery({
    projectId: id,
  });
  const { data: developers = [] } = trpc.user.listDevelopers.useQuery(
    undefined,
    {
      enabled: true,
    }
  );

  return {
    projectDetails,
    activityLogs,
    developers,
  };
}