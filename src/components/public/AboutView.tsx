import React, { useState, useEffect } from 'react';
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
  Users,
  Sparkles,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

export type AboutSubpage = 'all' | 'company-overview' | 'mission-vision-values' | 'our-approach' | 'leadership-team';

interface AboutViewProps {
  settings: SiteSettings;
  subpage?: string;
  pageSections?: PageSectionItem[];
  onNavigate: (page: NavigationPage, subpageOrSlug?: string, targetUrl?: string) => void;
  onOpenConsultation: (serviceName?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  settings,
  subpage = 'all',
  pageSections = [],
  onNavigate,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<string>(subpage || 'all');

  useEffect(() => {
    if (subpage) {
      setActiveTab(subpage);
    }
  }, [subpage]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const url = tab === 'all' ? '/about' : `/about/${tab}`;
    onNavigate('about', tab === 'all' ? undefined : tab, url);
  };

  const methodologySteps = [
    {
      step: '01',
      title: 'Diagnostic & Market Discovery',
      desc: 'Rigorous empirical evaluation of your operating model, cost structure, competitive positioning, and regulatory landscape in Ethiopia.',
      icon: <Search className="w-6 h-6 text-[#D5A13A]" />,
      details: [
        'Deep-dive operational and financial diagnostic',
        'Regulatory and macroeconomic impact assessment',
        'Stakeholder and customer value chain interviews',
      ],
    },
    {
      step: '02',
      title: 'Strategy & Solution Architecture',
      desc: 'Formulation of bankable financial models, strategic growth blueprints, and operational reorganizations tailored to market realities.',
      icon: <Target className="w-6 h-6 text-[#D5A13A]" />,
      details: [
        '5-Year dynamic financial simulation and sensitivity matrices',
        'Core competitive differentiator architecture',
        'Risk mitigation protocols and currency shock absorption',
      ],
    },
    {
      step: '03',
      title: 'Agile Implementation & PMO',
      desc: 'Hands-on project governance, standard operating procedures (SOPs), leadership coaching, and contractor management.',
      icon: <Layers className="w-6 h-6 text-[#D5A13A]" />,
      details: [
        'Turnkey PMO setup with milestone verification gates',
        'Standard Operating Procedure authoring and institutionalization',
        'Executive coaching and cross-functional taskforce steering',
      ],
    },
    {
      step: '04',
      title: 'Value Realization & Governance',
      desc: 'Institutionalizing internal capabilities, monitoring balanced scorecards, and ensuring long-term shareholder value creation.',
      icon: <TrendingUp className="w-6 h-6 text-[#D5A13A]" />,
      details: [
        'Quarterly performance scorecard audit and variance tracking',
        'Board of directors reporting and fiduciary governance',
        'Knowledge transfer for sustainable self-sufficiency',
      ],
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

      {/* Submenu Navigation Tabs */}
      <section className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-2 sm:space-x-8 overflow-x-auto py-1">
          <button
            onClick={() => handleTabChange('all')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'all'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('company-overview')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'company-overview'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Company Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('mission-vision-values')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'mission-vision-values'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Mission, Vision & Values</span>
          </button>

          <button
            onClick={() => handleTabChange('our-approach')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'our-approach'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Our Approach</span>
          </button>

          <button
            onClick={() => handleTabChange('leadership-team')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'leadership-team'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Leadership & Team</span>
          </button>
        </div>
      </section>

      {/* SECTION 1: Company Overview */}
      {(activeTab === 'all' || activeTab === 'company-overview') && (
        <section id="company-overview" className="py-16 bg-white border-b border-slate-200 scroll-mt-28">
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
                    Headquartered in Addis Ababa, Ethiopia, our firm serves high-growth enterprises, industrial conglomerates, financial institutions, and international investors navigating the Horn of Africa. As Ethiopia undergoes structural economic liberalization and capital market formation, our advisors bridge high-level strategy with operational reality.
                  </p>
                  <p>
                    We do not offer generic templates. Every engagement is architected from first principles, producing bankable, executable strategies that generate demonstrable commercial returns.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-serif text-2xl font-bold text-[#10283F]">18+</div>
                    <div className="text-[11px] text-slate-600">Years Advisory Leadership</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-serif text-2xl font-bold text-[#10283F]">$120M+</div>
                    <div className="text-[11px] text-slate-600">Capital Mobilized & Feasibilities</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="font-serif text-2xl font-bold text-[#10283F]">150+</div>
                    <div className="text-[11px] text-slate-600">Institutional Mandates Delivered</div>
                  </div>
                </div>
              </div>

              {/* Founder Monogram Card */}
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
      )}

      {/* SECTION 2: Mission, Vision & Values */}
      {(activeTab === 'all' || activeTab === 'mission-vision-values') && (
        <section id="mission-vision-values" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Our Compass
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
                Mission, Vision & Core Values
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Clear principles governing our fiduciary commitments, advisory rigor, and client partnership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#10283F] flex items-center justify-center shadow text-[#D5A13A]">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#10283F]">Our Vision</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {settings.vision ||
                    'To be the premier, most trusted management and strategic consulting firm in East Africa—recognized for transforming indigenous enterprises into regionally competitive institutions.'}
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-lg bg-[#10283F] flex items-center justify-center shadow text-[#D5A13A]">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#10283F]">Our Mission</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {settings.mission ||
                    'Deliver bespoke, data-grounded strategic advisory, bankable project feasibility, and operational transformation that unlock sustainable commercial value for our clients.'}
                </p>
              </div>
            </div>

            {/* Core Values Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#b88528]">Pillar 1</div>
                <h4 className="font-serif font-bold text-base text-[#10283F]">Uncompromising Integrity</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Objective, unvarnished strategic truth. We prioritize long-term client solvency over comfortable consensus.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#b88528]">Pillar 2</div>
                <h4 className="font-serif font-bold text-base text-[#10283F]">Empirical Rigor</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No guesswork. Every recommendation is anchored in validated field research, IFRS financial discipline, and econometric modeling.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#b88528]">Pillar 3</div>
                <h4 className="font-serif font-bold text-base text-[#10283F]">Execution Accountability</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We don't hand over binders and walk away. We establish PMO governance and measure tangible EBITDA impact.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#b88528]">Pillar 4</div>
                <h4 className="font-serif font-bold text-base text-[#10283F]">African Enterprise Pride</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Passionate commitment to developing local industrial capacity and driving regional AfCFTA integration.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Our Approach */}
      {(activeTab === 'all' || activeTab === 'our-approach') && (
        <section id="our-approach" className="py-16 bg-white border-b border-slate-200 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Execution Discipline
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
                Our 4-Phase Consulting Methodology
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every client engagement follows an iterative, battle-tested framework engineered to eliminate operational risk and maximize enterprise value.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {methodologySteps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
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

                    <div className="space-y-1.5 pt-2">
                      {item.details.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-200 flex items-center text-[11px] font-semibold text-[#b88528]">
                    <span>Phase {idx + 1} Deliverable Gate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Leadership & Team */}
      {(activeTab === 'all' || activeTab === 'leadership-team') && (
        <section id="leadership-team" className="py-16 bg-slate-50 border-b border-slate-200 scroll-mt-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Firm Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
                Leadership & Senior Advisory Team
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Direct engagement by proven senior partners with deep industry credentials across Ethiopia and East Africa.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="lg:col-span-4">
                <img
                  src={
                    settings.founderImageUrl ||
                    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={settings.founderName || 'Erukneh Ademe'}
                  className="w-full h-80 object-cover rounded-xl shadow-md"
                />
              </div>
              <div className="lg:col-span-8 space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#10283F]">
                    {settings.founderName || 'Erukneh Ademe'}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#b88528]">
                    {settings.founderTitle || 'Managing Partner & Senior Strategic Advisor'}
                  </p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {settings.founderBio ||
                    'With over 18 years of advisory and operational turnaround leadership in Ethiopia and regional East African markets, Erukneh Ademe has spearheaded bankable feasibility studies, industrial joint ventures, and capital restructurings for prominent manufacturing, banking, and agricultural conglomerates.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0" />
                    <span>Certified Management Consultant (CMC) Standards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0" />
                    <span>IFRS & Capital Market Valuation Specialist</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0" />
                    <span>Specialist in DBE & Commercial Banking Approvals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0" />
                    <span>AfCFTA Cross-Border Trade Advisor</span>
                  </div>
                </div>
                <div className="pt-4 flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('resume')}
                    className="px-4 py-2 text-xs font-semibold text-[#10283F] bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
                  >
                    View Executive CV
                  </button>
                  <button
                    onClick={() => onOpenConsultation('Leadership Briefing with Managing Partner')}
                    className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all"
                  >
                    Schedule Direct Partner Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

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
