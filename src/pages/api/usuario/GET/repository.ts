import { prisma } from '@/utils/prisma';

export async function getAllUsersFromDB() {
  return prisma.user.findMany({

    select: {
      id: true,
      name: true,
      email: true,
      profilePicture: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
