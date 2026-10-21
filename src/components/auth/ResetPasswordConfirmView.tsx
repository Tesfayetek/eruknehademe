import React, { useState, useEffect } from 'react';
import { NavigationPage } from '../../types';
import { verifyResetCode, resetPasswordWithCode, handleActionCode } from '../../services/authService';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface ResetPasswordConfirmViewProps {
  mode: string;
  oobCode: string;
  onNavigate: (page: NavigationPage) => void;
  onClearActionParams?: () => void;
}

export const ResetPasswordConfirmView: React.FC<ResetPasswordConfirmViewProps> = ({
  mode,
  oobCode,
  onNavigate,
  onClearActionParams,
}) => {
  const [verifying, setVerifying] = useState(true);
  const [accountEmail, setAccountEmail] = useState<string>('');
  const [codeValid, setCodeValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states for password reset
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Email verification state
  const [emailVerifiedSuccess, setEmailVerifiedSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function evaluateActionLink() {
      setVerifying(true);
      setErrorMessage(null);

      // Validate mode strictly
      if (!mode || (mode !== 'resetPassword' && mode !== 'verifyEmail' && mode !== 'recoverEmail')) {
        if (isMounted) {
          setErrorMessage(
            'The selected page mode is invalid or unsupported. If you were attempting to reset your password or verify your email, please request a fresh link.'
          );
          setCodeValid(false);
          setVerifying(false);
        }
        return;
      }

      if (!oobCode) {
        if (isMounted) {
          setErrorMessage('Security action code (oobCode) is missing from the incoming link.');
          setCodeValid(false);
          setVerifying(false);
        }
        return;
      }

      try {
        if (mode === 'resetPassword') {
          // Verify code and get user email
          const email = await verifyResetCode(oobCode);
          if (isMounted) {
            setAccountEmail(email);
            setCodeValid(true);
          }
        } else if (mode === 'verifyEmail') {
          // Verify email directly
          await handleActionCode(oobCode);
          if (isMounted) {
            setEmailVerifiedSuccess(true);
            setCodeValid(true);
          }
        } else if (mode === 'recoverEmail') {
          await handleActionCode(oobCode);
          if (isMounted) {
            setEmailVerifiedSuccess(true);
            setCodeValid(true);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Action code evaluation notice:', err);
          if (err.code === 'auth/expired-action-code') {
            setErrorMessage(
              'This security link has expired. Password reset and verification links are time-limited for your protection.'
            );
          } else if (err.code === 'auth/invalid-action-code') {
            setErrorMessage(
              'This security link is invalid or has already been used. Please request a new link.'
            );
          } else if (err.code === 'auth/user-disabled') {
            setErrorMessage('The account associated with this link has been disabled.');
          } else {
            setErrorMessage(
              err.message || 'An error occurred while verifying your link. Please try again.'
            );
          }
          setCodeValid(false);
        }
      } finally {
        if (isMounted) {
          setVerifying(false);
        }
      }
    }

    evaluateActionLink();

    return () => {
      isMounted = false;
    };
  }, [mode, oobCode]);

  const handleSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage('Password must contain at least 8 characters for corporate security.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Password confirmation does not match the new password.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPasswordWithCode(oobCode, newPassword);
      setSuccess(true);
      if (onClearActionParams) {
        onClearActionParams();
      }
    } catch (err: any) {
      console.error('Password reset confirmation error:', err);
      if (err.code === 'auth/expired-action-code') {
        setErrorMessage('This reset code has expired. Please request a fresh reset email.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMessage('The selected password is too weak. Please choose a stronger password.');
      } else {
        setErrorMessage(err.message || 'Failed to apply new password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnToLogin = () => {
    if (onClearActionParams) {
      onClearActionParams();
    }
    onNavigate('login');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#10283F] mx-auto flex items-center justify-center text-[#D5A13A] shadow-md font-serif font-bold text-xl">
            EA
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F]">
            {mode === 'verifyEmail'
              ? 'Email Verification'
              : mode === 'resetPassword'
              ? 'Set New Password'
              : 'Security Verification'}
          </h2>
          <p className="text-xs text-slate-500">
            Erukneh Ademe Business Consulting &bull; Secure Client Portal
          </p>
        </div>

        {/* Loading State */}
        {verifying && (
          <div className="py-12 text-center space-y-3 animate-in fade-in">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#10283F]" />
            <p className="text-xs font-semibold text-slate-600">
              Validating security token with Firebase...
            </p>
          </div>
        )}

        {/* Error State or Invalid Page Mode */}
        {!verifying && (!codeValid || errorMessage) && !success && !emailVerifiedSuccess && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold block">Unable to Process Link</span>
                <p className="leading-relaxed text-rose-700">{errorMessage}</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => onNavigate('forgot-password')}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors shadow flex items-center justify-center space-x-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D5A13A]" />
                <span>Request New Password Reset Link</span>
              </button>

              <button
                onClick={handleReturnToLogin}
                className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md transition-colors"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* Email Verification Success */}
        {!verifying && emailVerifiedSuccess && (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Email Verified Successfully
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your email address has been verified. You now have full access to the consulting client portal and private requests.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReturnToLogin}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors shadow"
              >
                Sign In to Your Account
              </button>
            </div>
          </div>
        )}

        {/* Password Reset Form */}
        {!verifying && codeValid && mode === 'resetPassword' && !success && (
          <form onSubmit={handleSubmitNewPassword} className="space-y-4 animate-in fade-in">
            {accountEmail && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                Resetting password for:{' '}
                <span className="font-semibold text-[#10283F] font-mono">{accountEmail}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                New Password <span className="text-[#b88528]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Confirm New Password <span className="text-[#b88528]">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#D5A13A]" />
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5 text-[#D5A13A]" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Password Reset Success */}
        {success && (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Password Changed Successfully
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Your password has been securely reset. You can now log into your account using your new credentials.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReturnToLogin}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors shadow"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
