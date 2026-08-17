import { Router } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { quoteRideOptions, createRideRequest, listRideHistory } from "../modules/rides/service";
import { buildContext } from "../myra/contextEngine";

export const ridesRouter = Router();
ridesRouter.use(requireAuth);

const point = z.object({ lat: z.number(), lng: z.number(), label: z.string().optional() });

ridesRouter.post("/quote", async (req: AuthedRequest, res) => {
  const schema = z.object({ pickup: point, dropoff: point });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ctx = await buildContext(req.userId!);
  res.json({ options: quoteRideOptions(parsed.data.pickup, parsed.data.dropoff, ctx.traffic.level), traffic: ctx.traffic });
});

ridesRouter.post("/", async (req: AuthedRequest, res) => {
  const schema = z.object({
    pickup: point,
    dropoff: point,
    vehicleType: z.enum(["bike", "auto", "cab", "pool"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ctx = await buildContext(req.userId!);
  const ride = await createRideRequest(req.userId!, parsed.data.pickup, parsed.data.dropoff, parsed.data.vehicleType, ctx.traffic.level);
  res.status(201).json({ ride });
});

ridesRouter.get("/", async (req: AuthedRequest, res) => {
  res.json({ rides: await listRideHistory(req.userId!) });
});
