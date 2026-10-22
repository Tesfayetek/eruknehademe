import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage } from '../../types';
import {
  Shield,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Send,
  RefreshCw,
  LogOut,
} from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onNavigate }) => {
  const {
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    resendVerificationEmail,
    resendVerificationForEmail,
    refreshUser,
    logout,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  // Post-registration resend verification state
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Required fields check
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please complete all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid corporate or personal email address.');
      return;
    }

    // Password requirements
    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    // Match validation
    if (password !== confirmPassword) {
      setError('Password and confirmation password do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the terms of service and client confidentiality agreement.');
      return;
    }

    setLoading(true);

    try {
      await registerWithEmail(fullName.trim(), email.trim(), password);
      setRegisteredSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Please sign in or reset your password.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a combination of letters, numbers, and symbols.');
      } else {
        setError(err?.message || 'Registration failed. Please check your details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setResendNotice(null);
    setResendError(null);
    try {
      if (email.trim() && password) {
        await resendVerificationForEmail(email.trim(), password);
      } else {
        await resendVerificationEmail();
      }
      setResendNotice('Verification email resent. Please check your inbox and junk folder.');
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err: any) {
      setResendError(err?.message || 'Failed to dispatch verification email. Please try again shortly.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerified = async () => {
    setLoading(true);
    setResendError(null);
    try {
      const { verified } = await loginWithEmail(email.trim(), password);
      if (verified) {
        onNavigate('account');
      } else {
        setResendError('Email is still unverified. Please check your inbox and verify your email before logging in.');
      }
    } catch (err: any) {
      setResendError(err?.message || 'Email is still unverified. Please check your inbox.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onNavigate('account');
    } catch (err: any) {
      setError(err?.message || 'Google registration was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-md border border-slate-200 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#10283F] mx-auto flex items-center justify-center text-[#D5A13A] shadow font-serif font-bold text-xl">
            EA
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F] tracking-tight">
            Create Client Account
          </h2>
          <p className="text-xs text-slate-500">
            Register to track advisory engagements, access diagnostic tools, and manage consultations.
          </p>
        </div>

        {registeredSuccess ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Mail className="w-7 h-7" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Action Required: Verify Your Email
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                We have sent an activation link to{' '}
                <span className="font-semibold text-[#10283F] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {email}
                </span>
                . In accordance with security protocols, you must verify your email before logging in or accessing confidential client portals.
              </p>
            </div>

            {resendNotice && (
              <div className="p-3 text-xs rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resendNotice}</span>
              </div>
            )}

            {resendError && (
              <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{resendError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col space-y-3">
              <button
                type="button"
                onClick={handleCheckVerified}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D5A13A]" />
                <span>I've Verified My Email (Check Status)</span>
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="w-full py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-[#D5A13A]" />
                )}
                <span>{cooldown > 0 ? `Resend Verification Email (${cooldown}s)` : 'Resend Verification Email'}</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onNavigate('login');
                }}
                className="text-xs text-[#b88528] hover:text-[#916215] font-semibold pt-2"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name <span className="text-[#b88528]">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alazar Bekele"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Corporate or Personal Email <span className="text-[#b88528]">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password <span className="text-[#b88528]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Confirm Password <span className="text-[#b88528]">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-start space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 h-3.5 w-3.5 rounded border-slate-300 text-[#10283F] focus:ring-[#D5A13A]"
                />
                <label htmlFor="terms" className="text-xs text-slate-600 leading-snug">
                  I agree to the Terms of Service and acknowledge that client consultations are held under strict non-disclosure terms.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow hover:shadow-md transition-all flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400">Or register with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full py-2 px-4 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-md transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="font-semibold text-[#10283F] hover:text-[#b88528]"
              >
                Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
