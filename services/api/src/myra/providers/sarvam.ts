import { env } from "../../env";
import { MyraProvider } from "./types";

/**
 * Sarvam AI integration point. Not implemented yet: it needs a real API key
 * and a verified request/response shape (chat + tool-calling format) from
 * Sarvam's docs, neither of which is available in this environment. Wiring
 * it in is meant to be a self-contained job: implement runChat() the same
 * way anthropic.ts does — own tool-calling loop against Sarvam's API,
 * calling executeTool() for anything Myra decides to act on — then flip
 * MYRA_PROVIDER=sarvam.
 */
export function createSarvamProvider(): MyraProvider {
  const configured = !!env.sarvamApiKey;

  return {
    name: "sarvam",
    configured,
    async runChat() {
      return {
        reply: configured
          ? "Sarvam AI is configured with an API key, but the integration itself isn't implemented yet — runChat() in providers/sarvam.ts needs to call Sarvam's chat API and translate its tool-calling format."
          : "Sarvam AI isn't configured (missing SARVAM_API_KEY). Set MYRA_PROVIDER=sarvam and SARVAM_API_KEY, then implement runChat() in providers/sarvam.ts against Sarvam's actual API.",
        toolActionsTaken: [],
      };
    },
  };
}
