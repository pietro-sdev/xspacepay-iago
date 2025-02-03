// /server/pythonBotsManager.ts

import { spawn, ChildProcessWithoutNullStreams } from "child_process";

interface PythonBotProcess {
  token: string;
  process: ChildProcessWithoutNullStreams;
}

const activePythonBots: PythonBotProcess[] = [];

/**
 * Inicia uma instância do bot Python com o BOT_TOKEN fornecido e registra no ativo.
 * @param botToken O token do bot recém-criado.
 */
export function startAndRegisterPythonBot(botToken: string) {
  const pythonProcess = spawn("python", ["C:/projetos/bot_21/main21.py"], {
    env: { ...process.env, BOT_TOKEN: botToken },
    detached: true, // Permite que o processo continue rodando independentemente do processo pai
    stdio: 'ignore'  // Ignora os streams de I/O
  });

  // Detach do processo para que ele continue rodando em background
  pythonProcess.unref();

  // Adiciona ao registro ativo
  activePythonBots.push({ token: botToken, process: pythonProcess });

  console.log(`[pythonBotsManager] Iniciado bot Python com token: ${botToken}`);
}

/**
 * Opcional: Função para encerrar todas as instâncias de bots Python
 */
export function stopAllPythonBots() {
  activePythonBots.forEach(bot => {
    bot.process.kill();
    console.log(`[pythonBotsManager] Encerrado bot Python com token: ${bot.token}`);
  });
  activePythonBots.length = 0;
}
