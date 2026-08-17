import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme";

interface ServiceTileProps {
  label: string;
  emoji: string;
  color: string;
  onPress: () => void;
}

export function ServiceTile({ label, emoji, color, onPress }: ServiceTileProps) {
  const { colors, radius, spacing, type } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: radius.lg,
          padding: spacing.md,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color + "22", borderRadius: radius.md }]}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <Text style={[type.bodyStrong, { color: colors.textPrimary, marginTop: spacing.sm }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, borderWidth: 1, minWidth: "45%" },
  iconWrap: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
});
