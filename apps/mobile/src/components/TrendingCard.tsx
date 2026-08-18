import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Restaurant } from "@nexserv/shared";
import { useTheme, brand } from "../theme";
import { GlassCard } from "./GlassCard";
import { PressableScale } from "./PressableScale";

export function TrendingCard({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) {
  const { colors, spacing, radius, type } = useTheme();

  return (
    <PressableScale style={{ width: 210 }} onPress={onPress} scaleTo={0.96}>
      <GlassCard padding={0} radius={radius.lg} gradientBorder={restaurant.trending ? [brand.food, "#FF5F6D"] : undefined}>
        {!restaurant.trending && <View style={[styles.accentBar, { backgroundColor: colors.glassBorder }]} />}
        <View style={{ padding: spacing.md }}>
          {restaurant.trending && (
            <View style={[styles.badge, styles.badgeRow, { backgroundColor: brand.food + "22", borderRadius: radius.pill, marginBottom: spacing.xs }]}>
              <Ionicons name="flame" size={11} color={brand.food} />
              <Text style={[type.micro, { color: brand.food }]}>TRENDING</Text>
            </View>
          )}
          <Text style={[type.bodyStrong, { color: colors.textPrimary }]} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <Text style={[type.caption, { color: colors.textMuted, marginTop: 2 }]} numberOfLines={1}>
            {restaurant.cuisine.join(" · ")}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.sm }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="star" size={12} color="#FFC24B" />
              <Text style={[type.caption, { color: colors.textSecondary }]}>{restaurant.rating} · {restaurant.distanceKm}km</Text>
            </View>
            <Text style={[type.caption, { color: colors.textMuted }]}>{restaurant.etaMinutes} min</Text>
          </View>
          {restaurant.offer && (
            <Text style={[type.micro, { color: colors.success, marginTop: spacing.xs }]} numberOfLines={1}>
              {restaurant.offer}
            </Text>
          )}
        </View>
      </GlassCard>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  accentBar: { height: 4 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2 },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
});
