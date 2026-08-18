import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../theme";

/**
 * Two oversized, mostly off-screen glow blobs behind the content. Their hard
 * edges get genuinely softened wherever a GlassCard's blur sits on top of
 * them; where they're not covered, keeping them low-opacity and bleeding off
 * the screen edges hides the circle outline, so the effect still reads as
 * ambient light rather than a sticker.
 */
export function AmbientBackground() {
  const { colors } = useTheme();
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[styles.blob, styles.blobA, { backgroundColor: colors.backgroundGlowA }]} />
      <View style={[styles.blob, styles.blobB, { backgroundColor: colors.backgroundGlowB }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: { position: "absolute", width: 380, height: 380, borderRadius: 380, opacity: 0.28 },
  blobA: { top: -160, left: -120 },
  blobB: { top: 320, right: -180 },
});
