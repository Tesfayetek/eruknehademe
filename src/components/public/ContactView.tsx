import React, { useState } from 'react';
import { SiteSettings } from '../../types';
import { submitContactMessage } from '../../services/dataService';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  Linkedin,
  Twitter,
  Globe,
  Loader2,
} from 'lucide-react';

interface ContactViewProps {
  settings: SiteSettings;
  onOpenConsultation: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  settings,
  onOpenConsultation,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
        throw new Error('Please fill in all required fields.');
      }

      await submitContactMessage({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccess(true);
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err?.message || 'Failed to submit message. Please try again or call our office.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 mr-1" />
              Connect With Our Partners
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Contact & Inquiries
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We welcome inquiries from domestic corporations, regional enterprises, international investors, and development organizations seeking strategic clarity in Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Office Details & Map Card */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <span className="text-[#b88528] text-xs font-bold uppercase tracking-wider block">
                    Headquarters
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#10283F] mt-1">
                    Addis Ababa Office
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Strategically situated in the Bole diplomatic and commercial district.
                  </p>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-md bg-[#10283F]/10 flex items-center justify-center text-[#10283F] shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 text-[#b88528]" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#10283F] block">Physical Address</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">
                        {settings.address ||
                          'Bole Sub-City, Namibia Street, Edna Mall Business Center, 6th Floor, Addis Ababa, Ethiopia'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-md bg-[#10283F]/10 flex items-center justify-center text-[#10283F] shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 text-[#b88528]" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#10283F] block">Telephone</span>
                      <a
                        href={`tel:${settings.phone || '+251116678900'}`}
                        className="text-slate-600 hover:text-[#10283F] block mt-0.5"
                      >
                        {settings.phone || '+251 11 667 8900'}
                      </a>
                      {settings.secondaryPhone && (
                        <a
                          href={`tel:${settings.secondaryPhone}`}
                          className="text-slate-500 hover:text-[#10283F] block text-xs"
                        >
                          Direct: {settings.secondaryPhone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-md bg-[#10283F]/10 flex items-center justify-center text-[#10283F] shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 text-[#b88528]" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#10283F] block">Email</span>
                      <a
                        href={`mailto:${settings.email || 'info@eruknehademe.com'}`}
                        className="text-slate-600 hover:text-[#10283F] block mt-0.5"
                      >
                        {settings.email || 'info@eruknehademe.com'}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-md bg-[#10283F]/10 flex items-center justify-center text-[#10283F] shrink-0 mt-0.5">
                      <Clock className="w-4 h-4 text-[#b88528]" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#10283F] block">Office Hours</span>
                      <p className="text-slate-600 mt-0.5">
                        {settings.workingHours || 'Monday - Friday: 8:30 AM - 5:30 PM (EAT)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Consultation CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs font-semibold text-[#10283F]">
                      Looking for an executive consultation?
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Skip general inquiry and submit full project specifications directly to our consulting partners.
                    </p>
                    <button
                      onClick={() => onOpenConsultation()}
                      className="mt-3 w-full py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all"
                    >
                      Open Consultation Booking
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Stylized Location Map Card */}
              <div className="bg-[#10283F] text-white p-6 rounded-xl border border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-[#D5A13A]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Addis Ababa &bull; Bole Commercial Zone
                    </span>
                  </div>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-[#D5A13A]">
                    Lat 9.00° N, Long 38.78° E
                  </span>
                </div>
                <div className="h-44 bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700 flex items-center justify-center text-center p-4">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#D5A13A]/20 border border-[#D5A13A] flex items-center justify-center mx-auto text-[#D5A13A]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-white">
                      Erukneh Ademe Business Consulting
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Edna Mall Commercial Complex, 6th Fl, Bole, Addis Ababa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Direct Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-10 rounded-xl shadow-sm border border-slate-200 space-y-6">
                <div>
                  <span className="text-[#b88528] text-xs font-bold uppercase tracking-wider block">
                    Direct Inquiry Form
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#10283F] mt-1">
                    Send a Message to Our Advisory Team
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Fill out the form below. All inquiries receive responses within one business day.
                  </p>
                </div>

                {success ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-emerald-900">
                      Message Received
                    </h4>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Erukneh Ademe Business Consulting. Your message has been logged in our system and routed to the appropriate advisory practice.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="mt-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-md transition-colors"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 text-xs rounded-md bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Full Name <span className="text-[#b88528]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Bethlehem Haile"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Email Address <span className="text-[#b88528]">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+251 91 123 4567"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Subject <span className="text-[#b88528]">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="e.g. Inquiry regarding Feasibility Study"
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Message <span className="text-[#b88528]">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please provide details about your organization, project scope, or general inquiry..."
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#b88528] focus:bg-white"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Protected by professional confidentiality.
                      </span>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-all shadow flex items-center disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 mr-2 text-[#D5A13A]" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
