import { env } from "../../env";
import { MYRA_TOOLS, executeTool } from "../tools";
import { ChatTurnResult, MyraProvider } from "./types";

// Sarvam's Chat Completions API is OpenAI-compatible: POST /v1/chat/completions,
// Authorization: Bearer <key>, messages: [{role, content}], and function-calling
// via tools: [{type: "function", function: {name, description, parameters}}].
// sarvam-105b is Sarvam's model recommended for complex reasoning/agentic tool use
// (sarvam-105b-conversations is tuned for real-time voice instead).
const SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_MODEL = "sarvam-105b";

const SARVAM_TOOLS = MYRA_TOOLS.map((t) => ({
  type: "function" as const,
  function: { name: t.name, description: t.description, parameters: t.input_schema },
}));

interface SarvamToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

interface SarvamMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: SarvamToolCall[];
  tool_call_id?: string;
}

interface SarvamChatResponse {
  choices: { message: SarvamMessage }[];
}

export function createSarvamProvider(): MyraProvider {
  const configured = !!env.sarvamApiKey;

  return {
    name: "sarvam",
    configured,

    async runChat({ systemPrompt, history, userId, ctx }): Promise<ChatTurnResult> {
      if (!configured) {
        return {
          reply: "Sarvam AI isn't configured (missing SARVAM_API_KEY).",
          toolActionsTaken: [],
        };
      }

      const messages: SarvamMessage[] = [
        { role: "system", content: systemPrompt },
        ...history.map((m): SarvamMessage => ({ role: m.role === "myra" ? "assistant" : "user", content: m.content })),
      ];

      const toolActionsTaken: { tool: string; result: unknown }[] = [];
      let finalText = "";

      for (let iteration = 0; iteration < 4; iteration++) {
        const res = await fetch(SARVAM_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.sarvamApiKey}`,
          },
          body: JSON.stringify({
            model: SARVAM_MODEL,
            messages,
            tools: SARVAM_TOOLS,
            temperature: 0.4,
            max_tokens: 1024,
          }),
        });

        if (!res.ok) {
          throw new Error(`Sarvam API error ${res.status}: ${await res.text()}`);
        }

        const data = (await res.json()) as SarvamChatResponse;
        const message = data.choices[0].message;
        finalText = (message.content ?? "").trim();

        const toolCalls = message.tool_calls ?? [];
        if (toolCalls.length === 0) break;

        messages.push({ role: "assistant", content: message.content ?? null, tool_calls: toolCalls });

        for (const call of toolCalls) {
          try {
            const args = JSON.parse(call.function.arguments || "{}");
            const result = await executeTool(userId, ctx, call.function.name, args);
            toolActionsTaken.push({ tool: call.function.name, result });
            messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(result) });
          } catch (err) {
            messages.push({
              role: "tool",
              tool_call_id: call.id,
              content: `Error: ${err instanceof Error ? err.message : String(err)}`,
            });
          }
        }
      }

      return { reply: finalText || "Done.", toolActionsTaken };
    },
  };
}
