// GET_BY_ME/get.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from './service';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Certifique-se de definir isso no .env
const DEFAULT_PROFILE_PICTURE =
  'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // Decodifica o token JWT para obter o ID do usuário
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ error: 'Token inválido.' });
    }

    // Busca o usuário pelo ID
    const user = await UserService.getUser(decoded.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Substituir `null` no `profilePicture` pela URL padrão
    const profilePicture = user.profilePicture || DEFAULT_PROFILE_PICTURE;

    return res.status(200).json({ user: { ...user, profilePicture } });
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error.message || error);
    return res.status(500).json({ error: 'Não foi possível buscar o usuário.' });
  }
}
