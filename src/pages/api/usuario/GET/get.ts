import { NextApiRequest, NextApiResponse } from 'next';
import { listAllUsersService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  try {
    const users = await listAllUsersService();
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao listar usuários.',
    });
  }
}
