import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getOrCreateUser } from "../lib/getOrCreateUser";

const router = Router();

/**
 * POST /api/bug-report
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const clerkUserId = (req as any).clerkUserId as string;

    const user = await getOrCreateUser(clerkUserId);

    const { title, description, steps, severity } = req.body;

    // 🔴 basic validation
    if (!title || !description) {
      return res.status(400).json({
        error: "Title and description are required",
      });
    }

    // 👉 TEMP: just log (you can replace with DB later)
    req.log.info(
      {
        userId: user.id,
        title,
        description,
        steps,
        severity,
      },
      "New bug report submitted"
    );

    // ✅ optional: store in DB later (if you create table)
    // await db.insert(bugReportsTable).values({ ... })

    res.json({
      success: true,
      message: "Bug report submitted",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit bug report");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;