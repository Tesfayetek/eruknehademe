import React, { useState, useEffect } from 'react';
import { Article, ProjectItem, NavigationPage } from '../../types';
import {
  Search,
  Clock,
  Calendar,
  User,
  ArrowRight,
  Tag,
  Share2,
  X,
  Bookmark,
  ChevronRight,
  BookOpen,
  Briefcase,
  Send,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export type InsightsSubpage = 'all' | 'articles-resources' | 'case-studies' | 'news-updates';

interface InsightsViewProps {
  articles: Article[];
  projects?: ProjectItem[];
  subpage?: string;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  onNavigate?: (page: NavigationPage, subpageOrSlug?: string, targetUrl?: string) => void;
  onOpenConsultation: (topic?: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  articles,
  projects = [],
  subpage = 'all',
  selectedArticle,
  onSelectArticle,
  onNavigate,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<InsightsSubpage>((subpage as InsightsSubpage) || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<ProjectItem | null>(null);

  useEffect(() => {
    if (subpage) {
      setActiveTab((subpage as InsightsSubpage) || 'all');
    }
  }, [subpage]);

  const handleTabChange = (tab: InsightsSubpage) => {
    setActiveTab(tab);
    const url = tab === 'all' ? '/insights' : `/insights/${tab}`;
    if (onNavigate) {
      onNavigate('insights', tab === 'all' ? undefined : tab, url);
    }
  };

  // Derive unique categories from articles
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const newsItems = [
    {
      id: 'news-1',
      title: 'Erukneh Ademe Consulting Announces AfCFTA Regional Advisory Practice',
      date: 'October 12, 2026',
      category: 'Firm News',
      summary:
        'Expanding our cross-border advisory team to assist Ethiopian manufacturers in structuring duty-free exports along the Djibouti and Berbera trade corridors.',
    },
    {
      id: 'news-2',
      title: 'Advisory Memorandum: Key Implications of the New NBE Foreign Exchange Directives',
      date: 'September 28, 2026',
      category: 'Regulatory Briefing',
      summary:
        'A comprehensive strategic summary for chief executives on managing foreign currency conversion, interbank FX hedging, and working capital safeguards.',
    },
    {
      id: 'news-3',
      title: 'Ethiopian Securities Exchange (ESX) Pre-Listing Readiness Gateways Launched',
      date: 'August 19, 2026',
      category: 'Capital Markets',
      summary:
        'Our corporate finance practice announces formal readiness audits for commercial banks and private share companies preparing for public listing.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Strategic Intelligence Hub
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Insights & Thought Leadership
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In-depth strategic analyses, bankable case studies, and actionable executive briefings on Ethiopia, the Horn of Africa, and regional economic integration.
            </p>
          </div>
        </div>
      </section>

      {/* Subpage Tabs Navigation */}
      <section className="bg-white border-b border-slate-200 sticky top-16 sm:top-20 z-30 shadow-sm">
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
            <span>All Insights</span>
          </button>

          <button
            onClick={() => handleTabChange('articles-resources')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'articles-resources'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Articles & Resources</span>
          </button>

          <button
            onClick={() => handleTabChange('case-studies')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'case-studies'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Case Studies</span>
          </button>

          <button
            onClick={() => handleTabChange('news-updates')}
            className={`py-3 sm:py-4 px-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeTab === 'news-updates'
                ? 'border-[#D5A13A] text-[#10283F] font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>News & Updates</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* SECTION 1: Articles & Resources */}
        {(activeTab === 'all' || activeTab === 'articles-resources') && (
          <section id="articles-resources" className="space-y-8 scroll-mt-28">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                  Research & Thought Leadership
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                  Articles & Executive Briefings
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Peer-reviewed strategic publications authored by senior consulting partners.
                </p>
              </div>

              {/* Search within articles */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter articles..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#D5A13A]"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#10283F] text-white shadow-sm'
                      : 'bg-slate-200/70 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((art) => (
                <article
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer"
                  onClick={() => onSelectArticle(art)}
                >
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={art.featuredImageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-[#10283F]/90 backdrop-blur-sm text-[#D5A13A] shadow">
                          {art.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-[#D5A13A]" />
                          {new Date(art.publishedAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-slate-400" />
                          {art.readTimeMinutes} min read
                        </span>
                      </div>

                      <h3 className="font-serif text-base sm:text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                    <span className="text-[11px] font-medium text-slate-500">
                      By {art.author}
                    </span>
                    <span className="text-xs font-semibold text-[#10283F] group-hover:text-[#b88528] flex items-center">
                      Read Article &rarr;
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: Case Studies */}
        {(activeTab === 'all' || activeTab === 'case-studies') && (
          <section id="case-studies" className="space-y-8 scroll-mt-28">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                Verified Ground Impact
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                Featured Client Case Studies & Transaction Records
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Demonstrated commercial results delivering project finance, operational turnarounds, and cross-border trade readiness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(projects.length > 0
                ? projects
                : [
                    {
                      id: 'cs-1',
                      title: '$42M Kilinto Industrial Park Agro-Chemical Facility Feasibility & Financing',
                      slug: 'kilinto-agro-chemical-facility',
                      client: 'Abyssinia Chemical & Pharmaceutical Consortium',
                      summary:
                        'A bankable technical and economic feasibility study that secured long-term credit from Development Bank of Ethiopia and private equity co-financiers.',
                      impactMetrics: '$42M Debt & Equity Raised • 320 Industrial Jobs Created • 18% IRR',
                      coverImageUrl:
                        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
                      tags: ['Manufacturing', 'Feasibility Study', 'Project Finance'],
                    },
                    {
                      id: 'cs-2',
                      title: 'Cross-Border Djibouti Corridor Logistics Modernization & AfCFTA Readiness',
                      slug: 'djibouti-corridor-logistics-modernization',
                      client: 'Horn Freight & Multimodal Logistics S.C.',
                      summary:
                        'End-to-end supply chain re-engineering that curtailed customs dwell times by 38% and integrated GPS fleet telematics along the Addis-Djibouti transit corridor.',
                      impactMetrics: '38% Dwell Time Reduction • $3.4M Annualized Fuel & Demurrage Savings',
                      coverImageUrl:
                        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
                      tags: ['Supply Chain', 'Logistics', 'AfCFTA', 'Process Optimization'],
                    },
                  ]
              ).map((cs: any) => (
                <div
                  key={cs.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={cs.coverImageUrl}
                        alt={cs.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#D5A13A]">
                          Client: {cs.client}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <h3 className="font-serif text-lg font-bold text-[#10283F]">
                        {cs.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cs.summary}
                      </p>

                      {cs.impactMetrics && (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-semibold flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Impact: {cs.impactMetrics}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {cs.tags?.map((t: string, tIdx: number) => (
                        <span
                          key={tIdx}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => onOpenConsultation(`Case Study Discussion: ${cs.title}`)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center"
                    >
                      Inquire Mandate &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: News & Updates */}
        {(activeTab === 'all' || activeTab === 'news-updates') && (
          <section id="news-updates" className="space-y-8 scroll-mt-28">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block mb-1">
                Firm Bulletins & Media
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#10283F]">
                Firm News, Press Releases & Regulatory Updates
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Official announcements from Erukneh Ademe Business Consulting regarding practice expansions and policy changes.
              </p>
            </div>

            <div className="space-y-4">
              {newsItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                      <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-[#D5A13A]" />
                        {item.date}
                      </span>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#10283F]">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => onOpenConsultation(`News Briefing Inquiry: ${item.title}`)}
                      className="px-4 py-2 text-xs font-semibold text-[#10283F] bg-slate-100 hover:bg-[#D5A13A] rounded border border-slate-300 hover:border-[#D5A13A] transition-colors whitespace-nowrap"
                    >
                      Connect with Media Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Article Detail Reading Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl text-slate-900 overflow-hidden my-8 border border-slate-300">
            {/* Modal Header Cover */}
            <div className="relative h-64 sm:h-72 bg-[#10283F] overflow-hidden">
              <img
                src={selectedArticle.featuredImageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10283F] via-[#10283F]/70 to-transparent" />
              <button
                onClick={() => onSelectArticle(null)}
                className="absolute top-4 right-4 text-white hover:text-[#D5A13A] p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-wider block">
                  {selectedArticle.category} &bull; {selectedArticle.readTimeMinutes} Min Read
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-300 mt-2">
                  Published by {selectedArticle.author} ({selectedArticle.authorRole}) &bull;{' '}
                  {new Date(selectedArticle.publishedAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="border-l-4 border-[#D5A13A] pl-4 py-1 bg-amber-50/50 rounded-r text-sm text-slate-800 font-medium italic">
                {selectedArticle.summary}
              </div>

              <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-line font-serif text-sm">
                {selectedArticle.content}
              </div>

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {selectedArticle.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded text-xs bg-slate-100 text-slate-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                Discuss these strategic findings with our consulting team.
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => onSelectArticle(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedArticle.title;
                    onSelectArticle(null);
                    onOpenConsultation(`Insight Discussion: ${title}`);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
                >
                  Consult Managing Partner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
