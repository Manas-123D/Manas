import { Router } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { listMedicines, createMedOrder, refillLastOrder, listMedOrderHistory, MEDICAL_ADVICE_DISCLAIMER } from "../modules/meds/service";

export const medsRouter = Router();
medsRouter.use(requireAuth);

medsRouter.get("/medicines", async (_req, res) => {
  res.json({ medicines: await listMedicines(), disclaimer: MEDICAL_ADVICE_DISCLAIMER });
});

medsRouter.post("/orders", async (req: AuthedRequest, res) => {
  const schema = z.object({ medicineIds: z.array(z.string()).min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const order = await createMedOrder(req.userId!, parsed.data.medicineIds);
  res.status(201).json({ order });
});

medsRouter.post("/orders/refill", async (req: AuthedRequest, res) => {
  const schema = z.object({ medicineId: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const order = await refillLastOrder(req.userId!, parsed.data.medicineId);
  res.status(201).json({ order });
});

medsRouter.get("/orders", async (req: AuthedRequest, res) => {
  res.json({ orders: await listMedOrderHistory(req.userId!) });
});
