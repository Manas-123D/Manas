import { prisma } from "../../db/prisma";

export function listMedicines() {
  return prisma.medicine.findMany();
}

export async function createMedOrder(userId: string, medicineIds: string[], refillOfOrderId?: string) {
  return prisma.medOrder.create({
    data: {
      userId,
      medicineIds,
      status: "placed",
      etaMinutes: 45,
      refillOfOrderId,
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

// Important: Myra only ever assists with refill logistics and reminders here.
// Anything touching dosage, substitution or medical suitability is explicitly
// out of scope for automation and must be deferred to the user / a pharmacist.
export const MEDICAL_ADVICE_DISCLAIMER =
  "Myra can help you order, track and refill medicines, but does not provide medical advice. Please consult a qualified professional for dosage or treatment questions.";
