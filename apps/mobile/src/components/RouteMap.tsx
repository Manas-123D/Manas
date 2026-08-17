import React, { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { AnimatedRegion, MarkerAnimated, Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { GeoPoint, TrackingKind } from "@nexserv/shared";
import { brand } from "../theme";

const KIND_COLOR: Record<TrackingKind, string> = { ride: brand.ride, food: brand.food, meds: brand.meds };

interface RouteMapProps {
  kind: TrackingKind;
  progress: number;
  origin: GeoPoint;
  destination: GeoPoint;
  agentLocation: GeoPoint;
}

function boundingRegion(a: GeoPoint, b: GeoPoint) {
  const latitude = (a.lat + b.lat) / 2;
  const longitude = (a.lng + b.lng) / 2;
  const latitudeDelta = Math.max(Math.abs(a.lat - b.lat) * 1.8, 0.02);
  const longitudeDelta = Math.max(Math.abs(a.lng - b.lng) * 1.8, 0.02);
  return { latitude, longitude, latitudeDelta, longitudeDelta };
}

/**
 * Real Google Maps tiles for native (iOS/Android), now that a Maps API key
 * is configured in app.config.js. Web keeps RouteTracker's animated strip -
 * react-native-maps has no official web renderer without extra shims.
 */
export function RouteMap({ kind, origin, destination, agentLocation }: RouteMapProps) {
  const color = KIND_COLOR[kind];
  const agentRegion = useRef(new AnimatedRegion({ latitude: agentLocation.lat, longitude: agentLocation.lng })).current;

  useEffect(() => {
    agentRegion
      .timing({
        latitude: agentLocation.lat,
        longitude: agentLocation.lng,
        duration: 900,
        useNativeDriver: false,
      } as any)
      .start();
  }, [agentLocation.lat, agentLocation.lng]);

  return (
    <View style={styles.wrap}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={boundingRegion(origin, destination)}
      >
        <Polyline
          coordinates={[
            { latitude: origin.lat, longitude: origin.lng },
            { latitude: destination.lat, longitude: destination.lng },
          ]}
          strokeColor={color}
          strokeWidth={3}
          lineDashPattern={[6, 6]}
        />
        <Marker coordinate={{ latitude: origin.lat, longitude: origin.lng }} title={origin.label ?? "Pickup"} pinColor={color} />
        <Marker coordinate={{ latitude: destination.lat, longitude: destination.lng }} title={destination.label ?? "Drop-off"} />
        <MarkerAnimated coordinate={agentRegion as any}>
          <View style={[styles.agentMarker, { backgroundColor: color }]} />
        </MarkerAnimated>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 220, borderRadius: 16, overflow: "hidden" },
  agentMarker: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#fff" },
});
