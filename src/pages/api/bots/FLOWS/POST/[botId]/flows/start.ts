import type { NextApiRequest, NextApiResponse } from 'next';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { prisma } from '@/utils/prisma';

// Configuração do TelegramClient
const apiId = parseInt(process.env.TELEGRAM_API_ID || '0', 10);
const apiHash = process.env.TELEGRAM_API_HASH || '';
const sessionString = process.env.TELEGRAM_SESSION || '';

let client: TelegramClient | null = null;

// Função Singleton para inicializar o TelegramClient
async function getTelegramClient() {
  if (!client) {
    client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
      connectionRetries: 5,
    });

    await client.start({
      phoneNumber: async () => '',
      password: async () => '',
      phoneCode: async () => '',
      onError: (err) => console.error('Erro no cliente Telegram:', err),
    });

    console.log('TelegramClient iniciado.');
  }
  return client;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { botId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    if (!botId || typeof botId !== 'string') {
      return res.status(400).json({ error: 'Bot ID inválido.' });
    }

    // Obtém os dados do bot pelo ID
    const bot = await prisma.bot.findUnique({ where: { id: botId } });
    if (!bot) {
      return res.status(404).json({ error: 'Bot não encontrado.' });
    }

    // Inicializa o cliente Telegram
    const telegramClient = await getTelegramClient();

    // Obtém o fluxo configurado para o bot
    const flow = await prisma.flow.findFirst({ where: { botId } });
    if (!flow) {
      return res.status(404).json({ error: 'Fluxo não configurado.' });
    }

    // Verifica e acessa as etapas do fluxo
    if (!flow.steps || !Array.isArray(flow.steps)) {
      return res.status(400).json({ error: 'Formato de etapas inválido.' });
    }

    const steps = flow.steps as Array<{ type: string; message?: string }>;
    const firstStep = steps[0];

    // Envia a mensagem inicial
    if (firstStep.type === 'text' && firstStep.message) {
      console.log(`Enviando mensagem inicial para o bot ${bot.username}: ${firstStep.message}`);
      await telegramClient.sendMessage(bot.username, { message: firstStep.message });
    } else {
      console.error('Tipo de etapa não suportado ou mensagem ausente:', firstStep);
    }

    return res.status(200).json({ success: true, message: 'Fluxo iniciado com sucesso.' });
  } catch (error) {
    console.error('Erro ao iniciar fluxo:', error);
    return res.status(500).json({ error: 'Erro ao iniciar fluxo.' });
  }
}
