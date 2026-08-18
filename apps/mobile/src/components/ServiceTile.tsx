import React from "react";
import { StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../theme";
import { GlassCard } from "./GlassCard";
import { PressableScale } from "./PressableScale";

interface ServiceTileProps {
  label: string;
  emoji: string;
  colorPair: readonly [string, string];
  onPress: () => void;
}

export function ServiceTile({ label, emoji, colorPair, onPress }: ServiceTileProps) {
  const { colors, spacing, radius, type, shadow } = useTheme();

  return (
    <PressableScale style={styles.tile} onPress={onPress} scaleTo={0.95}>
      <GlassCard padding={spacing.md}>
        <LinearGradient
          colors={colorPair}
          start={{ x: 0.15, y: 0.1 }}
          end={{ x: 0.9, y: 1 }}
          style={[styles.iconWrap, { borderRadius: radius.md }, shadow.glow(colorPair[1], 0.35)]}
        >
          <Text style={{ fontSize: 22 }}>{emoji}</Text>
        </LinearGradient>
        <Text style={[type.bodyStrong, { color: colors.textPrimary, marginTop: spacing.sm }]}>{label}</Text>
      </GlassCard>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, minWidth: "45%" },
  iconWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
