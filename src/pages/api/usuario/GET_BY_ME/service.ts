import { UserRepository } from './repository';

export const UserService = {
  async getUser(userId: string) {
    return await UserRepository.findUserById(userId);
  },
};
