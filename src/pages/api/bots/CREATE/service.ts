import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl'; // se precisar usar tipos
import { createBotInDB } from './repository';


const apiId = parseInt(process.env.TELEGRAM_API_ID || '0', 10);
const apiHash = process.env.TELEGRAM_API_HASH || '';

let sessionString = process.env.TELEGRAM_SESSION || '';

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
        throw new Error('Sem phoneNumber no modo produção. Configure a sessão pré-logada.');
      },
      password: async () => '',
      phoneCode: async () => '',
      onError: (err) => console.error(err),
    });

    sessionString = (client.session as StringSession).save();
    console.log('GramJS client iniciado. Sessão atual:', sessionString);
  }
  return client;
}

/**
 * Cria um novo bot conversando com o BotFather via MTProto.
 * @param botName
 * @param botUsername
 */
export async function createBotService(botName: string, botUsername: string) {
  try {
    const tg = await getTelegramClient();

    await tg.sendMessage('BotFather', { message: '/newbot' });

    await delay(1500);

    await tg.sendMessage('BotFather', { message: botName });
    await delay(1500);

    await tg.sendMessage('BotFather', { message: botUsername });
    await delay(2000);

    const messages = await tg.getMessages('BotFather', { limit: 5 });
    const lastMessage = messages[0]?.message || '';

    /**
     * O texto típico de sucesso é algo como:
     * "Done! Congratulations on your new bot. You will find it at t.me/xxx.
     *  Use this token to access the HTTP API: 1234567:ABC-DEFG..."
     *
     * Vamos buscar esse token com uma Regex simples:
     */
    const tokenRegex = /Use this token to access the HTTP API:\s*`?([\w:-]+)`?/i;
    const match = lastMessage.match(tokenRegex);

    if (!match) {
      throw new Error('Não foi possível extrair o token da resposta do BotFather:\n' + lastMessage);
    }

    const token = match[1];

    const newBot = await createBotInDB({
      name: botName,
      username: botUsername,
      token,
      profilePhoto: '',
    });

    return newBot;
  } catch (error) {
    console.error('Erro ao criar o bot:', error);
    throw new Error('Erro ao criar o bot com o BotFather.');
  }
}


function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
