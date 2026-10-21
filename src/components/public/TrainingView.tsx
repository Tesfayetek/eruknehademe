import React, { useState, useEffect } from 'react';
import { NavigationPage } from '../../types';
import {
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Shield,
  Download,
  Sparkles,
  Search,
} from 'lucide-react';

export type TrainingSubpage = 'all' | 'programs' | 'management-courses' | 'upcoming-training' | 'corporate-training';

interface TrainingViewProps {
  subpage?: TrainingSubpage;
  onNavigate: (page: NavigationPage, subpageOrSlug?: string, targetUrl?: string) => void;
  onOpenConsultation: (programTitle?: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({
  subpage = 'all',
  onNavigate,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<TrainingSubpage>(subpage);

  useEffect(() => {
    if (subpage) {
      setActiveTab(subpage);
    }
  }, [subpage]);

  const handleTabChange = (tab: TrainingSubpage) => {
    setActiveTab(tab);
    const url = tab === 'all' ? '/training' : `/training/${tab}`;
    onNavigate('training', tab === 'all' ? undefined : tab, url);
  };

  const programs = [
    {
      id: 'prog-1',
      title: 'Senior Executive Leadership & Strategic Governance',
      category: 'Executive Education',
      duration: '6 Weeks (Executive Weekend Cohort)',
      format: 'In-Person (Addis Ababa) & Executive Hybrid',
      targetAudience: 'CEOs, Managing Directors, Board Members, Senior Vice Presidents',
      summary:
        'A high-impact executive development program focused on steering organizations through macroeconomic liberalization, corporate restructuring, and capital market formation.',
      modules: [
        'Strategic Visioning & Scenario Planning in Volatile Markets',
        'Fiduciary Governance, Board Charters & Audit Oversight',
        'Capital Allocation & ESX Capital Market Preparation',
        'Change Management & Organizational Culture Transformation',
      ],
      certification: 'Executive Certificate in Strategic Governance (EA Consulting)',
      icon: Award,
    },
    {
      id: 'prog-2',
      title: 'Bankable Feasibility Study & Project Finance Masterclass',
      category: 'Financial Mastery',
      duration: '4 Weeks (Intensive)',
      format: 'Addis Ababa Executive Training Suite',
      targetAudience: 'CFOs, Project Directors, Investment Analysts, Corporate Finance Leads',
      summary:
        'Hands-on training on drafting bankable feasibility studies conforming to Development Bank of Ethiopia (DBE) and commercial lending criteria.',
      modules: [
        'Market Demand Forecasting & Total Addressable Market (TAM)',
        'Technical Due Diligence & EPC Procurement Gateways',
        'IFRS Dynamic 10-Year Financial Modeling & Stress-Testing',
        'Credit Defense & Loan Syndication Structuring',
      ],
      certification: 'Certified Feasibility & Project Finance Specialist',
      icon: BookOpen,
    },
    {
      id: 'prog-3',
      title: 'Operations Excellence & Lean PMO Transformation',
      category: 'Operational Systems',
      duration: '4 Weeks',
      format: 'Hybrid Classroom & Industrial Site Audit',
      targetAudience: 'Chief Operating Officers, Factory Managers, PMO Directors',
      summary:
        'Practical methodologies to eliminate waste, standardize standard operating procedures (SOPs), and build resilient domestic supply chains.',
      modules: [
        'Lean Manufacturing Principles & Waste (Muda) Elimination',
        'End-to-End Procurement & Multimodal Logistics Resilience',
        'Establishing an Agile Project Management Office (PMO)',
        'Root-Cause Quality Control & Continuous Improvement',
      ],
      certification: 'Lean Operations Leadership Certificate',
      icon: Building,
    },
    {
      id: 'prog-4',
      title: 'AfCFTA Regional Market Strategy & Export Readiness',
      category: 'Trade & Regional Growth',
      duration: '3 Weeks',
      format: 'Virtual Interactive Masterclass',
      targetAudience: 'Export Managers, Commercial Leads, Business Development Executives',
      summary:
        'Equipping Ethiopian manufacturers and agro-processors to leverage preferential tariffs, rules of origin, and trade corridors across the African continent.',
      modules: [
        'AfCFTA Tariff Schedules & Rules of Origin Compliance',
        'Djibouti & Berbera Logistics Corridor Optimization',
        'Regional Currency Settlement & Cross-Border Payment Systems',
        'Distributor Network Architecture in Kenya, Sudan & East Africa',
      ],
      certification: 'AfCFTA Trade Strategy Practitioner',
      icon: GraduationCap,
    },
  ];

  const courses = [
    {
      id: 'crs-1',
      title: 'Financial Acumen for Non-Financial Executives',
      duration: '3 Days Intensive',
      category: 'Finance & Strategy',
      level: 'Mid-to-Senior Management',
      description:
        'Demystifying balance sheets, profit & loss statements, cash flow cycles, and capital budgeting for functional leaders.',
      keyTakeaways: [
        'Interpreting IFRS corporate financial statements',
        'Working capital management during foreign exchange volatility',
        'Cost-volume-profit and break-even decision analysis',
      ],
    },
    {
      id: 'crs-2',
      title: 'Performance Management & Balanced Scorecard Architecture',
      duration: '3 Days Intensive',
      category: 'Human Capital',
      level: 'HR Directors & Department Heads',
      description:
        'Translating corporate strategic objectives into cascading KPIs, OKRs, and merit-based performance reward systems.',
      keyTakeaways: [
        'Designing 4-perspective Balanced Scorecards',
        'Setting quantifiable, auditable Key Performance Indicators',
        'Conducting objective, coaching-oriented quarterly appraisals',
      ],
    },
    {
      id: 'crs-3',
      title: 'Business Process Re-engineering (BPR) & SOP Design',
      duration: '4 Days Intensive',
      category: 'Process Engineering',
      level: 'Process Owners & Operations Managers',
      description:
        'How to map existing operational workflows, eliminate bureaucratic bottlenecks, and author clear, enforceable Standard Operating Procedures.',
      keyTakeaways: [
        'Current-state workflow diagnostic mapping',
        'Eliminating authorization bottlenecks and cycle time waste',
        'Publishing compliant institutional SOP documentation',
      ],
    },
    {
      id: 'crs-4',
      title: 'Strategic Talent Acquisition & RACI Governance Matrix',
      duration: '2 Days Intensive',
      category: 'Organizational Design',
      level: 'HR Executives & Managing Directors',
      description:
        'Structuring role clarity, job grading, and organizational accountability to prevent managerial overlap and friction.',
      keyTakeaways: [
        'Drafting functional RACI accountability matrices',
        'Designing compensation frameworks aligned with Ethiopian labor codes',
        'Executive succession planning & leadership pipeline continuity',
      ],
    },
  ];

  const upcomingCohorts = [
    {
      id: 'up-1',
      title: 'Senior Executive Leadership & Strategic Governance Cohort',
      startDate: 'November 15, 2026',
      duration: '6 Weeks (Fridays & Saturdays)',
      location: 'Addis Ababa (Bole Edna Mall Business Suite)',
      format: 'In-Person & Hybrid',
      seatsRemaining: 6,
      status: 'Open for Registration',
      instructor: 'Erukneh Ademe & Visiting Senior Partners',
    },
    {
      id: 'up-2',
      title: 'Bankable Feasibility Study & Financial Modeling Workshop',
      startDate: 'December 05, 2026',
      duration: '4 Weeks (Intensive Executive Sessions)',
      location: 'Addis Ababa (In-Person Hands-On Lab)',
      format: 'In-Person Practical',
      seatsRemaining: 8,
      status: 'Open for Registration',
      instructor: 'Senior Transaction & Valuation Advisory Team',
    },
    {
      id: 'up-3',
      title: 'Corporate Strategy & Governance for the ESX Capital Market Era',
      startDate: 'January 12, 2027',
      duration: '3 Days Executive Masterclass',
      location: 'Skylight Hotel, Addis Ababa',
      format: 'Executive Retreat',
      seatsRemaining: 12,
      status: 'Pre-Registration Open',
      instructor: 'Erukneh Ademe, Managing Partner',
    },
    {
      id: 'up-4',
      title: 'AfCFTA Export Strategy & Trade Corridor Compliance',
      startDate: 'February 08, 2027',
      duration: '3 Weeks (Evening Hybrid)',
      location: 'Live Interactive Virtual Suite',
      format: 'Virtual Executive Cohort',
      seatsRemaining: 15,
      status: 'Open for Registration',
      instructor: 'Regional Trade Advisory Specialists',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 mr-1" />
              Executive Education & Corporate Academies
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Training & Executive Development
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Empowering business leaders, senior executives, and corporate management teams across Ethiopia with battle-tested strategic frameworks, bankable financial acumen, and operational excellence.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onOpenConsultation('Executive Training Cohort')}
                className="px-5 py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Enroll or Inquire for Corporate Training
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Subpage Navigation Tabs */}
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
            <span>All Programs & Overview</span>
          </button>

          <button
            onClick={() => handleTabChange('programs')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'programs'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Training Programs</span>
          </button>

          <button
            onClick={() => handleTabChange('management-courses')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'management-courses'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Management Courses</span>
          </button>

          <button
            onClick={() => handleTabChange('upcoming-training')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'upcoming-training'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Upcoming Training Calendar</span>
          </button>

          <button
            onClick={() => handleTabChange('corporate-training')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'corporate-training'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Corporate In-House Training</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 1: Flagship Training Programs */}
        {(activeTab === 'all' || activeTab === 'programs') && (
          <section id="programs" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                  Comprehensive Academies
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                  Flagship Executive Training Programs
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Intensive cohorts combining global management frameworks with ground-level Ethiopian corporate case studies.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {programs.map((prog) => {
                const IconComp = prog.icon;
                return (
                  <div
                    key={prog.id}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-[#10283F]/5 text-[#10283F] border border-[#10283F]/10">
                          {prog.category}
                        </span>
                        <div className="w-10 h-10 rounded-lg bg-[#10283F] text-[#D5A13A] flex items-center justify-center shadow">
                          <IconComp className="w-5 h-5" />
                        </div>
                      </div>

                      <h3 className="font-serif text-xl font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors">
                        {prog.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {prog.summary}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-[#D5A13A] shrink-0" />
                          <span>{prog.duration}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-[#D5A13A] shrink-0" />
                          <span>{prog.format}</span>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                          Core Curriculum Modules:
                        </h4>
                        <div className="space-y-1.5">
                          {prog.modules.map((m, mIdx) => (
                            <div key={mIdx} className="flex items-start text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-500">
                        <span className="font-bold text-slate-700">Award:</span> {prog.certification}
                      </div>
                      <button
                        onClick={() => onOpenConsultation(`Enroll: ${prog.title}`)}
                        className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded transition-colors shadow flex items-center"
                      >
                        Enroll / Inquire
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SECTION 2: Management Courses */}
        {(activeTab === 'all' || activeTab === 'management-courses') && (
          <section id="management-courses" className="space-y-8 scroll-mt-28">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                Targeted Professional Modules
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                Management & Operational Courses
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Short, high-intensity modular courses focused on immediate competency upgrades for departmental leaders and corporate managers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((crs) => (
                <div
                  key={crs.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="px-2.5 py-0.5 rounded font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        {crs.category}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {crs.duration}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#10283F]">
                      {crs.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {crs.description}
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Key Competencies Gained:
                      </p>
                      {crs.keyTakeaways.map((takeaway, tIdx) => (
                        <div key={tIdx} className="flex items-start text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                          <span>{takeaway}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Audience: {crs.level}
                    </span>
                    <button
                      onClick={() => onOpenConsultation(`Course Inquiry: ${crs.title}`)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
                    >
                      Request Syllabus &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: Upcoming Training Calendar */}
        {(activeTab === 'all' || activeTab === 'upcoming-training') && (
          <section id="upcoming-training" className="space-y-8 scroll-mt-28">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                Scheduled Cohorts
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                Upcoming Training Calendar
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Confirmed upcoming executive cohorts in Addis Ababa and interactive virtual masterclasses. Limited seats per cohort to guarantee personalized advisory attention.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#10283F] text-white uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Program & Cohort Title</th>
                      <th className="py-3.5 px-4">Start Date</th>
                      <th className="py-3.5 px-4">Duration & Location</th>
                      <th className="py-3.5 px-4">Availability</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {upcomingCohorts.map((cohort) => (
                      <tr key={cohort.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-4 font-semibold text-slate-900 max-w-xs">
                          <div>{cohort.title}</div>
                          <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                            Lead Faculty: {cohort.instructor}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap font-medium text-[#10283F]">
                          <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D5A13A]" />
                            <span>{cohort.startDate}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>{cohort.duration}</div>
                          <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                            {cohort.location}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {cohort.seatsRemaining} Seats Open
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onOpenConsultation(`Register: ${cohort.title} (${cohort.startDate})`)}
                            className="px-3.5 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#c4912e] rounded shadow transition-colors"
                          >
                            Reserve Seat
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Corporate Training */}
        {(activeTab === 'all' || activeTab === 'corporate-training') && (
          <section id="corporate-training" className="space-y-8 scroll-mt-28">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                Custom Enterprise Academies
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                Bespoke Corporate & In-House Training
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                We author customized executive development curricula built around your firm's specific operating models, commercial bottlenecks, and strategic targets.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#10283F] to-[#153452] text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-700">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-widest">
                    Enterprise Capability Building
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Transforming Corporate Teams From The Inside Out
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    Standard off-the-shelf courses rarely move enterprise needles. Our bespoke corporate training engagements commence with a diagnostic review of your organization's performance gaps, followed by hands-on workshops that solve real commercial dilemmas facing your business today.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-bold text-sm text-[#D5A13A] flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Customized Case Studies
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Curriculum designed using your own company financials, supply chain metrics, and commercial realities.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <h4 className="font-bold text-sm text-[#D5A13A] flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Post-Training Performance Audits
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Quarterly follow-ups to measure KPI improvements and ensure behavioral adoption across management teams.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white/10 p-6 rounded-xl border border-white/10 text-center space-y-4 backdrop-blur-sm">
                  <h4 className="font-serif text-lg font-bold text-white">
                    Request an In-House Corporate Proposal
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Discuss your corporate upskilling priorities with our managing partner.
                  </p>
                  <button
                    onClick={() => onOpenConsultation('Bespoke Corporate In-House Training Proposal')}
                    className="w-full py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-lg transition-all"
                  >
                    Request Custom Training Proposal
                  </button>
                  <div className="text-[11px] text-slate-400">
                    Confidential executive consultation in Addis Ababa or virtually.
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
