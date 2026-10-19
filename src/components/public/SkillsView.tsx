import React, { useState } from 'react';
import {
  SkillItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  NavigationPage,
} from '../../types';
import {
  Award,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  Calendar,
  FileText,
  Building,
  ArrowRight,
} from 'lucide-react';

interface SkillsViewProps {
  skills: SkillItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
}

export const SkillsView: React.FC<SkillsViewProps> = ({
  skills,
  experience,
  education,
  certifications,
  onNavigate,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'credentials'>('skills');

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* Header Banner */}
      <section className="bg-[#10283F] text-white py-16 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#D5A13A] text-xs font-semibold">
              <Award className="w-3.5 h-3.5 mr-1" />
              Executive Profile & Proven Track Record
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Skills, Experience & Credentials
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore 18+ years of seasoned advisory experience spanning corporate strategy, multi-million dollar capital facilitation, and board-level fiduciary leadership across East Africa.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => onNavigate('resume')}
                className="px-4 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded shadow hover:shadow-md transition-all flex items-center"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                View Full Executive CV
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      <section className="bg-white border-b border-slate-200 sticky top-20 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'skills'
                ? 'border-[#D5A13A] text-[#10283F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#b88528]" />
            <span>Core Competencies & Skills ({skills.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('experience')}
            className={`py-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'experience'
                ? 'border-[#D5A13A] text-[#10283F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4 text-[#b88528]" />
            <span>Career Milestones & Roles ({experience.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('credentials')}
            className={`py-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'credentials'
                ? 'border-[#D5A13A] text-[#10283F]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#b88528]" />
            <span>Education & Certifications ({education.length + certifications.length})</span>
          </button>
        </div>
      </section>

      {/* Main Content Areas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* SUBTAB 1: SKILLS */}
        {activeTab === 'skills' && (
          <div className="space-y-12">
            {categories.map((category) => {
              const catSkills = skills.filter((s) => s.category === category);
              return (
                <div key={category} className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D5A13A]" />
                    <h3 className="font-serif text-xl font-bold text-[#10283F]">
                      {category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catSkills.map((sk) => (
                      <div key={sk.id} className="space-y-2 p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex justify-between items-center text-xs font-bold text-[#10283F]">
                          <span>{sk.name}</span>
                          <span className="text-[#b88528] font-mono">{sk.proficiency}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#10283F] to-[#D5A13A] h-full rounded-full transition-all duration-500"
                            style={{ width: `${sk.proficiency}%` }}
                          />
                        </div>
                        {sk.description && (
                          <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {sk.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 2: CAREER TIMELINE */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            <div className="relative border-l-2 border-[#D5A13A] ml-4 md:ml-32 space-y-10 pl-6 md:pl-8">
              {experience.map((exp, idx) => (
                <div key={exp.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <div className="absolute -left-[33px] md:-left-[41px] top-1.5 w-6 h-6 rounded-full bg-[#10283F] border-2 border-[#D5A13A] flex items-center justify-center text-white">
                    <Briefcase className="w-3 h-3 text-[#D5A13A]" />
                  </div>

                  {/* Left Period on Desktop */}
                  <div className="hidden md:block absolute -left-36 top-1.5 w-28 text-right font-mono text-xs font-bold text-[#b88528]">
                    {exp.period}
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 group-hover:border-[#D5A13A]/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#10283F]">
                          {exp.role}
                        </h4>
                        <p className="text-xs font-semibold text-slate-700">
                          {exp.company} &bull; <span className="font-normal text-slate-500">{exp.location}</span>
                        </p>
                      </div>
                      <div className="md:hidden font-mono text-xs text-[#b88528] font-bold">
                        {exp.period}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {exp.summary}
                    </p>

                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        {exp.achievements.map((ach, aIdx) => (
                          <div key={aIdx} className="flex items-start text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#b88528] mr-2 shrink-0 mt-0.5" />
                            <span>{ach}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: EDUCATION & CERTIFICATIONS */}
        {activeTab === 'credentials' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <GraduationCap className="w-5 h-5 text-[#b88528]" />
                <h3 className="font-serif text-xl font-bold text-[#10283F]">
                  Academic Education
                </h3>
              </div>

              <div className="space-y-5">
                {education.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[11px] font-mono text-[#b88528] font-bold block">
                      Class of {edu.graduationYear}
                    </span>
                    <h4 className="font-serif text-base font-bold text-[#10283F]">
                      {edu.degree} in {edu.field}
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      {edu.institution}
                    </p>
                    {edu.honors && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] rounded bg-emerald-100 text-emerald-800 font-semibold">
                        {edu.honors}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Regulatory Accreditations */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <Shield className="w-5 h-5 text-[#b88528]" />
                <h3 className="font-serif text-xl font-bold text-[#10283F]">
                  Certifications & Accreditations
                </h3>
              </div>

              <div className="space-y-4">
                {certifications.map((cert) => (
                  <div key={cert.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Accredited: {cert.issueDate}
                      </span>
                      {cert.credentialId && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          ID: {cert.credentialId}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm font-bold text-[#10283F]">
                      {cert.title}
                    </h4>
                    <p className="text-xs text-[#b88528] font-medium">
                      {cert.issuer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
