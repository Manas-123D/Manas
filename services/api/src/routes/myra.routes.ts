import { Router } from "express";
import { z } from "zod";
import { AuthedRequest, requireAuth } from "../middleware/auth";
import { buildContext } from "../myra/contextEngine";
import { generateInsights } from "../myra/insightEngine";
import { runChatTurn, getChatHistory } from "../myra/chatService";
import { prisma } from "../db/prisma";

export const myraRouter = Router();
myraRouter.use(requireAuth);

// The proactive feed: "Context changes -> Myra understands -> Myra surfaces an insight".
myraRouter.get("/insights", async (req: AuthedRequest, res) => {
  const ctx = await buildContext(req.userId!);
  const insights = generateInsights(ctx);

  await prisma.$transaction(
    insights.map((i) =>
      prisma.myraInsight.upsert({
        where: { id: i.id },
        create: {
          id: i.id,
          userId: req.userId!,
          headline: i.headline,
          detail: i.detail,
          confidence: i.confidence,
          service: i.service,
          action: i.action as any,
        },
        update: {},
      })
    )
  );

  res.json({ insights });
});

myraRouter.post("/insights/:id/dismiss", async (req: AuthedRequest, res) => {
  await prisma.myraInsight.update({ where: { id: req.params.id }, data: { dismissed: true } });
  res.status(204).end();
});

myraRouter.get("/chat", async (req: AuthedRequest, res) => {
  res.json({ messages: await getChatHistory(req.userId!) });
});

const chatSchema = z.object({ message: z.string().min(1) });

myraRouter.post("/chat", async (req: AuthedRequest, res) => {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const result = await runChatTurn(req.userId!, parsed.data.message);
  res.json(result);
});
