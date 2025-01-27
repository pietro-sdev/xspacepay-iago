import { deleteBotInDB } from './repository';

export async function deleteBotService(botId: string) {
  const deletedBot = await deleteBotInDB(botId);
  return deletedBot;
}
