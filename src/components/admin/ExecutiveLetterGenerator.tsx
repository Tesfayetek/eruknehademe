import React, { useState } from 'react';
import { ExecutiveLetterTemplate, SiteSettings } from '../../types';
import {
  saveExecutiveLetter,
  deleteExecutiveLetter,
} from '../../services/dataService';
import {
  FileText,
  Printer,
  Download,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  Calendar,
} from 'lucide-react';

interface ExecutiveLetterGeneratorProps {
  letters: ExecutiveLetterTemplate[];
  settings: SiteSettings;
  onRefresh: () => void;
  showNotice: (msg: string) => void;
}

export const ExecutiveLetterGenerator: React.FC<ExecutiveLetterGeneratorProps> = ({
  letters,
  settings,
  onRefresh,
  showNotice,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<ExecutiveLetterTemplate | null>(
    letters[0] || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<ExecutiveLetterTemplate>>(
    letters[0] || {}
  );

  const handleSelect = (letter: ExecutiveLetterTemplate) => {
    setSelectedLetter(letter);
    setFormData(letter);
    setIsEditing(false);
  };

  const handleNew = () => {
    const newLetter: Partial<ExecutiveLetterTemplate> = {
      title: 'New Executive Advisory Proposal',
      category: 'Advisory Proposal',
      recipientName: 'Ato / W/ro [Client Name]',
      recipientTitle: 'Chief Executive Officer / Managing Director',
      recipientCompany: '[Company Name PLC]',
      subject: 'Engagement Proposal: Strategic Advisory & Capital Mobilization',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      openingSalutation: 'Dear [Title and Last Name],',
      bodyParagraphs: [
        'Following our executive consultation regarding your organization’s strategic objectives in Ethiopia, Erukneh Ademe Business Consulting is pleased to submit this formal advisory engagement proposal.',
        'Our mandate will focus on formulating a bankable corporate roadmap, optimizing operational throughput, and aligning your financial models with local regulatory and international standards.',
        'We look forward to partnering with your leadership council to achieve sustainable commercial value.',
      ],
      closingText: 'With highest regards,',
      signatoryName: settings.founderName || 'Erukneh Ademe',
      signatoryTitle: settings.founderTitle || 'Managing Partner & Senior Strategic Advisor',
    };
    setFormData(newLetter);
    setSelectedLetter(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.recipientName) {
      alert('Please fill in title and recipient.');
      return;
    }
    const id = await saveExecutiveLetter(formData, formData.id);
    showNotice('Executive letter saved successfully.');
    setIsEditing(false);
    onRefresh();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = (letter: ExecutiveLetterTemplate | Partial<ExecutiveLetterTemplate>) => {
    const content = `
================================================================================
                    ERUKNEH ADEME BUSINESS CONSULTING
   Bole Sub-City, Edna Mall Business Center, 6th Fl, Addis Ababa, Ethiopia
                Tel: ${settings.phone} | Email: ${settings.email}
================================================================================

Date: ${letter.date || new Date().toLocaleDateString()}

TO:
${letter.recipientName}
${letter.recipientTitle}
${letter.recipientCompany}

SUBJECT: ${letter.subject?.toUpperCase()}

--------------------------------------------------------------------------------

${letter.openingSalutation}

${(letter.bodyParagraphs || []).join('\n\n')}

${letter.closingText}

${letter.signatoryName}
${letter.signatoryTitle}
Erukneh Ademe Business Consulting

================================================================================
CONFIDENTIAL & PROPRIETARY
`;

    const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Letter_${(letter.recipientCompany || 'Proposal').replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeLetter = isEditing ? formData : selectedLetter || letters[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F]">
            Executive Letter Generator & Correspondence
          </h2>
          <p className="text-xs text-slate-500">
            Generate customized, board-ready advisory proposals, executive cover letters, and memoranda with instant DOCX & PDF download.
          </p>
        </div>
        <button
          onClick={handleNew}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md shadow flex items-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
          Create New Executive Letter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Template Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="font-serif text-sm font-bold text-[#10283F] uppercase tracking-wider">
            Saved Letters ({letters.length})
          </h3>
          <div className="space-y-2">
            {letters.map((l) => (
              <div
                key={l.id}
                onClick={() => handleSelect(l)}
                className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  selectedLetter?.id === l.id && !isEditing
                    ? 'bg-[#10283F] text-white border-[#10283F] shadow'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#D5A13A]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold truncate">{l.title}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      selectedLetter?.id === l.id && !isEditing
                        ? 'bg-white/20 text-[#D5A13A]'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {l.category}
                  </span>
                </div>
                <p
                  className={`text-[11px] truncate mt-1 ${
                    selectedLetter?.id === l.id && !isEditing ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  To: {l.recipientName} ({l.recipientCompany})
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Letter Canvas & Editor */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-[#10283F]">
              {isEditing ? 'Editing Letter Template' : 'Executive Letterhead Preview'}
            </span>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded flex items-center"
                  >
                    <Save className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                    Save Letter
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setFormData(selectedLetter || {});
                      setIsEditing(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded flex items-center"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1 text-[#b88528]" />
                    Edit Content
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    Print / PDF
                  </button>
                  <button
                    onClick={() => handleDownloadDocx(activeLetter)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded flex items-center"
                  >
                    <Download className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                    Export DOCX
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form Editor View */}
          {isEditing ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Internal Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={formData.category || 'Advisory Proposal'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Advisory Proposal">Advisory Proposal</option>
                    <option value="Executive Cover Letter">Executive Cover Letter</option>
                    <option value="Board Endorsement">Board Endorsement</option>
                    <option value="Strategic Memorandum">Strategic Memorandum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={formData.recipientName || ''}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Recipient Title</label>
                  <input
                    type="text"
                    value={formData.recipientTitle || ''}
                    onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Company / Entity</label>
                  <input
                    type="text"
                    value={formData.recipientCompany || ''}
                    onChange={(e) => setFormData({ ...formData, recipientCompany: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Line</label>
                <input
                  type="text"
                  value={formData.subject || ''}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Opening Salutation</label>
                <input
                  type="text"
                  value={formData.openingSalutation || ''}
                  onChange={(e) => setFormData({ ...formData, openingSalutation: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Body Paragraphs (Separate each paragraph with a double newline)
                </label>
                <textarea
                  rows={8}
                  value={(formData.bodyParagraphs || []).join('\n\n')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bodyParagraphs: e.target.value.split('\n\n').filter(Boolean),
                    })
                  }
                  className="w-full p-2 border rounded font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Closing Valediction</label>
                  <input
                    type="text"
                    value={formData.closingText || 'With highest regards,'}
                    onChange={(e) => setFormData({ ...formData, closingText: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Signatory Name</label>
                  <input
                    type="text"
                    value={formData.signatoryName || settings.founderName}
                    onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Signatory Title</label>
                  <input
                    type="text"
                    value={formData.signatoryTitle || settings.founderTitle}
                    onChange={(e) => setFormData({ ...formData, signatoryTitle: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Executive Letterhead Paper View */
            <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-md space-y-6 text-slate-800 font-serif leading-relaxed">
              {/* Executive Letterhead */}
              <div className="border-b-2 border-[#10283F] pb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-bold text-[#10283F]">
                    {settings.companyName}
                  </h4>
                  <p className="text-[10px] font-sans text-[#b88528] tracking-widest uppercase font-semibold">
                    Strategic Advisory &bull; Management Consulting &bull; Capital Solutions
                  </p>
                </div>
                <div className="text-right text-[10px] font-sans text-slate-500">
                  <p>{settings.address}</p>
                  <p>{settings.phone} &bull; {settings.email}</p>
                </div>
              </div>

              <div className="text-xs font-sans text-slate-600">
                Date: {activeLetter?.date || new Date().toLocaleDateString()}
              </div>

              <div className="text-xs font-sans text-slate-800 space-y-0.5">
                <p className="font-bold">{activeLetter?.recipientName}</p>
                <p>{activeLetter?.recipientTitle}</p>
                <p>{activeLetter?.recipientCompany}</p>
              </div>

              <div className="text-xs font-sans font-bold text-[#10283F] border-b border-slate-200 pb-1 uppercase">
                RE: {activeLetter?.subject}
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                <p>{activeLetter?.openingSalutation}</p>
                {(activeLetter?.bodyParagraphs || []).map((paragraph, pIdx) => (
                  <p key={pIdx} className="text-justify indent-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="pt-6 font-sans text-xs space-y-1">
                <p className="font-serif italic mb-4">{activeLetter?.closingText}</p>
                <p className="font-bold text-[#10283F]">{activeLetter?.signatoryName}</p>
                <p className="text-slate-600">{activeLetter?.signatoryTitle}</p>
                <p className="text-slate-400 text-[10px]">{settings.companyName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
