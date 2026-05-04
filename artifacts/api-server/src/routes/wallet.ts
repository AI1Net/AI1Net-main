import { Router } from "express";
import { randomUUID } from "crypto";
import { verifyMessage } from "viem";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const nonces = new Map<string, string>();

// 1. get nonce
router.post("/nonce", (req, res) => {
  const { address } = req.body;

  const nonce = randomUUID();
  nonces.set(address, nonce);

  res.json({
    message: `Sign this: ${nonce}`,
  });
});

// 2. verify
router.post("/verify", async (req, res): Promise<any> => {
  const { address, signature, message } = req.body;

  const clerkId = req.auth?.userId; // ✅ secure

  if (!clerkId) {
    return res.status(401).json({ error: "unauthorized" });
  }

  const stored = nonces.get(address);

  if (!stored || !message.includes(stored)) {
    return res.status(400).json({ error: "bad nonce" });
  }

  const valid = await verifyMessage({
    address,
    message,
    signature,
  });

  if (!valid) {
    return res.status(401).json({ error: "bad signature" });
  }

  await db
    .update(usersTable)
    .set({ walletAddress: address })
    .where(eq(usersTable.clerkId, clerkId));

  nonces.delete(address);

  return res.json({ success: true });
});

export default router;