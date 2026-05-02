import { pgTable, text, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const stakeStatusEnum = pgEnum("stake_status", ["ACTIVE", "COMPLETED", "WITHDRAWN"]);

export const stakesTable = pgTable("stakes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  amount: real("amount").notNull(),
  status: stakeStatusEnum("status").notNull().default("ACTIVE"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull().defaultNow(),
  endDate: timestamp("end_date", { withTimezone: true }),
});

export const insertStakeSchema = createInsertSchema(stakesTable).omit({ id: true, startDate: true });
export type InsertStake = z.infer<typeof insertStakeSchema>;
export type Stake = typeof stakesTable.$inferSelect;
