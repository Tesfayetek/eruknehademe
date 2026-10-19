import React, { useState } from 'react';
import { Industry, NavigationPage } from '../../types';
import {
  Building2,
  Factory,
  Truck,
  Wheat,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';

interface IndustriesViewProps {
  industries: Industry[];
  onOpenConsultation: () => void;
}

export const IndustriesView: React.FC<IndustriesViewProps> = ({
  industries,
  onOpenConsultation,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Factory':
        return <Factory className="w-5 h-5 text-[#D5A13A]" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#D5A13A]" />;
      case 'Wheat':
        return <Wheat className="w-5 h-5 text-[#D5A13A]" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-[#D5A13A]" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-[#D5A13A]" />;
      default:
        return <Building2 className="w-5 h-5 text-[#D5A13A]" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Sector Specialization
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Industries We Serve
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Domain-specific strategic insights for manufacturing hubs, agricultural value chains, regional trade corridors, and high-growth ventures across Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind) => (
              <div
                key={ind.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={ind.coverImageUrl}
                    alt={ind.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg bg-[#10283F]/90 backdrop-blur-sm flex items-center justify-center shadow">
                    {getIndustryIcon(ind.icon)}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors">
                      {ind.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ind.summary}
                    </p>
                  </div>

                  {ind.highlights && ind.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                        Key Advisory Focus:
                      </p>
                      {ind.highlights.slice(0, 2).map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{h}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedIndustry(ind)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
                    >
                      Industry Overview
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                    <button
                      onClick={() => onOpenConsultation()}
                      className="px-3 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A]/20 hover:bg-[#D5A13A] rounded transition-colors"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Detail Modal */}
      {selectedIndustry && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl text-slate-900 overflow-hidden my-8 border border-slate-300">
            <div className="relative h-48 bg-[#10283F] overflow-hidden">
              <img
                src={selectedIndustry.coverImageUrl}
                alt={selectedIndustry.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10283F] via-[#10283F]/70 to-transparent" />
              <button
                onClick={() => setSelectedIndustry(null)}
                className="absolute top-4 right-4 text-white hover:text-[#D5A13A] p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-5 left-6 right-6">
                <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-wider block">
                  Industry Specialization
                </span>
                <h2 className="font-serif text-2xl font-bold text-white tracking-tight mt-1">
                  {selectedIndustry.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="font-serif text-base font-bold text-[#10283F] mb-2">
                  Market Context & Advisory Practice
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedIndustry.description || selectedIndustry.summary}
                </p>
              </div>

              {selectedIndustry.highlights && selectedIndustry.highlights.length > 0 && (
                <div>
                  <h3 className="font-serif text-base font-bold text-[#10283F] mb-3">
                    Sector Highlights & Value Drivers
                  </h3>
                  <div className="space-y-2">
                    {selectedIndustry.highlights.map((h, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-start space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#b88528] shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Strategic counsel adapted to Ethiopian regulatory frameworks.
              </span>
              <button
                onClick={() => {
                  setSelectedIndustry(null);
                  onOpenConsultation();
                }}
                className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
              >
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Schedule Sector Briefing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
