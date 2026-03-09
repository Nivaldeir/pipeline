import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const requestRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const requests = await ctx.db.projectRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return requests.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      company: r.company ?? undefined,
      projectType: r.projectType,
      description: r.description,
      estimatedDeadline: r.estimatedDeadline ?? undefined,
      estimatedBudget: r.estimatedBudget ?? undefined,
      createdAt: r.createdAt,
    }));
  }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(2),
        email: z.string().email(),
        company: z.string().optional(),
        projectType: z.string().min(1),
        description: z.string().min(10),
        estimatedDeadline: z.string().optional(),
        estimatedBudget: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const req = await ctx.db.projectRequest.create({
        data: {
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          projectType: input.projectType,
          description: input.description,
          estimatedDeadline: input.estimatedDeadline ?? null,
          estimatedBudget: input.estimatedBudget ?? null,
        },
      });
      return {
        id: req.id,
        name: req.name,
        email: req.email,
        company: req.company ?? undefined,
        projectType: req.projectType,
        description: req.description,
        estimatedDeadline: req.estimatedDeadline ?? undefined,
        estimatedBudget: req.estimatedBudget ?? undefined,
        createdAt: req.createdAt,
      };
    }),

  approve: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        developerId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const req = await ctx.db.projectRequest.findUnique({
        where: { id: input.requestId },
      });
      if (!req)
        throw new Error("Solicitação não encontrada");

      let client = await ctx.db.user.findFirst({
        where: { email: req.email, role: "CLIENT" },
      });
      if (!client) {
        client = await ctx.db.user.create({
          data: {
            name: req.name,
            email: req.email,
            role: "CLIENT",
          },
        });
      }

      const project = await ctx.db.project.create({
        data: {
          title: `${req.projectType} - ${req.company ?? req.name}`,
          description: req.description,
          type: "OUTRO",
          category: "OUTRO",
          status: "BACKLOG",
          priority: "MEDIUM",
          clientId: client.id,
          developerId: input.developerId ?? null,
          platform: req.projectType,
        },
      });

      await ctx.db.projectRequest.delete({ where: { id: input.requestId } });
      await ctx.db.activityLog.create({
        data: {
          projectId: project.id,
          userId: ctx.userId,
          action: "Projeto aprovado e criado a partir de solicitação",
        },
      });

      return { projectId: project.id };
    }),

  reject: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const req = await ctx.db.projectRequest.findUnique({
        where: { id: input.requestId },
      });
      if (!req)
        throw new Error("Solicitação não encontrada");
      await ctx.db.projectRequest.delete({ where: { id: input.requestId } });
      return { success: true };
    }),
});
