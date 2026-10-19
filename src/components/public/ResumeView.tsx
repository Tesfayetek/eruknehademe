import React from 'react';
import {
  ResumeConfig,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SiteSettings,
  NavigationPage,
} from '../../types';
import {
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Calendar,
  Briefcase,
  GraduationCap,
  Shield,
  ArrowLeft,
} from 'lucide-react';

interface ResumeViewProps {
  resumeConfig: ResumeConfig;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  settings: SiteSettings;
  onNavigate: (page: NavigationPage) => void;
  onOpenConsultation: () => void;
}

export const ResumeView: React.FC<ResumeViewProps> = ({
  resumeConfig,
  experience,
  education,
  certifications,
  settings,
  onNavigate,
  onOpenConsultation,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    // Generate clean text-based formatted curriculum vitae document
    const content = `
================================================================================
                    CURRICULUM VITAE - ${settings.founderName.toUpperCase()}
       ${resumeConfig.targetRole || settings.founderTitle}
================================================================================

CONTACT INFORMATION:
Location: ${resumeConfig.location || settings.address}
Email:    ${resumeConfig.contactEmail || settings.email}
Phone:    ${resumeConfig.contactPhone || settings.phone}
Firm:     ${settings.companyName}

--------------------------------------------------------------------------------
EXECUTIVE PROFILE:
--------------------------------------------------------------------------------
${resumeConfig.executiveSummary || settings.founderBio}

--------------------------------------------------------------------------------
CORE STRATEGIC COMPETENCIES:
--------------------------------------------------------------------------------
${(resumeConfig.keyCompetencies || settings.credentials || []).map((c) => `• ${c}`).join('\n')}

--------------------------------------------------------------------------------
PROFESSIONAL EXPERIENCE:
--------------------------------------------------------------------------------
${experience
  .map(
    (e) => `
${e.role.toUpperCase()}
${e.company} | ${e.location} | ${e.period}
Summary: ${e.summary}
Key Achievements:
${(e.achievements || []).map((a) => `  - ${a}`).join('\n')}
`
  )
  .join('\n')}

--------------------------------------------------------------------------------
EDUCATION:
--------------------------------------------------------------------------------
${education.map((ed) => `• ${ed.degree} in ${ed.field} - ${ed.institution} (${ed.graduationYear}) ${ed.honors ? `[${ed.honors}]` : ''}`).join('\n')}

--------------------------------------------------------------------------------
CERTIFICATIONS & ACCREDITATIONS:
--------------------------------------------------------------------------------
${certifications.map((c) => `• ${c.title} - ${c.issuer} (${c.issueDate}) ${c.credentialId ? `[Ref: ${c.credentialId}]` : ''}`).join('\n')}

--------------------------------------------------------------------------------
LANGUAGES:
--------------------------------------------------------------------------------
${(resumeConfig.languages || [{ language: 'Amharic', fluency: 'Native' }, { language: 'English', fluency: 'Fluent' }])
  .map((l) => `• ${l.language}: ${l.fluency}`)
  .join('\n')}

================================================================================
CONFIDENTIAL - ERUKNEH ADEME BUSINESS CONSULTING
`;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${(settings.founderName || 'Erukneh_Ademe').replace(/\s+/g, '_')}_Executive.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8 text-slate-900 print:bg-white print:p-0 print:m-0">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-semibold text-slate-600 hover:text-[#10283F] flex items-center"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Home
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save as PDF
            </button>
            <button
              onClick={handleDownloadDocx}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md transition-colors shadow flex items-center"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-[#D5A13A]" />
              Download DOCX
            </button>
            <button
              onClick={() => onOpenConsultation()}
              className="px-4 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded-md transition-colors shadow"
            >
              Inquire
            </button>
          </div>
        </div>

        {/* Paper CV Sheet */}
        <div className="bg-white p-8 sm:p-14 rounded-xl shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0 space-y-8">
          {/* CV Header */}
          <div className="border-b-2 border-[#10283F] pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#10283F] tracking-tight">
                  {settings.founderName || 'Erukneh Ademe'}
                </h1>
                <p className="text-sm font-semibold text-[#b88528] uppercase tracking-wider mt-1">
                  {resumeConfig.targetRole || settings.founderTitle}
                </p>
              </div>
              <div className="text-right text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-end space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#b88528]" />
                  <span>{resumeConfig.location || 'Addis Ababa, Ethiopia'}</span>
                </div>
                <div className="flex items-center justify-end space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#b88528]" />
                  <a href={`mailto:${resumeConfig.contactEmail || settings.email}`}>
                    {resumeConfig.contactEmail || settings.email}
                  </a>
                </div>
                <div className="flex items-center justify-end space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#b88528]" />
                  <span>{resumeConfig.contactPhone || settings.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-bold text-[#10283F] uppercase tracking-widest border-b border-slate-200 pb-1">
              Executive Profile
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {resumeConfig.executiveSummary || settings.founderBio}
            </p>
          </div>

          {/* Core Strategic Competencies */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#10283F] uppercase tracking-widest border-b border-slate-200 pb-1">
              Core Strategic Competencies
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(resumeConfig.keyCompetencies || [
                'Corporate Growth Strategy',
                'Bankable Feasibility & DBE Modeling',
                'IFRS Valuation & M&A Diligence',
                'AfCFTA Regional Logistics Corridors',
                'Project Management Office (PMO)',
                'Board Fiduciary Governance & ESX',
              ]).map((comp, idx) => (
                <div key={idx} className="flex items-center text-xs text-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b88528] mr-2 shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#10283F] uppercase tracking-widest border-b border-slate-200 pb-1">
              Professional Advisory & Executive Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-serif text-sm font-bold text-[#10283F]">
                      {exp.role} &mdash; <span className="font-sans font-semibold text-slate-700">{exp.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-slate-500">{exp.period}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic">{exp.location}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{exp.summary}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pt-1">
                      {exp.achievements.map((ach, aIdx) => (
                        <li key={aIdx} className="leading-snug">
                          {ach}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Credentials */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#10283F] uppercase tracking-widest border-b border-slate-200 pb-1">
              Academic Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">
                      {edu.degree} in {edu.field}
                    </span>{' '}
                    &mdash; <span className="text-slate-600">{edu.institution}</span>
                    {edu.honors && (
                      <span className="text-[#b88528] ml-2 font-medium">({edu.honors})</span>
                    )}
                  </div>
                  <span className="font-mono text-slate-500">{edu.graduationYear}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-[#10283F] uppercase tracking-widest border-b border-slate-200 pb-1">
              Certifications & Accreditations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
                  <span className="font-bold text-[#10283F] block">{cert.title}</span>
                  <span className="text-[11px] text-slate-600 block">
                    {cert.issuer} &bull; {cert.issueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Languages & Affiliations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#10283F] uppercase tracking-wider">
                Languages
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {(resumeConfig.languages || [
                  { language: 'Amharic', fluency: 'Native' },
                  { language: 'English', fluency: 'Full Professional Proficiency' },
                  { language: 'Oromo (Afaan Oromoo)', fluency: 'Professional Working Proficiency' },
                ]).map((l, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-100 py-0.5">
                    <span className="font-medium">{l.language}</span>
                    <span className="text-slate-500">{l.fluency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#10283F] uppercase tracking-wider">
                Professional Affiliations
              </h3>
              <ul className="space-y-1 text-xs text-slate-700">
                {(resumeConfig.professionalAffiliations || [
                  'Member, Ethiopian Chamber of Commerce & Sectoral Associations',
                  'Certified Management Consultant (CMC) Member',
                  'Associate Member, African Economics & Strategy Association',
                ]).map((aff, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-[#b88528] mr-1.5">&bull;</span>
                    <span>{aff}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
