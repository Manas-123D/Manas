import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../components/Screen";
import { GlassCard } from "../components/GlassCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand, gradients } from "../theme";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";

function memberSince(iso?: string): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(new Date(iso));
}

export function ProfileScreen() {
  const { colors, spacing, radius, type, shadow, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";
  const [bookingCount, setBookingCount] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      apiRequest<{ rides: unknown[] }>("/rides").catch(() => ({ rides: [] })),
      apiRequest<{ orders: unknown[] }>("/food/orders").catch(() => ({ orders: [] })),
      apiRequest<{ orders: unknown[] }>("/meds/orders").catch(() => ({ orders: [] })),
      apiRequest<{ requests: unknown[] }>("/home/requests").catch(() => ({ requests: [] })),
    ]).then(([rides, foodOrders, medOrders, homeRequests]) => {
      setBookingCount(rides.rides.length + foodOrders.orders.length + medOrders.orders.length + homeRequests.requests.length);
    });
  }, []);

  const stats: { label: string; value: string }[] = [
    { label: "Bookings", value: bookingCount === null ? "…" : String(bookingCount) },
    { label: "Member since", value: memberSince(user?.createdAt) },
    { label: "City", value: user?.city ?? "—" },
  ];

  return (
    <Screen>
      <Text style={[type.title, { color: colors.textPrimary }]}>Profile</Text>

      <GlassCard gradientBorder={gradients.myra} raised>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
          <View style={[{ borderRadius: 42 }, shadow.glow(brand.myraMid, 0.5)]}>
            <LinearGradient colors={gradients.myra} style={{ width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", padding: 3 }}>
              <View style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
                <LinearGradient
                  colors={gradients.myra}
                  start={{ x: 0.15, y: 0.1 }}
                  end={{ x: 0.9, y: 1 }}
                  style={{ width: 68, height: 68, borderRadius: 34, alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>{initial}</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
            <View
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 16,
                height: 16,
                borderRadius: 8,
                borderWidth: 2,
                backgroundColor: colors.success,
                borderColor: colors.background,
              }}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[type.subtitle, { color: colors.textPrimary }]} numberOfLines={1}>{user?.name}</Text>
            <Text style={[type.caption, { color: colors.textSecondary, marginTop: 2 }]} numberOfLines={1}>{user?.email}</Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.glassBorder }}>
          {stats.map((s, i) => (
            <View key={s.label} style={{ flex: 1, alignItems: i === 0 ? "flex-start" : i === stats.length - 1 ? "flex-end" : "center" }}>
              <Text style={[type.title, { color: colors.textPrimary }]}>{s.value}</Text>
              <Text style={[type.micro, { color: colors.textMuted, marginTop: 2 }]}>{s.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <Pressable onPress={() => navigation.navigate("History")}>
        <GlassCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
            <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: brand.ride + (isDark ? "26" : "1a"), alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="receipt-outline" size={16} color={brand.ride} />
            </View>
            <Text style={[type.bodyStrong, { color: colors.textPrimary, flex: 1 }]}>My Bookings</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </View>
        </GlassCard>
      </Pressable>

      <GlassCard>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <View style={{ width: 32, height: 32, borderRadius: radius.sm, backgroundColor: brand.myraStart + (isDark ? "26" : "1a"), alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="bulb-outline" size={16} color={brand.myraStart} />
          </View>
          <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>What Myra remembers</Text>
        </View>
        <Text style={[type.caption, { color: colors.textMuted, marginTop: spacing.sm }]}>
          Preferences, routines and service history — used only to personalize insights and never shared outside NexServ.
        </Text>
      </GlassCard>

      <PrimaryButton variant="outline" label="Log out" onPress={logout} />
    </Screen>
  );
}
