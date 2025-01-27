import { BotFlowRepository } from './botFlowRepository';

export class BotFlowService {
  private botFlowRepository: BotFlowRepository;

  constructor() {
    this.botFlowRepository = new BotFlowRepository();
  }

  async getFlow(botId: string) {
    const flow = await this.botFlowRepository.findFlowByBotId(botId);

    if (!flow) {
      throw new Error('Fluxo não encontrado para o Bot ID informado.');
    }

    return flow.steps || [];
  }

  async saveFlow(botId: string, steps: any[]) {
    // Validação simples para garantir que os passos tenham a estrutura necessária
    const validatedSteps = steps.map((step) => ({
      id: step.id,
      type: step.type,
      message: step.message || null,
      fileData: step.fileData || null,
      buttons: step.buttons || [],
      paymentProvider: step.paymentProvider || null,
      price: step.price || null,
      planName: step.planName || null,
    }));

    // Enviar os passos validados para o repositório
    await this.botFlowRepository.upsertFlow(botId, validatedSteps);
  }
}
