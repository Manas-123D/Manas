import { Router } from "express";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { listPartners, getPartner, recordCompletedJob } from "../modules/care/service";

export const careRouter = Router();
careRouter.use(requireAuth);

careRouter.get("/partners", async (req: AuthedRequest, res) => {
  const city = (req.query.city as string) ?? "";
  res.json({ partners: await listPartners(city) });
});

careRouter.get("/partners/:id", async (req, res) => {
  res.json({ partner: await getPartner(req.params.id) });
});

careRouter.post("/partners/:id/complete-job", async (req, res) => {
  res.json({ partner: await recordCompletedJob(req.params.id) });
});
