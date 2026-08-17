import { prisma } from "../../db/prisma";
import { computeTracking } from "../../tracking/computeTracking";

const DELIVERY_AGENT_NAMES = ["Farhan", "Swathi", "Bosco", "Rekha", "Ajay"];

// Standing in for a real Pharmacy model: one representative nearby pharmacy
// location per launch city, used purely to give meds tracking a real pickup
// point. Swap for a proper Pharmacy table once there's more than one per city.
const NEAREST_PHARMACY: Record<string, { lat: number; lng: number }> = {
  Hyderabad: { lat: 17.438, lng: 78.347 },
};

function nearestPharmacyFor(city: string, fallback: { lat: number; lng: number }) {
  return NEAREST_PHARMACY[city] ?? fallback;
}

export function listMedicines() {
  return prisma.medicine.findMany();
}

export async function createMedOrder(userId: string, medicineIds: string[], refillOfOrderId?: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const dropoff = { lat: user.homeLat ?? 12.9719, lng: user.homeLng ?? 77.6412 };
  const pickup = nearestPharmacyFor(user.city, dropoff);

  return prisma.medOrder.create({
    data: {
      userId,
      medicineIds,
      status: "placed",
      etaMinutes: 45,
      refillOfOrderId,
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropoffLat: dropoff.lat,
      dropoffLng: dropoff.lng,
      agentName: DELIVERY_AGENT_NAMES[Math.floor(Math.random() * DELIVERY_AGENT_NAMES.length)],
    },
  });
}

export async function refillLastOrder(userId: string, medicineId?: string) {
  const last = await prisma.medOrder.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  const medicineIds = medicineId ? [medicineId] : last?.medicineIds ?? [];
  if (medicineIds.length === 0) {
    throw new Error("No previous medicine order found to refill");
  }
  return createMedOrder(userId, medicineIds, last?.id);
}

export function listMedOrderHistory(userId: string) {
  return prisma.medOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}

export async function getMedOrderTracking(userId: string, orderId: string) {
  const order = await prisma.medOrder.findFirstOrThrow({ where: { id: orderId, userId } });
  return computeTracking(
    "meds",
    order.agentName ?? "Your delivery partner",
    { lat: order.pickupLat, lng: order.pickupLng },
    { lat: order.dropoffLat, lng: order.dropoffLng },
    order.createdAt,
    order.etaMinutes
  );
}

// Important: Myra only ever assists with refill logistics and reminders here.
// Anything touching dosage, substitution or medical suitability is explicitly
// out of scope for automation and must be deferred to the user / a pharmacist.
export const MEDICAL_ADVICE_DISCLAIMER =
  "Myra can help you order, track and refill medicines, but does not provide medical advice. Please consult a qualified professional for dosage or treatment questions.";
