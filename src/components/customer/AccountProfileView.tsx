import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ConsultationRequest, NavigationPage } from '../../types';
import { getUserConsultationRequests } from '../../services/dataService';
import { VerifyEmailNotice } from '../auth/VerifyEmailNotice';
import {
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Shield,
  Loader2,
  ExternalLink,
  Save,
  ChevronDown,
  LogOut,
} from 'lucide-react';

interface AccountProfileViewProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
}

export const AccountProfileView: React.FC<AccountProfileViewProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { currentUser, userProfile, isEmailVerified, updateProfileDetails, isAdmin, logout } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loadingConsultations, setLoadingConsultations] = useState(true);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close My Account sub menu on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
      setCompany(userProfile.company || '');
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (currentUser) {
        try {
          const reqs = await getUserConsultationRequests(currentUser.uid);
          setConsultations(reqs);
        } catch (err) {
          console.warn('Consultation fetch notice:', err);
        } finally {
          setLoadingConsultations(false);
        }
      }
    };
    fetchRequests();
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);

    try {
      await updateProfileDetails({
        displayName: displayName.trim(),
        phone: phone.trim(),
        company: company.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full border border-amber-200">
            Pending Review
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
            Reviewed by Partner
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            Meeting Scheduled
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
            Consultation Completed
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Email verification reminder */}
        {!isEmailVerified && <VerifyEmailNotice />}

        {/* Header Profile Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-[#10283F] text-[#D5A13A] flex items-center justify-center font-serif text-xl font-bold shadow">
              {(userProfile?.displayName || currentUser?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#10283F]">
                {userProfile?.displayName || 'Client Dashboard'}
              </h1>
              <p className="text-xs text-slate-500">{currentUser?.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  Role: {userProfile?.role || 'Customer'}
                </span>
                {isEmailVerified ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified Client
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className="px-3.5 py-2 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-colors shadow flex items-center"
              >
                <Shield className="w-3.5 h-3.5 mr-1.5" />
                Admin CMS
              </button>
            )}

            <button
              onClick={() => onOpenConsultation()}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors flex items-center shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#D5A13A]" />
              Book Consultation
            </button>

            {/* My Account Sub Menu Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
                aria-expanded={accountMenuOpen}
                aria-label="My Account Sub Menu"
              >
                <User className="w-3.5 h-3.5 text-[#D5A13A]" />
                <span>My Account</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-30 text-slate-700 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">My Account</p>
                    <p className="text-xs font-semibold text-[#10283F] truncate">{currentUser?.email}</p>
                    <p className="text-[10px] text-slate-500 capitalize mt-0.5">Role: {userProfile?.role || 'Customer'}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        const formEl = document.getElementById('profile-form-section');
                        if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center hover:bg-slate-50 font-medium text-slate-700"
                    >
                      <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      Edit Corporate Profile
                    </button>

                    <button
                      onClick={() => {
                        setAccountMenuOpen(false);
                        const listEl = document.getElementById('consultations-list-section');
                        if (listEl) listEl.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center hover:bg-slate-50 font-medium text-slate-700"
                    >
                      <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      My Consultations ({consultations.length})
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setAccountMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs flex items-center hover:bg-slate-50 font-semibold text-[#b88528]"
                      >
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        Admin Dashboard & CMS
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 my-1" />

                  {/* Sign Out sub menu item */}
                  <button
                    onClick={async () => {
                      setAccountMenuOpen(false);
                      await logout();
                      onNavigate('home');
                    }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center text-rose-600 hover:bg-rose-50 font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 mr-2 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Sign Out Button */}
            <button
              onClick={async () => {
                await logout();
                onNavigate('home');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors flex items-center space-x-1.5 shadow-sm cursor-pointer"
              title="Sign Out from your account"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two-Column Grid: Profile Editor & Consultation Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Permitted Profile Information */}
          <div id="profile-form-section" className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#10283F]">
                Corporate Profile
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Update your contact details for active consulting correspondence.
              </p>
            </div>

            {saveSuccess && (
              <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-md flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Profile details saved successfully.</span>
              </div>
            )}

            {saveError && (
              <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-md flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-100 border border-slate-200 text-slate-500 rounded-md cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Managed via Firebase Authentication.
                </span>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Telephone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 123 4567"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Company / Organization
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Awash Agribusiness Group"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center justify-center disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 mr-2 text-[#D5A13A]" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Customer Consultation Requests Tracking */}
          <div id="consultations-list-section" className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#10283F]">
                  My Consultation Inquiries
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time status updates and notes from our consulting partners.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-slate-100 rounded-md text-slate-700">
                {consultations.length} {consultations.length === 1 ? 'Record' : 'Records'}
              </span>
            </div>

            {loadingConsultations ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#10283F]" />
                <p className="text-xs">Loading consultation requests...</p>
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg p-6 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-700">
                  No Consultation Requests Yet
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  When you submit a consultation request, its review status, scheduling dates, and partner notes will appear here.
                </p>
                <button
                  onClick={() => onOpenConsultation()}
                  className="mt-2 px-4 py-2 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-colors"
                >
                  Schedule Your First Consultation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs font-bold text-[#10283F]">
                          {req.serviceInterest}
                        </span>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                          <span>Ref: {req.id}</span>
                          <span>&bull;</span>
                          <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div>{getStatusBadge(req.status)}</div>
                    </div>

                    <div className="text-xs text-slate-700 bg-white p-3 rounded border border-slate-200 space-y-1">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <p><span className="font-semibold text-slate-900">Company:</span> {req.companyName || 'Not specified'}</p>
                        <p><span className="font-semibold text-slate-900">Industry Sector:</span> {req.industry || 'Not specified'}</p>
                        <p><span className="font-semibold text-slate-900">Direct Telephone:</span> {req.phone || 'Not provided'}</p>
                        <p><span className="font-semibold text-slate-900">Contact Email:</span> {req.email}</p>
                      </div>
                      {req.projectDescription && req.projectDescription !== 'Register for consultation request' && (
                        <p className="pt-1 text-slate-600 border-t border-slate-100">
                          <span className="font-semibold text-slate-900">Notes:</span> {req.projectDescription}
                        </p>
                      )}
                    </div>

                    {req.adminNotes && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 space-y-1">
                        <span className="font-bold flex items-center">
                          <Shield className="w-3.5 h-3.5 mr-1 text-blue-700" />
                          Partner Feedback / Scheduling Note:
                        </span>
                        <p>{req.adminNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
