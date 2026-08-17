import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme";

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}

export function Screen({ children, scroll = true, style }: ScreenProps) {
  const { colors, spacing } = useTheme();
  const content = (
    <View style={[{ padding: spacing.lg, gap: spacing.lg }, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: colors.background }]} edges={["top"]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.grow} showsVerticalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={styles.grow}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1 },
});
