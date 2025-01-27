import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';
import { spawn } from 'child_process';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { botId } = req.body;

  if (!botId) {
    return res.status(400).json({ error: 'Bot ID é obrigatório.' });
  }

  try {
    // Busca o token do bot no banco de dados
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
    });

    if (!bot || !bot.token) {
      return res.status(404).json({ error: 'Bot não encontrado ou sem token configurado.' });
    }

    // Executa o script `botLongPolling.ts` com o token do bot como argumento
    const botProcess = spawn('npx', ['tsx', 'src/scripts/botLongPolling.ts', bot.token], {
      stdio: 'inherit',
      shell: true, // Necessário para rodar em alguns ambientes Windows
    });

    botProcess.on('error', (err) => {
      console.error('Erro ao iniciar o bot:', err);
    });

    botProcess.on('close', (code) => {
      console.log(`Processo do bot encerrado com código ${code}`);
    });

    return res.status(200).json({ message: 'Bot iniciado com sucesso.' });
  } catch (error) {
    console.error('Erro ao iniciar o bot:', error);
    return res.status(500).json({ error: 'Erro ao iniciar o bot.' });
  }
}
