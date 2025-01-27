import type { NextApiRequest, NextApiResponse } from 'next';
import { updateBotDetails } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { botId, name, description, about } = req.body;

  if (!botId) {
    return res.status(400).json({ error: 'O ID do bot é obrigatório.' });
  }

  try {
    const result = await updateBotDetails(botId, name, description, about);
    return res.status(200).json({ message: 'Detalhes do bot atualizados com sucesso.', result });
  } catch (error: any) {
    console.error('Erro ao atualizar detalhes do bot:', error);
    return res.status(500).json({ error: 'Erro ao atualizar detalhes do bot.' });
  }
}