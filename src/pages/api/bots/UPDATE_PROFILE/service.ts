import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { Api } from 'telegram/tl';
import fs from 'fs';
import path from 'path';
import { CustomFile } from 'telegram/client/uploads';
import bigInt from 'big-integer';

// Variáveis do ambiente para configurar o cliente
const apiId = parseInt(process.env.TELEGRAM_API_ID || '0', 10);
const apiHash = process.env.TELEGRAM_API_HASH || '';
const sessionString = process.env.TELEGRAM_SESSION || '';

let client: TelegramClient | null = null;

// Singleton para o cliente Telegram
async function getTelegramClient() {
  if (!client) {
    client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
      connectionRetries: 5,
    });
    await client.start({
      phoneNumber: async () => {
        throw new Error('Telefone não configurado. Use TELEGRAM_SESSION já logado.');
      },
      password: async () => '',
      phoneCode: async () => '',
      onError: (err) => console.error(err),
    });
    console.log('GramJS client iniciado.');
  }
  return client;
}

// Função para trocar a foto de perfil do bot
export async function updateBotProfilePicture(botUsername: string, imagePath: string): Promise<void> {
  const tg = await getTelegramClient();

  try {
    console.log('Enviando comando /setuserpic para BotFather...');
    await tg.sendMessage('BotFather', { message: '/setuserpic' });

    console.log(`Enviando nome do bot: @${botUsername}`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await tg.sendMessage('BotFather', { message: `@${botUsername}` });

    console.log('Preparando envio da imagem como foto...');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Cria o arquivo CustomFile com o buffer do arquivo lido
    const filePath = path.resolve(imagePath);
    const fileStats = fs.statSync(filePath);
    const customFile = new CustomFile(
      path.basename(filePath), // Nome do arquivo
      fileStats.size, // Tamanho do arquivo
      filePath // Caminho do arquivo para upload
    );

    // Envia a imagem como foto
    const result = await tg.invoke(
      new Api.messages.SendMedia({
        peer: 'BotFather',
        media: new Api.InputMediaUploadedPhoto({
          file: await tg.uploadFile({
            file: customFile,
            workers: 1, // Para upload eficiente
          }),
        }),
        message: '', // Nenhuma mensagem adicional
        randomId: bigInt(Math.floor(Math.random() * 1000000000)), // Corrige para usar bigInt
      })
    );

    console.log(`Foto de perfil do bot ${botUsername} atualizada com sucesso. Resultado:`, result);
  } catch (error) {
    console.error('Erro ao atualizar a foto de perfil do bot:', error);
    throw new Error('Não foi possível atualizar a foto de perfil do bot.');
  }
}
