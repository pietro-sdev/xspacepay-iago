import { prisma } from '@/utils/prisma';
export async function getAllBotsFromDB() {
  return prisma.bot.findMany();
}
