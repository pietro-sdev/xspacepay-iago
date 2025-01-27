import { prisma } from '@/utils/prisma';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  profilePicture?: string | null;
}


export async function createUserInDB(data: CreateUserData) {
  return prisma.user.create({
    data,
  });
}
