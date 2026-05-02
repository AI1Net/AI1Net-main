import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function getOrCreateUser(clerkId: string, email?: string, name?: string) {
  const existing = await db.select().from(usersTable).where(eq(usersTable.clerkId, clerkId)).limit(1);
  if (existing.length > 0) {
    return existing[0];
  }

  const userEmail = email ?? `${clerkId}@ai1net.app`;
  const [user] = await db.insert(usersTable).values({
    clerkId,
    email: userEmail,
    name: name ?? null,
    tokenBalance: 500,
  }).returning();

  logger.info({ clerkId, userId: user.id }, "Created new user");
  return user;
}
