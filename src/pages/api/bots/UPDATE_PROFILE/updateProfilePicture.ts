import type { NextApiRequest, NextApiResponse } from 'next';
import { updateBotProfilePicture } from './service';
import { getBotByIdService } from '@/pages/api/bots/GET_BY_ID/service';
import path from 'path';
import fs from 'fs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  const { botId, image } = req.body;

  if (!botId || !image) {
    return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes.' });
  }

  try {
    // Obtém o bot do banco de dados
    console.log(`Buscando bot com ID: ${botId}`);
    const bot = await getBotByIdService(botId);
    if (!bot) {
      return res.status(404).json({ error: 'Bot não encontrado.' });
    }

    // Salva a imagem no servidor temporariamente
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      console.log(`Criando diretório temporário em: ${tempDir}`);
      fs.mkdirSync(tempDir);
    }

    const tempImagePath = path.join(tempDir, `profile_${botId}.png`);
    console.log(`Salvando imagem no caminho temporário: ${tempImagePath}`);
    fs.writeFileSync(tempImagePath, Buffer.from(image, 'base64'));

    // Atualiza a foto de perfil do bot
    console.log(`Atualizando a foto de perfil para o bot: @${bot.username}`);
    await updateBotProfilePicture(bot.username, tempImagePath);

    // Remove o arquivo temporário
    console.log(`Removendo arquivo temporário: ${tempImagePath}`);
    fs.unlinkSync(tempImagePath);

    return res.status(200).json({ message: 'Foto de perfil atualizada com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao atualizar a foto de perfil:', error);
    return res.status(500).json({ error: 'Erro ao atualizar a foto de perfil.' });
  }
}
