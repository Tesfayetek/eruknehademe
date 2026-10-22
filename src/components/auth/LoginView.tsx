import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage } from '../../types';
import {
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  ArrowRight,
  Shield,
  CheckCircle2,
  Send,
  RefreshCw,
  LogOut,
  Calendar,
} from 'lucide-react';

interface LoginViewProps {
  onNavigate: (page: NavigationPage) => void;
  consultationNotice?: boolean;
  onAuthSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onNavigate,
  consultationNotice,
  onAuthSuccess,
}) => {
  const {
    loginWithEmail,
    loginWithGoogle,
    resendVerificationEmail,
    resendVerificationForEmail,
    refreshUser,
    logout,
    currentUser,
    isEmailVerified,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unverified user state
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [cachedPassword, setCachedPassword] = useState<string>('');
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResendNotice(null);
    setResendError(null);
    setLoading(true);

    try {
      if (!email.trim() || !password) {
        throw new Error('Please enter both your email address and password.');
      }

      const { verified } = await loginWithEmail(email.trim(), password);

      if (!verified) {
        // Step 5: Immediately signed out and access blocked in AuthContext
        // Step 6: Display exact required message
        setUnverifiedEmail(email.trim());
        setCachedPassword(password);
        return;
      }

      // Step 4: If verified, proceed to destination
      if (onAuthSuccess) {
        onAuthSuccess();
      } else {
        onNavigate('account');
      }
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email address or password. Please verify your credentials and try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Access temporarily restricted due to consecutive failed attempts. Please reset your password or wait a few minutes.');
      } else {
        setError(err?.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (cooldown > 0) return;
    setResending(true);
    setResendNotice(null);
    setResendError(null);

    try {
      if (unverifiedEmail) {
        await resendVerificationForEmail(unverifiedEmail, cachedPassword || password);
      } else {
        await resendVerificationEmail();
      }
      setResendNotice('Verification email resent. Please check your inbox and spam folder.');
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
      setResendError(err?.message || 'Failed to dispatch verification email. Please check your credentials.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    setLoading(true);
    setResendError(null);
    try {
      if (unverifiedEmail && (cachedPassword || password)) {
        const { verified } = await loginWithEmail(unverifiedEmail, cachedPassword || password);
        if (verified) {
          setUnverifiedEmail(null);
          onNavigate('account');
          return;
        }
      }
      setResendError('Your email address has not been verified yet. Please check your inbox and verify your email before logging in.');
    } catch (err: any) {
      setResendError(err?.message || 'Failed to verify account status.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUnverifiedEmail(null);
    setCachedPassword('');
    setPassword('');
    setError(null);
    setResendNotice(null);
    setResendError(null);
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onNavigate('account');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in was cancelled or failed.');
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
            Client & Executive Portal
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to manage advisory engagements and view consultation statuses.
          </p>
        </div>

        {/* Protected Consultation Flow Notice */}
        {consultationNotice && !unverifiedEmail && (
          <div className="p-3.5 bg-amber-50/90 border border-amber-200 text-amber-950 rounded-xl text-xs flex items-start space-x-2.5 animate-in fade-in">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-[#b88528] flex items-center justify-center shrink-0 border border-amber-200">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 text-xs">
                Account Required for Consultation Registration
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Consultation requests are reserved for verified client accounts. Please log in or register below to continue directly to the consultation registration form.
              </p>
            </div>
          </div>
        )}

        {/* Step 6 & 7: Unverified User State Card */}
        {unverifiedEmail ? (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 text-amber-950 space-y-4 animate-in fade-in">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 rounded">
                  Email Verification Required
                </span>
                <h4 className="font-serif text-base font-bold text-[#10283F]">
                  Email Not Verified
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  Your email address has not been verified. Please check your inbox and verify your email before logging in.
                </p>
                <p className="text-[11px] text-slate-500 font-mono pt-1">
                  Target: {unverifiedEmail}
                </p>
              </div>
            </div>

            {resendNotice && (
              <div className="p-2.5 text-xs rounded bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{resendNotice}</span>
              </div>
            )}

            {resendError && (
              <div className="p-2.5 text-xs rounded bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{resendError}</span>
              </div>
            )}

            <div className="pt-2 flex flex-col space-y-2">
              <button
                type="button"
                onClick={handleCheckVerification}
                disabled={loading}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D5A13A]" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5 text-[#D5A13A]" />
                )}
                <span>I've Verified (Check Status & Log In)</span>
              </button>

              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending || cooldown > 0}
                className="w-full py-2 text-xs font-medium text-amber-950 bg-white hover:bg-amber-50 border border-amber-300 rounded-md transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {resending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>{cooldown > 0 ? `Resend Verification (${cooldown}s)` : 'Resend Verification Email'}</span>
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 pt-2 hover:underline"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out & Try Another Account</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs text-[#b88528] hover:text-[#916215]"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#D5A13A]" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 text-[#D5A13A]" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
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
              <span>Sign In with Google</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Don't have a client account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-semibold text-[#10283F] hover:text-[#b88528]"
              >
                Create an Account
              </button>
            </div>

            {/* Admin hint */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                System Administrator: <span className="text-slate-600 font-mono">arabsafashion@gmail.com</span>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
