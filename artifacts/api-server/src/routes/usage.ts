import { Router } from "express";
import { db, aiUsageTable, aiToolsTable } from "@workspace/db";
import { eq, sql, count, sum, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { ListMyUsageQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const params = ListMyUsageQueryParams.parse({
      toolId: req.query.toolId,
      status: req.query.status,
      limit: req.query.limit ? Number(req.query.limit) : 20,
      offset: req.query.offset ? Number(req.query.offset) : 0,
    });

    const conditions = [eq(aiUsageTable.userId, user.id)];
    if (params.toolId) conditions.push(eq(aiUsageTable.toolId, params.toolId));
    if (params.status) conditions.push(eq(aiUsageTable.status, params.status));

    const [{ total }] = await db.select({ total: count() })
      .from(aiUsageTable)
      .where(and(...conditions));

    const data = await db.select({
      id: aiUsageTable.id,
      toolId: aiUsageTable.toolId,
      toolName: aiToolsTable.name,
      toolSlug: aiToolsTable.slug,
      category: aiToolsTable.category,
      input: aiUsageTable.input,
      output: aiUsageTable.output,
      tokensUsed: aiUsageTable.tokensUsed,
      status: aiUsageTable.status,
      createdAt: aiUsageTable.createdAt,
    })
    .from(aiUsageTable)
    .innerJoin(aiToolsTable, eq(aiToolsTable.id, aiUsageTable.toolId))
    .where(and(...conditions))
    .orderBy(desc(aiUsageTable.createdAt))
    .limit(params.limit ?? 20)
    .offset(params.offset ?? 0);

    res.json({ data, total, limit: params.limit ?? 20, offset: params.offset ?? 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to list usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totals] = await db.select({
      totalRequests: count(),
      totalTokensSpent: sum(aiUsageTable.tokensUsed),
    }).from(aiUsageTable).where(eq(aiUsageTable.userId, user.id));

    const [todayTotals] = await db.select({
      requestsToday: count(),
      tokensSpentToday: sum(aiUsageTable.tokensUsed),
    }).from(aiUsageTable).where(
      and(
        eq(aiUsageTable.userId, user.id),
        sql`${aiUsageTable.createdAt} >= ${today.toISOString()}`
      )
    );

    const [successCount] = await db.select({ count: count() })
      .from(aiUsageTable)
      .where(and(eq(aiUsageTable.userId, user.id), eq(aiUsageTable.status, "SUCCESS")));

    const totalR = Number(totals.totalRequests) || 0;
    const successRate = totalR > 0 ? (Number(successCount.count) / totalR) * 100 : 100;

    const topCategories = await db.select({
      category: aiToolsTable.category,
      count: count(),
    })
    .from(aiUsageTable)
    .innerJoin(aiToolsTable, eq(aiToolsTable.id, aiUsageTable.toolId))
    .where(eq(aiUsageTable.userId, user.id))
    .groupBy(aiToolsTable.category)
    .orderBy(sql`count(*) DESC`)
    .limit(5);

    res.json({
      totalRequests: totalR,
      totalTokensSpent: Number(totals.totalTokensSpent) || 0,
      requestsToday: Number(todayTotals.requestsToday) || 0,
      tokensSpentToday: Number(todayTotals.tokensSpentToday) || 0,
      successRate: Math.round(successRate * 10) / 10,
      topCategories: topCategories.map(c => ({ category: c.category, count: Number(c.count) })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get usage stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
