import { NextApiRequest, NextApiResponse } from 'next';
import { listAllBots } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const bots = await listAllBots();
    return res.status(200).json({ success: true, bots });
  } catch (error) {
    console.error('Erro ao listar bots:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao obter bots.',
    });
  }
}
