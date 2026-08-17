import { prisma } from "../../db/prisma";
import { HomeServiceCategory } from "@nexserv/shared";

const CATEGORY_BASE_PRICE: Record<HomeServiceCategory, number> = {
  electrician: 299,
  plumber: 279,
  ac_technician: 499,
  cleaning: 399,
  appliance_repair: 349,
};

export async function createHomeServiceRequest(
  userId: string,
  category: HomeServiceCategory,
  description: string,
  scheduledFor: Date
) {
  return prisma.homeServiceRequest.create({
    data: {
      userId,
      category,
      description,
      scheduledFor,
      status: "requested",
      priceEstimate: CATEGORY_BASE_PRICE[category],
      technicianName: ["Suresh", "Meena", "Anitha", "Vignesh", "Deepak"][Math.floor(Math.random() * 5)],
    },
  });
}

export function listHomeServiceHistory(userId: string) {
  return prisma.homeServiceRequest.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}
