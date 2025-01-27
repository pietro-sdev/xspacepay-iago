// UPDATE_PROFILE_PICTURE/service.ts
import { UserRepository } from './repository';

const DEFAULT_PROFILE_PICTURE =
  'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg?20200418092106';

export const UserService = {
  async updateProfilePicture(userId: string, file?: Express.Multer.File) {
    // Buscar o usuário atual
    const user = await UserRepository.findUserById(userId);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }

    // Foto de perfil padrão
    if (!file) {
      await UserRepository.updateProfilePicture(userId, null);
      return { profilePicture: DEFAULT_PROFILE_PICTURE };
    }

    // Converter a imagem para base64 e criar o Data URL
    const base64Image = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64Image}`;
    await UserRepository.updateProfilePicture(userId, dataUrl);

    return { profilePicture: dataUrl };
  },
};
