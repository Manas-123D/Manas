import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Restaurant } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

export function NexFoodScreen() {
  const { colors, spacing, radius, type } = useTheme();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [order, setOrder] = useState<{ restaurant: Restaurant; itemId: string } | null>(null);
  const [confirmed, setConfirmed] = useState<{ etaMinutes: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest<{ restaurants: Restaurant[] }>("/food/restaurants").then((res) => setRestaurants(res.restaurants));
  }, []);

  async function placeOrder() {
    if (!order) return;
    setLoading(true);
    try {
      const res = await apiRequest<{ order: { etaMinutes: number; total: number } }>("/food/orders", {
        method: "POST",
        body: { restaurantId: order.restaurant.id, items: [{ itemId: order.itemId, quantity: 1 }] },
      });
      setConfirmed(res.order);
    } finally {
      setLoading(false);
    }
  }

  if (confirmed) {
    return (
      <Screen>
        <Text style={[type.title, { color: colors.textPrimary }]}>Order placed 🍔</Text>
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
          <Text style={[type.body, { color: colors.textSecondary }]}>Total ₹{confirmed.total}</Text>
          <Text style={[type.subtitle, { color: colors.textPrimary }]}>Arriving in ~{confirmed.etaMinutes} min</Text>
        </View>
        <PrimaryButton label="Order again" onPress={() => { setConfirmed(null); setOrder(null); }} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={[type.micro, { color: brand.food }]}>NEXFOOD</Text>
      <Text style={[type.title, { color: colors.textPrimary }]}>Restaurants near you</Text>

      {restaurants.map((r) => (
        <View key={r.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={[type.subtitle, { color: colors.textPrimary }]}>{r.name}</Text>
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
