import React, { useState } from 'react';
import { ProjectItem, NavigationPage } from '../../types';
import {
  Briefcase,
  Layers,
  TrendingUp,
  CheckCircle2,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  Target,
  Sparkles,
} from 'lucide-react';

interface PortfolioViewProps {
  projects: ProjectItem[];
  onOpenConsultation: (projectTitle?: string) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  projects,
  onOpenConsultation,
}) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Derive unique tags
  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.tags || [])))];

  const filteredProjects = projects.filter((p) => {
    return selectedTag === 'All' || p.tags?.includes(selectedTag);
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 mr-1" />
              Verified Case Studies & Engagements
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Projects & Strategic Portfolio
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Examine our real-world advisory track record across manufacturing industrial parks, regional trade corridors, banking recapitalizations, and multilateral programs in Ethiopia.
            </p>
          </div>
        </div>
      </section>

      {/* Tag Filters */}
      <section className="py-6 bg-white border-b border-slate-200 sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-2 overflow-x-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-[#10283F] text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden flex flex-col group hover:-translate-y-1"
              >
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-[#10283F]/85 backdrop-blur-sm text-[#D5A13A] text-[10px] font-bold px-2.5 py-1 rounded">
                    {project.client}
                  </div>
                  {project.impactMetrics && (
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm text-[#10283F] p-2 rounded text-[11px] font-semibold truncate shadow">
                      🎯 {project.impactMetrics}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-[#10283F] group-hover:text-[#b88528] transition-colors line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {project.summary}
                    </p>
                  </div>

                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="text-xs font-semibold text-[#10283F] hover:text-[#b88528] flex items-center transition-colors"
                    >
                      Case Study Dossier
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                    <button
                      onClick={() => onOpenConsultation(project.title)}
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

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in">
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl text-slate-900 overflow-hidden my-8 border border-slate-300">
            <div className="relative h-60 sm:h-72 bg-[#10283F] overflow-hidden">
              <img
                src={selectedProject.coverImageUrl}
                alt={selectedProject.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10283F] via-[#10283F]/70 to-transparent" />
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white hover:text-[#D5A13A] p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[#D5A13A] text-xs font-bold uppercase tracking-wider block">
                  Client: {selectedProject.client}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                  {selectedProject.title}
                </h2>
                {selectedProject.impactMetrics && (
                  <p className="text-xs text-amber-200 mt-2 font-medium">
                    Verified Outcomes: {selectedProject.impactMetrics}
                  </p>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="p-4 bg-slate-50 border-l-4 border-[#b88528] rounded-r text-sm text-slate-700 italic">
                {selectedProject.summary}
              </div>

              <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-4">
                {selectedProject.description.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="font-serif text-xl font-bold text-[#10283F] pt-2">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('#### ')) {
                    return (
                      <h4 key={pIdx} className="font-serif text-base font-bold text-[#10283F] pt-1">
                        {paragraph.replace('#### ', '')}
                      </h4>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-slate-700">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Facing a similar enterprise growth challenge?
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const title = selectedProject.title;
                    setSelectedProject(null);
                    onOpenConsultation(title);
                  }}
                  className="px-5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Inquire on Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
