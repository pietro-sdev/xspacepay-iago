import { NextApiRequest, NextApiResponse } from 'next';
import { createBotService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { botName, botUsername } = req.body;

  if (!botName || !botUsername) {
    return res.status(400).json({ error: 'Nome e username do bot são obrigatórios.' });
  }

  try {
    const newBot = await createBotService(botName, botUsername);
    res.status(201).json({
      success: true,
      message: 'Bot criado com sucesso!',
      bot: newBot,
    });
  } catch (error) {
    console.error('Erro ao criar o bot:', error);
    res.status(500).json({ error: 'Erro ao criar o bot.' });
  }
}
