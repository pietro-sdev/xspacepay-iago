import { NextApiRequest, NextApiResponse } from 'next';
import { deleteBotService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'ID inválido.' });
  }

  switch (req.method) {
    case 'DELETE':
      try {
        await deleteBotService(id);
        return res.status(200).json({ success: true, message: 'Bot excluído com sucesso.' });
      } catch (error) {
        console.error('Erro ao excluir bot:', error);
        return res.status(500).json({ success: false, error: 'Erro ao excluir bot.' });
      }

    default:
      return res.status(405).json({ error: 'Método não permitido.' });
  }
}
