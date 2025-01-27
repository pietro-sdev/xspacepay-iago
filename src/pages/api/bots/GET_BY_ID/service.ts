import { getBotByIdFromDB } from './repository';

export async function getBotByIdService(botId: string) {
  const bot = await getBotByIdFromDB(botId);

  if (!bot) {
    throw new Error('BOT_NOT_FOUND');
  }
  return bot;
}
