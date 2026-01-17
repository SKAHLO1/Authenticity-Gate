import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { env } from './config/env';

// Initialize Firebase Admin
const serviceAccount: ServiceAccount = env.FIREBASE_SERVICE_ACCOUNT 
  ? JSON.parse(env.FIREBASE_SERVICE_ACCOUNT)
  : {
      projectId: env.FIREBASE_PROJECT_ID || 'demo-project',
      clientEmail: 'demo@demo.iam.gserviceaccount.com',
      privateKey: '-----BEGIN PRIVATE KEY-----\nDEMO\n-----END PRIVATE KEY-----\n',
    };

const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.projectId,
});

// Get Firestore instance
export const db = getFirestore(app);

// Collections
export const collections = {
  verifications: 'verifications',
  users: 'users', // For future use
};

// Types
export interface Verification {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalityScore?: number;
  plagiarismRisk?: number;
  deepfakeConfidence?: number;
  sentiment?: string;
  summary?: string;
  reasoning?: string;
  contractVerificationId?: number; // ID from GenLayer contract
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Helper to convert Firestore doc to Verification
export function docToVerification(doc: FirebaseFirestore.DocumentSnapshot): Verification | null {
  if (!doc.exists) return null;
  
  const data = doc.data()!;
  return {
    id: doc.id,
    ...data,
  } as Verification;
}
