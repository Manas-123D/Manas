import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { TrackingKind } from "@nexserv/shared";
import { useTheme, brand } from "../theme";

const KIND_MARKER: Record<TrackingKind, string> = { ride: "🚗", food: "🛵", meds: "💊" };
const KIND_COLOR: Record<TrackingKind, string> = { ride: brand.ride, food: brand.food, meds: brand.meds };

interface RouteTrackerProps {
  kind: TrackingKind;
  progress: number; // 0-1
  originLabel: string;
  destinationLabel: string;
}

/**
 * A literal map needs a Maps API key we don't have yet - this is the
 * honest stand-in: a live, animated route strip that glides the agent
 * marker from origin to destination as `progress` updates, so tracking
 * still feels alive and real-time without map tiles.
 */
export function RouteTracker({ kind, progress, originLabel, destinationLabel }: RouteTrackerProps) {
  const { colors, spacing, radius, type } = useTheme();
  const anim = useRef(new Animated.Value(progress)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.35, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const markerLeft = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const fillWidth = anim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });
  const color = KIND_COLOR[kind];

  return (
    <View>
      <View style={styles.trackWrap}>
        <View style={[styles.trackBg, { backgroundColor: colors.border, borderRadius: radius.pill }]} />
        <Animated.View style={[styles.trackFillWrap, { width: fillWidth }]}>
          <LinearGradient colors={[color, brand.myraEnd]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.trackFill, { borderRadius: radius.pill }]} />
        </Animated.View>
        <View style={[styles.endpoint, styles.endpointStart, { backgroundColor: colors.textPrimary }]} />
        <View style={[styles.endpoint, styles.endpointEnd, { backgroundColor: colors.textPrimary }]} />
        <Animated.View style={[styles.markerWrap, { left: markerLeft }]}>
          <Animated.View style={[styles.markerPulse, { backgroundColor: color + "33", transform: [{ scale: pulse }] }]} />
          <View style={[styles.marker, { backgroundColor: color }]}>
            <Text style={styles.markerEmoji}>{KIND_MARKER[kind]}</Text>
          </View>
        </Animated.View>
      </View>
      <View style={[styles.labelsRow, { marginTop: spacing.md }]}>
        <Text style={[type.caption, { color: colors.textSecondary, flex: 1 }]} numberOfLines={1}>
          {originLabel}
        </Text>
        <Text style={[type.caption, { color: colors.textSecondary, flex: 1, textAlign: "right" }]} numberOfLines={1}>
          {destinationLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trackWrap: { height: 40, justifyContent: "center" },
  trackBg: { position: "absolute", left: 0, right: 0, height: 4 },
  trackFillWrap: { position: "absolute", left: 0, height: 4 },
  trackFill: { flex: 1 },
  endpoint: { position: "absolute", width: 10, height: 10, borderRadius: 5, top: 15 },
  endpointStart: { left: -2 },
  endpointEnd: { right: -2 },
  labelsRow: { flexDirection: "row" },
  markerWrap: { position: "absolute", top: 0, marginLeft: -18, alignItems: "center", justifyContent: "center" },
  markerPulse: { position: "absolute", width: 40, height: 40, borderRadius: 20 },
  marker: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  markerEmoji: { fontSize: 18 },
});
