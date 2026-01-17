import { db, collections, docToVerification, type Verification } from './firebase';
import { Timestamp } from 'firebase-admin/firestore';
import { logger } from './services/logger';

export interface CreateVerificationInput {
  url: string;
  status?: string;
}

export interface UpdateVerificationInput {
  status?: string;
  originalityScore?: number;
  plagiarismRisk?: number;
  deepfakeConfidence?: number;
  sentiment?: string;
  summary?: string;
  reasoning?: string;
  contractVerificationId?: number;
}

export class FirebaseStorage {
  /**
   * Get all verifications, sorted by creation date
   */
  async getVerifications(): Promise<Verification[]> {
    try {
      const snapshot = await db.collection(collections.verifications)
        .orderBy('createdAt', 'desc')
        .limit(100)
        .get();
      
      return snapshot.docs
        .map(doc => docToVerification(doc))
        .filter((v): v is Verification => v !== null);
    } catch (error) {
      logger.error({ error }, 'Error getting verifications');
      return [];
    }
  }

  /**
   * Get a single verification by ID
   */
  async getVerification(id: string): Promise<Verification | null> {
    try {
      const doc = await db.collection(collections.verifications).doc(id).get();
      return docToVerification(doc);
    } catch (error) {
      logger.error({ error, id }, 'Error getting verification');
      return null;
    }
  }

  /**
   * Create a new verification
   */
  async createVerification(input: CreateVerificationInput): Promise<Verification> {
    try {
      const now = Timestamp.now();
      const docRef = db.collection(collections.verifications).doc();
      
      const verification: Omit<Verification, 'id'> = {
        url: input.url,
        status: (input.status as any) || 'pending',
        createdAt: now,
        updatedAt: now,
      };
      
      await docRef.set(verification);
      
      logger.info({ id: docRef.id, url: input.url }, 'Verification created');
      
      return {
        id: docRef.id,
        ...verification,
      };
    } catch (error) {
      logger.error({ error, input }, 'Error creating verification');
      throw error;
    }
  }

  /**
   * Update a verification
   */
  async updateVerification(id: string, updates: UpdateVerificationInput): Promise<Verification> {
    try {
      const docRef = db.collection(collections.verifications).doc(id);
      
      await docRef.update({
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      const updated = await docRef.get();
      const verification = docToVerification(updated);
      
      if (!verification) {
        throw new Error('Verification not found after update');
      }
      
      logger.info({ id, updates }, 'Verification updated');
      
      return verification;
    } catch (error) {
      logger.error({ error, id, updates }, 'Error updating verification');
      throw error;
    }
  }

  /**
   * Delete a verification (optional - for cleanup)
   */
  async deleteVerification(id: string): Promise<void> {
    try {
      await db.collection(collections.verifications).doc(id).delete();
      logger.info({ id }, 'Verification deleted');
    } catch (error) {
      logger.error({ error, id }, 'Error deleting verification');
      throw error;
    }
  }
}

// Singleton instance
export const storage = new FirebaseStorage();
