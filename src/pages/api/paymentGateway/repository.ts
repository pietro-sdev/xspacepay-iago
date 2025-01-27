import { prisma } from '@/utils/prisma';

export const PaymentGatewayRepository = {
  async findByUserAndType(userId: string, type: string) {
    return prisma.paymentGateway.findUnique({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  },

  async createGateway(userId: string, type: string, apiKey: string, secretKey?: string) {
    return prisma.paymentGateway.create({
      data: {
        userId,
        type,
        apiKey,
        secretKey,
      },
    });
  },

  async updateGateway(userId: string, type: string, apiKey: string, secretKey?: string) {
    return prisma.paymentGateway.update({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
      data: {
        apiKey,
        secretKey,
      },
    });
  },

  async deleteGateway(userId: string, type: string) {
    return prisma.paymentGateway.delete({
      where: {
        userId_type: {
          userId,
          type,
        },
      },
    });
  },

  async getGatewaysByUser(userId: string) {
    return prisma.paymentGateway.findMany({
      where: { userId },
    });
  },
};
