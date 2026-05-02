import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";
import { getOrCreateUser } from "../lib/getOrCreateUser";
import { getAuth } from "@clerk/express";

const router = Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const auth = getAuth(req);
    const user = await getOrCreateUser(clerkUserId);
    res.json({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      tokenBalance: user.tokenBalance,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get user");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/me", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;
    const user = await getOrCreateUser(clerkUserId);
    const { name, avatar } = req.body;

    const updates: Partial<typeof usersTable.$inferInsert> = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    const [updated] = await db.update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, user.id))
      .returning();

    res.json({
      id: updated.id,
      clerkId: updated.clerkId,
      email: updated.email,
      name: updated.name,
      avatar: updated.avatar,
      tokenBalance: updated.tokenBalance,
      createdAt: updated.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
