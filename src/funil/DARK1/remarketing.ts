import TelegramBot from "node-telegram-bot-api";
import { MESSAGES } from "./messages";
import { MEDIA } from "./media";

export async function sendRemarketing(bot: TelegramBot, chatId: number, originalValue: number) {
  const discountValue = 5.0;
  // Substitui o placeholder "{}" pela string do desconto (ex: "R$5,00")
  const remarketingMessage = MESSAGES.REMARKETING.replace("{}", `R$${discountValue.toFixed(2)}`);
  
  await bot.sendPhoto(chatId, MEDIA.REMARKETING, {
    caption: remarketingMessage,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { 
            text: "✅ Garantir Desconto", 
            callback_data: `REMARKETING_DISCOUNT_${originalValue}` // armazena o valor original escolhido
          }
        ]
      ]
    }
  });
}
