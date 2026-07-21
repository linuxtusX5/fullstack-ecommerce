// lib/prisma.ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create the adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
