import { pgTable, text, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { aiToolsTable } from "./ai-tools";

export const usageStatusEnum = pgEnum("usage_status", ["SUCCESS", "FAILED", "PENDING"]);

export const aiUsageTable = pgTable("ai_usage", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  toolId: text("tool_id").notNull().references(() => aiToolsTable.id),
  input: text("input").notNull(),
  output: text("output"),
  tokensUsed: real("tokens_used").notNull(),
  status: usageStatusEnum("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAIUsageSchema = createInsertSchema(aiUsageTable).omit({ id: true, createdAt: true });
export type InsertAIUsage = z.infer<typeof insertAIUsageSchema>;
export type AIUsage = typeof aiUsageTable.$inferSelect;
