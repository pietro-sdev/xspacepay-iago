// /server/checkChannelLinks.ts
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram/tl";
import bigInt from "big-integer";
import { createBotService } from "@/pages/api/bots/CREATE/service";
import { getNextBotUsername } from "./botNameGenerator";
import { usernameExists } from "./usernameExists";
import { startAndRegisterPythonBot } from "./pythonBotsManager";

// Importamos cada "updateLongPollingBots" de cada funil
import { updateLongPollingBots as updateLongPollingBotsDARK1 } from "@/funil/DARK1/botLongPolling";
import { updateLongPollingBots as updateLongPollingBotsDARK2 } from "@/funil/DARK2/botLongPolling";
import { updateLongPollingBots as updateLongPollingBotsDARK3 } from "@/funil/DARK3/botLongPolling";
import { updateLongPollingBots as updateLongPollingBotsDARK4 } from "@/funil/DARK4/botLongPolling";
import { updateLongPollingBots as updateLongPollingBotsDARK5 } from "@/funil/DARK5/botLongPolling";

const apiId = parseInt(process.env.TELEGRAM_API_ID || "0", 10);
const apiHash = process.env.TELEGRAM_API_HASH || "";
let sessionString = process.env.TELEGRAM_SESSION || "";
let client: TelegramClient | null = null;

async function getTelegramClient() {
  if (!client) {
    console.log("[checkChannelLinks] Criando novo TelegramClient...");
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
      onError: (err) => console.error("[TelegramClient onError]", err),
    });
    console.log("[checkChannelLinks] GramJS client iniciado.");
  }
  return client;
}

/**
 * Cria até 2 bots nesta rodada.
 */
async function createUpTo2Bots() {
  const createdBots = [];
  for (let i = 0; i < 2; i++) {
    try {
      const { botName, botUsername } = await getNextBotUsername();
      const newBot = await createBotService(botName, botUsername, i);
      createdBots.push(newBot);
    } catch (err) {
      console.error("[createUpTo2Bots] Erro ao criar bot index=", i, err);
      break;
    }
  }
  console.log(`[createUpTo2Bots] Bots criados nesta rodada: ${createdBots.length}`);
  return createdBots;
}

/**
 * Faz a verificação do canal, substitui links offline e,
 * se houver links offline, cria os bots e inicia o fluxo com ambos os tokens.
 * Agora também recebe o funil para decidir qual "updateLongPollingBots" chamar.
 */
export async function checkChannelLinksAndReplace(channelId: string, funnel: string) {
  console.log(`[checkChannelLinksAndReplace] Checando canal: ${channelId}`);
  console.log(`[checkChannelLinksAndReplace] Funil selecionado: ${funnel}`);
  const tg = await getTelegramClient();

  let createdBots: any[] = [];
  let botsCriados = false;
  let botIndex = 0;

  // Ajuste o ID do canal se necessário
  if (!channelId.startsWith("-100") && /^\d+$/.test(channelId)) {
    channelId = `-100${channelId}`;
  }

  let offsetId = 0;
  const limit = 100;
  let totalEdited = 0;

  while (true) {
    try {
      console.log(`[checkChannelLinksAndReplace] Buscando histórico offsetId=${offsetId}...`);
      const history: any = await tg.invoke(
        new Api.messages.GetHistory({
          peer: channelId,
          offsetId,
          offsetDate: 0,
          addOffset: 0,
          limit,
          maxId: 0,
          minId: 0,
          hash: bigInt(0),
        })
      );

      const messages: any[] = history.messages || [];
      console.log(`[checkChannelLinksAndReplace] Encontradas ${messages.length} mensagens.`);

      if (!messages.length) {
        console.log("[checkChannelLinksAndReplace] Fim do histórico. Encerrando loop.");
        break;
      }

      for (const msg of messages) {
        if (!msg || !msg.entities || msg.entities.length === 0) continue;

        let updatedEntities: Api.TypeMessageEntity[] = [];
        let somethingChanged = false;

        for (const entity of msg.entities) {
          if (entity instanceof Api.MessageEntityTextUrl || entity instanceof Api.MessageEntityUrl) {
            const originalUrl = (entity as any).url;
            if (originalUrl?.startsWith("https://t.me/")) {
              const username = originalUrl.replace("https://t.me/", "").replace("/", "");
              console.log(` -> Verificando se '${username}' existe...`);
              const existe = await usernameExists(tg, username);
              if (!existe) {
                if (!botsCriados) {
                  console.log("[checkChannelLinksAndReplace] Link offline detectado; criando bots...");
                  createdBots = await createUpTo2Bots();
                  if (createdBots.length > 0) {
                    // Inicializa cada novo bot
                    createdBots.forEach((bot) => startAndRegisterPythonBot(bot.token));
                  }
                  botsCriados = true;
                }

                if (createdBots.length > 0) {
                  const chosenBot = createdBots[botIndex % createdBots.length];
                  botIndex++;
                  const newLink = `https://t.me/${chosenBot.username}`;
                  let newEntity;
                  if (entity instanceof Api.MessageEntityTextUrl) {
                    newEntity = new Api.MessageEntityTextUrl({
                      offset: entity.offset,
                      length: entity.length,
                      url: newLink,
                    });
                  } else {
                    newEntity = new Api.MessageEntityUrl({
                      offset: entity.offset,
                      length: entity.length,
                      url: newLink,
                    });
                  }
                  updatedEntities.push(newEntity);
                  somethingChanged = true;
                  console.log(`    -> Substituindo ${originalUrl} por ${newLink}`);
                  continue;
                } else {
                  console.log("    -> Não há bots criados nesta rodada. Não substituir.");
                }
              }
            }
          }
          updatedEntities.push(entity);
        }

        if (somethingChanged) {
          try {
            await tg.invoke(
              new Api.messages.EditMessage({
                peer: channelId,
                id: msg.id,
                message: msg.message,
                entities: updatedEntities,
              })
            );
            totalEdited++;
            console.log(` -> Mensagem ID ${msg.id} editada com sucesso!`);
          } catch (err) {
            console.error(` -> Erro ao editar msg ID=${msg.id}:`, err);
          }
        }
      }

      const lastMsgId = messages[messages.length - 1].id;
      offsetId = lastMsgId;
      if (offsetId === 0) {
        console.log("[checkChannelLinksAndReplace] offsetId=0, encerrando.");
        break;
      }
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      break;
    }
  }

  console.log(`[checkChannelLinksAndReplace] Finalizado. Mensagens editadas: ${totalEdited}`);

  // Se os bots foram criados, inicia o fluxo de long polling para ambos
  if (botsCriados && createdBots.length > 0) {
    const tokens = createdBots.map((bot) => bot.token);

    // Escolhe dinamicamente qual updateLongPollingBots chamar
    switch (funnel) {
      case "funil1":
        console.log("[checkChannelLinksAndReplace] Chamando updateLongPollingBotsDARK1...");
        updateLongPollingBotsDARK1(tokens);
        break;
      case "funil2":
        console.log("[checkChannelLinksAndReplace] Chamando updateLongPollingBotsDARK2...");
        updateLongPollingBotsDARK2(tokens);
        break;
      case "funil3":
        console.log("[checkChannelLinksAndReplace] Chamando updateLongPollingBotsDARK3...");
        updateLongPollingBotsDARK3(tokens);
        break;
      case "funil4":
        console.log("[checkChannelLinksAndReplace] Chamando updateLongPollingBotsDARK4...");
        updateLongPollingBotsDARK4(tokens);
        break;
      case "funil5":
        console.log("[checkChannelLinksAndReplace] Chamando updateLongPollingBotsDARK5...");
        updateLongPollingBotsDARK5(tokens);
        break;
      default:
        console.log("[checkChannelLinksAndReplace] Funil não reconhecido, usando 'DARK1' como fallback.");
        updateLongPollingBotsDARK1(tokens);
        break;
    }
  }

  return { editedCount: totalEdited };
}
