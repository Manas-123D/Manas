import { prisma } from "../../db/prisma";
import { GeoPoint, RideOption, RideVehicleType } from "@nexserv/shared";
import { computeTracking } from "../../tracking/computeTracking";

const VEHICLES: { type: RideVehicleType; baseFare: number; perKm: number; baseEta: number }[] = [
  { type: "bike", baseFare: 15, perKm: 5, baseEta: 4 },
  { type: "auto", baseFare: 25, perKm: 8, baseEta: 5 },
  { type: "cab", baseFare: 40, perKm: 13, baseEta: 6 },
  { type: "pool", baseFare: 20, perKm: 6, baseEta: 9 },
];

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return R * 2 * Math.asin(Math.sqrt(h));
}

export function quoteRideOptions(pickup: GeoPoint, dropoff: GeoPoint, trafficLevel: "light" | "moderate" | "heavy"): RideOption[] {
  const distanceKm = Math.max(1, haversineKm(pickup, dropoff));
  const surge = trafficLevel === "heavy" ? 1.3 : trafficLevel === "moderate" ? 1.1 : 1.0;
  const trafficEtaPenalty = trafficLevel === "heavy" ? 6 : trafficLevel === "moderate" ? 3 : 0;

  return VEHICLES.map((v) => ({
    vehicleType: v.type,
    etaMinutes: Math.round(v.baseEta + trafficEtaPenalty + distanceKm * 0.6),
    priceEstimate: Math.round((v.baseFare + v.perKm * distanceKm) * surge),
    surge,
  }));
}

export async function createRideRequest(userId: string, pickup: GeoPoint, dropoff: GeoPoint, vehicleType: RideVehicleType, trafficLevel: "light" | "moderate" | "heavy") {
  const [quote] = quoteRideOptions(pickup, dropoff, trafficLevel).filter((o) => o.vehicleType === vehicleType);
  return prisma.rideRequest.create({
    data: {
      userId,
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropoffLat: dropoff.lat,
      dropoffLng: dropoff.lng,
      vehicleType,
      status: "matched",
      priceEstimate: quote?.priceEstimate ?? 0,
      etaMinutes: quote?.etaMinutes ?? 5,
      driverName: ["Arjun", "Priya", "Karthik", "Fathima", "Ravi"][Math.floor(Math.random() * 5)],
    },
  });
}

export function listRideHistory(userId: string) {
  return prisma.rideRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}

export async function getRideTracking(userId: string, rideId: string) {
  const ride = await prisma.rideRequest.findFirstOrThrow({ where: { id: rideId, userId } });
  return computeTracking(
    "ride",
    ride.driverName ?? "Your driver",
    { lat: ride.pickupLat, lng: ride.pickupLng },
    { lat: ride.dropoffLat, lng: ride.dropoffLng },
    ride.createdAt,
    ride.etaMinutes
  );
}
