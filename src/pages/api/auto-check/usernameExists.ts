// /server/usernameExists.ts
import { TelegramClient } from "telegram";
import { Api } from "telegram/tl";

/**
 * Retorna true se o username existe, ou false caso contrário (ou em caso de erro).
 */
export async function usernameExists(client: TelegramClient, username: string): Promise<boolean> {
  try {
    const cleanName = username.replace(/^@/, "");
    const result = await client.invoke(
      new Api.contacts.ResolveUsername({ username: cleanName })
    );
    console.log("[usernameExists] ResolveUsername result:", result);
    return true;
  } catch (err: any) {
    console.log("[usernameExists] Erro ao resolver username:", err);
    return false;
  }
}
