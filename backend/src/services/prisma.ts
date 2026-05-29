import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enable WAL mode for SQLite to improve concurrent read performance
prisma.$executeRawUnsafe('PRAGMA journal_mode = WAL').catch(() => {
  // Non-critical - SQLite WAL mode may not be supported in all environments
});

prisma.$executeRawUnsafe('PRAGMA synchronous = NORMAL').catch(() => {});

export default prisma;