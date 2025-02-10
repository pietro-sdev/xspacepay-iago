// src/funil/botLongPolling.ts
import fs from "fs";
import TelegramBot from "node-telegram-bot-api";
import { BOT_TOKEN } from "./config";
import {
  MESSAGES,
  VIP_MESSAGES,
  PAYMENT_METHOD_PROMPT,
  PAYMENT_GENERATED,
  UPSELL_MESSAGE,
  CROSS_SELL_MESSAGE,
} from "./messages";
import { BUTTONS } from "./buttons";
import { MEDIA } from "./media";
import { gerarPix, verificarStatusPix } from "./pix";
import { criarPagamentoPayPal } from "./paypal";
import { criarPagamentoStripe } from "./stripe";
import { iniciarMonitoramentoPagamento } from "./remarketing";

// Links dos Grupos para upsell e cross-sell
const GRUPO_VIP_LINK = "https://t.me/+7qavgRQcz2pjMmYx"; // Grupo VIP após pagamento
const GRUPO_PLANO_ANUAL_LINK = "https://t.me/+7qavgRQcz2pjMmYx"; // Upsell: plano anual
const GRUPO_CONTEUDO_PREMIUM_LINK = "https://t.me/+7qavgRQcz2pjMmYx"; // Cross sell: Conteúdo Premium

// Mapeia os pagamentos pendentes (compartilhado entre as instâncias)
const pagamentosPendentes = new Map<
  string,
  { chatId: number; valor: number; idioma: string; tipo: string }
>();

/**
 * Registra todos os handlers de eventos (onText, on callback_query, etc.)
 * para a instância do bot recebida.
 */
function registerEventHandlers(bot: TelegramBot) {
  // Envia mensagem inicial com os botões de idioma
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, MESSAGES.start, {
      reply_markup: { inline_keyboard: BUTTONS.language },
    });
  });

  // Handler para todas as callback queries
  bot.on("callback_query", async (query) => {
    const chatId = query.message?.chat.id;
    const queryData = query.data;
    if (!chatId || !queryData) return;

    // --- Tratamento dos Botões de Desconto ---
    if (
      queryData.startsWith("pay_with_discount_") ||
      queryData.startsWith("pagar_con_descuento_") ||
      queryData.startsWith("pagar_com_desconto_")
    ) {
      const parts = queryData.split("_");
      const paymentId = parts[parts.length - 1];
      const user = pagamentosPendentes.get(paymentId);
      if (!user) {
        await bot.sendMessage(
          chatId,
          "Desculpe, pagamento não encontrado ou já processado."
        );
        return;
      }
      const desconto = (user.valor * 0.9).toFixed(2);
      if (user.tipo === "pix") {
        // Aqui é necessário passar o terceiro argumento (o token)
        const novoPagamento = await gerarPix(Number(desconto), "Pagamento VIP - 10% OFF",);
        if (novoPagamento) {
          await bot.sendMessage(
            chatId,
            `🔒 *Novo PIX gerado com 10% de desconto!*\n\n💳 *Valor:* R$ ${desconto}\n\n\`${novoPagamento.qr_code}\`\n\n⚠️ *Use a opção "PIX Copia e Cola" no seu banco.*`,
            { parse_mode: "Markdown" }
          );
        }
      } else {
        const currency = user.idioma === "es" ? "EUR" : "USD";
        const paymentFunction =
          user.tipo === "pay_with_paypal" ? criarPagamentoPayPal : criarPagamentoStripe;
        const link = await paymentFunction(Number(desconto), "VIP Subscription - 10% OFF", currency);
        if (link) {
          const msgDiscount =
            user.idioma === "us"
              ? `🛍 *Discount applied!*\n\n💳 *Amount:* $${desconto}\n\n🔗 [*Complete Payment*](${link})`
              : `🛍 *¡Descuento aplicado!*\n\n💳 *Monto:* €${desconto}\n\n🔗 [*Completar pago*](${link})`;
          await bot.sendMessage(chatId, msgDiscount, {
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          });
        }
      }
      pagamentosPendentes.delete(paymentId);
      return;
    }
    // --- Fim do Tratamento dos Botões de Desconto ---

    let response = "";
    let videoMessage = "";
    let buttons: TelegramBot.InlineKeyboardButton[][] = [];
    let gerarPagamento = false;

    switch (queryData) {
      case "lang_br":
        response = MESSAGES.br;
        videoMessage = MESSAGES.video_br;
        buttons = BUTTONS.colors.br;
        gerarPagamento = true;
        break;
      case "lang_us":
        response = MESSAGES.us;
        videoMessage = MESSAGES.video_us;
        buttons = BUTTONS.colors.us;
        pagamentosPendentes.set(chatId.toString(), {
          chatId,
          valor: 0,
          idioma: "us",
          tipo: "",
        });
        break;
      case "lang_es":
        response = MESSAGES.es;
        videoMessage = MESSAGES.video_es;
        buttons = BUTTONS.colors.es;
        pagamentosPendentes.set(chatId.toString(), {
          chatId,
          valor: 0,
          idioma: "es",
          tipo: "",
        });
        break;
      default:
        break;
    }

    if (response) {
      await bot.sendMessage(chatId, response);
      if (fs.existsSync(MEDIA.video)) {
        await bot.sendVideo(chatId, fs.createReadStream(MEDIA.video), {
          caption: videoMessage,
          reply_markup: { inline_keyboard: buttons },
        });
      }
    }

    // Fluxo para Brasil: gera PIX automaticamente
    if (gerarPagamento) {
      bot.once("callback_query", async (paymentQuery) => {
        const valores = {
          adquirir_10_00: 10.0,
          adquirir_15_00: 15.0,
          adquirir_20_00: 20.0,
          adquirir_25_00: 25.0,
          adquirir_30_00: 30.0,
        };
        const valor = valores[paymentQuery.data as keyof typeof valores];
        if (valor) {
          const pagamento = await gerarPix(valor, "Pagamento VIP no Telegram",);
          if (pagamento) {
            pagamentosPendentes.set(pagamento.id, {
              chatId,
              valor,
              idioma: "br",
              tipo: "pix",
            });
            iniciarMonitoramentoPagamento(bot, pagamento.id, chatId, "pix", pagamentosPendentes);
            await bot.sendMessage(
              chatId,
              `🔒 *Pagamento gerado com sucesso!*\n\n💳 *Valor:* R$ ${valor.toFixed(2)}\n\n\`${pagamento.qr_code}\`\n\n⚠️ *Use a opção "PIX Copia e Cola" no seu banco.*`,
              { parse_mode: "Markdown" }
            );
            await bot.sendMessage(chatId, "✅ Pagamento gerado com sucesso! Clique no botão abaixo para verificar:", {
              parse_mode: "Markdown",
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🔍 Verificar o Pagamento ✅",
                      callback_data: `verificar_pagamento_${pagamento.id}`,
                    },
                  ],
                ],
              },
            });
          }
        }
      });
    }

    // Verifica o status do pagamento
    if (queryData.startsWith("verificar_pagamento_")) {
      const paymentId = queryData.replace("verificar_pagamento_", "");
      const status = await verificarStatusPix(paymentId,);
      const user = pagamentosPendentes.get(paymentId);
      if (status === "confirmed" || status === "paid") {
        if (user) {
          await bot.sendMessage(chatId, MESSAGES.paymentConfirmed, { parse_mode: "Markdown" });
          await bot.sendMessage(chatId, VIP_MESSAGES[user.idioma as keyof typeof VIP_MESSAGES], {
            reply_markup: { inline_keyboard: BUTTONS.vip[user.idioma as keyof typeof BUTTONS.vip] },
          });
          // --- Upsell e Cross Sell ---
          if (user.idioma === "br") {
            await bot.sendMessage(chatId, UPSELL_MESSAGE.br, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image3);
            await bot.sendMessage(chatId, `Clique aqui para acessar nosso grupo anual: ${GRUPO_PLANO_ANUAL_LINK}`, { parse_mode: "Markdown" });
            await bot.sendMessage(chatId, CROSS_SELL_MESSAGE.br, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image4);
            await bot.sendMessage(chatId, `Clique aqui para acessar nosso grupo de Conteúdo Premium: ${GRUPO_CONTEUDO_PREMIUM_LINK}`, { parse_mode: "Markdown" });
          } else if (user.idioma === "us") {
            await bot.sendMessage(chatId, UPSELL_MESSAGE.us, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image3);
            await bot.sendMessage(chatId, `Click here to join our annual plan group: ${GRUPO_PLANO_ANUAL_LINK}`, { parse_mode: "Markdown" });
            await bot.sendMessage(chatId, CROSS_SELL_MESSAGE.us, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image4);
            await bot.sendMessage(chatId, `Click here to join our Premium Content group: ${GRUPO_CONTEUDO_PREMIUM_LINK}`, { parse_mode: "Markdown" });
          } else if (user.idioma === "es") {
            await bot.sendMessage(chatId, UPSELL_MESSAGE.es, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image3);
            await bot.sendMessage(chatId, `Haz clic aquí para unirte a nuestro grupo anual: ${GRUPO_PLANO_ANUAL_LINK}`, { parse_mode: "Markdown" });
            await bot.sendMessage(chatId, CROSS_SELL_MESSAGE.es, { parse_mode: "Markdown" });
            await bot.sendPhoto(chatId, MEDIA.image4);
            await bot.sendMessage(chatId, `Haz clic aquí para unirte a nuestro grupo de Contenido Premium: ${GRUPO_CONTEUDO_PREMIUM_LINK}`, { parse_mode: "Markdown" });
          }
          // --- Fim Upsell / Cross Sell ---
          pagamentosPendentes.delete(paymentId);
        }
      } else {
        await bot.sendMessage(chatId, MESSAGES.paymentNotIdentified, { parse_mode: "Markdown" });
      }
    }

    const valores = {
      adquirir_10_00: 10.0,
      adquirir_15_00: 15.0,
      adquirir_20_00: 20.0,
      adquirir_25_00: 25.0,
      adquirir_30_00: 30.0,
    };

    // Quando o usuário seleciona um valor
    if (pagamentosPendentes.has(chatId.toString()) && queryData.startsWith("adquirir_")) {
      const valor = valores[queryData as keyof typeof valores];
      const user = pagamentosPendentes.get(chatId.toString());
      if (user) pagamentosPendentes.set(chatId.toString(), { ...user, valor });
      if (user) {
        if (user.idioma === "us") {
          await bot.sendMessage(chatId, PAYMENT_METHOD_PROMPT.us, {
            reply_markup: { inline_keyboard: BUTTONS.paymentMethod.us },
          });
        } else if (user.idioma === "es") {
          await bot.sendMessage(chatId, PAYMENT_METHOD_PROMPT.es, {
            reply_markup: { inline_keyboard: BUTTONS.paymentMethod.es },
          });
        } else {
          const pagamento = await gerarPix(valor, "Pagamento VIP no Telegram",);
          if (pagamento) {
            pagamentosPendentes.set(pagamento.id, { chatId, valor, idioma: user.idioma, tipo: "pix" });
            iniciarMonitoramentoPagamento(bot, pagamento.id, chatId, "pix", pagamentosPendentes);
            await bot.sendMessage(
              chatId,
              `🔒 *Pagamento gerado com sucesso!*\n\n💳 *Valor:* R$ ${valor.toFixed(2)}\n\n\`${pagamento.qr_code}\`\n\n⚠️ *Use a opção "PIX Copia e Cola" no seu banco.*`,
              { parse_mode: "Markdown" }
            );
          }
        }
      }
    }

    // Processa pagamentos externos (EUA e ESPAÑA)
    if (queryData === "pay_with_paypal" || queryData === "pay_with_stripe") {
      const user = pagamentosPendentes.get(chatId.toString());
      if (!user) return;
      const currency = user.idioma === "es" ? "EUR" : "USD";
      const paymentFunction = queryData === "pay_with_paypal" ? criarPagamentoPayPal : criarPagamentoStripe;
      const link = await paymentFunction(user.valor, "VIP Subscription", currency);
      if (link) {
        pagamentosPendentes.set(link, { chatId, valor: user.valor, idioma: user.idioma, tipo: queryData });
        iniciarMonitoramentoPagamento(bot, link, chatId, queryData, pagamentosPendentes);
        const msgPayment =
          user.idioma === "us"
            ? PAYMENT_GENERATED.us(user.valor.toFixed(2), link)
            : PAYMENT_GENERATED.es(user.valor.toFixed(2), link);
        await bot.sendMessage(chatId, msgPayment, { parse_mode: "Markdown", disable_web_page_preview: true });
      }
    }
  });
}

/**
 * Inicia o fluxo de long polling para uma única instância do bot usando o token informado.
 * Registra os handlers e retorna a instância.
 */
export function startBotLongPolling(token: string): TelegramBot {
  const bot = new TelegramBot(token, { polling: true });
  console.log("🤖 Bot iniciado com token:", token);
  registerEventHandlers(bot);
  return bot;
}

/**
 * Variável para armazenar as instâncias ativas.
 */
let bots: TelegramBot[] = [];

/**
 * Para quaisquer instâncias existentes e inicia novas instâncias para cada token da lista.
 * Retorna o array de bots ativos.
 */
export function startBotsLongPolling(tokens: string[]): TelegramBot[] {
  // Para as instâncias anteriores (se houver)
  bots.forEach((b) => b.stopPolling());
  bots = [];
  tokens.forEach((token) => {
    const newBot = startBotLongPolling(token);
    bots.push(newBot);
  });
  console.log("🤖 Bots iniciados com tokens:", tokens);
  return bots;
}

/**
 * Atualiza (ou reinicia) o fluxo dos bots usando os novos tokens.
 */
export function updateLongPollingBots(newTokens: string[]): TelegramBot[] {
  console.log("Atualizando long polling bots com os tokens:", newTokens);
  return startBotsLongPolling(newTokens);
}
