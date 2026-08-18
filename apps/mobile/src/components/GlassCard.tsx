import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../theme";

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  raised?: boolean;
  radius?: number;
  /** Tint the border + fill, e.g. for a selected list row. Deliberately no glow - selection reads from fill/border, not a blurred halo. */
  accentColor?: string;
  /** A thin gradient ring instead of a flat border - reserved for hero-level cards (profile, standout states). */
  gradientBorder?: readonly [string, string];
}

/**
 * The one glassmorphism primitive every premium surface in the app builds
 * on: a real backdrop blur (native), a translucent tint, a hairline border,
 * a diagonal sheen for depth, and a soft diffuse shadow that lives on an
 * unclipped wrapper (overflow:hidden on the same view as a shadow clips the
 * shadow itself on RN).
 */
export function GlassCard({ children, style, padding, raised, radius: radiusOverride, accentColor, gradientBorder }: GlassCardProps) {
  const { colors, radius, spacing, isDark, shadow } = useTheme();
  const r = radiusOverride ?? radius.lg;
  const outerShadow = gradientBorder ? shadow.glow(gradientBorder[0], 0.32) : shadow.soft;
  const pad = padding ?? spacing.lg;

  const sheen = (
    <LinearGradient
      pointerEvents="none"
      colors={isDark ? ["rgba(255,255,255,0.10)", "rgba(255,255,255,0)"] : ["rgba(255,255,255,0.55)", "rgba(255,255,255,0)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.7, y: 0.9 }}
      style={StyleSheet.absoluteFill}
    />
  );

  const inner = (
    <View style={{ borderRadius: gradientBorder ? r - 1.5 : r, overflow: "hidden" }}>
      <BlurView intensity={isDark ? 36 : 55} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      <View
        style={{
          borderRadius: gradientBorder ? r - 1.5 : r,
          borderWidth: gradientBorder ? 0 : accentColor ? 1.5 : 1,
          borderColor: accentColor ?? colors.glassBorder,
          borderTopColor: accentColor ?? colors.glassHighlight,
          backgroundColor: accentColor ? accentColor + (isDark ? "17" : "0d") : raised ? colors.glassRaised : colors.glass,
        }}
      >
        {sheen}
        <View style={{ padding: pad }}>{children}</View>
      </View>
    </View>
  );

  return (
    <View style={[{ borderRadius: r }, outerShadow, style]}>
      {gradientBorder ? (
        <LinearGradient colors={gradientBorder} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: r, padding: 1.5 }}>
          {inner}
        </LinearGradient>
      ) : (
        inner
      )}
    </View>
  );
}
