// /server/botManager.ts
import { createBotService } from "@/pages/api/bots/CREATE/service";
import { startAndRegisterPythonBot } from "./pythonBotsManager";

export async function createAndStartBot(botName: string, botUsername: string) {
  try {
    const newBot = await createBotService(botName, botUsername, 0);
    console.log(`Bot criado com sucesso: ${newBot.username}`);

    startAndRegisterPythonBot(newBot.token);
  } catch (error) {
    console.error("Erro ao criar e iniciar o bot:", error);
  }
}
