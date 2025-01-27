import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { botId } = req.body;

  if (!botId) {
    return res.status(400).json({ error: 'Bot ID é obrigatório.' });
  }

  try {
    // Aqui você pode adicionar lógica para finalizar o processo do bot
    console.log(`Parando o bot com ID: ${botId}`);
    // Exemplo: Use um sistema de gerenciamento de processos para parar o bot.

    return res.status(200).json({ message: 'Bot parado com sucesso.' });
  } catch (error) {
    console.error('Erro ao parar o bot:', error);
    return res.status(500).json({ error: 'Erro ao parar o bot.' });
  }
}
