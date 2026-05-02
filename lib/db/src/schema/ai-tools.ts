import { pgTable, text, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { aiProvidersTable } from "./ai-providers";

export const aiCategoryEnum = pgEnum("ai_category", ["TEXT", "IMAGE", "VIDEO", "CODE", "VOICE", "MULTIMODAL"]);

export const aiToolsTable = pgTable("ai_tools", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: aiCategoryEnum("category").notNull(),
  providerId: text("provider_id").notNull().references(() => aiProvidersTable.id),
  pricePerUse: real("price_per_use").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertAIToolSchema = createInsertSchema(aiToolsTable).omit({ id: true, createdAt: true });
export type InsertAITool = z.infer<typeof insertAIToolSchema>;
export type AITool = typeof aiToolsTable.$inferSelect;
