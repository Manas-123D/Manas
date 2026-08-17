import { Router } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { createHomeServiceRequest, listHomeServiceHistory } from "../modules/home/service";

export const homeRouter = Router();
homeRouter.use(requireAuth);

homeRouter.post("/requests", async (req: AuthedRequest, res) => {
  const schema = z.object({
    category: z.enum(["electrician", "plumber", "ac_technician", "cleaning", "appliance_repair"]),
    description: z.string().min(1),
    scheduledFor: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const request = await createHomeServiceRequest(
    req.userId!,
    parsed.data.category,
    parsed.data.description,
    new Date(parsed.data.scheduledFor)
  );
  res.status(201).json({ request });
});

homeRouter.get("/requests", async (req: AuthedRequest, res) => {
  res.json({ requests: await listHomeServiceHistory(req.userId!) });
});
