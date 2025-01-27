// scripts/botLongPolling.ts

import { Bot, session, SessionFlavor } from 'grammy';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Tipagem para a sessão, caso queira armazenar dados específicos
interface SessionData {
  // Adicione campos de sessão se necessário
}

type MyContext = SessionFlavor<SessionData>;

// Inicializa o Prisma Client
const prisma = new PrismaClient();

// Obtém as variáveis de ambiente
const BOT_TOKEN = process.env.BOT_TOKEN;
const TELEGRAM_SESSION = process.env.TELEGRAM_SESSION;

if (!BOT_TOKEN) {
  console.error('Erro: BOT_TOKEN não está definido no arquivo .env');
  process.exit(1);
}

// Inicializa o bot
const bot = new Bot<MyContext>(BOT_TOKEN);

// Middleware de sessão, se necessário
// bot.use(session({ initial: () => ({ /* dados iniciais */ }) }));

// Função para buscar a mensagem inicial do fluxo
async function getInitialMessage(botId: string): Promise<string> {
  try {
    const flow = await prisma.flow.findUnique({
      where: { botId },
    });

    if (!flow || !flow.steps) {
      throw new Error('Fluxo não encontrado para o Bot ID informado.');
    }

    // Supondo que 'steps' está armazenado como JSON
    const steps = JSON.parse(flow.steps);

    // Busca o passo do tipo 'initial-message'
    const initialStep = steps.find((step: any) => step.type === 'initial-message');

    if (!initialStep || !initialStep.message) {
      throw new Error('Passo inicial de mensagem não encontrado no fluxo.');
    }

    return initialStep.message;
  } catch (error) {
    console.error('Erro ao buscar mensagem inicial:', error);
    throw error;
  }
}

// Handler para o comando /start
bot.command('start', async (ctx) => {
  const botId = 'cm66t8oup0000ruqsa3fcysnp'; // Substitua pelo botId correspondente

  try {
    const initialMessage = await getInitialMessage(botId);
    await ctx.reply(initialMessage);
  } catch (error: any) {
    await ctx.reply('Desculpe, ocorreu um erro ao iniciar o bot.');
  }
});

// Handler para mensagens de texto
bot.on('message:text', async (ctx) => {
  const receivedText = ctx.message.text;
  
  // Aqui você pode implementar a lógica para processar a mensagem recebida
  // de acordo com o fluxo definido no banco de dados.

  await ctx.reply(`Você disse: ${receivedText}`);
});

// Inicia o bot com long polling
bot.start({
  onStart: (info) => {
    console.log(`Bot ${info.username} iniciado`);
  },
  onError: (err) => {
    console.error('Ocorreu um erro no bot:', err);
  },
});
