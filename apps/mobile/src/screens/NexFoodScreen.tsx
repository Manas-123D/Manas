import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Restaurant } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

export function NexFoodScreen() {
  const { colors, spacing, radius, type } = useTheme();
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

  return (
    <Screen>
      <Text style={[type.micro, { color: brand.food }]}>NEXFOOD</Text>
      <Text style={[type.title, { color: colors.textPrimary }]}>Restaurants near you</Text>

      {restaurants.map((r) => (
        <View key={r.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[type.subtitle, { color: colors.textPrimary }]}>{r.name}</Text>
                {r.trending && (
                  <View style={{ backgroundColor: brand.food + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill }}>
                    <Text style={[type.micro, { color: brand.food }]}>🔥 TRENDING</Text>
                  </View>
                )}
              </View>
              {r.offer && <Text style={[type.caption, { color: colors.success, marginTop: 2 }]}>{r.offer}</Text>}
            </View>
            <Text style={[type.caption, { color: colors.textMuted }]}>★ {r.rating} · {r.etaMinutes} min</Text>
          </View>
          <Text style={[type.caption, { color: colors.textMuted }]}>{r.cuisine.join(" · ")}</Text>
          {r.menu.map((item) => {
            const isSelected = order?.restaurant.id === r.id && order.itemId === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => setOrder({ restaurant: r, itemId: item.id })}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  borderRadius: radius.sm,
                  backgroundColor: isSelected ? brand.food + "22" : "transparent",
                }}
              >
                <Text style={[type.body, { color: colors.textPrimary }]}>{item.isVeg ? "🟢" : "🔴"} {item.name}</Text>
                <Text style={[type.body, { color: colors.textSecondary }]}>₹{item.price}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}

      <PrimaryButton label={loading ? "Placing order..." : "Place order"} onPress={placeOrder} disabled={!order} loading={loading} />
    </Screen>
  );
}
