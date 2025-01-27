import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const UserRepository = {
  async findUserById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    });
  },
};
