import { pgTable, text, real, timestamp, pgEnum, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const proposalStatusEnum = pgEnum("proposal_status", ["ACTIVE", "PASSED", "REJECTED"]);
export const voteChoiceEnum = pgEnum("vote_choice", ["YES", "NO", "ABSTAIN"]);

export const proposalsTable = pgTable("proposals", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: proposalStatusEnum("status").notNull().default("ACTIVE"),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const votesTable = pgTable("votes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => usersTable.id),
  proposalId: text("proposal_id").notNull().references(() => proposalsTable.id),
  choice: voteChoiceEnum("choice").notNull(),
  weight: real("weight").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique().on(table.userId, table.proposalId),
]);

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ id: true, createdAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;

export const insertVoteSchema = createInsertSchema(votesTable).omit({ id: true, createdAt: true });
export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votesTable.$inferSelect;
