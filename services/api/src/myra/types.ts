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
}
