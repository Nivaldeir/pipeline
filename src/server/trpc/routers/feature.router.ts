import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const featureRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const feature = await ctx.db.projectFeature.create({
        data: {
          projectId: input.projectId,
          name: input.name,
        },
      });

      await ctx.db.activityLog.create({
        data: {
          projectId: input.projectId,
          userId: ctx.userId,
          action: "Funcionalidade adicionada",
          details: feature.name,
        },
      });

      return feature;
    }),

  toggleComplete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const feature = await ctx.db.projectFeature.update({
        where: { id: input.id },
        data: {
          completedAt: input.completed ? new Date() : null,
        },
      });

      await ctx.db.activityLog.create({
        data: {
          projectId: feature.projectId,
          userId: ctx.userId,
          action: input.completed ? "Funcionalidade concluída" : "Funcionalidade reaberta",
          details: feature.name,
        },
      });

      return feature;
    }),
}
);

