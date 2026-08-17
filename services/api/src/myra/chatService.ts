import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env";
import { prisma } from "../db/prisma";
import { buildContext } from "./contextEngine";
import { generateInsights } from "./insightEngine";
import { MYRA_TOOLS, executeTool } from "./tools";
import { MEDICAL_ADVICE_DISCLAIMER } from "../modules/meds/service";
import { AggregatedContext } from "./types";

const client = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;

function systemPrompt(ctx: AggregatedContext): string {
  const insights = generateInsights(ctx, 5);
  return `You are Myra, the intelligence layer of NexServ — an everyday-life AI companion, not a generic chatbot.

NexServ connects four services: NexRide (mobility), NexFood (food delivery), NexMeds (medicine & healthcare logistics)
and NexHome (household services: electrician, plumber, AC technician, cleaning, appliance repair).

Your job is to go beyond answering questions: understand the user's situation, connect it to what you know about
them, and help them decide — then act only with their explicit approval via tools.

Ground rules:
- Be concise, warm and direct. Skip filler like "As an AI...". Talk like a sharp, trustworthy assistant who knows
  the user, not a search engine.
- Never call a booking/order tool (book_ride, place_food_order, refill_last_medicine_order, book_home_service)
  without the user clearly approving the specific action first in this conversation. Use get_ride_quotes,
  list_restaurants and list_medicines freely to inform recommendations.
- For NexMeds: you may help with ordering, refills, and reminders. You must NEVER give medical advice, dosage
  guidance, or suggest substitutions. ${MEDICAL_ADVICE_DISCLAIMER}
- When you recommend something, say briefly why, referencing the real context you were given (traffic, weather,
  time, history) — that specificity is what makes you feel intelligent rather than generic.
- If nothing in context is actionable, have a normal helpful conversation.

Live context for this user right now:
- City: ${ctx.city}
- Local time bucket: ${ctx.timeOfDayBucket}
- Weather: ${ctx.weather.condition}, ${ctx.weather.tempC}°C
- Traffic: ${ctx.traffic.level} (${ctx.traffic.note})
- Recent activity: ${JSON.stringify(ctx.recentServiceHistory)}
- Standing preferences: ${JSON.stringify(ctx.preferences)}
- Insights Myra has already surfaced proactively (avoid just repeating these verbatim): ${JSON.stringify(
    insights.map((i) => i.headline)
  )}`;
}

export interface ChatTurnResult {
  reply: string;
  toolActionsTaken: { tool: string; result: unknown }[];
}

/**
 * One user↔Myra chat turn. Loads full context, runs the Anthropic tool-use
 * loop (Myra may call read-only tools freely and mutating tools only after
 * the user has approved in-conversation), and persists both sides of the
 * exchange.
 */
export async function runChatTurn(userId: string, userMessage: string): Promise<ChatTurnResult> {
  await prisma.chatMessage.create({ data: { userId, role: "user", content: userMessage } });

  if (!client) {
    const reply =
      "Myra's language model isn't configured yet (missing ANTHROPIC_API_KEY on the server). " +
      "Once that's set, I'll be able to have full conversations and take actions for you.";
    await prisma.chatMessage.create({ data: { userId, role: "myra", content: reply } });
    return { reply, toolActionsTaken: [] };
  }

  const ctx = await buildContext(userId);
  const history = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    take: 30,
  });

  const messages: Anthropic.MessageParam[] = history.map((m) => ({
    role: m.role === "myra" ? "assistant" : "user",
    content: m.content,
  }));

  const toolActionsTaken: { tool: string; result: unknown }[] = [];
  let finalText = "";

  for (let iteration = 0; iteration < 4; iteration++) {
    const response = await client.messages.create({
      model: env.myraModel,
      max_tokens: 1024,
      system: systemPrompt(ctx),
      tools: MYRA_TOOLS,
      messages,
    });

    const textParts = response.content.filter((b) => b.type === "text").map((b: any) => b.text);
    finalText = textParts.join("\n").trim();

    const toolUses = response.content.filter((b) => b.type === "tool_use") as Anthropic.ToolUseBlock[];
    if (toolUses.length === 0) break;

    messages.push({ role: "assistant", content: response.content });

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const use of toolUses) {
      try {
        const result = await executeTool(userId, ctx, use.name, use.input as Record<string, any>);
        toolActionsTaken.push({ tool: use.name, result });
        toolResults.push({ type: "tool_result", tool_use_id: use.id, content: JSON.stringify(result) });
      } catch (err) {
        toolResults.push({
          type: "tool_result",
          tool_use_id: use.id,
          content: `Error: ${err instanceof Error ? err.message : String(err)}`,
          is_error: true,
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }

  const reply = finalText || "Done.";
  await prisma.chatMessage.create({ data: { userId, role: "myra", content: reply } });
  return { reply, toolActionsTaken };
}

export async function getChatHistory(userId: string) {
  return prisma.chatMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" } });
}
