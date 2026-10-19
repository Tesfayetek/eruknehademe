import {
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
} from 'firebase/auth';
import { auth } from '../firebase';

/**
 * Sends a password reset email to the specified user address.
 * Uses Firebase's default password reset email action URL without
 * passing any unnecessary or invalid ActionCodeSettings.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    throw new Error('Please enter your email address.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  // Use Firebase Web SDK default configuration
  await sendPasswordResetEmail(auth, normalizedEmail);
}

/**
 * Validates a Firebase password reset code (oobCode) from the incoming action link.
 * Returns the email associated with the reset code if valid.
 */
export async function verifyResetCode(oobCode: string): Promise<string> {
  if (!oobCode || !oobCode.trim()) {
    throw new Error('Missing password reset action code.');
  }
  return await verifyPasswordResetCode(auth, oobCode.trim());
}

/**
 * Confirms and saves the new password using the validated action code.
 */
export async function completePasswordReset(oobCode: string, newPassword: string): Promise<void> {
  if (!oobCode || !oobCode.trim()) {
    throw new Error('Missing password reset action code.');
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  await confirmPasswordReset(auth, oobCode.trim(), newPassword);
}

/**
 * Verifies email address using the action code from the verification link.
 */
export async function verifyEmailWithCode(oobCode: string): Promise<void> {
  if (!oobCode || !oobCode.trim()) {
    throw new Error('Missing email verification code.');
  }
  await applyActionCode(auth, oobCode.trim());
}

/**
 * Checks metadata of an action code without applying it.
 */
export async function inspectActionCode(oobCode: string) {
  if (!oobCode || !oobCode.trim()) {
    throw new Error('Missing action code.');
  }
  return await checkActionCode(auth, oobCode.trim());
}
