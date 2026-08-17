import Anthropic from "@anthropic-ai/sdk";
import { env } from "../../env";
import { MYRA_TOOLS, executeTool } from "../tools";
import { ChatTurnResult, MyraProvider } from "./types";

export function createAnthropicProvider(): MyraProvider {
  const client = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;

  return {
    name: "anthropic",
    configured: !!client,

    async runChat({ systemPrompt, history, userId, ctx }): Promise<ChatTurnResult> {
      if (!client) {
        return {
          reply:
            "Myra's language model isn't configured yet (missing ANTHROPIC_API_KEY on the server). " +
            "Once that's set, I'll be able to have full conversations and take actions for you.",
          toolActionsTaken: [],
        };
      }

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
          system: systemPrompt,
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

      return { reply: finalText || "Done.", toolActionsTaken };
    },
  };
}
