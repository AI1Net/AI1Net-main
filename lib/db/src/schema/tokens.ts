import { pgTable, text, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const transactionTypeEnum = pgEnum("transaction_type", ["SPEND", "EARN", "STAKE", "UNSTAKE", "REWARD"]);

export const tokenTransactionsTable = pgTable("token_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  type: transactionTypeEnum("type").notNull(),
  amount: real("amount").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTokenTransactionSchema = createInsertSchema(tokenTransactionsTable).omit({ id: true, createdAt: true });
export type InsertTokenTransaction = z.infer<typeof insertTokenTransactionSchema>;
export type TokenTransaction = typeof tokenTransactionsTable.$inferSelect;
