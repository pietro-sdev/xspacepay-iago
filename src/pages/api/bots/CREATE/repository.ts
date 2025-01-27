import { prisma } from '@/utils/prisma';

export const createBotInDB = async (data: {
  name: string;
  username: string;
  token: string;
  profilePhoto: string;
}) => {
  return await prisma.bot.create({
    data,
  });
};
