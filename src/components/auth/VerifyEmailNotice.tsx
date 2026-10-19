import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, RefreshCw, Send, CheckCircle2, AlertTriangle, Loader2, LogOut, ArrowRight } from 'lucide-react';

interface VerifyEmailNoticeProps {
  onRefreshComplete?: () => void;
  onSignOut?: () => void;
}

export const VerifyEmailNotice: React.FC<VerifyEmailNoticeProps> = ({
  onRefreshComplete,
  onSignOut,
}) => {
  const { currentUser, resendVerificationEmail, refreshUser, isEmailVerified, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  if (isEmailVerified) return null;

  const handleResend = async () => {
    if (cooldownSeconds > 0) return;
    setResending(true);
    setResendNotice(null);
    setResendError(null);

    try {
      await resendVerificationEmail();
      setResendNotice('Verification email dispatched! Please check your inbox and spam folder.');
      // Start 60s cooldown
      setCooldownSeconds(60);
      const interval = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      setResendError(e?.message || 'Failed to dispatch verification email. Please wait a moment.');
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setResendError(null);
    try {
      const verified = await refreshUser();
      if (verified) {
        if (onRefreshComplete) onRefreshComplete();
      } else {
        setResendError('Email is not yet verified. Please click the link in your verification email first.');
      }
    } catch (e: any) {
      setResendError(e?.message || 'Error checking verification status.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    if (onSignOut) {
      onSignOut();
    } else {
      await logout();
    }
  };

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 sm:p-8 text-amber-950 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 rounded">
              Verification Required
            </span>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#10283F]">
            Verify Your Email Address
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            A confirmation link was dispatched to{' '}
            <span className="font-semibold text-[#10283F] bg-white px-2 py-0.5 rounded border border-amber-200 font-mono">
              {currentUser?.email || 'your registered address'}
            </span>
            . To protect confidential client files, you must verify your email before entering protected workspaces or submitting binding consultation briefs.
          </p>
        </div>
      </div>

      {resendNotice && (
        <div className="p-3 text-xs rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{resendNotice}</span>
        </div>
      )}

      {resendError && (
        <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{resendError}</span>
        </div>
      )}

      <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-[#D5A13A]" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-[#D5A13A]" />
            )}
            I've Verified (Check Status)
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldownSeconds > 0}
            className="px-4 py-2 text-xs font-medium text-amber-950 bg-white hover:bg-amber-50 border border-amber-300 rounded-md transition-colors flex items-center disabled:opacity-50"
          >
            {resending ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 mr-1.5 text-amber-700" />
            )}
            {cooldownSeconds > 0 ? `Resend Email (${cooldownSeconds}s)` : 'Resend Verification Email'}
          </button>
        </div>

        <button
          onClick={handleSignOut}
          className="text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center space-x-1 hover:underline"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
