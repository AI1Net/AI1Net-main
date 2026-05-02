import { Router } from "express";
import { db, rewardsTable, usersTable, aiUsageTable } from "@workspace/db";
import { eq, sum, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const rewards = await db.select()
      .from(rewardsTable)
      .where(eq(rewardsTable.userId, user.id))
      .orderBy(desc(rewardsTable.createdAt));

    res.json(rewards);
  } catch (err) {
    req.log.error({ err }, "Failed to list rewards");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leaders = await db.select({
      userId: usersTable.id,
      name: usersTable.name,
      totalRewards: sum(rewardsTable.amount),
      requestCount: count(aiUsageTable.id),
    })
    .from(usersTable)
    .leftJoin(rewardsTable, eq(rewardsTable.userId, usersTable.id))
    .leftJoin(aiUsageTable, eq(aiUsageTable.userId, usersTable.id))
    .groupBy(usersTable.id)
    .orderBy(desc(sum(rewardsTable.amount)))
    .limit(10);

    const leaderboard = leaders.map((entry, idx) => ({
      rank: idx + 1,
      userId: entry.userId,
      name: entry.name ?? `User ${entry.userId.slice(0, 6).toUpperCase()}`,
      totalRewards: Number(entry.totalRewards) || 0,
      requestCount: Number(entry.requestCount) || 0,
    }));

    res.json(leaderboard);
  } catch (err) {
    req.log.error({ err }, "Failed to get leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
