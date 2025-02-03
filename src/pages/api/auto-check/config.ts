// /pages/api/auto-check/config.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { setAutoCheckConfig } from "./autoCheckManager";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    console.log("[config.ts] Método não permitido:", req.method);
    return res.status(405).json({ error: "Método não permitido." });
  }

  const { channelId, intervalValue, intervalUnit } = req.body;
  console.log("[config.ts] Recebido body:", req.body);

  if (!channelId || !intervalValue || !intervalUnit) {
    console.log("[config.ts] Dados incompletos.");
    return res.status(400).json({ error: "Dados incompletos." });
  }

  try {
    await setAutoCheckConfig({ channelId, intervalValue, intervalUnit });
    console.log("[config.ts] Configuração salva com sucesso.");
    return res.status(200).json({ message: "Configuração salva." });
  } catch (error: any) {
    console.error("[config.ts] Erro ao salvar config:", error);
    return res.status(500).json({ error: error.message || "Erro interno." });
  }
}
