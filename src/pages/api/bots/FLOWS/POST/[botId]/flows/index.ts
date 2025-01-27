import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/utils/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { botId } = req.query;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    if (!botId || typeof botId !== 'string') {
      return res.status(400).json({ error: 'Bot ID inválido.' });
    }

    const { steps } = req.body;

    if (!steps || !Array.isArray(steps)) {
      return res.status(400).json({ error: 'Passos inválidos.' });
    }

    const flow = await prisma.flow.create({
      data: {
        botId,
        steps,
      },
    });

    return res.status(201).json({ success: true, flow });
  } catch (error) {
    console.error('Erro ao salvar fluxo:', error);
    return res.status(500).json({ error: 'Erro ao salvar fluxo.' });
  }
}
