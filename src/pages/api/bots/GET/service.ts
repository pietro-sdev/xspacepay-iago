import { getAllBotsFromDB } from './repository';

export async function listAllBots() {

  const bots = await getAllBotsFromDB();

  return bots;
}
