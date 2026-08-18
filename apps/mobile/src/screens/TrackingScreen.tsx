import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { TrackingKind, TrackingState } from "@nexserv/shared";
import { Screen } from "../components/Screen";
import { GlassCard } from "../components/GlassCard";
import { RouteMap } from "../components/RouteMap";
import { useTheme, brand } from "../theme";
import { apiRequest } from "../api/client";

const TRACK_PATH: Record<TrackingKind, (id: string) => string> = {
  ride: (id) => `/rides/${id}/track`,
  food: (id) => `/food/orders/${id}/track`,
  meds: (id) => `/meds/orders/${id}/track`,
};

const KIND_TITLE: Record<TrackingKind, string> = { ride: "Your ride", food: "Your order", meds: "Your delivery" };
const KIND_COLOR: Record<TrackingKind, string> = { ride: brand.ride, food: brand.food, meds: brand.meds };
const STATUS_LABEL: Record<string, string> = {
  matched: "Driver on the way to pick you up",
  ongoing: "On the way",
  completed: "Arrived",
  preparing: "Being prepared",
  packed: "Being packed",
  out_for_delivery: "On the way to you",
  delivered: "Delivered",
};

export function TrackingScreen() {
  const { colors, spacing, type } = useTheme();
  const route = useRoute<any>();
  const { kind, id } = route.params as { kind: TrackingKind; id: string };
  const [tracking, setTracking] = useState<TrackingState | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await apiRequest<{ tracking: TrackingState }>(TRACK_PATH[kind](id));
        if (!cancelled) setTracking(res.tracking);
      } catch {
        // Best-effort: a missed poll just waits for the next tick.
      }
    }

    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [kind, id]);

  const isDone = tracking?.status === "completed" || tracking?.status === "delivered";
  const color = KIND_COLOR[kind];

  return (
    <Screen>
      <View>
        <Text style={[type.micro, { color }]}>{KIND_TITLE[kind].toUpperCase()}</Text>
        <Text style={[type.title, { color: colors.textPrimary }]}>
          {tracking ? STATUS_LABEL[tracking.status] ?? tracking.status : "Loading..."}
        </Text>
      </View>

      {tracking && (
        <>
          <GlassCard accentColor={isDone ? color : undefined}>
            <View style={{ gap: spacing.lg }}>
              <RouteMap
                kind={kind}
                progress={tracking.progress}
                origin={tracking.origin}
                destination={tracking.destination}
                agentLocation={tracking.agentLocation}
              />
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={[type.bodyStrong, { color: colors.textPrimary }]}>{tracking.agentName}</Text>
                  <Text style={[type.caption, { color: colors.textMuted }]}>
                    {isDone ? "Arrived" : `${tracking.etaRemainingMinutes} min remaining`}
                  </Text>
                </View>
                <View style={{ backgroundColor: color + "22", paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 999 }}>
                  <Text style={[type.caption, { color, fontWeight: "700" }]}>{Math.round(tracking.progress * 100)}%</Text>
                </View>
              </View>
            </View>
          </GlassCard>

          {isDone && (
            <GlassCard>
              <Text style={[type.body, { color: colors.textSecondary }]}>
                {kind === "ride" ? "Hope it was a smooth ride." : "Enjoy! Let Myra know if anything was off."}
              </Text>
            </GlassCard>
          )}
        </>
      )}
    </Screen>
  );
}
