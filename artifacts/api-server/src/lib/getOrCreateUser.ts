import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function getOrCreateUser(clerkId: string) {
  try {
    // try insert first (fast path)
    const [user] = await db
      .insert(usersTable)
      .values({
        id: randomUUID(),
        clerkId,
        email: `${clerkId}@ai1net.app`,
        name: "",
        tokenBalance: 500,
      })
      .onConflictDoNothing() // 👈 KEY FIX
      .returning();

    if (user) return user;

    // if insert did nothing → user already exists → fetch it
    const existing = await db.query.usersTable.findFirst({
      where: eq(usersTable.clerkId, clerkId),
    });

    if (!existing) {
      throw new Error("User exists but cannot fetch");
    }

    return existing;

  } catch (err) {
    throw err;
  }
}