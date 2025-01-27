import { prisma } from '@/utils/prisma';

export async function deleteBotInDB(botId: string) {
  return prisma.bot.delete({
    where: { id: botId },
  });
}
