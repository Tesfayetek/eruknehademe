import React, { useState } from 'react';
import { Article, NavigationPage } from '../../types';
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
} from 'lucide-react';

interface InsightsViewProps {
  articles: Article[];
  selectedArticle: Article | null;
  onSelectArticle: (article: Article | null) => void;
  onOpenConsultation: (topic?: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  articles,
  selectedArticle,
  onSelectArticle,
  onOpenConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Derive unique categories
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter((a) => {
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              Strategic Intelligence Hub
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Insights & Thought Leadership
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              In-depth strategic analyses, macroeconomic commentary, and actionable management perspectives on Ethiopia, the Horn of Africa, and regional trade integration.
            </p>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 bg-white border-b border-slate-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#10283F] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-[#D5A13A] focus:bg-white transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-slate-700">No Insights Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try refining your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
                        <span>
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium">{article.author}</span>
                      </div>
                      <span className="text-xs font-semibold text-[#10283F] group-hover:text-[#b88528] flex items-center">
                        Read Article
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Detail View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl text-slate-900 overflow-hidden my-8 border border-slate-300">
            {/* Cover Banner */}
            <div className="relative h-64 sm:h-80 bg-[#10283F] overflow-hidden">
              <img
                src={selectedArticle.featuredImageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10283F] via-[#10283F]/60 to-transparent" />
              <button
                onClick={() => onSelectArticle(null)}
                className="absolute top-4 right-4 text-white hover:text-[#D5A13A] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-wider block">
                  {selectedArticle.category} &bull; {selectedArticle.readTimeMinutes} min read
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  {selectedArticle.title}
                </h1>
                <div className="flex items-center text-xs text-slate-300 mt-2 space-x-4">
                  <span>By {selectedArticle.author} ({selectedArticle.authorRole})</span>
                  <span>&bull;</span>
                  <span>{new Date(selectedArticle.publishedAt || selectedArticle.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-6 sm:p-10 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="p-4 bg-slate-50 border-l-4 border-[#b88528] rounded-r-md text-sm text-slate-700 italic">
                {selectedArticle.summary}
              </div>

              <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-4">
                {selectedArticle.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="font-serif text-xl font-bold text-[#10283F] pt-4">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={pIdx} className="font-serif text-lg font-bold text-[#10283F] pt-2">
                        {paragraph.replace('#### ', '')}
                      </h4>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-slate-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {selectedArticle.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom CTA */}
            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600">
                Interested in strategic advisory on this subject?
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => onSelectArticle(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onSelectArticle(null);
                    onOpenConsultation(selectedArticle.title);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
                >
                  Discuss with Author
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
