import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const fileRouter = router({
  byProject: publicProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const files = await ctx.db.projectFile.findMany({
        where: { projectId: input.projectId },
        include: { uploadedBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return files.map((f) => ({
        id: f.id,
        projectId: f.projectId,
        name: f.name,
        url: f.url,
        type: f.type,
        size: f.size,
        uploadedBy: f.uploadedBy.name,
        createdAt: f.createdAt,
      }));
    }),

  create: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string(),
        url: z.string(),
        type: z.string(),
        size: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.db.projectFile.create({
        data: {
          projectId: input.projectId,
          name: input.name,
          url: input.url,
          type: input.type,
          size: input.size,
          uploadedById: ctx.userId,
        },
        include: { uploadedBy: { select: { name: true } } },
      });
      return {
        id: file.id,
        projectId: file.projectId,
        name: file.name,
        url: file.url,
        type: file.type,
        size: file.size,
        uploadedBy: file.uploadedBy.name,
        createdAt: file.createdAt,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.projectFile.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
