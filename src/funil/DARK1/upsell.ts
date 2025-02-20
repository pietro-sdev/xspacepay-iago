import TelegramBot from "node-telegram-bot-api";
import { MESSAGES } from "./messages";
import { MEDIA } from "./media";

export async function sendUpsell(bot: TelegramBot, chatId: number) {
  await bot.sendVideo(chatId, MEDIA.UPSELL, {
    caption: MESSAGES.UPSELL,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Receber VIP", callback_data: "UPSELL" }
        ]
      ]
    }
  });
}
