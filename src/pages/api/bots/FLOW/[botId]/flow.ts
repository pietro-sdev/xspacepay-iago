export const config = {
  api: {
    bodyParser: {
      sizeLimit: '300mb',
    },
  },
};

import { NextApiRequest, NextApiResponse } from 'next';
import { BotFlowService } from '../botFlowService';

const botFlowService = new BotFlowService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { botId } = req.query;

  if (typeof botId !== 'string') {
    return res.status(400).json({ message: 'Bot ID inválido ou ausente.' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const flow = await botFlowService.getFlow(botId);
        return res.status(200).json({ steps: flow });

      case 'POST':
        const { steps } = req.body;
        if (!steps) {
          return res.status(400).json({ message: 'Dados dos passos ausentes.' });
        }

        await botFlowService.saveFlow(botId, steps);
        return res.status(200).json({ message: 'Fluxo salvo com sucesso.' });

      default:
        return res.status(405).json({ message: 'Método não permitido.' });
    }
  } catch (error) {
    console.error('Erro na API:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}
