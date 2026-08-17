import { prisma } from "../../db/prisma";
import { computeTracking } from "../../tracking/computeTracking";

const DELIVERY_AGENT_NAMES = ["Naveen", "Divya", "Imran", "Shreya", "Ganesh"];

export function listRestaurants(city: string) {
  return prisma.restaurant.findMany({ where: { city }, include: { menuItems: true } });
}

export async function createFoodOrder(userId: string, restaurantId: string, items: { itemId: string; quantity: number }[]) {
  const [restaurant, user] = await Promise.all([
    prisma.restaurant.findUniqueOrThrow({ where: { id: restaurantId }, include: { menuItems: true } }),
    prisma.user.findUniqueOrThrow({ where: { id: userId } }),
  ]);
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
      pickupLat: restaurant.lat,
      pickupLng: restaurant.lng,
      dropoffLat: user.homeLat ?? restaurant.lat,
      dropoffLng: user.homeLng ?? restaurant.lng,
      agentName: DELIVERY_AGENT_NAMES[Math.floor(Math.random() * DELIVERY_AGENT_NAMES.length)],
    },
  });
}

export function listFoodOrderHistory(userId: string) {
  return prisma.foodOrder.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 20 });
}

export async function getFoodOrderTracking(userId: string, orderId: string) {
  const order = await prisma.foodOrder.findFirstOrThrow({ where: { id: orderId, userId } });
  return computeTracking(
    "food",
    order.agentName ?? "Your delivery partner",
    { lat: order.pickupLat, lng: order.pickupLng },
    { lat: order.dropoffLat, lng: order.dropoffLng },
    order.createdAt,
    order.etaMinutes
  );
}
