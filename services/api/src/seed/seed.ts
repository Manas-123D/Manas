import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";

// Seeds one launch area (Indiranagar, Bengaluru) so the app is usable end to
// end out of the box: one demo user, restaurants, medicines and partners.
async function main() {
  const city = "Bengaluru";

  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@nexserv.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@nexserv.app",
      passwordHash,
      city,
      phone: "+91 90000 00000",
      homeLat: 12.9719,
      homeLng: 77.6412,
      workLat: 12.9698,
      workLng: 77.75,
    },
  });

  await prisma.preference.createMany({
    data: [
      { userId: user.id, key: "food.cuisine", value: "South Indian" },
      { userId: user.id, key: "ride.default_vehicle", value: "auto" },
    ],
    skipDuplicates: true,
  });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: "Thindi Beedi Kitchen",
      cuisine: ["South Indian", "Healthy"],
      rating: 4.6,
      etaMinutes: 25,
      distanceKm: 2.1,
      city,
      menuItems: {
        create: [
          { name: "Masala Dosa", price: 90, isVeg: true, prepTimeMinutes: 12 },
          { name: "Curd Rice Bowl", price: 70, isVeg: true, prepTimeMinutes: 8 },
          { name: "Filter Coffee", price: 30, isVeg: true, prepTimeMinutes: 3 },
        ],
      },
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Spice Route Grill",
      cuisine: ["North Indian", "Grill"],
      rating: 4.3,
      etaMinutes: 35,
      distanceKm: 3.4,
      city,
      menuItems: {
        create: [
          { name: "Butter Chicken", price: 260, isVeg: false, prepTimeMinutes: 18 },
          { name: "Paneer Tikka", price: 210, isVeg: true, prepTimeMinutes: 15 },
        ],
      },
    },
  });

  await prisma.medicine.createMany({
    data: [
      { name: "Paracetamol 500mg (Strip of 10)", requiresPrescription: false, price: 25, packSize: "10 tablets" },
      { name: "Cetirizine 10mg (Strip of 10)", requiresPrescription: false, price: 30, packSize: "10 tablets" },
      { name: "Metformin 500mg (Strip of 15)", requiresPrescription: true, price: 45, packSize: "15 tablets" },
    ],
    skipDuplicates: true,
  });

  await prisma.foodOrder.create({
    data: {
      userId: user.id,
      restaurantId: restaurant.id,
      items: [{ itemId: (await prisma.menuItem.findFirstOrThrow({ where: { restaurantId: restaurant.id } })).id, quantity: 1 }],
      status: "delivered",
      total: 90,
      etaMinutes: 25,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.homeServiceRequest.create({
    data: {
      userId: user.id,
      category: "ac_technician",
      description: "Routine AC service",
      scheduledFor: new Date(Date.now() - 182 * 24 * 60 * 60 * 1000),
      status: "completed",
      priceEstimate: 499,
      technicianName: "Vignesh",
      createdAt: new Date(Date.now() - 182 * 24 * 60 * 60 * 1000),
    },
  });

  const partners = [
    { name: "Ravi Kumar", role: "driver" },
    { name: "Lakshmi N.", role: "delivery_partner" },
    { name: "Suresh Babu", role: "electrician" },
    { name: "Meena R.", role: "cleaner" },
  ];
  for (const p of partners) {
    await prisma.partner.create({
      data: {
        name: p.name,
        role: p.role,
        city,
        rating: 4.7,
        completedJobs: 120,
        loyaltyTier: "gold",
        loyaltyPoints: 3400,
        trainingModulesCompleted: 6,
        incentives: {
          create: [
            {
              title: "Quarterly performance bonus",
              description: "Top 20% completion rate this quarter",
              kind: "financial",
              achievedAt: new Date(),
            },
            {
              title: "Customer-service certification",
              description: "Completed advanced customer-service training",
              kind: "growth",
              achievedAt: new Date(),
            },
          ],
        },
      },
    });
  }

  console.log("Seed complete. Demo login: demo@nexserv.app / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
