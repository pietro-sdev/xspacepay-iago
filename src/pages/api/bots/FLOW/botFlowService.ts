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
    const validatedSteps = steps.map((step) => ({
      id: step.id,
      type: step.type,
      message: step.message || null,
      fileData: step.fileData || null, // Base64 da imagem ou vídeo
      buttons: step.buttons || [],
      paymentProvider: step.paymentProvider || null,
      price: step.price || null,
      planName: step.planName || null,
    }));
  
    await this.botFlowRepository.upsertFlow(botId, validatedSteps);
  }  
}
