// /server/autoCheckManager.ts
import { checkChannelLinksAndReplace } from "./checkChannelLinks";

interface AutoCheckConfig {
  channelId: string;
  intervalValue: number;
  intervalUnit: "minutes" | "hours" | "days";
}

let autoCheckTimer: NodeJS.Timeout | null = null;
let currentConfig: AutoCheckConfig = {
  channelId: "",
  intervalValue: 30,
  intervalUnit: "minutes",
};

export async function setAutoCheckConfig(config: AutoCheckConfig) {
  console.log("[autoCheckManager] Recebida config:", config);
  currentConfig = config;
  console.log("[autoCheckManager] Nova config de auto-check:", currentConfig);
  if (autoCheckTimer) {
    console.log("[autoCheckManager] Limpando timer antigo...");
    clearInterval(autoCheckTimer);
    autoCheckTimer = null;
  }

  let ms = config.intervalValue * 60_000;
  if (config.intervalUnit === "hours") {
    ms = config.intervalValue * 60 * 60_000;
  } else if (config.intervalUnit === "days") {
    ms = config.intervalValue * 24 * 60 * 60_000;
  }

  autoCheckTimer = setInterval(() => {
    console.log("[AutoCheck] Iniciando verificação de links...");
    checkChannelLinksAndReplace(currentConfig.channelId)
      .then((result) => {
        console.log("[AutoCheck] checkChannelLinksAndReplace finalizado. Resultado:", result);
      })
      .catch((err) => {
        console.error("Erro no checkChannelLinksAndReplace:", err);
      });
  }, ms);

  console.log(`[autoCheckManager] Agendado check a cada ${ms / 1000} segundos.`);
}
