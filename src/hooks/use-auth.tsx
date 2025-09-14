'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';

// Mock User type
interface MockUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: MockUser = {
  uid: 'mock-user-id',
  displayName: 'Admin User',
  email: 'admin@example.com',
  photoURL: 'https://picsum.photos/seed/mock-user-id/40/40'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(mockUser);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const signInWithGoogle = async () => {
    // No-op
    console.log("Sign in with Google is disabled.");
  };

  const signOut = async () => {
    // No-op
    console.log("Sign out is disabled.");
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
