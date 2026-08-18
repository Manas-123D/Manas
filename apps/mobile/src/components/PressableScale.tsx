import React, { useRef } from "react";
import { Animated, Pressable, PressableProps, ViewStyle } from "react-native";

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  scaleTo?: number;
}

/** Shared tactile press-down feedback used across tiles, cards and chips. */
export function PressableScale({ children, style, scaleTo = 0.96, ...pressableProps }: PressableScaleProps) {
  const scale = useRef(new Animated.Value(1)).current;

  function pressIn() {
    Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  }
  function pressOut() {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30, bounciness: 8 }).start();
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable onPressIn={pressIn} onPressOut={pressOut} {...pressableProps}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
