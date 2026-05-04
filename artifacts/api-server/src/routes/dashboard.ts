import { Router } from "express";
import { db, aiUsageTable, aiToolsTable, rewardsTable, usersTable, tokenTransactionsTable, stakesTable } from "@workspace/db";
import { eq, sql, sum, count, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { GetDashboardActivityQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/summary", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [requestsToday] = await db.select({ count: count() })
      .from(aiUsageTable)
      .where(and(
        eq(aiUsageTable.userId, user.id),
        sql`${aiUsageTable.createdAt} >= ${today.toISOString()}`
      ));

    const [totalRequests] = await db.select({ count: count() })
      .from(aiUsageTable)
      .where(eq(aiUsageTable.userId, user.id));

    const [rewardsTotal] = await db.select({ total: sum(rewardsTable.amount) })
      .from(rewardsTable)
      .where(eq(rewardsTable.userId, user.id));

    const [tokensSpentToday] = await db.select({ total: sum(aiUsageTable.tokensUsed) })
      .from(aiUsageTable)
      .where(and(
        eq(aiUsageTable.userId, user.id),
        sql`${aiUsageTable.createdAt} >= ${today.toISOString()}`
      ));

    const [activeModels] = await db.select({ count: count(sql`DISTINCT ${aiUsageTable.toolId}`) })
      .from(aiUsageTable)
      .where(eq(aiUsageTable.userId, user.id));

    res.json({
      requestsToday: Number(requestsToday.count) || 0,
      tokenBalance: user.tokenBalance,
      totalRewardsEarned: Number(rewardsTotal.total) || 0,
      activeModels: Number(activeModels.count) || 0,
      totalRequests: Number(totalRequests.count) || 0,
      tokensSpentToday: Number(tokensSpentToday.total) || 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/activity", async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const params = GetDashboardActivityQueryParams.parse({
      limit: req.query.limit ? Number(req.query.limit) : 10,
    });

    const limit = params.limit ?? 10;

    const usageItems = await db.select({
      id: aiUsageTable.id,
      toolName: aiToolsTable.name,
      tokensUsed: aiUsageTable.tokensUsed,
      status: aiUsageTable.status,
      createdAt: aiUsageTable.createdAt,
    })
    .from(aiUsageTable)
    .innerJoin(aiToolsTable, eq(aiToolsTable.id, aiUsageTable.toolId))
    .where(eq(aiUsageTable.userId, user.id))
    .orderBy(desc(aiUsageTable.createdAt))
    .limit(limit);

    const rewardItems = await db.select()
      .from(rewardsTable)
      .where(eq(rewardsTable.userId, user.id))
      .orderBy(desc(rewardsTable.createdAt))
      .limit(limit);

    const txItems = await db.select()
      .from(tokenTransactionsTable)
      .where(and(
        eq(tokenTransactionsTable.userId, user.id),
        eq(tokenTransactionsTable.type, "STAKE")
      ))
      .orderBy(desc(tokenTransactionsTable.createdAt))
      .limit(limit);

    const activity = [
      ...usageItems.map(u => ({
        id: u.id,
        type: "AI_REQUEST" as const,
        title: `Used ${u.toolName}`,
        description: u.status === "SUCCESS" ? "Request completed successfully" : `Status: ${u.status}`,
        amount: u.tokensUsed,
        createdAt: u.createdAt,
      })),
      ...rewardItems.map(r => ({
        id: r.id,
        type: "REWARD_EARNED" as const,
        title: `Reward earned`,
        description: `${r.type.toLowerCase()} reward received`,
        amount: r.amount,
        createdAt: r.createdAt,
      })),
      ...txItems.map(t => ({
        id: t.id,
        type: "STAKE" as const,
        title: `Tokens staked`,
        description: t.metadata ?? "Stake transaction",
        amount: t.amount,
        createdAt: t.createdAt,
      })),
    ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);

    res.json(activity);
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard activity");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/tools-usage", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const toolUsage = await db.select({
      toolId: aiToolsTable.id,
      toolName: aiToolsTable.name,
      toolSlug: aiToolsTable.slug,
      category: aiToolsTable.category,
      requestCount: count(aiUsageTable.id),
      tokensSpent: sum(aiUsageTable.tokensUsed),
    })
    .from(aiUsageTable)
    .innerJoin(aiToolsTable, eq(aiToolsTable.id, aiUsageTable.toolId))
    .where(eq(aiUsageTable.userId, user.id))
    .groupBy(aiToolsTable.id, aiToolsTable.name, aiToolsTable.slug, aiToolsTable.category)
    .orderBy(desc(count(aiUsageTable.id)))
    .limit(10);

    res.json(toolUsage.map(t => ({
      toolId: t.toolId,
      toolName: t.toolName,
      toolSlug: t.toolSlug,
      category: t.category,
      requestCount: Number(t.requestCount),
      tokensSpent: Number(t.tokensSpent) || 0,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get tools usage");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
