import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Screen } from "../components/Screen";
import { GlassCard } from "../components/GlassCard";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme, brand } from "../theme";
import { useAuth } from "../context/AuthContext";

export function ProfileScreen() {
  const { colors, spacing, type, shadow } = useTheme();
  const { user, logout } = useAuth();
  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  return (
    <Screen>
      <Text style={[type.title, { color: colors.textPrimary }]}>Profile</Text>

      <GlassCard>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          <View style={[{ borderRadius: 28 }, shadow.glow(brand.myraStart, 0.4)]}>
            <LinearGradient
              colors={[brand.myraStart, brand.myraEnd]}
              start={{ x: 0.15, y: 0.1 }}
              end={{ x: 0.9, y: 1 }}
              style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ color: "#fff", fontSize: 22, fontWeight: "800" }}>{initial}</Text>
            </LinearGradient>
          </View>
          <View>
            <Text style={[type.subtitle, { color: colors.textPrimary }]}>{user?.name}</Text>
            <Text style={[type.body, { color: colors.textSecondary }]}>{user?.email}</Text>
            <Text style={[type.caption, { color: colors.textMuted }]}>{user?.city}</Text>
          </View>
        </View>
      </GlassCard>

      <GlassCard>
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>What Myra remembers</Text>
        <Text style={[type.caption, { color: colors.textMuted, marginTop: spacing.xs }]}>
          Preferences, routines and service history — used only to personalize insights and never shared outside NexServ.
        </Text>
      </GlassCard>

      <PrimaryButton variant="outline" label="Log out" onPress={logout} />
    </Screen>
  );
}
