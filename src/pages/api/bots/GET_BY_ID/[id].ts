import { NextApiRequest, NextApiResponse } from 'next';
import { getBotByIdService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // Rota: /api/bots/[id]

  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'ID inválido.' });
  }

  if (req.method === 'GET') {
    try {
      const bot = await getBotByIdService(id);

      return res.status(200).json({ success: true, bot });
    } catch (error: any) {
      console.error('Erro ao obter bot:', error);

      if (error.message === 'BOT_NOT_FOUND') {
        
        return res.status(404).json({ success: false, error: 'Bot não encontrado.' });
      }

      return res.status(500).json({ success: false, error: 'Erro ao buscar bot.' });
    }
  }

  return res.status(405).json({ success: false, error: 'Método não permitido.' });
}
