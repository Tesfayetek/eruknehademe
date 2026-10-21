import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
} from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Sends a password reset email using Firebase Auth.
 * Uses Firebase's default email action URL without unnecessary or invalid ActionCodeSettings.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    throw new Error('Please enter your email address.');
  }

  await sendPasswordResetEmail(auth, normalizedEmail);
}

/**
 * Validates a password reset oobCode and retrieves the associated email.
 */
export async function verifyResetCode(oobCode: string): Promise<string> {
  return await verifyPasswordResetCode(auth, oobCode);
}

/**
 * Confirms password reset with the verified oobCode and the new password.
 */
export async function resetPasswordWithCode(oobCode: string, newPassword: string): Promise<void> {
  await confirmPasswordReset(auth, oobCode, newPassword);
}

/**
 * Applies an action code (e.g. for email verification or email recovery).
 */
export async function handleActionCode(oobCode: string): Promise<void> {
  await applyActionCode(auth, oobCode);
}

/**
 * Checks an action code metadata (operation, data).
 */
export async function inspectActionCode(oobCode: string) {
  return await checkActionCode(auth, oobCode);
}
