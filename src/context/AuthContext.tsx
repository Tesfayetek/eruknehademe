import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole } from '../types';

const ADMIN_BOOTSTRAP_EMAIL = 'arabsafashion@gmail.com';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ verified: boolean }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshUser: () => Promise<boolean>;
  updateProfileDetails: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVerificationSent, setLastVerificationSent] = useState<number>(0);

  // Sync user profile from Firestore or bootstrap admin
  const syncProfile = async (fbUser: FirebaseUser | null) => {
    if (!fbUser) {
      setUserProfile(null);
      return;
    }

    try {
      const isSystemAdminEmail = (fbUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // If system admin email, ensure role is admin
        if (isSystemAdminEmail && data.role !== 'admin') {
          await updateDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() });
          data.role = 'admin';
        }
        setUserProfile(data);
      } else {
        // Create initial profile
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || (isSystemAdminEmail ? 'Erukneh Ademe (Admin)' : 'Consulting Client'),
          role: isSystemAdminEmail ? 'admin' : 'customer',
          status: 'active',
          emailVerified: fbUser.emailVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);

        // Also ensure admin mapping document exists if admin
        if (isSystemAdminEmail) {
          const adminRef = doc(db, 'admins', fbUser.uid);
          await setDoc(
            adminRef,
            {
              email: fbUser.email,
              role: 'admin',
              addedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        }
      }
    } catch (err) {
      console.warn('Profile sync notice:', err);
      // Fallback for UI if network or permissions sync is in progress
      if ((fbUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase()) {
        setUserProfile({
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Administrator',
          role: 'admin',
          status: 'active',
          emailVerified: true,
          createdAt: new Date().toISOString(),
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Always reload to get fresh verification status from Firebase Auth
          await fbUser.reload();
        } catch (e) {
          console.warn('User reload notice on state change:', e);
        }

        const freshUser = auth.currentUser || fbUser;
        setCurrentUser(freshUser);

        const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
        const verified = Boolean(
          freshUser.emailVerified ||
          isSystemAdminEmail ||
          freshUser.providerData?.some((p) => p.providerId === 'google.com')
        );

        setIsEmailVerified(verified);

        if (verified) {
          await syncProfile(freshUser);
        } else {
          setUserProfile(null);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setIsEmailVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      await auth.currentUser.reload();
      const freshUser = auth.currentUser;
      setCurrentUser(freshUser);

      const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      const verified = Boolean(
        freshUser.emailVerified ||
        isSystemAdminEmail ||
        freshUser.providerData?.some((p) => p.providerId === 'google.com')
      );

      setIsEmailVerified(verified);

      if (verified) {
        await syncProfile(freshUser);
      }
      return verified;
    } catch (err) {
      console.warn('Refresh user error:', err);
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ verified: boolean }> => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await cred.user.reload();
    const freshUser = auth.currentUser || cred.user;
    setCurrentUser(freshUser);

    const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
    const verified = Boolean(
      freshUser.emailVerified ||
      isSystemAdminEmail ||
      freshUser.providerData?.some((p) => p.providerId === 'google.com')
    );

    setIsEmailVerified(verified);

    if (verified) {
      await syncProfile(freshUser);
    }

    return { verified };
  };

  const registerWithEmail = async (name: string, email: string, pass: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const fbUser = cred.user;

    // Send verification email immediately
    try {
      await sendEmailVerification(fbUser);
      setLastVerificationSent(Date.now());
    } catch (e) {
      console.warn('Verification email dispatch notice:', e);
    }

    const isSystemAdminEmail = (email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();

    const newProfile: UserProfile = {
      uid: fbUser.uid,
      email: fbUser.email || email,
      displayName: name,
      role: isSystemAdminEmail ? 'admin' : 'customer',
      status: 'active',
      emailVerified: fbUser.emailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', fbUser.uid), newProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
    }

    setCurrentUser(fbUser);
    setIsEmailVerified(fbUser.emailVerified || isSystemAdminEmail);
    setUserProfile(newProfile);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    setCurrentUser(cred.user);
    setIsEmailVerified(true);
    await syncProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setIsEmailVerified(false);
  };

  const resendVerificationEmail = async () => {
    if (!auth.currentUser) throw new Error('No active user session. Please sign in to request verification.');
    
    // 60-second rate-limiting
    const now = Date.now();
    const timeSinceLast = now - lastVerificationSent;
    if (timeSinceLast < 60000) {
      const remaining = Math.ceil((60000 - timeSinceLast) / 1000);
      throw new Error(`Please wait ${remaining} seconds before requesting another verification email.`);
    }

    try {
      await sendEmailVerification(auth.currentUser);
      setLastVerificationSent(Date.now());
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        throw new Error('Too many requests. Please wait a few moments before trying again.');
      }
      throw err;
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileDetails = async (details: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');
    const userRef = doc(db, 'users', currentUser.uid);

    // Filter strictly to permitted personal profile fields
    const allowedKeys: (keyof UserProfile)[] = ['displayName', 'phone', 'company'];
    const cleanUpdate: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    allowedKeys.forEach((key) => {
      if (details[key] !== undefined) {
        cleanUpdate[key] = details[key];
      }
    });

    try {
      await updateDoc(userRef, cleanUpdate);
      setUserProfile((prev) => (prev ? { ...prev, ...cleanUpdate } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  const isSystemAdmin = (currentUser?.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
  const isAdmin = (isSystemAdmin || userProfile?.role === 'admin') && isEmailVerified;
  const role: UserRole | null = isAdmin ? 'admin' : userProfile ? 'customer' : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        isAdmin,
        isEmailVerified,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resendVerificationEmail,
        sendPasswordReset,
        refreshUser,
        updateProfileDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
