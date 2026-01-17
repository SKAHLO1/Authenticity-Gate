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

// Try to load from JSON file first (more reliable than env var)
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
  console.warn('⚠️  Firebase service account file not found - authentication will not work');
  console.warn('Expected file:', serviceAccountPath);
  
  // Fallback to demo credentials
  serviceAccount = {
    projectId: 'demo-project',
    clientEmail: 'demo@demo.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj\nMzEfYyjiWA4R4/M2bS1+fWIcPm15nQRBW7wyLuo+VFT0DNV5Ocfu2lLGKr5FS96z\n-----END PRIVATE KEY-----\n',
  };
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
