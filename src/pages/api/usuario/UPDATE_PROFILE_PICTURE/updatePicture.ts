import { NextApiRequest, NextApiResponse } from 'next';
import { UserService } from './service';
import multer from 'multer';

// Configuração do multer para lidar com uploads
const upload = multer({ storage: multer.memoryStorage() });

export const config = {
  api: {
    bodyParser: false, // Desativar o bodyParser para trabalhar com multer
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  // Usar o middleware do multer para lidar com o upload
  upload.single('profilePicture')(req as any, {} as any, async (error: any) => {
    if (error) {
      return res.status(500).json({ error: 'Erro ao fazer o upload da imagem.' });
    }

    const userId = req.headers['x-user-id'] as string; // Obter o ID do usuário dos headers (ou outro lugar, como token)
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    try {
      const result = await UserService.updateProfilePicture(userId, (req as any).file);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao atualizar a foto de perfil.' });
    }
  });
}
