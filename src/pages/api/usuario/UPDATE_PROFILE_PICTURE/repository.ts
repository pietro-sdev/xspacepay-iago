import { prisma } from '@/utils/prisma';

export const UserRepository = {
  async findUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profilePicture: true,
      },
    });
  },

  async updateProfilePicture(userId: string, profilePicture: string | null) {
    return prisma.user.update({
      where: { id: userId },
      data: { profilePicture },
    });
  },
};
