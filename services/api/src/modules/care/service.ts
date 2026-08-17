import { prisma } from "../../db/prisma";

export function listPartners(city: string) {
  return prisma.partner.findMany({ where: { city }, include: { incentives: true } });
}

export function getPartner(partnerId: string) {
  return prisma.partner.findUniqueOrThrow({ where: { id: partnerId }, include: { incentives: true } });
}

const TIER_THRESHOLDS: { tier: "bronze" | "silver" | "gold" | "platinum"; minJobs: number }[] = [
  { tier: "platinum", minJobs: 500 },
  { tier: "gold", minJobs: 200 },
  { tier: "silver", minJobs: 50 },
  { tier: "bronze", minJobs: 0 },
];

export async function recordCompletedJob(partnerId: string, pointsEarned = 10) {
  const partner = await prisma.partner.findUniqueOrThrow({ where: { id: partnerId } });
  const completedJobs = partner.completedJobs + 1;
  const tier = TIER_THRESHOLDS.find((t) => completedJobs >= t.minJobs)?.tier ?? "bronze";

  return prisma.partner.update({
    where: { id: partnerId },
    data: {
      completedJobs,
      loyaltyPoints: partner.loyaltyPoints + pointsEarned,
      loyaltyTier: tier,
    },
  });
}
