import { db } from "./db";
import {
  verifications,
  type CreateVerificationRequest,
  type VerificationResponse
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getVerifications(): Promise<VerificationResponse[]>;
  getVerification(id: number): Promise<VerificationResponse | undefined>;
  createVerification(verification: CreateVerificationRequest): Promise<VerificationResponse>;
  updateVerification(id: number, updates: Partial<VerificationResponse>): Promise<VerificationResponse>;
}

export class DatabaseStorage implements IStorage {
  async getVerifications(): Promise<VerificationResponse[]> {
    return await db.select().from(verifications).orderBy(verifications.createdAt);
  }

  async getVerification(id: number): Promise<VerificationResponse | undefined> {
    const [verification] = await db.select().from(verifications).where(eq(verifications.id, id));
    return verification;
  }

  async createVerification(verification: CreateVerificationRequest): Promise<VerificationResponse> {
    const [created] = await db.insert(verifications).values(verification).returning();
    return created;
  }

  async updateVerification(id: number, updates: Partial<VerificationResponse>): Promise<VerificationResponse> {
    const [updated] = await db.update(verifications)
      .set(updates)
      .where(eq(verifications.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
