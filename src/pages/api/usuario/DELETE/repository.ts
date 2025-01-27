import { prisma } from '@/utils/prisma';

export async function deleteUserInDB(userId: string) {
  return prisma.user.delete({
    where: { id: userId },
  });
}
