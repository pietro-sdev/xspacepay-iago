// /pages/api/bots/CREATE/service.ts
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { createBotInDB } from "./repository";

const apiId = parseInt(process.env.TELEGRAM_API_ID || "0", 10);
const apiHash = process.env.TELEGRAM_API_HASH || "";
let sessionString = process.env.TELEGRAM_SESSION || "";
let client: TelegramClient | null = null;

async function getTelegramClient(): Promise<TelegramClient> {
  if (!client) {
    client = new TelegramClient(
      new StringSession(sessionString),
      apiId,
      apiHash,
      { connectionRetries: 5 }
    );
    await client.start({
      phoneNumber: async () => {
        throw new Error("Configure a TELEGRAM_SESSION pré-logada em produção.");
      },
      password: async () => "",
      phoneCode: async () => "",
      onError: (err) => console.error(err),
    });
    // Realiza o cast para 'any' para evitar o erro de tipo
    sessionString = (client.session as any).save();
    console.log("[createBotService] GramJS client iniciado. Sessão:", sessionString);
  }
  return client;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cria UM novo bot conversando com o BotFather.
 * O parâmetro 'index' (0 ou 1) é usado para aplicar um delay se necessário.
 */
export async function createBotService(botName: string, botUsername: string, index = 0) {
  if (index === 1) {
    console.log("[createBotService] Esperando 15s antes de criar o 2º bot...");
    await delay(15000);
  }

  try {
    const tg = await getTelegramClient();

    // 1) Inicia o processo enviando o comando /newbot
    await tg.sendMessage("BotFather", { message: "/newbot" });
    await delay(1500);

    // 2) Envia o nome do bot
    await tg.sendMessage("BotFather", { message: botName });
    await delay(1500);

    // 3) Envia o username do bot
    await tg.sendMessage("BotFather", { message: botUsername });
    await delay(2000);

    // 4) Obtém as últimas mensagens do BotFather para extrair o token
    const messages = await tg.getMessages("BotFather", { limit: 5 });
    const lastMessage = messages[0]?.message || "";
    console.log("[createBotService] Resposta do BotFather:\n", lastMessage);

    const tokenRegex = /Use this token to access the HTTP API:\s*`?([\w:-]+)`?/i;
    const match = lastMessage.match(tokenRegex);

    if (!match) {
      throw new Error(
        "Não foi possível extrair o token da resposta do BotFather:\n" + lastMessage
      );
    }

    const token = match[1];

    // Salva o novo bot no banco de dados
    const newBot = await createBotInDB({
      name: botName,
      username: botUsername,
      token,
      profilePhoto: "",
    });

    return newBot;
  } catch (error) {
    console.error("[createBotService] Erro ao criar bot:", error);
    throw new Error("Erro ao criar o bot com o BotFather.");
  }
}
