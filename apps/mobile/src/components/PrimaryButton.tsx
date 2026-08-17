import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, brand } from "../theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "myra" | "outline";
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = "myra" }: PrimaryButtonProps) {
  const { colors, radius, spacing, type } = useTheme();
  const isDisabled = disabled || loading;

  if (variant === "outline") {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.base,
          {
            borderRadius: radius.pill,
            paddingVertical: spacing.md,
            borderWidth: 1.5,
            borderColor: colors.border,
            opacity: pressed ? 0.7 : isDisabled ? 0.5 : 1,
          },
        ]}
      >
        <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [{ opacity: pressed ? 0.85 : isDisabled ? 0.6 : 1 }]}>
      <LinearGradient
        colors={[brand.myraStart, brand.myraEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.base, { borderRadius: radius.pill, paddingVertical: spacing.md }]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={[type.bodyStrong, { color: "#fff" }]}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
});
