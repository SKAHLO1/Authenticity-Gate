import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Export Timestamp for use in other modules
export { Timestamp };

// Export getAuth for authentication middleware
export { getAuth };

// Initialize Firebase Admin
let serviceAccount: ServiceAccount;

// Try environment variables first (for production deployments)
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    // Replace literal \n with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    };
    console.log('✓ Loaded Firebase credentials from environment variables');
  } catch (error) {
    console.error('Failed to parse Firebase credentials from environment:', error);
    throw new Error('Invalid Firebase environment variables');
  }
}
// Try to load from JSON file (for local development)
else {
  const serviceAccountPath = join(process.cwd(), 'authentication-gate-firebase-adminsdk-fbsvc-9b11cdccbe.json');
  
  if (existsSync(serviceAccountPath)) {
    try {
      const fileContent = readFileSync(serviceAccountPath, 'utf8');
      serviceAccount = JSON.parse(fileContent);
      console.log('✓ Loaded Firebase credentials from file');
    } catch (error) {
      console.error('Failed to load Firebase credentials from file:', error);
      throw new Error('Invalid Firebase service account file');
    }
  } else {
    console.error('❌ No Firebase credentials found!');
    console.error('Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables');
    console.error('Or place the service account JSON file at:', serviceAccountPath);
    throw new Error('Firebase credentials not configured');
  }
}

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
  userId?: string; // Firebase Auth UID of the user who created this verification
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalityScore?: number;
  plagiarismRisk?: number;
  deepfakeConfidence?: number;
  sentiment?: string;
  summary?: string;
  reasoning?: string;
  contractVerificationId?: number; // ID from GenLayer contract
  rawResult?: {
    summary?: string;
    reasoning?: string;
    error?: string;
    stack?: string;
    processedAt?: string;
    failedAt?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Helper to convert Firestore doc to Verification
export function docToVerification(doc: FirebaseFirestore.DocumentSnapshot): Verification | null {
  if (!doc.exists) return null;
  
  const data = doc.data()!;
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
  } as Verification;
}
