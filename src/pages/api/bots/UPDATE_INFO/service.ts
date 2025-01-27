// service/updateInfoService.ts

import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { getBotById, updateBotNameInDatabase } from './repository';

const apiId = parseInt(process.env.TELEGRAM_API_ID || '0', 10);
const apiHash = process.env.TELEGRAM_API_HASH || '';
const sessionString = process.env.TELEGRAM_SESSION || '';

let client: TelegramClient | null = null;

async function getTelegramClient() {
  if (!client) {
    client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => '',
      password: async () => '',
      phoneCode: async () => '',
      onError: (err) => console.error(err),
    });

    console.log('GramJS client iniciado.');
  }
  return client;
}

export async function updateBotDetails(botId: string, name?: string, description?: string, about?: string) {
  const tg = await getTelegramClient();

  try {
    const bot = await getBotById(botId);
    if (!bot) {
      throw new Error('Bot não encontrado.');
    }

    const botUsername = `@${bot.username}`;

    if (name) {
      console.log(`Atualizando nome do bot para: ${name}`);
      await tg.sendMessage('BotFather', { message: '/setname' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: botUsername });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: name });
      await updateBotNameInDatabase(botId, name);
    }

    if (description) {
      console.log(`Atualizando descrição do bot para: ${description}`);
      await tg.sendMessage('BotFather', { message: '/setdescription' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: botUsername });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: description });
    }

    if (about) {
      console.log(`Atualizando "sobre" do bot para: ${about}`);
      await tg.sendMessage('BotFather', { message: '/setabouttext' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: botUsername });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await tg.sendMessage('BotFather', { message: about });
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar detalhes do bot:', error);
    throw new Error('Erro ao atualizar detalhes do bot no Telegram.');
  }
}