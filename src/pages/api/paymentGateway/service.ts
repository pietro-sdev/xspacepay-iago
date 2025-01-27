import { PaymentGatewayRepository } from './repository';

export const PaymentGatewayService = {
  async saveGateway(userId: string, type: string, apiKey: string, secretKey?: string) {
    // Verifica se o gateway já existe para o usuário
    const existingGateway = await PaymentGatewayRepository.findByUserAndType(userId, type);

    if (existingGateway) {
      // Atualiza o gateway existente
      return PaymentGatewayRepository.updateGateway(userId, type, apiKey, secretKey);
    } else {
      // Cria um novo gateway
      return PaymentGatewayRepository.createGateway(userId, type, apiKey, secretKey);
    }
  },

  async getUserGateways(userId: string) {
    return PaymentGatewayRepository.getGatewaysByUser(userId);
  },

  async deleteGateway(userId: string, type: string) {
    return PaymentGatewayRepository.deleteGateway(userId, type);
  },
};
