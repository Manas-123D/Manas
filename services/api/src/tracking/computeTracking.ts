import { GeoPoint, TrackingKind, TrackingState } from "@nexserv/shared";

// No background jobs, no websockets, no cron: a delivery/ride's live position
// is a pure function of elapsed time since it was created. Every poll just
// recomputes where the agent "should" be along the straight-line route given
// how much of the ETA has passed. Deterministic, cheap, and always accurate
// even if the server restarts.

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const STATUS_BY_KIND: Record<TrackingKind, { early: string; mid: string; done: string }> = {
  ride: { early: "matched", mid: "ongoing", done: "completed" },
  food: { early: "preparing", mid: "out_for_delivery", done: "delivered" },
  meds: { early: "packed", mid: "out_for_delivery", done: "delivered" },
};

export function computeTracking(
  kind: TrackingKind,
  agentName: string,
  origin: GeoPoint,
  destination: GeoPoint,
  createdAt: Date,
  totalEtaMinutes: number,
  now: Date = new Date()
): TrackingState {
  const elapsedMinutes = (now.getTime() - createdAt.getTime()) / 60000;
  // First ~20% of the ETA is prep/matching time (cooking, dispatch) before the
  // agent actually starts moving - keeps the very first poll from showing
  // motion that hasn't happened yet.
  const prepFraction = 0.2;
  const movingWindow = totalEtaMinutes * (1 - prepFraction);
  const movingElapsed = Math.max(0, elapsedMinutes - totalEtaMinutes * prepFraction);
  const progress = Math.max(0, Math.min(1, movingWindow > 0 ? movingElapsed / movingWindow : 1));

  const statuses = STATUS_BY_KIND[kind];
  const status = progress >= 1 ? statuses.done : progress > 0 ? statuses.mid : statuses.early;

  return {
    kind,
    status,
    progress,
    agentName,
    agentLocation: {
      lat: lerp(origin.lat, destination.lat, progress),
      lng: lerp(origin.lng, destination.lng, progress),
    },
    origin,
    destination,
    etaRemainingMinutes: Math.max(0, Math.round(totalEtaMinutes - elapsedMinutes)),
    totalEtaMinutes,
  };
}
