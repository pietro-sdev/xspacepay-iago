import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma }  from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { botId } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    if (!botId || typeof botId !== 'string') {
      return res.status(400).json({ error: 'Bot ID inválido.' });
    }

    const flows = await prisma.flow.findMany({
      where: { botId },
      include: { bot: true },
    });

    return res.status(200).json({ success: true, flows });
  } catch (error) {
    console.error('Erro ao buscar fluxos:', error);
    return res.status(500).json({ error: 'Erro ao buscar fluxos.' });
  }
}
