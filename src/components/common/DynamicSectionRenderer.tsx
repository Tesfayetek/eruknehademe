import React from 'react';
import { PageSectionItem, NavigationPage } from '../../types';
import { ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

interface DynamicSectionRendererProps {
  sections: PageSectionItem[];
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  sections,
  onNavigate,
  onOpenConsultation,
}) => {
  const visibleSections = sections.filter((s) => s.isVisible && s.status === 'published');

  if (visibleSections.length === 0) return null;

  return (
    <div className="space-y-0">
      {visibleSections.map((sec) => {
        const isDark = sec.backgroundColor && sec.backgroundColor.toLowerCase().includes('#10283f');
        const bgStyle = sec.backgroundColor ? { backgroundColor: sec.backgroundColor } : {};

        return (
          <section
            key={sec.id}
            style={bgStyle}
            className={`py-16 sm:py-20 border-t border-slate-200/60 ${
              isDark ? 'text-white' : 'text-slate-900 bg-white'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Type 1: Image & Text Split */}
              {sec.sectionType === 'image-text' && (
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${
                    sec.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className="lg:col-span-7 space-y-4">
                    {sec.subtitle && (
                      <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block">
                        {sec.subtitle}
                      </span>
                    )}
                    <h2
                      className={`font-serif text-2xl sm:text-4xl font-bold tracking-tight ${
                        isDark ? 'text-white' : 'text-[#10283F]'
                      }`}
                    >
                      {sec.title}
                    </h2>
                    {sec.body && (
                      <p
                        className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                          isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {sec.body}
                      </p>
                    )}
                    {sec.buttonText && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            if (sec.buttonUrl === 'consultation') onOpenConsultation();
                            else onNavigate((sec.buttonUrl as any) || 'contact');
                          }}
                          className="px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
                        >
                          {sec.buttonText}
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {sec.imageUrl && (
                    <div className="lg:col-span-5">
                      <div className="rounded-xl overflow-hidden shadow-xl border border-slate-200 aspect-[4/3]">
                        <img
                          src={sec.imageUrl}
                          alt={sec.imageAlt || sec.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Type 2: Text / Narrative Centered */}
              {sec.sectionType === 'text' && (
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  {sec.subtitle && (
                    <span className="text-[#b88528] text-xs font-bold uppercase tracking-widest block">
                      {sec.subtitle}
                    </span>
                  )}
                  <h2
                    className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${
                      isDark ? 'text-white' : 'text-[#10283F]'
                    }`}
                  >
                    {sec.title}
                  </h2>
                  {sec.body && (
                    <p
                      className={`text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {sec.body}
                    </p>
                  )}
                  {sec.buttonText && (
                    <div className="pt-3">
                      <button
                        onClick={() => {
                          if (sec.buttonUrl === 'consultation') onOpenConsultation();
                          else onNavigate((sec.buttonUrl as any) || 'contact');
                        }}
                        className="px-6 py-2.5 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all inline-flex items-center"
                      >
                        {sec.buttonText}
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Type 3: Call to Action Banner */}
              {sec.sectionType === 'cta' && (
                <div className="bg-[#10283F] text-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl text-center md:text-left">
                    <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-widest block">
                      {sec.subtitle || 'Executive Strategic Advisory'}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                      {sec.title}
                    </h3>
                    {sec.body && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {sec.body}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (sec.buttonUrl === 'consultation') onOpenConsultation();
                      else onNavigate((sec.buttonUrl as any) || 'contact');
                    }}
                    className="px-6 py-3 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-lg transition-all shrink-0 flex items-center"
                  >
                    {sec.buttonText || 'Schedule Briefing'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
