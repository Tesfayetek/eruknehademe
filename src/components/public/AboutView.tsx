import React from 'react';
import { SiteSettings, NavigationPage, PageSectionItem } from '../../types';
import { DynamicSectionRenderer } from '../common/DynamicSectionRenderer';
import {
  Shield,
  Award,
  Target,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  Search,
  Zap,
  TrendingUp,
  Building,
  GraduationCap,
  Globe,
} from 'lucide-react';

interface AboutViewProps {
  settings: SiteSettings;
  pageSections?: PageSectionItem[];
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  settings,
  pageSections = [],
  onNavigate,
  onOpenConsultation,
}) => {
  const methodologySteps = [
    {
      step: '01',
      title: 'Diagnostic & Market Discovery',
      desc: 'Rigorous empirical evaluation of your operating model, cost structure, competitive positioning, and regulatory landscape in Ethiopia.',
      icon: <Search className="w-6 h-6 text-[#D5A13A]" />,
    },
    {
      step: '02',
      title: 'Strategy & Solution Architecture',
      desc: 'Formulation of bankable financial models, strategic growth blueprints, and operational reorganizations tailored to market realities.',
      icon: <Target className="w-6 h-6 text-[#D5A13A]" />,
    },
    {
      step: '03',
      title: 'Agile Implementation & PMO',
      desc: 'Hands-on project governance, standard operating procedures (SOPs), leadership coaching, and contractor management.',
      icon: <Layers className="w-6 h-6 text-[#D5A13A]" />,
    },
    {
      step: '04',
      title: 'Value Realization & Governance',
      desc: 'Institutionalizing internal capabilities, monitoring balanced scorecards, and ensuring long-term shareholder value creation.',
      icon: <TrendingUp className="w-6 h-6 text-[#D5A13A]" />,
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 mr-1" />
              About Erukneh Ademe Business Consulting
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Strategic Insight. Proven Ground Execution.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We empower organizations across Ethiopia, East Africa, and globally to navigate complexity, seize growth opportunities, and build enduring institutional strength.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview & Core Philosophy */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Our Institutional Heritage
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F] tracking-tight">
                Architecting African Business Success
              </h2>
              <div className="text-sm sm:text-base text-slate-700 space-y-4 leading-relaxed">
                <p>
                  {settings.aboutSummary ||
                    'Erukneh Ademe Business Consulting was founded on a singular conviction: that transformative strategic counsel must combine international analytical excellence with an intimate, nuanced understanding of the local African commercial landscape.'}
                </p>
                <p>
                  As Ethiopia enters an era of macroeconomic structural liberalization, capital market formation with the Ethiopian Securities Exchange (ESX), and accelerated regional trade integration through the African Continental Free Trade Area (AfCFTA), the demands placed on organizational leadership are unprecedented.
                </p>
                <p>
                  We do not offer generic templates. Every engagement is architected from first principles, producing bankable, executable strategies that generate demonstrable commercial returns.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-serif text-sm font-bold text-[#10283F] flex items-center">
                    <Target className="w-4 h-4 mr-2 text-[#b88528]" />
                    Our Vision
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {settings.vision ||
                      'To be the most trusted and transformative strategic consulting firm in East Africa, recognized for empowering sustainable enterprise growth.'}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <h4 className="font-serif text-sm font-bold text-[#10283F] flex items-center">
                    <Compass className="w-4 h-4 mr-2 text-[#b88528]" />
                    Our Mission
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {settings.mission ||
                      'Deliver bespoke, data-grounded strategic advisory and consulting solutions that unlock economic value and generate enduring impact.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Founder Profile Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#10283F] text-white rounded-xl shadow-xl border border-slate-700 overflow-hidden">
                <div className="h-64 sm:h-72 overflow-hidden bg-slate-800">
                  <img
                    src={
                      settings.founderImageUrl ||
                      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={settings.founderName || 'Erukneh Ademe'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">
                      {settings.founderName || 'Erukneh Ademe'}
                    </h3>
                    <p className="text-xs font-semibold text-[#D5A13A] uppercase tracking-wider">
                      {settings.founderTitle || 'Managing Partner & Senior Strategic Advisor'}
                    </p>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {settings.founderBio ||
                      'Over 18 years of executive consulting experience across Ethiopia and regional East African commercial hubs. Trusted advisor on enterprise restructuring, capital formation, and strategic market expansion.'}
                  </p>
                  <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Addis Ababa Head Office</span>
                    <button
                      onClick={() => onOpenConsultation()}
                      className="text-xs font-semibold text-[#D5A13A] hover:underline"
                    >
                      Book Partner Briefing &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consulting Methodology */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
              Execution Discipline
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
              Our 4-Phase Consulting Methodology
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Every engagement follows an iterative, battle-tested framework designed to mitigate operational risk and maximize enterprise value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {methodologySteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#10283F] flex items-center justify-center shadow">
                      {item.icon}
                    </div>
                    <span className="font-serif text-2xl font-bold text-slate-300">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#10283F]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center text-[11px] font-semibold text-[#b88528]">
                  <span>Phase {idx + 1} Deliverable</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Credentials & Institutional Standards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Standards of Excellence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F] tracking-tight">
                Verified Credentials & Professional Standards
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe consulting credentials must be grounded in verified capability, regulatory compliance, and ethical stewardship. We maintain strict compliance with Ethiopian commercial law and international management consulting codes.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenConsultation()}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors"
                >
                  Schedule Leadership Discussion
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(settings.credentials || [
                  'Certified Management Consultant (CMC) Standards Compliant',
                  'Advisory Partner for Ethiopian Capital Market / ESX Pre-Listing',
                  'Member of the Ethiopian Chamber of Commerce & Sectoral Associations',
                  'Authorized Feasibility & Business Plan Specialist for DBE & Commercial Banks',
                  'AfCFTA Regional Trade & Investment Advisory Specialist',
                  'IFRS Compliant Valuation & Financial Advisory Modeling',
                ]).map((cred, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-start space-x-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#b88528] shrink-0 mt-0.5" />
                    <span className="text-xs font-medium text-[#10283F] leading-snug">
                      {cred}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections from CMS */}
      {pageSections.length > 0 && (
        <DynamicSectionRenderer
          sections={pageSections}
          onNavigate={onNavigate}
          onOpenConsultation={onOpenConsultation}
        />
      )}
    </div>
  );
};
