import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MyraInsight } from "@nexserv/shared";
import { useTheme, brand } from "../theme";

interface InsightCardProps {
  insight: MyraInsight;
  onAct: (insight: MyraInsight) => void;
  onDismiss: (insight: MyraInsight) => void;
}

const SERVICE_LABEL: Record<string, string> = {
  ride: "NexRide",
  food: "NexFood",
  meds: "NexMeds",
  home: "NexHome",
  general: "Myra",
};

export function InsightCard({ insight, onAct, onDismiss }: InsightCardProps) {
  const { colors, spacing, radius, type } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg }]}>
      <View style={styles.headerRow}>
        <LinearGradient colors={[brand.myraStart, brand.myraEnd]} style={[styles.dot, { borderRadius: radius.pill }]} />
        <Text style={[type.micro, { color: colors.textMuted }]}>MYRA · {SERVICE_LABEL[insight.service] ?? "NexServ"}</Text>
      </View>
      <Text style={[type.subtitle, { color: colors.textPrimary, marginTop: spacing.xs }]}>{insight.headline}</Text>
      <Text style={[type.body, { color: colors.textSecondary, marginTop: spacing.xs }]}>{insight.detail}</Text>
      <View style={[styles.actionsRow, { marginTop: spacing.md, gap: spacing.sm }]}>
        {insight.action && (
          <Pressable onPress={() => onAct(insight)} style={[styles.pillBtn, { backgroundColor: colors.textPrimary, borderRadius: radius.pill }]}>
            <Text style={[type.caption, { color: colors.background, fontWeight: "700" }]}>Act on this</Text>
          </Pressable>
        )}
        <Pressable onPress={() => onDismiss(insight)} style={[styles.pillBtn, { borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border }]}>
          <Text style={[type.caption, { color: colors.textSecondary }]}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8 },
  actionsRow: { flexDirection: "row" },
  pillBtn: { paddingVertical: 8, paddingHorizontal: 14 },
});
