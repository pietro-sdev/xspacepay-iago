import { NextApiRequest, NextApiResponse } from 'next';
import { createUserService } from './service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { name, email, password, profilePicture } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const newUser = await createUserService({
      name,
      email,
      password,
      profilePicture,
    });

    return res.status(201).json({
      success: true,
      message: 'Usuário criado com sucesso!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({
        success: false,
        error: 'Já existe um usuário com este email.',
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Erro ao criar usuário.',
    });
  }
}
