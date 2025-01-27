import { prisma } from '@/utils/prisma';
    
export async function getBotByIdFromDB(botId: string) {
  return prisma.bot.findUnique({
    where: { id: botId },
  });
}
