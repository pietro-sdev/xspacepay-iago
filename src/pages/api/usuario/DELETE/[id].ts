import { NextApiRequest, NextApiResponse } from 'next';
import { deleteUserService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'ID inválido.' });
  }

  try {
    await deleteUserService(id);
    return res.status(200).json({ success: true, message: 'Usuário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao excluir usuário.',
    });
  }
}
