import { PrismaClient } from '@prisma/client';

let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, propKey) {
    const instance = getPrisma();
    const value = (instance as any)[propKey];
    if (typeof value === 'function') {
      return value.bind(instance);
    }
    return value;
  }
});
