import { AggregatedContext } from "../types";

export interface ChatTurnResult {
  reply: string;
  toolActionsTaken: { tool: string; result: unknown }[];
}

export interface ChatHistoryItem {
  role: "user" | "myra";
  content: string;
}

/**
 * Every model provider owns its own tool-calling loop against its own API —
 * Anthropic's tool_use content blocks, OpenAI-style function_call objects
 * (which Grok's API mirrors) and Sarvam's chat format aren't compatible
 * enough to flatten into one shared loop. What's shared is the contract:
 * given a system prompt, conversation history and userId/context, produce a
 * reply and the list of NexServ actions actually taken.
 */
export interface MyraProvider {
  readonly name: string;
  readonly configured: boolean;
  runChat(params: {
    systemPrompt: string;
    history: ChatHistoryItem[];
    userId: string;
    ctx: AggregatedContext;
  }): Promise<ChatTurnResult>;
}
