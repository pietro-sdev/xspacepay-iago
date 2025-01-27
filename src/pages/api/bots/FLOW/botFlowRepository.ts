import { prisma } from '@/utils/prisma';

export class BotFlowRepository {
  async findFlowByBotId(botId: string) {
    return await prisma.flow.findUnique({
      where: { botId },
    });
  }

  async upsertFlow(botId: string, steps: any[]) {
    // Upsert para criar ou atualizar o fluxo com base no botId
    await prisma.flow.upsert({
      where: { botId },
      update: { steps },
      create: {
        botId,
        steps,
      },
    });
  }
}
