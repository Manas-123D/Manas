import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Restaurant } from "@nexserv/shared";
import { useTheme, brand } from "../theme";

export function TrendingCard({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) {
  const { colors, spacing, radius, type } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.md }]}
    >
      {restaurant.trending && (
        <View style={{ alignSelf: "flex-start", backgroundColor: brand.food + "22", paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, marginBottom: spacing.xs }}>
          <Text style={[type.micro, { color: brand.food }]}>🔥 TRENDING</Text>
        </View>
      )}
      <Text style={[type.bodyStrong, { color: colors.textPrimary }]} numberOfLines={1}>
        {restaurant.name}
      </Text>
      <Text style={[type.caption, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
        {restaurant.cuisine.join(" · ")}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
        <Text style={[type.caption, { color: colors.textSecondary }]}>★ {restaurant.rating} · {restaurant.distanceKm}km</Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>{restaurant.etaMinutes} min</Text>
      </View>
      {restaurant.offer && (
        <Text style={[type.micro, { color: colors.success, marginTop: spacing.xs }]} numberOfLines={1}>
          {restaurant.offer}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 200, borderWidth: 1 },
});
