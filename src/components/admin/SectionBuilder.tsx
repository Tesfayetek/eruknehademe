import React, { useState } from 'react';
import { PageSectionItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import {
  savePageSection,
  deletePageSection,
  logAuditEvent,
} from '../../services/dataService';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import {
  Layers,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Copy,
  Save,
  CheckCircle2,
  Layout,
  Palette,
  ExternalLink,
} from 'lucide-react';

interface SectionBuilderProps {
  sections: PageSectionItem[];
  onRefresh: () => void;
  showNotice: (msg: string) => void;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  sections,
  onRefresh,
  showNotice,
}) => {
  const { currentUser } = useAuth();
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [editingSection, setEditingSection] = useState<Partial<PageSectionItem> | null>(null);
  const [deletingSection, setDeletingSection] = useState<PageSectionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const pageOptions = [
    { id: 'home', label: 'Homepage' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'industries', label: 'Industries' },
    { id: 'portfolio', label: 'Projects & Portfolio' },
    { id: 'skills', label: 'Skills & Experience' },
    { id: 'insights', label: 'Insights & Blog' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const filteredSections = sections
    .filter((s) => s.pageId === selectedPage)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const handleAddNewSection = () => {
    const newSec: Partial<PageSectionItem> = {
      pageId: selectedPage as any,
      sectionId: `sec-${Date.now()}`,
      sectionType: 'image-text',
      title: 'New Configurable Section',
      subtitle: 'Optional supporting description or subtitle',
      body: 'Detailed strategic narrative or content paragraphs for this section...',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
      imageAlt: 'Section Visual Asset',
      imagePosition: 'right',
      buttonText: 'Explore More',
      buttonUrl: 'contact',
      backgroundColor: '#ffffff',
      textColor: '#10283F',
      layout: 'split',
      displayOrder: filteredSections.length + 1,
      isVisible: true,
      status: 'published',
    };
    setEditingSection(newSec);
  };

  const handleDuplicate = async (sec: PageSectionItem) => {
    const dup: Partial<PageSectionItem> = {
      ...sec,
      sectionId: `sec-${Date.now()}`,
      title: `${sec.title} (Copy)`,
      displayOrder: (sec.displayOrder || 0) + 1,
    };
    delete (dup as any).id;
    await savePageSection(dup);
    showNotice('Section duplicated.');
    onRefresh();
  };

  const handleToggleVisibility = async (sec: PageSectionItem) => {
    await savePageSection({ ...sec, isVisible: !sec.isVisible }, sec.id);
    showNotice(`Section is now ${!sec.isVisible ? 'Visible' : 'Hidden'}.`);
    onRefresh();
  };

  const handleMove = async (sec: PageSectionItem, direction: 'up' | 'down') => {
    const currentIdx = filteredSections.findIndex((s) => s.id === sec.id);
    const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= filteredSections.length) return;

    const targetSec = filteredSections[targetIdx];
    const currentOrder = sec.displayOrder;
    const targetOrder = targetSec.displayOrder;

    await savePageSection({ displayOrder: targetOrder }, sec.id);
    await savePageSection({ displayOrder: currentOrder }, targetSec.id);
    showNotice('Section order updated.');
    onRefresh();
  };

  const handleOpenDelete = (sec: PageSectionItem) => {
    setDeletingSection(sec);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSection) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deletePageSection(deletingSection.id);
      await logAuditEvent(
        'DELETE_PAGE_SECTION',
        'PageSection',
        deletingSection.id,
        `Permanently deleted section "${deletingSection.title}" on page "${deletingSection.pageId}"`,
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      showNotice(`Section "${deletingSection.title}" permanently deleted.`);
      setDeletingSection(null);
      onRefresh();
    } catch (err: any) {
      console.error('Delete section error:', err);
      setDeleteError(err?.message || 'Failed to delete section from database.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveSection = async () => {
    if (!editingSection?.title || !editingSection.pageId) {
      alert('Section title and page are required.');
      return;
    }
    await savePageSection(editingSection, editingSection.id);
    showNotice('Section saved and published.');
    setEditingSection(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F]">
            Page & Section Builder
          </h2>
          <p className="text-xs text-slate-500">
            Construct, reorder, show, hide, and customize reusable sections across all public website pages.
          </p>
        </div>
        <button
          onClick={handleAddNewSection}
          className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded-md shadow flex items-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
          Add Section to {pageOptions.find((p) => p.id === selectedPage)?.label}
        </button>
      </div>

      {/* Page Tabs */}
      <div className="bg-white p-2 rounded-lg border border-slate-200 flex items-center space-x-2 overflow-x-auto">
        {pageOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => {
              setSelectedPage(opt.id);
              setEditingSection(null);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedPage === opt.id
                ? 'bg-[#10283F] text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-serif text-sm font-bold text-slate-700">
              No Custom Dynamic Sections for {pageOptions.find((p) => p.id === selectedPage)?.label}
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add a new section to customize layouts, banners, card grids, or custom call-to-action blocks.
            </p>
            <button
              onClick={handleAddNewSection}
              className="px-4 py-2 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded shadow"
            >
              Create First Section
            </button>
          </div>
        ) : (
          filteredSections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-5 rounded-xl border transition-all bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                !sec.isVisible ? 'opacity-60 bg-slate-50' : 'hover:border-[#D5A13A]/60'
              }`}
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{idx + 1}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#10283F]/10 text-[#10283F] uppercase">
                    {sec.sectionType} ({sec.layout || 'default'})
                  </span>
                  {!sec.isVisible && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-semibold">
                      Hidden
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-base font-bold text-[#10283F]">{sec.title}</h4>
                {sec.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-1">{sec.subtitle}</p>
                )}
                {sec.buttonText && (
                  <span className="text-[11px] text-[#b88528] font-semibold block">
                    CTA Button: "{sec.buttonText}" &rarr; {sec.buttonUrl}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={() => handleMove(sec, 'up')}
                  disabled={idx === 0}
                  title="Move Up"
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleMove(sec, 'down')}
                  disabled={idx === filteredSections.length - 1}
                  title="Move Down"
                  className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30 rounded hover:bg-slate-100"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleToggleVisibility(sec)}
                  title={sec.isVisible ? 'Hide Section' : 'Show Section'}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                >
                  {sec.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-rose-500" />}
                </button>
                <button
                  onClick={() => handleDuplicate(sec)}
                  title="Duplicate Section"
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingSection(sec)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded flex items-center"
                >
                  <Edit className="w-3.5 h-3.5 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleOpenDelete(sec)}
                  className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50"
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Section Edit Modal Dialog */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F] border-b pb-2">
              {editingSection.id ? 'Edit Page Section' : 'Create New Page Section'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Page</label>
                <select
                  value={editingSection.pageId || selectedPage}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, pageId: e.target.value as any })
                  }
                  className="w-full p-2 border rounded"
                >
                  {pageOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Section Type</label>
                <select
                  value={editingSection.sectionType || 'image-text'}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, sectionType: e.target.value as any })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="image-text">Image & Text Split</option>
                  <option value="text">Rich Text & Narrative</option>
                  <option value="hero">Hero Banner</option>
                  <option value="card-grid">Card Grid Showcase</option>
                  <option value="timeline">Timeline / Process</option>
                  <option value="stats">Key Metric Statistics</option>
                  <option value="cta">Call to Action Box</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Section Heading</label>
                <input
                  type="text"
                  value={editingSection.title || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={editingSection.subtitle || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, subtitle: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Body Text / Narrative</label>
              <textarea
                rows={4}
                value={editingSection.body || ''}
                onChange={(e) =>
                  setEditingSection({ ...editingSection, body: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Asset URL</label>
                <input
                  type="text"
                  value={editingSection.imageUrl || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, imageUrl: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Image Position</label>
                <select
                  value={editingSection.imagePosition || 'right'}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, imagePosition: e.target.value as any })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="right">Right Side</option>
                  <option value="left">Left Side</option>
                  <option value="background">Background Image</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Button Text (Optional)</label>
                <input
                  type="text"
                  value={editingSection.buttonText || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, buttonText: e.target.value })
                  }
                  placeholder="e.g. Schedule Briefing"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Button Destination</label>
                <input
                  type="text"
                  value={editingSection.buttonUrl || ''}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, buttonUrl: e.target.value })
                  }
                  placeholder="e.g. contact, services, or https://..."
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Background Color</label>
                <input
                  type="text"
                  value={editingSection.backgroundColor || '#ffffff'}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, backgroundColor: e.target.value })
                  }
                  placeholder="#ffffff or #10283F"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Layout Variant</label>
                <select
                  value={editingSection.layout || 'split'}
                  onChange={(e) =>
                    setEditingSection({ ...editingSection, layout: e.target.value as any })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="split">Split Columns</option>
                  <option value="centered">Centered</option>
                  <option value="grid-3">3-Card Grid</option>
                  <option value="grid-4">4-Card Grid</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visibility</label>
                <select
                  value={editingSection.isVisible ? 'yes' : 'no'}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      isVisible: e.target.value === 'yes',
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="yes">Visible</option>
                  <option value="no">Hidden (Draft)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-1.5 text-xs text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save & Publish Section
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!deletingSection}
        title="Delete Page Section?"
        recordType="Page Section"
        recordName={deletingSection?.title || ''}
        recordId={deletingSection?.id}
        confirmationMessage="Are you sure you want to permanently delete this page section? This action cannot be undone."
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeletingSection(null);
            setDeleteError(null);
          }
        }}
      />
    </div>
  );
};
