import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "../db";

export async function createContext(opts: FetchCreateContextFnOptions) {
  const userId = opts.req.headers.get("x-user-id") ?? null;
  return {
    db,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
