import { Router } from "express";
import { db, tokenTransactionsTable, stakesTable, usersTable } from "@workspace/db";
import { eq, and, sum, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { ListTokenTransactionsQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/balance", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const [stakedResult] = await db.select({ total: sum(stakesTable.amount) })
      .from(stakesTable)
      .where(and(eq(stakesTable.userId, user.id), eq(stakesTable.status, "ACTIVE")));

    const stakedAmount = Number(stakedResult?.total) || 0;

    res.json({
      balance: user.tokenBalance,
      stakedAmount,
      availableBalance: user.tokenBalance - stakedAmount,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get token balance");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const params = ListTokenTransactionsQueryParams.parse({
      type: req.query.type,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });

    const conditions = [eq(tokenTransactionsTable.userId, user.id)];
    if (params.type) conditions.push(eq(tokenTransactionsTable.type, params.type));

    const [{ total }] = await db.select({ total: count() })
      .from(tokenTransactionsTable)
      .where(and(...conditions));

    const data = await db.select()
      .from(tokenTransactionsTable)
      .where(and(...conditions))
      .orderBy(desc(tokenTransactionsTable.createdAt))
      .limit(params.limit ?? 20)
      .offset(params.offset ?? 0);

    res.json({ data, total, limit: params.limit ?? 20, offset: params.offset ?? 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to list transactions");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
