import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
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
import { doc, getDoc, setDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile, UserRole, RoleDefinition, DEFAULT_SYSTEM_ROLES, SYSTEM_PERMISSIONS } from '../types';

const ADMIN_BOOTSTRAP_EMAIL = 'arabsafashion@gmail.com';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  role: UserRole | null;
  isAdmin: boolean;
  isEmailVerified: boolean;
  loading: boolean;
  roles: RoleDefinition[];
  hasPermission: (permission: string) => boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ verified: boolean; email?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ email: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resendVerificationForEmail: (email: string, pass?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  refreshUser: () => Promise<boolean>;
  refreshRoles: () => Promise<void>;
  updateProfileDetails: (details: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_SYSTEM_ROLES);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastVerificationSent, setLastVerificationSent] = useState<number>(0);
  const isRegisteringRef = useRef<boolean>(false);

  const fetchRoles = async () => {
    try {
      const snap = await getDocs(collection(db, 'roles'));
      if (!snap.empty) {
        const loaded: RoleDefinition[] = [];
        snap.forEach((d) => loaded.push({ id: d.id, ...(d.data() as Omit<RoleDefinition, 'id'>) }));
        setRoles(loaded);
      } else {
        setRoles(DEFAULT_SYSTEM_ROLES);
      }
    } catch (e) {
      console.warn('Roles fetch note:', e);
      setRoles(DEFAULT_SYSTEM_ROLES);
    }
  };

  // Sync user profile from Firestore or bootstrap admin
  const syncProfile = async (fbUser: FirebaseUser | null): Promise<UserProfile | null> => {
    if (!fbUser) {
      setUserProfile(null);
      return null;
    }

    try {
      const isSystemAdminEmail = (fbUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      const userRef = doc(db, 'users', fbUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // If system admin email and verified, ensure role is admin
        if (isSystemAdminEmail && data.role !== 'admin' && fbUser.emailVerified) {
          await updateDoc(userRef, { role: 'admin', updatedAt: new Date().toISOString() });
          data.role = 'admin';
        }

        // If user account is disabled, sign out immediately
        if (data.status === 'disabled' || data.status === 'inactive') {
          await signOut(auth);
          setCurrentUser(null);
          setUserProfile(null);
          setIsEmailVerified(false);
          throw new Error('Your account has been deactivated or disabled by an administrator. Please contact support.');
        }

        setUserProfile(data);
        return data;
      } else {
        // Create initial profile for verified users (e.g. Google sign-in)
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || (isSystemAdminEmail ? 'Erukneh Ademe (Admin)' : 'Consulting Client'),
          role: isSystemAdminEmail && fbUser.emailVerified ? 'admin' : 'customer',
          status: 'active',
          emailVerified: fbUser.emailVerified,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);

        // Also ensure admin mapping document exists if admin
        if (isSystemAdminEmail && fbUser.emailVerified) {
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

        return newProfile;
      }
    } catch (err: any) {
      console.warn('Profile sync notice:', err?.message || err);
      if (err?.message?.includes('deactivated or disabled')) {
        throw err;
      }
      // Fallback for UI if bootstrap admin
      if ((fbUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase() && fbUser.emailVerified) {
        const adminProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || 'Administrator',
          role: 'admin',
          status: 'active',
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUserProfile(adminProfile);
        return adminProfile;
      }
      return null;
    }
  };

  useEffect(() => {
    fetchRoles();

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      // If registration is actively writing user profile, do not interfere or prematurely sign out
      if (isRegisteringRef.current) {
        return;
      }
      if (fbUser) {
        try {
          // Always reload to get fresh verification status from Firebase Auth
          await fbUser.reload();
        } catch (e) {
          console.warn('User reload notice on state change:', e);
        }

        const freshUser = auth.currentUser || fbUser;
        const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
        const verified = Boolean(
          freshUser.emailVerified ||
          (isSystemAdminEmail && freshUser.emailVerified) ||
          freshUser.providerData?.some((p) => p.providerId === 'google.com')
        );

        if (verified) {
          setCurrentUser(freshUser);
          setIsEmailVerified(true);
          try {
            await syncProfile(freshUser);
          } catch (e) {
            // Disabled accounts were signed out in syncProfile
          }
        } else {
          // Rule 2: If the email is not verified, immediately sign the user out and block access to protected pages
          await signOut(auth);
          setCurrentUser(null);
          setUserProfile(null);
          setIsEmailVerified(false);
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
      const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
      const verified = Boolean(
        freshUser.emailVerified ||
        (isSystemAdminEmail && freshUser.emailVerified) ||
        freshUser.providerData?.some((p) => p.providerId === 'google.com')
      );

      if (verified) {
        setCurrentUser(freshUser);
        setIsEmailVerified(true);
        await syncProfile(freshUser);
        return true;
      } else {
        await signOut(auth);
        setCurrentUser(null);
        setUserProfile(null);
        setIsEmailVerified(false);
        return false;
      }
    } catch (err) {
      console.warn('Refresh user error:', err);
      return false;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ verified: boolean; email?: string }> => {
    // 1. Authenticate using Firebase Authentication
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    
    // 2. Retrieve the authenticated user's current status via reload
    await cred.user.reload();
    const freshUser = auth.currentUser || cred.user;

    const isSystemAdminEmail = (freshUser.email || '').toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
    const verified = Boolean(
      freshUser.emailVerified ||
      (isSystemAdminEmail && freshUser.emailVerified) ||
      freshUser.providerData?.some((p) => p.providerId === 'google.com')
    );

    // 4 & 5: If the email is not verified, immediately sign the user out and block access to protected pages
    if (!verified) {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsEmailVerified(false);
      return { verified: false, email: freshUser.email || email };
    }

    // 5. If the email is verified, retrieve the user's authorized role and permissions
    setCurrentUser(freshUser);
    setIsEmailVerified(true);
    const profile = await syncProfile(freshUser);

    if (profile && (profile.status === 'disabled' || profile.status === 'inactive')) {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsEmailVerified(false);
      throw new Error('Your account has been deactivated or disabled by an administrator. Please contact support.');
    }

    const normalizedEmail = email.trim().toLowerCase();
    return { verified: true, email: freshUser.email || normalizedEmail };
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<{ email: string }> => {
    isRegisteringRef.current = true;
    try {
      const normalizedEmail = email.trim().toLowerCase();
      // 1. Create user with Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
      const fbUser = cred.user;

      // 2. Send verification email immediately
      try {
        await sendEmailVerification(fbUser);
        setLastVerificationSent(Date.now());
      } catch (e) {
        console.warn('Verification email dispatch notice:', e);
      }

      // 3. New users must receive ONLY the default registered-user role (customer). Never grant administrator privileges during public registration.
      const newProfile: UserProfile = {
        uid: fbUser.uid,
        email: normalizedEmail,
        displayName: name.trim(),
        role: 'customer',
        status: 'active',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), newProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      // 4. Immediately sign out the unverified newly registered user
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setIsEmailVerified(false);

      return { email: normalizedEmail };
    } finally {
      isRegisteringRef.current = false;
    }
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
    if (!auth.currentUser) throw new Error('No active user session. Please enter your credentials on the login screen to request verification.');
    
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

  const resendVerificationForEmail = async (email: string, pass?: string) => {
    const now = Date.now();
    const timeSinceLast = now - lastVerificationSent;
    if (timeSinceLast < 60000) {
      const remaining = Math.ceil((60000 - timeSinceLast) / 1000);
      throw new Error(`Please wait ${remaining} seconds before requesting another verification email.`);
    }

    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      setLastVerificationSent(Date.now());
      return;
    }

    if (!pass) {
      throw new Error('Please enter your password to resend the verification email.');
    }

    // Authenticate briefly to resend verification link, then immediately sign out
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    try {
      await sendEmailVerification(cred.user);
      setLastVerificationSent(Date.now());
    } finally {
      await signOut(auth);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileDetails = async (details: Partial<UserProfile>) => {
    if (!currentUser || !userProfile) throw new Error('User not authenticated');
    const userRef = doc(db, 'users', currentUser.uid);

    // Filter strictly to permitted personal profile fields
    const allowedKeys: (keyof UserProfile)[] = ['displayName', 'phone', 'company', 'photoURL'];
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
  const role: UserRole | null = isAdmin ? 'admin' : userProfile ? userProfile.role : null;

  // Granular Permission Checker
  const hasPermission = (permission: string): boolean => {
    if (!currentUser || !isEmailVerified) return false;
    if (userProfile?.status === 'disabled' || userProfile?.status === 'inactive') return false;
    if (isAdmin) return true;

    // Check custom permissions override on user profile
    if (userProfile?.permissions?.includes(permission)) return true;

    // Check assigned role permissions from roles list
    const currentRoleKey = userProfile?.role || 'customer';
    const roleDef = roles.find((r) => r.id === currentRoleKey);
    if (roleDef && roleDef.permissions.includes(permission)) {
      return true;
    }

    // Default system fallback for customer
    if (currentRoleKey === 'customer') {
      const defaultCustomerRole = DEFAULT_SYSTEM_ROLES.find((r) => r.id === 'customer');
      if (defaultCustomerRole && defaultCustomerRole.permissions.includes(permission)) {
        return true;
      }
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role,
        isAdmin,
        isEmailVerified,
        loading,
        roles,
        hasPermission,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resendVerificationEmail,
        resendVerificationForEmail,
        sendPasswordReset,
        refreshUser,
        refreshRoles: fetchRoles,
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
