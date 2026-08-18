import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme, brand } from "../theme";

function Dot({ delay }: { delay: number }) {
  const bounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bounce, { toValue: 1, duration: 340, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(bounce, { toValue: 0, duration: 340, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(600 - delay),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay]);

  const translateY = bounce.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const opacity = bounce.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return <Animated.View style={[styles.dot, { backgroundColor: brand.myraStart, transform: [{ translateY }], opacity }]} />;
}

/** The "Myra is thinking" bubble - keeps the chat feeling alive between a sent message and her reply. */
export function TypingIndicator() {
  const { colors, radius, isDark } = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.bubbleWrap, { borderRadius: radius.lg, borderBottomLeftRadius: 4 }]}>
        <BlurView intensity={isDark ? 36 : 55} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        <View
          style={[
            styles.bubble,
            { borderRadius: radius.lg, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: colors.glassBorder, backgroundColor: colors.glass },
          ]}
        >
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 10 },
  bubbleWrap: { overflow: "hidden" },
  bubble: { flexDirection: "row", gap: 5, paddingHorizontal: 16, paddingVertical: 14, alignItems: "center" },
  dot: { width: 7, height: 7, borderRadius: 4 },
});
