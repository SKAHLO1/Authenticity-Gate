import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  originalityScore: integer("originality_score"),
  plagiarismRisk: integer("plagiarism_risk"),
  deepfakeConfidence: integer("deepfake_confidence"),
  sentiment: text("sentiment"),
  rawResult: jsonb("raw_result"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVerificationSchema = createInsertSchema(verifications).pick({
  url: true,
});

export const createVerificationSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
export type CreateVerificationRequest = z.infer<typeof createVerificationSchema>;
export type VerificationResponse = Verification;

// Export chat models for OpenAI integration
export * from "./models/chat";
