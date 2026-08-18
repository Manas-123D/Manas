import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MyraInsight } from "@nexserv/shared";
import { useTheme, brand, gradients } from "../theme";
import { MyraOrb } from "./MyraOrb";

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
  const { spacing, radius, type, shadow } = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [insight.id]);

  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Animated.View style={{ opacity: entrance, transform: [{ translateY }], borderRadius: radius.lg, ...shadow.glow(brand.myraMid, 0.5) }}>
      <Pressable onPress={onOpenChat}>
        <LinearGradient
          colors={gradients.myra}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderRadius: radius.lg, padding: spacing.lg }]}
        >
          <View style={styles.shine} pointerEvents="none" />
          <View style={styles.headerRow}>
            <MyraOrb size={22} />
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { overflow: "hidden" },
  shine: { position: "absolute", top: -60, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: "rgba(255,255,255,0.12)" },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  actionsRow: { flexDirection: "row" },
  pillBtn: { paddingVertical: 8, paddingHorizontal: 14 },
});
