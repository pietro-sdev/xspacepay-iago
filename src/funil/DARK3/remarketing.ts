// src/funil/remarketing.ts
import TelegramBot from "node-telegram-bot-api";
import { MEDIA } from "./media";
import { gerarPix } from "./pix";
import { criarPagamentoPayPal } from "./paypal";
import { criarPagamentoStripe } from "./stripe";
import { REMARKETING_MESSAGES, REMARKETING_PIX_NEW, REMARKETING_PIX_WARNING } from "./messages";

// Função de monitoramento e remarketing
// Recebe a instância do bot, paymentId, chatId, tipo e o Map de pagamentos pendentes.
export async function iniciarMonitoramentoPagamento(
  bot: TelegramBot,
  paymentId: string,
  chatId: number,
  tipo: string,
  pagamentosPendentes: Map<string, { chatId: number; valor: number; idioma: string; tipo: string }>
) {
  setTimeout(async () => {
    if (!pagamentosPendentes.has(paymentId)) return;

    const pagamento = pagamentosPendentes.get(paymentId);
    if (!pagamento) return;

    const desconto = (pagamento.valor * 0.9).toFixed(2);

    // Envia a imagem antes da mensagem de remarketing
    await bot.sendPhoto(chatId, MEDIA.image);

    // Obtém a mensagem de remarketing formatada de acordo com o idioma do usuário
    const mensagemBase = REMARKETING_MESSAGES[pagamento.idioma as keyof typeof REMARKETING_MESSAGES](desconto);

    if (pagamento.tipo === "pix") {
      // Se o pagamento for via PIX, gera novo PIX com desconto
      const novoPagamento = await gerarPix(Number(desconto), "Pagamento VIP - 10% OFF");
      if (novoPagamento) {
        await bot.sendMessage(
          chatId,
          `${mensagemBase}${REMARKETING_PIX_NEW}\n\n\`${novoPagamento.qr_code}\`\n\n${REMARKETING_PIX_WARNING}`,
          { parse_mode: "Markdown" }
        );
      }
    } else {
      // Para métodos externos: gera automaticamente o link com desconto (sem botões)
      const currency = pagamento.idioma === "es" ? "EUR" : "USD";
      const paymentFunction =
        pagamento.tipo === "pay_with_paypal" ? criarPagamentoPayPal : criarPagamentoStripe;
      const link = await paymentFunction(Number(desconto), "VIP Subscription - 10% OFF", currency);
      if (link) {
        await bot.sendMessage(
          chatId,
          `${mensagemBase}\n\n🔗 ${link}`,
          { parse_mode: "Markdown", disable_web_page_preview: true }
        );
      }
    }

    pagamentosPendentes.delete(paymentId);
  }, 300000); // 5 minutos
}
