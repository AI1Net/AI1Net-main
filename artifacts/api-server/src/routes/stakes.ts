import { Router } from "express";
import { db, stakesTable, usersTable, tokenTransactionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { CreateStakeBody } from "@workspace/api-zod";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const stakes = await db.select()
      .from(stakesTable)
      .where(eq(stakesTable.userId, user.id));

    res.json(stakes);
  } catch (err) {
    req.log.error({ err }, "Failed to list stakes");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);
    const body = CreateStakeBody.parse(req.body);

    if (user.tokenBalance < body.amount) {
      res.status(400).json({ error: "Insufficient balance to stake" });
      return;
    }

    const [stake] = await db.insert(stakesTable).values({
      userId: user.id,
      amount: body.amount,
      status: "ACTIVE",
    }).returning();

    await db.update(usersTable)
      .set({ tokenBalance: user.tokenBalance - body.amount })
      .where(eq(usersTable.id, user.id));

    await db.insert(tokenTransactionsTable).values({
      userId: user.id,
      type: "STAKE",
      amount: body.amount,
      metadata: `Staked ${body.amount} $AI1NET`,
    });

    res.status(201).json(stake);
  } catch (err) {
    req.log.error({ err }, "Failed to create stake");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
