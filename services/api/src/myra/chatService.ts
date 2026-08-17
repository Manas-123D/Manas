import { prisma } from "../db/prisma";
import { buildContext } from "./contextEngine";
import { buildSystemPrompt } from "./systemPrompt";
import { getMyraProvider, ChatTurnResult } from "./providers";

export type { ChatTurnResult } from "./providers";

/**
 * One user↔Myra chat turn. Loads full context, delegates to whichever model
 * provider is configured (see providers/), and persists both sides of the
 * exchange.
 */
export async function runChatTurn(userId: string, userMessage: string): Promise<ChatTurnResult> {
  await prisma.chatMessage.create({ data: { userId, role: "user", content: userMessage } });

  const ctx = await buildContext(userId);
  const history = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  const provider = getMyraProvider();
  const result = await provider.runChat({
    systemPrompt: buildSystemPrompt(ctx),
    history: history.map((m) => ({ role: m.role === "myra" ? "myra" : "user", content: m.content })),
    userId,
    ctx,
  });

  await prisma.chatMessage.create({ data: { userId, role: "myra", content: result.reply } });
  return result;
}

export async function getChatHistory(userId: string) {
  return prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
}
