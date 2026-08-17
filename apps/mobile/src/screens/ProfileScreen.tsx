import React from "react";
import { Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { PrimaryButton } from "../components/PrimaryButton";
import { useTheme } from "../theme";
import { useAuth } from "../context/AuthContext";

export function ProfileScreen() {
  const { colors, spacing, radius, type } = useTheme();
  const { user, logout } = useAuth();

  return (
    <Screen>
      <Text style={[type.title, { color: colors.textPrimary }]}>Profile</Text>

      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
        <Text style={[type.subtitle, { color: colors.textPrimary }]}>{user?.name}</Text>
        <Text style={[type.body, { color: colors.textSecondary }]}>{user?.email}</Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>{user?.city}</Text>
      </View>

      <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>What Myra remembers</Text>
        <Text style={[type.caption, { color: colors.textMuted }]}>
          Preferences, routines and service history — used only to personalize insights and never shared outside NexServ.
        </Text>
      </View>

      <PrimaryButton variant="outline" label="Log out" onPress={logout} />
    </Screen>
  );
}
