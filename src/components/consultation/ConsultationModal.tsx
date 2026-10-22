import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitConsultationRequest } from '../../services/dataService';
import { NavigationPage } from '../../types';
import {
  X,
  Calendar,
  Building,
  Mail,
  Phone,
  User,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertCircle,
  LogIn,
  UserPlus,
  RefreshCw,
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
  onNavigate?: (page: NavigationPage) => void;
}

const INDUSTRY_OPTIONS = [
  'Information Technology',
  'Financial Services and Insurance',
  'Manufacturing',
  'Construction and Real Estate',
  'Healthcare',
  'Education and Training',
  'Agriculture',
  'Retail and Trade',
  'Consulting and Professional Services',
  'Government and Public Sector',
  'Other',
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
  onNavigate,
}) => {
  const {
    currentUser,
    userProfile,
    isEmailVerified,
    resendVerificationEmail,
    refreshUser,
  } = useAuth();

  // Exactly five fields as specified:
  // 1. Full Name *
  // 2. Email *
  // 3. Direct Telephone (optional)
  // 4. Company / Organization (optional)
  // 5. Industry Sector (optional dropdown)
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [otherIndustry, setOtherIndustry] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<{
    clientName?: string;
    email?: string;
  }>({});
  const [touched, setTouched] = useState<{
    clientName?: boolean;
    email?: boolean;
  }>({});

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Email verification action state
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const [refreshingAuth, setRefreshingAuth] = useState(false);

  // Pre-populate authenticated user's details
  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setClientName(userProfile?.displayName || currentUser.displayName || '');
      if (userProfile?.phone) setPhone(userProfile.phone);
      if (userProfile?.company) setCompanyName(userProfile.company);
    }
  }, [currentUser, userProfile, isOpen]);

  if (!isOpen) return null;

  const validateEmailFormat = (val: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(val.trim());
  };

  const handleBlur = (field: 'clientName' | 'email') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: 'clientName' | 'email') => {
    const newErrors = { ...errors };
    if (field === 'clientName') {
      if (!clientName.trim()) {
        newErrors.clientName = 'Full Name is required.';
      } else {
        delete newErrors.clientName;
      }
    }
    if (field === 'email') {
      if (!email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!validateEmailFormat(email)) {
        newErrors.email = 'Please enter a valid email address (e.g. name@company.com).';
      } else {
        delete newErrors.email;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Validate both required fields
    const newErrors: { clientName?: string; email?: string } = {};
    if (!clientName.trim()) {
      newErrors.clientName = 'Full Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!validateEmailFormat(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ clientName: true, email: true });
      return;
    }

    // Auth gate check
    if (!currentUser) {
      setGeneralError('Please register or sign in to request a consultation.');
      return;
    }

    if (!isEmailVerified) {
      setGeneralError('Please verify your email address before submitting a consultation request.');
      return;
    }

    setLoading(true);

    try {
      const finalIndustry =
        industry === 'Other' && otherIndustry.trim()
          ? `Other: ${otherIndustry.trim()}`
          : industry;

      const reqId = await submitConsultationRequest({
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim(),
        industry: finalIndustry,
        serviceInterest: preselectedService || 'General Strategic Consulting',
        projectDescription: 'Consultation registration submitted via online client portal.',
        userId: currentUser.uid,
      });

      setSubmittedId(reqId);
    } catch (err: any) {
      setGeneralError(err?.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setGeneralError(null);
    setErrors({});
    setTouched({});
    onClose();
  };

  const handleResendVerification = async () => {
    setResendingVerification(true);
    setVerificationNotice(null);
    try {
      await resendVerificationEmail();
      setVerificationNotice('A fresh verification link has been sent to your email inbox.');
    } catch (err: any) {
      setVerificationNotice(err?.message || 'Could not resend verification email.');
    } finally {
      setResendingVerification(false);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshingAuth(true);
    try {
      await refreshUser();
    } catch (err) {
      console.warn('Refresh error:', err);
    } finally {
      setRefreshingAuth(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#10283F] border border-slate-700 w-full max-w-xl rounded-xl shadow-2xl text-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#173859] to-[#10283F] px-6 py-5 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#D5A13A]/20 border border-[#D5A13A]/40 flex items-center justify-center text-[#D5A13A]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                Register for Consultation
              </h3>
              <p className="text-xs text-slate-300">
                Direct engagement with Erukneh Ademe Business Consulting senior partners.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STATE 1: Submitted Success Screen */}
          {submittedId ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="font-serif text-2xl font-bold text-white">
                Consultation Request Confirmed
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-white">{clientName}</span>. Your request has been assigned reference ID:
              </p>
              <div className="inline-block px-4 py-2 bg-[#0a1826] border border-[#D5A13A]/40 rounded-md font-mono text-xs text-[#D5A13A] font-semibold tracking-wider">
                {submittedId}
              </div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                A member of our executive advisory council will review your registration details and contact you at{' '}
                <span className="text-slate-200 font-semibold">{email}</span> within 24 business hours to arrange an introductory briefing.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    handleResetAndClose();
                    onNavigate?.('account');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-all shadow"
                >
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>View My Consultation Requests</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-all border border-slate-700"
                >
                  Done
                </button>
              </div>
            </div>
          ) : !currentUser ? (
            /* STATE 2: Unauthenticated Visitor Guard */
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-[#D5A13A]/15 border border-[#D5A13A]/30 text-[#D5A13A] flex items-center justify-center mx-auto">
                <LogIn className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-white">
                  Account Required
                </h4>
                <p className="text-sm text-slate-300 font-medium">
                  Please register or sign in to request a consultation.
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
                  To protect executive client confidentiality and ensure secure, direct communication with our senior advisory team, consultation requests require a verified client account.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate?.('register');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-all shadow"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Register Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate?.('login');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md transition-all"
                >
                  <LogIn className="w-4 h-4 mr-1.5 text-[#D5A13A]" />
                  Sign In
                </button>
              </div>
            </div>
          ) : !isEmailVerified ? (
            /* STATE 3: Unverified Email Notice */
            <div className="text-center py-8 space-y-5 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-xl font-bold text-white">
                  Email Verification Required
                </h4>
                <p className="text-sm text-slate-300 font-medium">
                  Please verify your email address to submit a consultation request.
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto pt-1 leading-relaxed">
                  A verification email has been sent to{' '}
                  <span className="text-white font-semibold">{currentUser.email}</span>. Click the link in that email, then refresh your status below.
                </p>
              </div>

              {verificationNotice && (
                <div className="p-3 text-xs rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 max-w-md mx-auto">
                  {verificationNotice}
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  disabled={refreshingAuth}
                  onClick={handleRefreshStatus}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-all disabled:opacity-50"
                >
                  {refreshingAuth ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1.5" />
                  )}
                  I Have Verified My Email
                </button>
                <button
                  type="button"
                  disabled={resendingVerification}
                  onClick={handleResendVerification}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-md transition-all disabled:opacity-50"
                >
                  {resendingVerification ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-1.5 text-[#D5A13A]" />
                  )}
                  Resend Verification Email
                </button>
              </div>
            </div>
          ) : (
            /* STATE 4: Exactly 5 Form Fields in Required Order */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {generalError && (
                <div className="p-3 text-xs rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              {/* FIELD 1: Full Name * */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name <span className="text-[#D5A13A] font-bold">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => {
                      setClientName(e.target.value);
                      if (errors.clientName) {
                        setErrors((prev) => ({ ...prev, clientName: undefined }));
                      }
                    }}
                    onBlur={() => handleBlur('clientName')}
                    placeholder="e.g. Alazar Bekele"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border rounded-md text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      touched.clientName && errors.clientName
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#D5A13A]'
                    }`}
                  />
                </div>
                {touched.clientName && errors.clientName && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.clientName}
                  </p>
                )}
              </div>

              {/* FIELD 2: Email * */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email <span className="text-[#D5A13A] font-bold">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: undefined }));
                      }
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border rounded-md text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-700 focus:border-[#D5A13A]'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-rose-400 mt-1 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* FIELD 3: Direct Telephone */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Direct Telephone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 100 0000"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A] transition-colors"
                  />
                </div>
              </div>

              {/* FIELD 4: Company / Organization */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Rift Valley Holdings PLC"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A] transition-colors"
                  />
                </div>
              </div>

              {/* FIELD 5: Industry Sector */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Industry Sector
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#D5A13A] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Industry Sector (Optional)</option>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#10283F] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>

                {/* Optional subordinate specify input when 'Other' is chosen */}
                {industry === 'Other' && (
                  <div className="mt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={otherIndustry}
                      onChange={(e) => setOtherIndustry(e.target.value)}
                      placeholder="Please specify your industry sector..."
                      className="w-full px-3 py-1.5 text-xs bg-[#0a1826] border border-slate-700 rounded text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                    />
                  </div>
                )}
              </div>

              {/* Confidentiality Notice */}
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400 mt-2">
                <ShieldCheck className="w-4 h-4 text-[#D5A13A] shrink-0 mt-0.5" />
                <span>
                  All client registrations and corporate discussions are protected under strict non-disclosure and professional consulting confidentiality protocols.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  disabled={loading}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/5 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] hover:brightness-105 active:scale-[0.99] rounded-md shadow-md transition-all flex items-center disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />}
                  Submit Consultation Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
