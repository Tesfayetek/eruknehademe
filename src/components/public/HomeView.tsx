import React from 'react';
import {
  SiteSettings,
  Service,
  Industry,
  Article,
  Testimonial,
  NavigationPage,
  PageSectionItem,
} from '../../types';
import { DynamicSectionRenderer } from '../common/DynamicSectionRenderer';
import {
  TrendingUp,
  Briefcase,
  DollarSign,
  FileText,
  Search,
  Layers,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building,
  Shield,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react';

interface HomeViewProps {
  settings: SiteSettings;
  services: Service[];
  industries: Industry[];
  articles: Article[];
  testimonials: Testimonial[];
  pageSections?: PageSectionItem[];
  onNavigate: (page: NavigationPage, param?: string) => void;
  onOpenConsultation: (serviceSlug?: string) => void;
  onSelectService: (service: Service) => void;
  onSelectArticle: (article: Article) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  settings,
  services,
  industries,
  articles,
  testimonials,
  pageSections = [],
  onNavigate,
  onOpenConsultation,
  onSelectService,
  onSelectArticle,
}) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-[#D5A13A]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 text-[#D5A13A]" />;
      case 'DollarSign':
        return <DollarSign className="w-6 h-6 text-[#D5A13A]" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-[#D5A13A]" />;
      case 'Search':
        return <Search className="w-6 h-6 text-[#D5A13A]" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-[#D5A13A]" />;
      default:
        return <Briefcase className="w-6 h-6 text-[#D5A13A]" />;
    }
  };

  const heroBadge = settings.heroBadge || 'Premier Advisory • Addis Ababa & East Africa';
  const heroTitle = settings.heroTitle || 'Build a Stronger Business. Achieve Sustainable Growth.';
  const heroSubtitle =
    settings.heroSubtitle ||
    'Strategic insights and practical consulting solutions to help your organization grow, improve performance, and seize new opportunities in Ethiopia and beyond.';
  const heroPrimaryBtn = settings.heroPrimaryBtnText || 'Explore Our Services';
  const heroSecondaryBtn = settings.heroSecondaryBtnText || 'Book a Consultation';

  return (
    <div className="space-y-0">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#10283F] text-white overflow-hidden min-h-[580px] lg:min-h-[660px] flex items-center">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D5A13A_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#173859]/50 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/10 border border-[#D5A13A]/30 text-xs font-semibold text-[#D5A13A]">
                <Shield className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                <span>{heroBadge}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                {heroTitle}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate((settings.heroPrimaryBtnTarget as any) || 'services')}
                  className="px-6 py-3.5 text-sm font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow-lg shadow-black/30 hover:shadow-[#D5A13A]/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {heroPrimaryBtn}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => onOpenConsultation()}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-[#173859] hover:bg-[#1f4b75] border border-slate-600 rounded-md transition-all flex items-center justify-center"
                >
                  <Calendar className="w-4 h-4 mr-2 text-[#D5A13A]" />
                  {heroSecondaryBtn}
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <span className="block font-serif text-lg sm:text-xl font-bold text-white">18+</span>
                  <span>Years Advisory</span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-xl font-bold text-[#D5A13A]">140+</span>
                  <span>Completed Projects</span>
                </div>
                <div>
                  <span className="block font-serif text-lg sm:text-xl font-bold text-white">$95M+</span>
                  <span>Capital Facilitated</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Gold frame accent */}
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-[#D5A13A]/40 via-transparent to-[#10283F] opacity-75 blur-sm" />
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 aspect-[4/3] sm:aspect-[5/4]">
                  <img
                    src={
                      settings.heroImageUrl ||
                      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
                    }
                    alt={settings.companyName}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10283F]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#10283F]/90 backdrop-blur-md p-3.5 rounded-lg border border-slate-700">
                    <p className="text-xs font-semibold text-[#D5A13A] uppercase tracking-wider">
                      Addis Ababa &bull; East African Trade Hub
                    </p>
                    <p className="text-xs text-slate-200 mt-0.5">
                      Ground-level operational execution aligned with international standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & CREDENTIALS STRIP */}
      <section className="bg-[#0a1826] text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {settings.stats?.map((stat, idx) => (
              <div key={idx} className="pt-4 md:pt-0 px-4 space-y-1">
                <div className="font-serif text-3xl sm:text-4xl font-bold text-[#D5A13A]">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-white">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC CUSTOM SECTIONS (Configured via Section Builder) */}
      {pageSections.length > 0 && (
        <DynamicSectionRenderer
          sections={pageSections}
          onNavigate={onNavigate}
          onOpenConsultation={onOpenConsultation}
        />
      )}

      {/* 4. SERVICES OVERVIEW */}
      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
              Core Practice Areas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
              Comprehensive Consulting Solutions
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              We provide end-to-end strategic, operational, and financial consulting services tailored to the unique economic dynamics of Ethiopia and regional markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={service.coverImageUrl}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-11 h-11 rounded-lg bg-[#10283F]/90 backdrop-blur-sm flex items-center justify-center shadow-md">
                    {getIconComponent(service.icon)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {service.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectService(service)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
                    >
                      View Deliverables
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                    <button
                      onClick={() => onOpenConsultation(service.title)}
                      className="px-3 py-1.5 text-xs font-medium text-[#10283F] bg-[#D5A13A]/20 hover:bg-[#D5A13A] rounded transition-colors"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('services')}
              className="inline-flex items-center px-6 py-3 rounded-md text-sm font-semibold text-white bg-[#10283F] hover:bg-[#173859] shadow transition-colors"
            >
              Explore All Consulting Practices
              <ArrowRight className="w-4 h-4 ml-2 text-[#D5A13A]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. ABOUT THE COMPANY INTRODUCTION */}
      <section className="py-20 bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Founder Visual and Credential badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-100 aspect-[4/5] bg-slate-100">
                  <img
                    src={
                      settings.founderImageUrl ||
                      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={settings.founderName || 'Erukneh Ademe, Managing Partner'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                {/* Floating quote card */}
                <div className="absolute -bottom-6 -right-4 sm:right-2 bg-[#10283F] text-white p-5 rounded-lg shadow-xl max-w-xs border border-slate-700">
                  <div className="flex items-center space-x-1 text-[#D5A13A] mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#D5A13A]" />
                    ))}
                  </div>
                  <p className="text-xs italic text-slate-200 leading-snug">
                    "Sustainable growth is achieved when visionary strategy is paired with relentless operational execution."
                  </p>
                  <p className="text-[11px] font-semibold text-[#D5A13A] mt-2">
                    — {settings.founderName || 'Erukneh Ademe'}
                  </p>
                </div>
              </div>
            </div>

            {/* About Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                  {settings.aboutBadge || 'About Our Firm'}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight mt-1">
                  {settings.aboutTitle || 'Bridging Vision with Practical Execution'}
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {settings.aboutSummary ||
                  'Erukneh Ademe Business Consulting is a premier strategic advisory firm headquartered in Addis Ababa, Ethiopia. We bridge the gap between visionary ambition and on-the-ground operational execution, helping domestic enterprises, international investors, and development agencies succeed in East Africa’s rapidly evolving economic landscape.'}
              </p>

              {/* Verified Achievements & Differentiators */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#b88528] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#10283F]">
                      Certified Management Consulting Frameworks
                    </h4>
                    <p className="text-xs text-slate-600">
                      We operate strictly under internationally accepted consulting ethics and financial accounting rigor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#b88528] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#10283F]">
                      Ethiopian Capital Market & Bankable Feasibility
                    </h4>
                    <p className="text-xs text-slate-600">
                      Proven track record preparing firms for the Ethiopian Securities Exchange (ESX) and commercial bank credit approval.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-[#b88528] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#10283F]">
                      Deep Regional Context & AfCFTA Readiness
                    </h4>
                    <p className="text-xs text-slate-600">
                      Field-tested insights across Addis Ababa, industrial parks (Hawassa, Kilinto), and cross-border trade corridors.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors"
                >
                  Meet Founder & Learn Methodology
                </button>
                <button
                  onClick={() => onNavigate('portfolio')}
                  className="text-xs font-semibold text-[#b88528] hover:text-[#916215] flex items-center"
                >
                  View Verified Project Case Studies
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. STRATEGIC INDUSTRIES SERVED */}
      <section className="py-20 bg-[#10283F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-widest">
              Sector Expertise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Industries We Empower
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Specialized domain knowledge across key sectors driving the Ethiopian economic renaissance and regional East African trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.slice(0, 6).map((ind) => (
              <div
                key={ind.id}
                className="bg-[#173859]/70 rounded-xl border border-slate-700/80 p-6 hover:bg-[#173859] transition-all hover:border-[#D5A13A]/50 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-[#D5A13A]/20 border border-[#D5A13A]/30 flex items-center justify-center text-[#D5A13A]">
                    <Building className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">{ind.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{ind.summary}</p>
                  {ind.highlights && ind.highlights.length > 0 && (
                    <ul className="space-y-1.5 pt-2 border-t border-slate-700">
                      {ind.highlights.slice(0, 2).map((h, i) => (
                        <li key={i} className="text-[11px] text-slate-400 flex items-start">
                          <span className="text-[#D5A13A] mr-1.5">&bull;</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-6 mt-4">
                  <button
                    onClick={() => onNavigate('industries')}
                    className="text-xs font-semibold text-[#D5A13A] hover:text-[#e6b956] flex items-center transition-colors"
                  >
                    Explore Sector Solutions
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CLIENT TESTIMONIALS */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-widest">
              Executive Endorsements
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Trusted by Leaders Across the Region
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#10283F] p-7 rounded-xl border border-slate-700/80 flex flex-col justify-between shadow-lg relative"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-1 text-[#D5A13A]">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D5A13A]" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center space-x-3.5">
                  <img
                    src={test.avatarUrl}
                    alt={test.clientName}
                    className="w-11 h-11 rounded-full object-cover border border-[#D5A13A]/50"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{test.clientName}</h4>
                    <p className="text-[11px] text-[#D5A13A]">{test.clientTitle}</p>
                    <p className="text-[10px] text-slate-400">{test.clientCompany}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST INSIGHTS & THOUGHT LEADERSHIP */}
      <section className="py-20 bg-slate-50 text-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest">
                Knowledge & Research
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight mt-1">
                Strategic Insights
              </h2>
            </div>
            <button
              onClick={() => onNavigate('insights')}
              className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
            >
              Browse All Articles
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group cursor-pointer"
                onClick={() => onSelectArticle(article)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={article.featuredImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 bg-[#10283F]/80 text-[#D5A13A] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-[11px] text-slate-400 space-x-2">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTimeMinutes} min read</span>
                      <span>&bull;</span>
                      <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#10283F] group-hover:text-[#b88528] flex items-center">
                      Read Full Analysis
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                    <span className="text-[11px] text-slate-500">{article.author}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
