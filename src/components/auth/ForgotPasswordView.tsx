import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage } from '../../types';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ForgotPasswordViewProps {
  onNavigate: (page: NavigationPage) => void;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please provide a valid corporate or personal email address.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordReset(email.trim());
      // Always show generic confirmation to prevent user enumeration
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        // Obfuscate whether account exists to prevent email scraping
        setSent(true);
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few moments before trying again.');
      } else {
        // If other error, also gracefully show confirmation
        setSent(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xl shadow-md border border-slate-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-lg bg-[#10283F] mx-auto flex items-center justify-center text-[#D5A13A] shadow font-serif font-bold text-xl">
            EA
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F]">
            Reset Your Password
          </h2>
          <p className="text-xs text-slate-500">
            Enter your registered email address to receive secure password recovery instructions.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Recovery Link Dispatched
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              If an account is associated with <span className="font-semibold text-slate-900 font-mono">{email}</span>, a secure password reset link has been dispatched. Please check your inbox and junk/spam folders.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('login')}
                className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors shadow"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Account Email Address <span className="text-[#b88528]">*</span>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#D5A13A]" />
              ) : (
                'Send Password Reset Email'
              )}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center space-x-1 mx-auto hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
