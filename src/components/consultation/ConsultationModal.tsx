import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitConsultationRequest } from '../../services/dataService';
import {
  X,
  Calendar,
  Building,
  Mail,
  Phone,
  User,
  Briefcase,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preselectedService,
}) => {
  const { currentUser, userProfile } = useAuth();

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Manufacturing & Heavy Industry');
  const [serviceInterest, setServiceInterest] = useState(
    preselectedService || 'Business Strategy & Corporate Growth'
  );
  const [projectDescription, setProjectDescription] = useState('');
  const [estimatedTimeline, setEstimatedTimeline] = useState('1-3 Months');
  const [preferredDate, setPreferredDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email || '');
      setClientName(userProfile?.displayName || currentUser.displayName || '');
      if (userProfile?.phone) setPhone(userProfile.phone);
      if (userProfile?.company) setCompanyName(userProfile.company);
    }
    if (preselectedService) {
      setServiceInterest(preselectedService);
    }
  }, [currentUser, userProfile, preselectedService, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!clientName.trim() || !email.trim() || !projectDescription.trim()) {
        throw new Error('Please complete all required fields.');
      }

      const reqId = await submitConsultationRequest({
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        companyName: companyName.trim() || 'Undisclosed Enterprise',
        industry,
        serviceInterest,
        projectDescription: projectDescription.trim(),
        estimatedTimeline,
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        userId: currentUser?.uid,
      });

      setSubmittedId(reqId);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit consultation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setProjectDescription('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#10283F] border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl text-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#173859] to-[#10283F] px-6 py-5 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#D5A13A]/20 border border-[#D5A13A]/40 flex items-center justify-center text-[#D5A13A]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white tracking-tight">
                Schedule a Strategic Consultation
              </h3>
              <p className="text-xs text-slate-300">
                Direct engagement with Erukneh Ademe Business Consulting senior partners.
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
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
                A member of our executive advisory council will review your submission and contact you at <span className="text-slate-200">{email}</span> within 24 business hours to arrange an introductory briefing.
              </p>
              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded-md transition-all shadow"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs rounded-md bg-rose-500/20 border border-rose-500/40 text-rose-300">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Full Name <span className="text-[#D5A13A]">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alazar Bekele"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Corporate Email <span className="text-[#D5A13A]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                    />
                  </div>
                </div>

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
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                    />
                  </div>
                </div>

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
                      className="w-full pl-9 pr-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#D5A13A]"
                  >
                    <option value="Manufacturing & Heavy Industry">Manufacturing & Heavy Industry</option>
                    <option value="Agriculture & Agro-Processing">Agriculture & Agro-Processing</option>
                    <option value="Trade, Freight & Logistics">Trade, Freight & Logistics</option>
                    <option value="SMEs & High-Growth Startups">SMEs & High-Growth Startups</option>
                    <option value="NGOs & Development Agencies">NGOs & Development Agencies</option>
                    <option value="Financial Services & FinTech">Financial Services & FinTech</option>
                    <option value="International Investors / Joint Ventures">International Investors / FDI</option>
                    <option value="Other Industry">Other Industry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Primary Service Required
                  </label>
                  <select
                    value={serviceInterest}
                    onChange={(e) => setServiceInterest(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#D5A13A]"
                  >
                    <option value="Business Strategy & Corporate Growth">Business Strategy & Corporate Growth</option>
                    <option value="Management Consulting & Operational Excellence">Management Consulting & Operations</option>
                    <option value="Financial Advisory & Capital Raising">Financial Advisory & ESX Listing</option>
                    <option value="Business Plan & Bankable Feasibility Studies">Business Plan & Feasibility Studies</option>
                    <option value="Market Research & Consumer Insights">Market Research & Field Intelligence</option>
                    <option value="Project Management & PMO Advisory">Project Management & PMO Advisory</option>
                    <option value="Other Specialized Consulting">Other Specialized Consulting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Project Scope & Strategic Challenges <span className="text-[#D5A13A]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Outline your company's core objectives, timeline constraints, or specific hurdles you would like our advisory team to address..."
                  className="w-full px-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-[#D5A13A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Engagement Timeline
                  </label>
                  <select
                    value={estimatedTimeline}
                    onChange={(e) => setEstimatedTimeline(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#D5A13A]"
                  >
                    <option value="Immediate (Within 30 Days)">Immediate (Within 30 Days)</option>
                    <option value="1-3 Months">1-3 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                    <option value="Exploratory / Budget Planning">Exploratory / Budget Planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Preferred Briefing Date
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#0a1826] border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#D5A13A]"
                  />
                </div>
              </div>

              {/* Confidentiality Notice */}
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 flex items-start space-x-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-[#D5A13A] shrink-0 mt-0.5" />
                <span>
                  All communications and enterprise project specifications are protected under strict non-disclosure and professional consulting confidentiality protocols.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-transparent hover:bg-white/5 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow-md hover:shadow-[#D5A13A]/25 transition-all flex items-center disabled:opacity-50"
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
