import { prisma } from "../../db/prisma";

export function listRestaurants(city: string) {
  return prisma.restaurant.findMany({ where: { city }, include: { menuItems: true } });
}

export async function createFoodOrder(userId: string, restaurantId: string, items: { itemId: string; quantity: number }[]) {
  const restaurant = await prisma.restaurant.findUniqueOrThrow({
    where: { id: restaurantId },
    include: { menuItems: true },
  });
  const priceByItem = new Map(restaurant.menuItems.map((m) => [m.id, m.price]));
  const total = items.reduce((sum, i) => sum + (priceByItem.get(i.itemId) ?? 0) * i.quantity, 0);

  return prisma.foodOrder.create({
    data: {
      userId,
      restaurantId,
      items,
      status: "placed",
      total,
      etaMinutes: restaurant.etaMinutes,
    },
  });
}

export function listFoodOrderHistory(userId: string) {
  return prisma.foodOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}
