// backend/lib/prisma.js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

/**
 * Create/Re-use Prisma client.
 * - In dev we attach it to globalThis so hot reloads don't create new clients.
 * - In production we create a normal client.
 */
function createPrisma() {
  try {
    const p = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
    console.log('[prisma] PrismaClient created');
    return p;
  } catch (err) {
    console.error('[prisma] Failed creating PrismaClient:', err && (err.stack || err.message || err));
    throw err;
  }
}

let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = createPrisma();
} else {
  // reuse across module reloads in dev
  if (!globalForPrisma.__prisma) {
    globalForPrisma.__prisma = createPrisma();
  }
  prisma = globalForPrisma.__prisma;
}

// export default for your existing imports
export default prisma;
