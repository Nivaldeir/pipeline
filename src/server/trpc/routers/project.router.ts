import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { toFrontendStatus, toPrismaStatus } from "../mappers";
import type { FrontendProjectStatus } from "../mappers";

const projectStatusSchema = z.enum([
  "backlog",
  "todo",
  "in-progress",
  "review",
  "completed",
  "cancelled",
]);

export const projectRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          clientId: z.string().optional(),
          developerId: z.string().optional(),
          status: projectStatusSchema.optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input?.clientId) where.clientId = input.clientId;
      if (input?.developerId) where.developerId = input.developerId;
      if (input?.status) where.status = toPrismaStatus(input.status as FrontendProjectStatus);

      const projects = await ctx.db.project.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: {
          client: {
            select: { id: true, name: true, email: true, role: true },
          },
          developer: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { updatedAt: "desc" },
      });

      return projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: toFrontendStatus(p.status),
        priority: p.priority.toLowerCase() as "low" | "medium" | "high" | "urgent",
        clientId: p.clientId,
        developerId: p.developerId ?? undefined,
        projectType: p.platform ?? p.type,
        estimatedDeadline: p.deadline ?? undefined,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        client: p.client
          ? {
              id: p.client.id,
              name: p.client.name,
              email: p.client.email,
              role: p.client.role,
            }
          : undefined,
        developer: p.developer
          ? { id: p.developer.id, name: p.developer.name, email: p.developer.email }
          : undefined,
      }));
    }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const project = await ctx.db.project.findUnique({
      where: { id: input.id },
      include: {
        client: { select: { id: true, name: true, email: true, role: true } },
        developer: { select: { id: true, name: true, email: true } },
        tasks: true,
      },
    });
    if (!project) throw new TRPCError({ code: "NOT_FOUND", message: "Projeto não encontrado" });
    return {
      ...project,
      status: toFrontendStatus(project.status),
      priority: project.priority.toLowerCase() as "low" | "medium" | "high" | "urgent",
      deadline: project.deadline ?? undefined,
      developerId: project.developerId ?? undefined,
    };
  }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: projectStatusSchema.default("backlog"),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        clientId: z.string(),
        developerId: z.string().optional(),
        projectType: z.string(),
        estimatedDeadline: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description ?? null,
          type: "OUTRO",
          category: "OUTRO",
          status: toPrismaStatus(input.status as FrontendProjectStatus),
          priority: input.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT",
          clientId: input.clientId,
          developerId: input.developerId ?? null,
          platform: input.projectType,
          deadline: input.estimatedDeadline ?? null,
        },
        include: {
          client: { select: { id: true, name: true, email: true } },
          developer: { select: { id: true, name: true, email: true } },
        },
      });
      await ctx.db.activityLog.create({
        data: {
          projectId: project.id,
          userId: ctx.userId,
          action: "Projeto criado",
        },
      });
      return {
        id: project.id,
        title: project.title,
        description: project.description,
        status: toFrontendStatus(project.status),
        priority: project.priority.toLowerCase(),
        clientId: project.clientId,
        developerId: project.developerId ?? undefined,
        projectType: project.platform ?? "",
        estimatedDeadline: project.deadline ?? undefined,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: projectStatusSchema.optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        developerId: z.string().nullable().optional(),
        estimatedDeadline: z.date().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const data: Record<string, unknown> = {};
      if (rest.title != null) data.title = rest.title;
      if (rest.description != null) data.description = rest.description;
      if (rest.status != null) data.status = toPrismaStatus(rest.status as FrontendProjectStatus);
      if (rest.priority != null) data.priority = rest.priority.toUpperCase();
      if (rest.developerId !== undefined) data.developerId = rest.developerId;
      if (rest.estimatedDeadline !== undefined) data.deadline = rest.estimatedDeadline;

      const project = await ctx.db.project.update({
        where: { id },
        data,
      });
      await ctx.db.activityLog.create({
        data: {
          projectId: project.id,
          userId: ctx.userId,
          action: "Projeto atualizado",
        },
      });
      return {
        ...project,
        status: toFrontendStatus(project.status),
        priority: project.priority.toLowerCase(),
        developerId: project.developerId ?? undefined,
        estimatedDeadline: project.deadline ?? undefined,
      };
    }),

  move: protectedProcedure
    .input(z.object({ id: z.string(), status: projectStatusSchema }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.update({
        where: { id: input.id },
        data: { status: toPrismaStatus(input.status as FrontendProjectStatus) },
      });
      await ctx.db.activityLog.create({
        data: {
          projectId: project.id,
          userId: ctx.userId,
          action: `Status alterado para ${input.status}`,
        },
      });
      return { ...project, status: toFrontendStatus(project.status) };
    }),
});
