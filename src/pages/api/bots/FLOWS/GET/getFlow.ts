import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { botId } = req.query;

  if (!botId || typeof botId !== 'string') {
    return res.status(400).json({ error: 'Bot ID é obrigatório e deve ser uma string válida.' });
  }

  try {
    // Busca o fluxo associado ao bot no banco de dados
    const flow = await prisma.flow.findFirst({
      where: { botId },
    });

    if (!flow) {
      return res.status(404).json({ error: 'Fluxo não encontrado para o bot especificado.' });
    }

    return res.status(200).json({ success: true, flow });
  } catch (error) {
    console.error('Erro ao buscar fluxo:', error);
    return res.status(500).json({ error: 'Erro ao buscar fluxo no banco de dados.' });
  }
}
