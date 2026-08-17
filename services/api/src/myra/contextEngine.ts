import { prisma } from "../db/prisma";
import { AggregatedContext, NearbySpot } from "./types";

// Standing in for a real Places API: a small curated set of real, specific
// spots per launch city, with enough sensory detail that Myra can give a
// grounded, concrete recommendation ("KBR Park, soft birdsong, shaded
// trails") instead of a vague "go for a walk". Swap for Google/Mapbox Places
// once there's a key — the shape (NearbySpot[]) stays the same either way.
const NEARBY_SPOTS: Record<string, NearbySpot[]> = {
  Hyderabad: [
    {
      name: "KBR National Park",
      vibe: "shaded walking trails, birdsong, far enough from the main road that traffic noise fades out",
      goodFor: ["walk", "unwind", "reset"],
      distanceKm: 8.4,
      quietness: "quiet",
    },
    {
      name: "Durgam Cheruvu (Secret Lake)",
      vibe: "a rocky lakeside path with a glass sky-walk bridge, quiet water, best right around sunset",
      goodFor: ["walk", "unwind", "photography"],
      distanceKm: 4.6,
      quietness: "quiet",
    },
    {
      name: "Kondapur Botanical Garden",
      vibe: "wide green lawns, a small lake, mostly local families and joggers - calm on weekday evenings",
      goodFor: ["walk", "run", "unwind"],
      distanceKm: 3.9,
      quietness: "moderate",
    },
    {
      name: "Necklace Road (Hussain Sagar)",
      vibe: "a long lakeside promenade with an open breeze, lively but never crowded on the walking path",
      goodFor: ["walk", "run"],
      distanceKm: 11.2,
      quietness: "moderate",
    },
  ],
};

// Weather/traffic providers are pluggable. For launch-city rollout, swap these
// two functions for real calls (e.g. OpenWeather, Google Maps Traffic) — the
// rest of Myra only depends on the AggregatedContext shape, not the source.
async function fetchWeather(_city: string): Promise<AggregatedContext["weather"]> {
  const hour = new Date().getHours();
  const isMonsoonish = hour % 5 === 0; // deterministic placeholder signal
  return isMonsoonish
    ? { condition: "rain", tempC: 24 }
    : { condition: "clear", tempC: 29 };
}

async function fetchTraffic(_city: string): Promise<AggregatedContext["traffic"]> {
  const hour = new Date().getHours();
  const isPeak = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 20);
  return isPeak
    ? { level: "heavy", note: "Peak commute hours in your area" }
    : { level: "light", note: "Roads are relatively clear" };
}

function timeBucket(now: Date): AggregatedContext["timeOfDayBucket"] {
  const h = now.getHours();
  if (h < 6) return "night";
  if (h < 9) return "early_morning";
  if (h < 12) return "morning";
  if (h < 17) return "midday";
  if (h < 21) return "evening";
  return "night";
}

function daysAgo(date: Date, now: Date): number {
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Builds the single context object every Myra insight and chat turn reasons over.
 * Combines user context, service history, time and (pluggable) environmental
 * signals into one snapshot — this is where "Myra understands" becomes concrete.
 */
export async function buildContext(userId: string): Promise<AggregatedContext> {
  const now = new Date();

  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

  const [preferences, lastRide, lastFoodOrder, lastHomeService, lastMedOrder] = await Promise.all([
    prisma.preference.findMany({ where: { userId } }),
    prisma.rideRequest.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.foodOrder.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.homeServiceRequest.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.medOrder.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
  ]);

  let lastFoodOrderContext: AggregatedContext["recentServiceHistory"]["lastFoodOrder"];
  if (lastFoodOrder) {
    const restaurant = await prisma.restaurant.findUnique({ where: { id: lastFoodOrder.restaurantId } });
    const items = lastFoodOrder.items as { itemId: string; quantity: number }[];
    lastFoodOrderContext = {
      restaurantId: lastFoodOrder.restaurantId,
      restaurantName: restaurant?.name ?? "your usual place",
      itemIds: items.map((i) => i.itemId),
      whenDaysAgo: daysAgo(lastFoodOrder.createdAt, now),
    };
  }

  const [weather, traffic] = await Promise.all([fetchWeather(user.city), fetchTraffic(user.city)]);

  return {
    userId,
    city: user.city,
    now,
    timeOfDayBucket: timeBucket(now),
    weather,
    traffic,
    recentServiceHistory: {
      lastRide: lastRide
        ? {
            vehicleType: lastRide.vehicleType,
            whenDaysAgo: daysAgo(lastRide.createdAt, now),
            toWork:
              !!user.workLat &&
              Math.abs(lastRide.dropoffLat - (user.workLat ?? 0)) < 0.01 &&
              Math.abs(lastRide.dropoffLng - (user.workLng ?? 0)) < 0.01,
          }
        : undefined,
      lastFoodOrder: lastFoodOrderContext,
      lastHomeService: lastHomeService
        ? { category: lastHomeService.category, whenDaysAgo: daysAgo(lastHomeService.createdAt, now) }
        : undefined,
      lastMedOrder: lastMedOrder
        ? { medicineIds: lastMedOrder.medicineIds, whenDaysAgo: daysAgo(lastMedOrder.createdAt, now) }
        : undefined,
    },
    preferences: Object.fromEntries(preferences.map((p) => [p.key, p.value])),
    nearbySpots: NEARBY_SPOTS[user.city] ?? [],
  };
}
