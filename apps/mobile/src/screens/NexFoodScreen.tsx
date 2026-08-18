import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Restaurant } from "@nexserv/shared";
import { AmbientBackground } from "../components/AmbientBackground";
import { GlassCard } from "../components/GlassCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

// Stand-in for restaurant photography: a rotating set of cover gradients so
// the list reads with visual variety instead of every card looking the same.
const COVER_GRADIENTS: readonly (readonly [string, string])[] = [
  ["#2FB3A3", "#1D8577"],
  ["#5FA8FF", "#3D5FFF"],
  ["#B18CFF", "#7C4CFF"],
  ["#FF8A3D", "#FF5F6D"],
];

function coverEmoji(cuisine: string[]): string {
  const text = cuisine.join(" ").toLowerCase();
  if (text.includes("healthy") || text.includes("salad") || text.includes("bowl")) return "🥗";
  if (text.includes("smoothie") || text.includes("juice")) return "🥤";
  if (text.includes("grill") || text.includes("kebab")) return "🍢";
  if (text.includes("south indian")) return "🍛";
  if (text.includes("north indian")) return "🍲";
  return "🍽️";
}

export function NexFoodScreen() {
  const { colors, spacing, radius, type, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [order, setOrder] = useState<{ restaurant: Restaurant; itemId: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest<{ restaurants: Restaurant[] }>("/food/restaurants").then((res) => setRestaurants(res.restaurants));
  }, []);

  async function placeOrder() {
    if (!order) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ order: { id: string } }>("/food/orders", {
        method: "POST",
        body: { restaurantId: order.restaurant.id, items: [{ itemId: order.itemId, quantity: 1 }] },
      });
      navigation.replace("Tracking", { kind: "food", id: res.order.id });
    } finally {
      setLoading(false);
    }
  }

  const selectedItem = order?.restaurant.menuItems.find((i) => i.id === order.itemId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg, paddingBottom: order ? 140 : spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={[type.micro, { color: brand.food }]}>NEXFOOD</Text>
        <Text style={[type.title, { color: colors.textPrimary }]}>Restaurants near you</Text>

        {restaurants.map((r, i) => {
          const cover = COVER_GRADIENTS[i % COVER_GRADIENTS.length];
          return (
            <GlassCard key={r.id} padding={0}>
              <LinearGradient colors={cover} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.cover}>
                <Text style={styles.coverEmoji}>{coverEmoji(r.cuisine)}</Text>
                {r.trending && (
                  <View style={[styles.badge, styles.badgeLeft, styles.badgeRow, { backgroundColor: "rgba(0,0,0,0.35)", borderRadius: radius.pill }]}>
                    <Ionicons name="flame" size={11} color="#FFB25E" />
                    <Text style={[type.micro, { color: "#fff" }]}>TRENDING</Text>
                  </View>
                )}
                <View style={[styles.badge, styles.badgeRight, styles.badgeRow, { backgroundColor: "rgba(0,0,0,0.35)", borderRadius: radius.pill }]}>
                  <Ionicons name="star" size={11} color="#FFC24B" />
                  <Text style={[type.micro, { color: "#fff" }]}>{r.rating}</Text>
                </View>
              </LinearGradient>

              <View style={{ padding: spacing.lg, gap: spacing.sm }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <Text style={[type.subtitle, { color: colors.textPrimary, flex: 1 }]}>{r.name}</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>{r.etaMinutes} min · {r.distanceKm}km</Text>
                </View>
                <Text style={[type.caption, { color: colors.textMuted }]}>{r.cuisine.join(" · ")}</Text>
                {r.offer && (
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ backgroundColor: colors.success + "1c", paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill }}>
                      <Text style={[type.micro, { color: colors.success }]}>{r.offer}</Text>
                    </View>
                  </View>
                )}

                <View style={{ marginTop: spacing.xs, gap: 6 }}>
                  {r.menuItems.map((item) => {
                    const isSelected = order?.restaurant.id === r.id && order.itemId === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setOrder({ restaurant: r, itemId: item.id })}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: radius.sm,
                          borderWidth: isSelected ? 1 : 0,
                          borderColor: brand.food + "55",
                          backgroundColor: isSelected ? brand.food + "1c" : "transparent",
                        }}
                      >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <View
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: 3,
                              borderWidth: 1.5,
                              borderColor: item.isVeg ? colors.success : colors.danger,
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: item.isVeg ? colors.success : colors.danger }} />
                          </View>
                          <Text style={[type.body, { color: colors.textPrimary }]}>{item.name}</Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                          <Text style={[type.body, { color: colors.textSecondary }]}>₹{item.price}</Text>
                          <View
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 10,
                              borderWidth: 1.5,
                              borderColor: isSelected ? brand.food : colors.glassBorder,
                              backgroundColor: isSelected ? brand.food : "transparent",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {isSelected && <Ionicons name="checkmark" size={13} color="#fff" />}
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </GlassCard>
          );
        })}
      </ScrollView>

      {order && selectedItem && (
        <View style={styles.stickyWrap}>
          <BlurView intensity={isDark ? 55 : 75} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View style={[styles.stickyBar, { padding: spacing.lg, paddingBottom: spacing.lg + insets.bottom, borderTopColor: colors.glassBorder }]}>
            <View style={{ flex: 1 }}>
              <Text style={[type.caption, { color: colors.textMuted }]} numberOfLines={1}>{order.restaurant.name}</Text>
              <Text style={[type.bodyStrong, { color: colors.textPrimary }]} numberOfLines={1}>{selectedItem.name} · ₹{selectedItem.price}</Text>
            </View>
            <View style={{ width: 150 }}>
              <PrimaryButton label={loading ? "Placing..." : "Place order"} onPress={placeOrder} loading={loading} />
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cover: { height: 110, alignItems: "center", justifyContent: "center" },
  coverEmoji: { fontSize: 40 },
  badge: { position: "absolute", top: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  badgeLeft: { left: 10 },
  badgeRight: { right: 10 },
  stickyWrap: { position: "absolute", left: 0, right: 0, bottom: 0, overflow: "hidden" },
  stickyBar: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1 },
});
