import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MyraInsight, MyraInsightAction, Restaurant } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { MyraHeroBanner } from "../components/MyraHeroBanner";
import { TrendingCard } from "../components/TrendingCard";
import { ServiceTile } from "../components/ServiceTile";
import { useTheme, brand } from "../theme";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

const SERVICES: { label: string; emoji: string; color: string; screen: string }[] = [
  { label: "NexRide", emoji: "🚕", color: brand.ride, screen: "NexRide" },
  { label: "NexFood", emoji: "🍔", color: brand.food, screen: "NexFood" },
  { label: "NexMeds", emoji: "💊", color: brand.meds, screen: "NexMeds" },
  { label: "NexHome", emoji: "🏠", color: brand.home, screen: "NexHome" },
];

function greetingForHour(hour: number): string {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  if (hour < 21) return "Good evening";
  return "Good night";
}

export function HomeScreen() {
  const { colors, spacing, type } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [insights, setInsights] = useState<MyraInsight[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [insightsRes, restaurantsRes] = await Promise.all([
        apiRequest<{ insights: MyraInsight[] }>("/myra/insights"),
        apiRequest<{ restaurants: Restaurant[] }>("/food/restaurants").catch(() => ({ restaurants: [] })),
      ]);
      setInsights(insightsRes.insights.filter((i) => !i.dismissed));
      setRestaurants(restaurantsRes.restaurants);
    } catch {
      // Best-effort: an empty feed is a fine fallback if the API is unreachable.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function handleAct(insight: MyraInsight) {
    const action = insight.action as MyraInsightAction | undefined;
    if (!action) return;
    if (action.kind === "open_screen") {
      navigation.navigate(action.params.screen === "ride" ? "NexRide" : action.params.screen === "food" ? "NexFood" : action.params.screen === "meds" ? "NexMeds" : "NexHome");
    } else {
      navigation.navigate("MyraChat", { seedMessage: `Go ahead and act on: "${insight.headline}"` });
    }
  }

  async function handleDismiss(insight: MyraInsight) {
    setInsights((prev) => prev.filter((i) => i.id !== insight.id));
    try {
      await apiRequest(`/myra/insights/${insight.id}/dismiss`, { method: "POST" });
    } catch {
      // Non-critical; the insight will simply resurface on next fetch.
    }
  }

  const topInsight = insights[0];
  const firstName = user?.name?.split(" ")[0] ?? "there";
  const trendingRestaurants = restaurants.filter((r) => r.trending).length > 0 ? restaurants.filter((r) => r.trending) : restaurants;

  return (
    <Screen scroll={false} style={{ flex: 1, padding: 0 }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.textSecondary} />}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[type.caption, { color: colors.textMuted }]}>{greetingForHour(new Date().getHours())}</Text>
          <Text style={[type.display, { color: colors.textPrimary }]}>{firstName} 👋</Text>
        </View>

        {topInsight ? (
          <MyraHeroBanner
            insight={topInsight}
            extraCount={insights.length - 1}
            onAct={() => handleAct(topInsight)}
            onDismiss={() => handleDismiss(topInsight)}
            onOpenChat={() => navigation.navigate("MyraChat")}
          />
        ) : (
          !loading && (
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, borderWidth: 1, borderColor: colors.border }}>
              <Text style={[type.body, { color: colors.textSecondary }]}>
                Nothing urgent right now — Myra's watching traffic, weather and your routines and will speak up when something's worth it.
              </Text>
            </View>
          )
        )}

        <View style={{ gap: spacing.md }}>
          <Text style={[type.subtitle, { color: colors.textPrimary }]}>Services</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.md }}>
            {SERVICES.map((s) => (
              <ServiceTile key={s.label} label={s.label} emoji={s.emoji} color={s.color} onPress={() => navigation.navigate(s.screen)} />
            ))}
          </View>
        </View>

        {trendingRestaurants.length > 0 && (
          <View style={{ gap: spacing.md }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[type.subtitle, { color: colors.textPrimary }]}>Nearby & trending</Text>
              <Text style={[type.caption, { color: colors.textMuted }]}>within 6km</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
              {trendingRestaurants.map((r) => (
                <TrendingCard key={r.id} restaurant={r} onPress={() => navigation.navigate("NexFood")} />
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
