import { randomUUID } from "crypto";
import { MyraInsightAction, ServiceKind } from "@nexserv/shared";
import { AggregatedContext } from "./types";

export interface GeneratedInsight {
  id: string;
  headline: string;
  detail: string;
  confidence: number;
  service: ServiceKind | "general";
  action?: MyraInsightAction;
}

type Rule = (ctx: AggregatedContext) => GeneratedInsight | null;

// Each rule encodes one piece of "Myra doesn't just respond" behavior: a
// condition worth noticing plus the recommendation that follows from it.
// Rules are intentionally small and independently testable — the ranking
// step below decides which ones actually surface.

const rainyCommuteRule: Rule = (ctx) => {
  const isCommuteWindow = ctx.timeOfDayBucket === "morning" || ctx.timeOfDayBucket === "early_morning";
  if (ctx.weather.condition !== "rain" || !isCommuteWindow) return null;
  return {
    id: randomUUID(),
    headline: "Rain expected during your commute",
    detail:
      "Rain is likely around your usual travel time today. Leaving about 15 minutes earlier can help you avoid the peak congestion that follows.",
    confidence: 0.82,
    service: "ride",
    action: { kind: "open_screen", params: { screen: "ride" } },
  };
};

const heavyTrafficRule: Rule = (ctx) => {
  if (ctx.traffic.level !== "heavy") return null;
  return {
    id: randomUUID(),
    headline: "Heavy traffic on your usual routes",
    detail: `${ctx.traffic.note}. A bike or auto may get you there faster than a cab right now.`,
    confidence: 0.68,
    service: "ride",
    action: { kind: "open_screen", params: { screen: "ride" } },
  };
};

const usualRestaurantRule: Rule = (ctx) => {
  const meal = ctx.recentServiceHistory.lastFoodOrder;
  const isMealWindow = ctx.timeOfDayBucket === "midday" || ctx.timeOfDayBucket === "evening";
  if (!meal || !isMealWindow || meal.whenDaysAgo > 21) return null;
  return {
    id: randomUUID(),
    headline: `${meal.restaurantName} has your usual ready`,
    detail: `You ordered from ${meal.restaurantName} last time. It's available now with a normal delivery window — want the same order again?`,
    confidence: 0.74,
    service: "food",
    action: { kind: "reorder_food", params: { restaurantId: meal.restaurantId, itemIds: meal.itemIds } },
  };
};

const homeMaintenanceRule: Rule = (ctx) => {
  const service = ctx.recentServiceHistory.lastHomeService;
  if (!service || service.category !== "ac_technician" || service.whenDaysAgo < 150) return null;
  return {
    id: randomUUID(),
    headline: "AC maintenance is due",
    detail: "Your AC was last serviced about 6 months ago. Scheduling a checkup now can help it run efficiently through the season.",
    confidence: 0.71,
    service: "home",
    action: {
      kind: "schedule_home_service",
      params: { category: "ac_technician", suggestedSlot: "This weekend" },
    },
  };
};

const medsRefillRule: Rule = (ctx) => {
  const meds = ctx.recentServiceHistory.lastMedOrder;
  if (!meds || meds.whenDaysAgo < 25) return null;
  return {
    id: randomUUID(),
    headline: "Time for your regular refill",
    detail: "Based on your last order, you're likely due for a refill soon. Nearby pharmacies currently show same-day availability.",
    confidence: 0.65,
    service: "meds",
    action: { kind: "refill_medicine", params: { medicineId: meds.medicineIds[0] } },
  };
};

const RULES: Rule[] = [
  rainyCommuteRule,
  heavyTrafficRule,
  usualRestaurantRule,
  homeMaintenanceRule,
  medsRefillRule,
];

/**
 * Deterministic, explainable insight generation. This is the reliable core —
 * every insight here can be traced back to a specific signal, which matters
 * for trust. The chat/LLM layer (chatService.ts) is used separately for
 * open-ended conversation and can reference these same insights.
 */
export function generateInsights(ctx: AggregatedContext, limit = 3): GeneratedInsight[] {
  const candidates = RULES.map((rule) => rule(ctx)).filter((i): i is GeneratedInsight => i !== null);
  return candidates.sort((a, b) => b.confidence - a.confidence).slice(0, limit);
}
