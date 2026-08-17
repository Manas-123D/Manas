import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MyraInsight } from "@nexserv/shared";
import { useTheme, brand } from "../theme";

interface MyraHeroBannerProps {
  insight: MyraInsight;
  extraCount: number;
  onAct: () => void;
  onDismiss: () => void;
  onOpenChat: () => void;
}

// The single most relevant thing Myra has to say right now, presented like a
// message from a person, not a notification card in a stack.
export function MyraHeroBanner({ insight, extraCount, onAct, onDismiss, onOpenChat }: MyraHeroBannerProps) {
  const { spacing, radius, type } = useTheme();

  return (
    <Pressable onPress={onOpenChat}>
      <LinearGradient
        colors={[brand.myraStart, brand.myraEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderRadius: radius.lg, padding: spacing.lg }]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={[type.micro, { color: "rgba(255,255,255,0.85)" }]}>MYRA</Text>
        </View>
        <Text style={[type.subtitle, { color: "#fff", marginTop: spacing.xs }]}>{insight.headline}</Text>
        <Text style={[type.body, { color: "rgba(255,255,255,0.92)", marginTop: spacing.xs }]}>{insight.detail}</Text>

        <View style={[styles.actionsRow, { marginTop: spacing.md, gap: spacing.sm }]}>
          {insight.action && (
            <Pressable onPress={onAct} style={[styles.pillBtn, { backgroundColor: "#fff", borderRadius: radius.pill }]}>
              <Text style={[type.caption, { color: brand.myraStart, fontWeight: "700" }]}>Act on this</Text>
            </Pressable>
          )}
          <Pressable onPress={onDismiss} style={[styles.pillBtn, { borderRadius: radius.pill, borderWidth: 1, borderColor: "rgba(255,255,255,0.6)" }]}>
            <Text style={[type.caption, { color: "#fff" }]}>Not now</Text>
          </Pressable>
        </View>

        {extraCount > 0 && (
          <Text style={[type.caption, { color: "rgba(255,255,255,0.85)", marginTop: spacing.md }]}>
            +{extraCount} more from Myra · tap to open chat
          </Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sparkle: { fontSize: 12 },
  actionsRow: { flexDirection: "row" },
  pillBtn: { paddingVertical: 8, paddingHorizontal: 14 },
});
