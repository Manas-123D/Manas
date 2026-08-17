import { Router } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { listRestaurants, createFoodOrder, listFoodOrderHistory } from "../modules/food/service";
import { buildContext } from "../myra/contextEngine";

export const foodRouter = Router();
foodRouter.use(requireAuth);

foodRouter.get("/restaurants", async (req: AuthedRequest, res) => {
  const ctx = await buildContext(req.userId!);
  res.json({ restaurants: await listRestaurants(ctx.city) });
});

foodRouter.post("/orders", async (req: AuthedRequest, res) => {
  const schema = z.object({
    restaurantId: z.string(),
    items: z.array(z.object({ itemId: z.string(), quantity: z.number().int().positive() })).min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const order = await createFoodOrder(req.userId!, parsed.data.restaurantId, parsed.data.items);
  res.status(201).json({ order });
});

foodRouter.get("/orders", async (req: AuthedRequest, res) => {
  res.json({ orders: await listFoodOrderHistory(req.userId!) });
});
