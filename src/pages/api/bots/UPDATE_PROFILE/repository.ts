// repository/botRepository.ts

import { prisma } from '@/utils/prisma'; 

// Função para buscar o bot pelo ID
export async function getBotById(botId: string) {
  return prisma.bot.findUnique({
    where: { id: botId },
  });
}
