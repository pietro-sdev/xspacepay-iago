import TelegramBot from "node-telegram-bot-api";
import { MESSAGES } from "./messages";
import { MEDIA } from "./media";

export async function sendCrossell(bot: TelegramBot, chatId: number) {
  await bot.sendVideo(chatId, MEDIA.CROSSELL, {
    caption: MESSAGES.CROSSSELL,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "✅ Receber Conteúdo Premium", callback_data: "CROSSSELL" }
        ]
      ]
    }
  });
}
