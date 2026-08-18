import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "../theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  raised?: boolean;
  radius?: number;
  /** Tint the border + add a colored glow, e.g. for a selected list row. */
  accentColor?: string;
}

/**
 * The one glassmorphism primitive every premium surface in the app builds
 * on: a real backdrop blur (native), a translucent tint, a hairline border,
 * a brighter top edge for a glass "sheen", and a soft diffuse shadow that
 * lives on an unclipped wrapper (overflow:hidden on the same view as a
 * shadow clips the shadow itself on RN).
 */
export function GlassCard({ children, style, padding, raised, radius: radiusOverride, accentColor }: GlassCardProps) {
  const { colors, radius, spacing, isDark, shadow } = useTheme();
  const r = radiusOverride ?? radius.lg;
  const outerShadow = accentColor ? shadow.glow(accentColor, 0.3) : shadow.soft;

  return (
    <View style={[{ borderRadius: r }, outerShadow, style]}>
      <View style={{ borderRadius: r, overflow: "hidden" }}>
        <BlurView intensity={isDark ? 36 : 55} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
        <View
          style={{
            borderRadius: r,
            borderWidth: accentColor ? 1.5 : 1,
            borderColor: accentColor ?? colors.glassBorder,
            borderTopColor: accentColor ?? colors.glassHighlight,
            backgroundColor: raised ? colors.glassRaised : colors.glass,
            padding: padding ?? spacing.lg,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
