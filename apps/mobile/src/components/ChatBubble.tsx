import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChatMessage } from "@nexserv/shared";
import { useTheme, brand } from "../theme";

export function ChatBubble({ message }: { message: ChatMessage }) {
  const { colors, radius, spacing, type } = useTheme();
  const isMyra = message.role === "myra";

  if (isMyra) {
    return (
      <View style={[styles.row, { justifyContent: "flex-start" }]}>
        <LinearGradient
          colors={[colors.surfaceRaised, colors.surfaceRaised]}
          style={[styles.bubble, { borderRadius: radius.lg, borderTopLeftRadius: 4, borderWidth: 1, borderColor: colors.border, padding: spacing.md }]}
        >
          <Text style={[type.micro, { color: brand.myraStart, marginBottom: 4 }]}>MYRA</Text>
          <Text style={[type.body, { color: colors.textPrimary }]}>{message.content}</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.row, { justifyContent: "flex-end" }]}>
      <LinearGradient
        colors={[brand.myraStart, brand.myraEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.bubble, { borderRadius: radius.lg, borderTopRightRadius: 4, padding: spacing.md }]}
      >
        <Text style={[type.body, { color: "#fff" }]}>{message.content}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 10 },
  bubble: { maxWidth: "82%" },
});
