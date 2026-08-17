import React from "react";
import { GeoPoint, TrackingKind } from "@nexserv/shared";
import { RouteTracker } from "./RouteTracker";

interface RouteMapProps {
  kind: TrackingKind;
  progress: number;
  origin: GeoPoint;
  destination: GeoPoint;
  agentLocation: GeoPoint;
}

/**
 * Web build of RouteMap. Metro picks this file over RouteMap.tsx for the web
 * platform automatically (the .web.tsx convention) - react-native-maps has no
 * web renderer and breaks the web bundle if it's even imported, so this stays
 * on the animated route-strip fallback instead of real map tiles.
 */
export function RouteMap({ kind, progress, origin, destination }: RouteMapProps) {
  return (
    <RouteTracker
      kind={kind}
      progress={progress}
      originLabel={origin.label ?? "Pickup"}
      destinationLabel={destination.label ?? "Drop-off"}
    />
  );
}
