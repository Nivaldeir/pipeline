import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { db } from "../db";

const MOCK_USERS_BY_ID: Record<
  string,
  { id: string; name: string; email: string; role: "ADMIN" | "DEVELOPER" | "CLIENT" }
> = {
  "mock-1": { id: "mock-1", name: "João Silva", email: "cliente@email.com", role: "CLIENT" },
  "mock-2": { id: "mock-2", name: "Maria Santos", email: "dev@email.com", role: "DEVELOPER" },
  "mock-3": { id: "mock-3", name: "Carlos Admin", email: "admin@email.com", role: "ADMIN" },
};

export async function createContext(opts: FetchCreateContextFnOptions) {
  const userId = opts.req.headers.get("x-user-id") ?? null;
  if (userId) {
    const mock = MOCK_USERS_BY_ID[userId];
    if (mock) {
      await db.user.upsert({
        where: { id: mock.id },
        update: {
          name: mock.name,
          email: mock.email,
          role: mock.role,
          isActive: true,
        },
        create: {
          id: mock.id,
          name: mock.name,
          email: mock.email,
          role: mock.role,
          isActive: true,
        },
      });
    }
  }
  return {
    db,
    userId,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
