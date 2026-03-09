import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "cliente@email.com" },
    update: {},
    create: {
      id: "mock-1",
      name: "João Silva",
      email: "cliente@email.com",
      role: "CLIENT",
    },
  });
  await prisma.user.upsert({
    where: { email: "dev@email.com" },
    update: {},
    create: {
      id: "mock-2",
      name: "Maria Santos",
      email: "dev@email.com",
      role: "DEVELOPER",
    },
  });
  await prisma.user.upsert({
    where: { email: "admin@email.com" },
    update: {},
    create: {
      id: "mock-3",
      name: "Carlos Admin",
      email: "admin@email.com",
      role: "ADMIN",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
