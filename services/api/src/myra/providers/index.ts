import { env } from "../../env";
import { MyraProvider } from "./types";
import { createAnthropicProvider } from "./anthropic";
import { createSarvamProvider } from "./sarvam";
import { createGrokProvider } from "./grok";

export type { MyraProvider, ChatTurnResult, ChatHistoryItem } from "./types";

export function getMyraProvider(): MyraProvider {
  switch (env.myraProvider) {
    case "sarvam":
      return createSarvamProvider();
    case "grok":
      return createGrokProvider();
    case "anthropic":
    default:
      return createAnthropicProvider();
  }
}
