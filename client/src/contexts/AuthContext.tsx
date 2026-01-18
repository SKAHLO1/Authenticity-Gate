import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function signup(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
  }

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logout() {
    await signOut(auth);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      console.log('Starting Google sign-in with redirect...');
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      console.error('Google sign-in error:', error.code, error.message);
      throw error;
    }
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    console.log('AuthContext: Initializing auth...');
    
    // Check for redirect result first, then set up auth state listener
    getRedirectResult(auth)
      .then((result) => {
        console.log('Redirect result:', result ? 'User found' : 'No redirect result');
        if (result) {
          console.log('Redirect sign-in successful:', result.user.email);
          console.log('User UID:', result.user.uid);
          // User is set, now set up the listener
          setCurrentUser(result.user);
        } else {
          console.log('No redirect result - checking current auth state');
        }
      })
      .catch((error) => {
        console.error('Redirect sign-in error:', error.code, error.message);
      })
      .finally(() => {
        // Set up auth state listener after checking redirect result
        console.log('Setting up auth state listener...');
        unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
          if (user) {
            console.log('User UID:', user.uid);
            console.log('User persistence:', auth.currentUser ? 'Session active' : 'No session');
          }
          setCurrentUser(user);
          setLoading(false);
        });
      });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    loginWithGoogle,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
