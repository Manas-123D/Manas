import { env } from "../../env";
import { MyraProvider } from "./types";

/**
 * Grok (xAI) integration point. xAI's API is OpenAI-compatible, so runChat()
 * here would look like a standard OpenAI-style function-calling loop against
 * https://api.x.ai/v1/chat/completions — but it's not implemented yet since
 * there's no API key available in this environment to build and test against.
 * Same contract as anthropic.ts: own tool-calling loop, call executeTool()
 * for actions, then flip MYRA_PROVIDER=grok.
 */
export function createGrokProvider(): MyraProvider {
  const configured = !!env.grokApiKey;

  return {
    name: "grok",
    configured,
    async runChat() {
      return {
        reply: configured
          ? "Grok is configured with an API key, but the integration itself isn't implemented yet — runChat() in providers/grok.ts needs to call xAI's OpenAI-compatible chat completions endpoint and translate its function-calling format."
          : "Grok isn't configured (missing GROK_API_KEY). Set MYRA_PROVIDER=grok and GROK_API_KEY, then implement runChat() in providers/grok.ts against xAI's API.",
        toolActionsTaken: [],
      };
    },
  };
}
