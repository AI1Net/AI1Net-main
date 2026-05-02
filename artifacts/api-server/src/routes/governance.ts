import { Router } from "express";
import { db, proposalsTable, votesTable, stakesTable } from "@workspace/db";
import { eq, sum, count, and } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { CastVoteBody, ListProposalsQueryParams, CastVoteParams } from "@workspace/api-zod";

const router = Router();

router.get("/proposals", async (req, res) => {
  try {
    const params = ListProposalsQueryParams.parse({ status: req.query.status });

    const conditions = params.status ? [eq(proposalsTable.status, params.status)] : [];

    const proposals = await db.select().from(proposalsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const enriched = await Promise.all(proposals.map(async (p) => {
      const voteCounts = await db.select({
        choice: votesTable.choice,
        total: sum(votesTable.weight),
      })
      .from(votesTable)
      .where(eq(votesTable.proposalId, p.id))
      .groupBy(votesTable.choice);

      const yesVotes = Number(voteCounts.find(v => v.choice === "YES")?.total ?? 0);
      const noVotes = Number(voteCounts.find(v => v.choice === "NO")?.total ?? 0);
      const abstainVotes = Number(voteCounts.find(v => v.choice === "ABSTAIN")?.total ?? 0);

      return { ...p, yesVotes, noVotes, abstainVotes, userVote: null };
    }));

    res.json(enriched);
  } catch (err) {
    req.log.error({ err }, "Failed to list proposals");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/proposals/:id/vote", requireAuth, async (req, res) => {
  try {
    const { id } = CastVoteParams.parse({ id: req.params.id });
    const body = CastVoteBody.parse(req.body);
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);

    const [proposal] = await db.select().from(proposalsTable).where(eq(proposalsTable.id, id)).limit(1);
    if (!proposal) {
      res.status(404).json({ error: "Proposal not found" });
      return;
    }
    if (proposal.status !== "ACTIVE") {
      res.status(400).json({ error: "Proposal is not active" });
      return;
    }

    const [stakeResult] = await db.select({ total: sum(stakesTable.amount) })
      .from(stakesTable)
      .where(and(eq(stakesTable.userId, user.id), eq(stakesTable.status, "ACTIVE")));
    const votingWeight = Math.max(1, Number(stakeResult?.total) || 1);

    const [existing] = await db.select().from(votesTable)
      .where(and(eq(votesTable.userId, user.id), eq(votesTable.proposalId, id)))
      .limit(1);

    if (existing) {
      res.status(400).json({ error: "Already voted on this proposal" });
      return;
    }

    const [vote] = await db.insert(votesTable).values({
      userId: user.id,
      proposalId: id,
      choice: body.choice,
      weight: votingWeight,
    }).returning();

    res.status(201).json(vote);
  } catch (err) {
    req.log.error({ err }, "Failed to cast vote");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
