import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const aiProvidersTable = pgTable("ai_providers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAIProviderSchema = createInsertSchema(aiProvidersTable).omit({ id: true, createdAt: true });
export type InsertAIProvider = z.infer<typeof insertAIProviderSchema>;
export type AIProvider = typeof aiProvidersTable.$inferSelect;
