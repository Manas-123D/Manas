import React, { useRef } from "react";
import { ActivityIndicator, Animated, Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, brand, gradients } from "../theme";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "myra" | "outline";
}

export function PrimaryButton({ label, onPress, loading, disabled, variant = "myra" }: PrimaryButtonProps) {
  const { colors, radius, spacing, type, shadow } = useTheme();
  const isDisabled = disabled || loading;
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  }

  if (variant === "outline") {
    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onPress}
          onPressIn={pressIn}
          onPressOut={pressOut}
          disabled={isDisabled}
          style={[
            styles.base,
            {
              borderRadius: radius.pill,
              paddingVertical: spacing.md,
              borderWidth: 1.5,
              borderColor: colors.border,
              opacity: isDisabled ? 0.5 : 1,
            },
          ]}
        >
          <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{label}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale }], borderRadius: radius.pill }, shadow.glow(brand.myraMid, 0.4), { opacity: isDisabled ? 0.6 : 1 }]}>
      <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} disabled={isDisabled}>
        <LinearGradient
          colors={gradients.myra}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.base, { borderRadius: radius.pill, paddingVertical: spacing.md }]}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[type.bodyStrong, { color: "#fff" }]}>{label}</Text>}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
});
