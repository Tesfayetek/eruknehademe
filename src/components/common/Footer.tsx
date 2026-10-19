import React from 'react';
import { NavigationPage, SiteSettings } from '../../types';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Shield,
  ArrowRight,
  Linkedin,
  Twitter,
  Send,
  Facebook,
  Github,
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
  settings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenConsultation,
  settings,
}) => {
  const companyName = settings?.companyName || 'Erukneh Ademe';
  const tagline = settings?.tagline || 'Business Consulting';
  const phone = settings?.phone || '+251 11 667 8900';
  const email = settings?.email || 'info@eruknehademe.com';
  const address = settings?.address || 'Bole Sub-City, Edna Mall Business Center, 6th Fl., Addis Ababa, Ethiopia';
  const workingHours = settings?.workingHours || 'Mon - Fri: 8:30 AM - 5:30 PM EAT';
  const ctaHeading = settings?.consultationCtaHeading || 'Ready to Navigate Your Next Strategic Horizon?';
  const ctaText = settings?.consultationCtaText || 'Schedule a confidential discussion with our senior consulting partners in Addis Ababa or virtually.';
  const btnText = settings?.consultationBtnText || 'Book a Consultation';
  const copyrightText = settings?.copyrightText || `© ${new Date().getFullYear()} ${companyName} ${tagline}. All Rights Reserved. Regulated under Ethiopian Commercial Law.`;

  return (
    <footer className="bg-[#0a1826] text-slate-300 border-t border-slate-800">
      {/* Upper Consultation CTA Banner */}
      <div className="bg-gradient-to-r from-[#10283F] via-[#153452] to-[#10283F] py-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left max-w-2xl">
            <span className="text-[#D5A13A] text-xs font-semibold tracking-widest uppercase mb-1 block">
              Strategic Partnership &bull; Transformative Growth
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {ctaHeading}
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              {ctaText}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onOpenConsultation()}
              className="px-6 py-3 text-sm font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow-lg hover:shadow-[#D5A13A]/30 transition-all transform hover:-translate-y-0.5 flex items-center"
            >
              {btnText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 text-sm font-medium text-slate-200 bg-white/10 hover:bg-white/15 rounded-md border border-slate-700 transition-colors"
            >
              Direct Office Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Company Profile */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('home')}>
              {settings?.logoUrl ? (
                <img src={settings.logoUrl} alt={companyName} className="w-10 h-10 object-contain rounded" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#D5A13A] to-[#916215] p-0.5">
                  <div className="w-full h-full bg-[#10283F] rounded-[7px] flex items-center justify-center">
                    <span className="font-serif font-bold text-base text-[#D5A13A]">EA</span>
                  </div>
                </div>
              )}
              <div>
                <span className="font-serif text-lg font-bold text-white block leading-snug">
                  {companyName}
                </span>
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-slate-400 block">
                  {tagline}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {settings?.aboutSummary ||
                'Headquartered in Addis Ababa, Erukneh Ademe Business Consulting delivers world-class corporate strategy, financial advisory, and operational transformation across Ethiopia and East Africa.'}
            </p>
            <div className="pt-2 flex items-center space-x-3">
              {settings?.socialLinks?.linkedin && (
                <a
                  href={settings.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-[#D5A13A] hover:text-[#10283F] transition-colors flex items-center justify-center text-slate-400"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-[#D5A13A] hover:text-[#10283F] transition-colors flex items-center justify-center text-slate-400"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.telegram && (
                <a
                  href={settings.socialLinks.telegram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-[#D5A13A] hover:text-[#10283F] transition-colors flex items-center justify-center text-slate-400"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded bg-slate-800 hover:bg-[#D5A13A] hover:text-[#10283F] transition-colors flex items-center justify-center text-slate-400"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-[#D5A13A] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-[#D5A13A] transition-colors">
                  About Us & Founder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#D5A13A] transition-colors">
                  Consulting Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('industries')} className="hover:text-[#D5A13A] transition-colors">
                  Industries Served
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-[#D5A13A] transition-colors">
                  Projects & Case Studies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('resume')} className="hover:text-[#D5A13A] transition-colors">
                  Executive CV / Resume
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Core Practices */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Practice Areas
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#D5A13A] text-left transition-colors">
                  Corporate Strategy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#D5A13A] text-left transition-colors">
                  Financial Advisory & ESX
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#D5A13A] text-left transition-colors">
                  Bankable Feasibility Studies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('skills')} className="hover:text-[#D5A13A] text-left transition-colors">
                  Core Competencies
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#D5A13A] text-left transition-colors">
                  Direct Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Addis Ababa Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start">
                <MapPin className="w-3.5 h-3.5 mr-2 text-[#D5A13A] shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-[#D5A13A] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phone}
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-[#D5A13A] shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-2 text-[#D5A13A] shrink-0" />
                <span>{workingHours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 bg-[#081420] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>{copyrightText}</p>
          <div className="flex items-center space-x-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-400 transition-colors">
              Professional Ethics
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-400 transition-colors">
              Confidentiality
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="inline-flex items-center text-slate-500 hover:text-[#D5A13A] transition-colors"
            >
              <Shield className="w-3 h-3 mr-1" />
              Administrative CMS
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
