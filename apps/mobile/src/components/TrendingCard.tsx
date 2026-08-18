import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Restaurant } from "@nexserv/shared";
import { useTheme, brand } from "../theme";
import { GlassCard } from "./GlassCard";

export function TrendingCard({ restaurant, onPress }: { restaurant: Restaurant; onPress: () => void }) {
  const { colors, spacing, radius, type } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  }

  return (
    <Animated.View style={{ width: 210, transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
        <GlassCard padding={0} radius={radius.lg}>
          <LinearGradient colors={[brand.food, "#FF5F6D"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.accentBar} />
          <View style={{ padding: spacing.md }}>
            {restaurant.trending && (
              <View style={[styles.badge, { backgroundColor: brand.food + "22", borderRadius: radius.pill, marginBottom: spacing.xs }]}>
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
          </View>
        </GlassCard>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  accentBar: { height: 4 },
  badge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 2 },
});
