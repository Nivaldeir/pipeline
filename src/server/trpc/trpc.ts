import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

export const createCallerFactory = t.createCallerFactory;
export const router = t.router;
export const publicProcedure = t.procedure;

const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Não autenticado" });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const protectedProcedure = t.procedure.use(enforceAuth);
