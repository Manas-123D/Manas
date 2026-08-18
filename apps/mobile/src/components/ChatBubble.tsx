import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ChatMessage } from "@nexserv/shared";
import { useTheme, brand } from "../theme";
import { MyraOrb } from "./MyraOrb";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { colors, radius, spacing, type, isDark } = useTheme();
  const isMyra = message.role === "myra";
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, { toValue: 1, duration: 380, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, []);

  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const translateX = entrance.interpolate({ inputRange: [0, 1], outputRange: [isMyra ? -8 : 8, 0] });

  if (isMyra) {
    return (
      <Animated.View style={[styles.row, { justifyContent: "flex-start", opacity: entrance, transform: [{ translateY }, { translateX }] }]}>
        <MyraOrb size={26} active={false} />
        <View style={[styles.bubbleWrap, { borderRadius: radius.lg, borderBottomLeftRadius: 4 }]}>
          <BlurView intensity={isDark ? 36 : 55} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          <View
            style={[
              styles.bubble,
              {
                borderRadius: radius.lg,
                borderBottomLeftRadius: 4,
                borderWidth: 1,
                borderColor: colors.glassBorder,
                borderTopColor: colors.glassHighlight,
                backgroundColor: colors.glass,
                padding: spacing.md,
              },
            ]}
          >
            <Text style={[type.micro, { color: brand.myraStart, marginBottom: 4 }]}>MYRA</Text>
            <Text style={[type.body, { color: colors.textPrimary }]}>{message.content}</Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.row, { justifyContent: "flex-end", opacity: entrance, transform: [{ translateY }, { translateX }] }]}>
      <LinearGradient
        colors={[brand.myraStart, brand.myraEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, styles.userBubble, { borderRadius: radius.lg, borderTopRightRadius: 4, padding: spacing.md }]}
      >
        <Text style={[type.body, { color: "#fff" }]}>{message.content}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 12, gap: 8, alignItems: "flex-end" },
  bubbleWrap: { overflow: "hidden", flexShrink: 1, maxWidth: "78%" },
  bubble: { maxWidth: "100%" },
  userBubble: { maxWidth: "82%" },
});
