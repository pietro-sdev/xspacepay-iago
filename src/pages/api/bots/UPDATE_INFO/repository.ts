import { prisma } from '@/utils/prisma'; 

export async function getBotById(botId: string) {
  return prisma.bot.findUnique({
    where: { id: botId },
  });
}

export async function updateBotNameInDatabase(botId: string, name: string) {
  try {
    return await prisma.bot.update({
      where: { id: botId },
      data: { name },
    });
  } catch (error) {
    console.error('Erro ao atualizar o nome do bot no banco de dados:', error);
    throw new Error('Erro ao atualizar o nome do bot no banco de dados.');
  }
}