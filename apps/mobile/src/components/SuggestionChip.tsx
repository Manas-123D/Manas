import React, { useRef } from "react";
import { Animated, Pressable, Text } from "react-native";
import { useTheme, brand } from "../theme";

interface SuggestionChipProps {
  label: string;
  onPress: () => void;
}

/** A quick-reply chip under Myra's messages - keeps chat feeling like tapping through a conversation with a person, not always typing. */
export function SuggestionChip({ label, onPress }: SuggestionChipProps) {
  const { colors, radius, type } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={{
          borderRadius: radius.pill,
          borderWidth: 1,
          borderColor: brand.myraStart + "55",
          backgroundColor: brand.myraStart + "14",
          paddingHorizontal: 14,
          paddingVertical: 9,
        }}
      >
        <Text style={[type.caption, { color: brand.myraStart, fontWeight: "700" }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
