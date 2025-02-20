import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config"; // Seu token
import { MESSAGES } from "./messages"; 
import { inlineKeyboard } from "./buttons";
import { MEDIA } from "./media";
import { gerarPix, verificarStatusPix } from "./pix";
import { sendRemarketing } from "./remarketing";
import { sendUpsell } from "./upsell";
import { sendCrossell } from "./crossel";

// Links dos grupos
const GRUPO_VIP_LINK = "https://t.me/+txkexBXT4Gs3Nzk5";
const GRUPO_PLANO_ANUAL_LINK = "https://t.me/+txkexBXT4Gs3Nzk5";
const GRUPO_CONTEUDO_PREMIUM_LINK = "https://t.me/+txkexBXT4Gs3Nzk5";

// Mapeia cada plano para seu valor (em reais)
const planValues: { [key: string]: number } = {
  PLAN_DAILY: 10.0,
  PLAN_WEEKLY: 15.0,
  PLAN_MONTHLY: 20.0,
  PLAN_PREMIUM: 25.0,
  PLAN_DEEP: 30.0,
};

function registerEventHandlers(bot: TelegramBot) {
  // Handler para o comando /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    // Envia mensagem de boas-vindas
    await bot.sendMessage(chatId, MESSAGES.WELCOME, { parse_mode: "HTML" });
    
    // Envia vídeo com mensagem e botões dos planos
    await bot.sendVideo(chatId, MEDIA.video1, {
      caption: MESSAGES.SECOND,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: inlineKeyboard }
    });
  });

  // Trata cliques em callback_query
  bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message?.chat.id;
    if (!chatId) return;
    const data = callbackQuery.data;

    // Tratamento para botões de planos
    if (
      data === "PLAN_DAILY" ||
      data === "PLAN_WEEKLY" ||
      data === "PLAN_MONTHLY" ||
      data === "PLAN_PREMIUM" ||
      data === "PLAN_DEEP"
    ) {
      const selectedValue = planValues[data];
      const paymentResponse = await gerarPix(selectedValue, "Pagamento do Plano");
      if (paymentResponse) {
        const pixMessage = `
🔒 Pagamento gerado com sucesso!
💳 Valor: R$${selectedValue.toFixed(2)}

Para efetuar o pagamento, copie o código abaixo e cole no aplicativo do seu banco para a transação via PIX:

\`${paymentResponse.qr_code}\`

❗️ Atenção: Utilize "PIX Copia e Cola" no seu banco.
        `;
        await bot.sendMessage(chatId, pixMessage, { parse_mode: "Markdown" });
        
        // Envia botão para verificação do pagamento
        await bot.sendMessage(chatId, "✅ Para confirmar o pagamento, clique abaixo:", {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🔍 Verificar o Pagamento ✅", callback_data: `VERIFY_PLAN_${paymentResponse.id}` }
              ]
            ]
          }
        });
        
        // Envia remarketing e upsell após 60 segundos
        setTimeout(async () => {
          await sendRemarketing(bot, chatId, selectedValue);
          await sendUpsell(bot, chatId);
        }, 60000);
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento PIX. Tente novamente.");
      }
    }
    // Tratamento para botão de upsell ("Receber VIP")
    else if (data === "UPSELL") {
      const upsellValue = 49.90;
      const paymentResponse = await gerarPix(upsellValue, "Pagamento do Upsell - Plano VIP Anual");
      if (paymentResponse) {
        const pixMessage = `
🔒 Pagamento gerado com sucesso para o upsell!
💳 Valor: R$${upsellValue.toFixed(2)}

Para efetuar o pagamento, copie o código abaixo e cole no aplicativo do seu banco:

\`${paymentResponse.qr_code}\`

❗️ Atenção: Utilize "PIX Copia e Cola" no seu banco.
        `;
        await bot.sendMessage(chatId, pixMessage, { parse_mode: "Markdown" });
        
        await bot.sendMessage(chatId, "✅ Para confirmar o pagamento, clique abaixo:", {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🔍 Verificar o Pagamento ✅", callback_data: `VERIFY_UPSELL_${paymentResponse.id}` }
              ]
            ]
          }
        });
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento PIX para o upsell.");
      }
    }
    // Tratamento para botão de cross-sell ("Receber Conteúdo Premium")
    else if (data === "CROSSSELL") {
      const crossellValue = 19.90;
      const paymentResponse = await gerarPix(crossellValue, "Pagamento do Cross-sell - Conteúdo Premium Extra");
      if (paymentResponse) {
        const pixMessage = `
🔒 Pagamento gerado com sucesso para o cross-sell!
💳 Valor: R$${crossellValue.toFixed(2)}

Para efetuar o pagamento, copie o código abaixo e cole no aplicativo do seu banco:

\`${paymentResponse.qr_code}\`

❗️ Atenção: Utilize "PIX Copia e Cola" no seu banco.
        `;
        await bot.sendMessage(chatId, pixMessage, { parse_mode: "Markdown" });
        
        await bot.sendMessage(chatId, "✅ Para confirmar o pagamento, clique abaixo:", {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🔍 Verificar o Pagamento ✅", callback_data: `VERIFY_CROSSSELL_${paymentResponse.id}` }
              ]
            ]
          }
        });
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento PIX para o cross-sell.");
      }
    }
    // Tratamento para remarketing com desconto
    else if (data && data.startsWith("REMARKETING_DISCOUNT_")) {
      const parts = data.split("_");
      const originalValue = parseFloat(parts[2]);
      const discountedValue = originalValue - 5.0;
      const paymentResponse = await gerarPix(discountedValue, "Pagamento do Plano com Desconto");
      if (paymentResponse) {
        const pixMessage = `
🔒 Pagamento com desconto gerado com sucesso!
💳 Valor: R$${discountedValue.toFixed(2)}

Para efetuar o pagamento, copie o código abaixo e cole no aplicativo do seu banco:

\`${paymentResponse.qr_code}\`

❗️ Atenção: Utilize "PIX Copia e Cola" no seu banco.
        `;
        await bot.sendMessage(chatId, pixMessage, { parse_mode: "Markdown" });
      } else {
        await bot.sendMessage(chatId, "❌ Erro ao gerar pagamento PIX com desconto.");
      }
    }
    // Tratamento para verificação de pagamento (para PLAN, UPSELL ou CROSSSELL)
    else if (data && data.startsWith("VERIFY_")) {
      let paymentType = "";
      let paymentId = "";
      if (data.startsWith("VERIFY_PLAN_")) {
        paymentType = "PLAN";
        paymentId = data.substring("VERIFY_PLAN_".length);
      } else if (data.startsWith("VERIFY_UPSELL_")) {
        paymentType = "UPSELL";
        paymentId = data.substring("VERIFY_UPSELL_".length);
      } else if (data.startsWith("VERIFY_CROSSSELL_")) {
        paymentType = "CROSSSELL";
        paymentId = data.substring("VERIFY_CROSSSELL_".length);
      } else {
        paymentId = data.replace("VERIFY_", "");
      }
      const status = await verificarStatusPix(paymentId);
      if (status === "confirmed" || status === "paid") {
        let groupLink = GRUPO_VIP_LINK; // padrão para planos
        if (paymentType === "UPSELL") groupLink = GRUPO_PLANO_ANUAL_LINK;
        else if (paymentType === "CROSSSELL") groupLink = GRUPO_CONTEUDO_PREMIUM_LINK;
        
        await bot.sendMessage(
          chatId,
          `✅ Pagamento aprovado! Bem-vindo ao nosso grupo VIP!
Aproveite os benefícios e conteúdos exclusivos.
Entre no grupo: ${groupLink}`
        );
      } else {
        await bot.sendMessage(chatId, "❌ O pagamento ainda não foi confirmado.");
      }
    }
  });
}

/**
 * Inicia o fluxo de long polling para uma instância do bot com o token informado.
 * Registra os handlers de eventos e retorna a instância do bot.
 */
export function startBotLongPolling(token: string): TelegramBot {
  const bot = new TelegramBot(token, { polling: true });
  console.log("🤖 Bot iniciado e ouvindo mensagens com token:", token);
  registerEventHandlers(bot);
  return bot;
}

// Caso deseje iniciar o bot utilizando o token padrão
startBotLongPolling(BOT_TOKEN);
