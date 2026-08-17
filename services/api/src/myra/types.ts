export interface NearbySpot {
  name: string;
  vibe: string; // short sensory description Myra can draw on ("soft birdsong, shaded trails")
  goodFor: string[]; // e.g. ["walk", "unwind", "run"]
  distanceKm: number;
  quietness: "quiet" | "moderate" | "busy";
}

export interface AggregatedContext {
  userId: string;
  city: string;
  now: Date;
  timeOfDayBucket: "early_morning" | "morning" | "midday" | "evening" | "night";
  weather: { condition: "clear" | "rain" | "storm" | "heat"; tempC: number };
  traffic: { level: "light" | "moderate" | "heavy"; note: string };
  recentServiceHistory: {
    lastRide?: { vehicleType: string; whenDaysAgo: number; toWork: boolean };
    lastFoodOrder?: { restaurantId: string; restaurantName: string; itemIds: string[]; whenDaysAgo: number };
    lastHomeService?: { category: string; whenDaysAgo: number };
    lastMedOrder?: { medicineIds: string[]; whenDaysAgo: number };
  };
  preferences: Record<string, string>;
  nearbySpots: NearbySpot[];
}
