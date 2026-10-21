import React, { useState, useMemo } from 'react';
import {
  NavigationItem,
  NavigationPage,
  NavigationMenuType,
  DestinationType,
} from '../../types';
import {
  saveNavigationItem,
  saveAllNavigationItems,
  deleteNavigationItem,
  resetNavigationItemsToDefault,
  logAuditEvent,
} from '../../services/dataService';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import {
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Eye,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Home,
  Info,
  Briefcase,
  Award,
  GraduationCap,
  FileText,
  Send,
  Building,
  Star,
  BookOpen,
  Layout,
  Layers,
  Phone,
  HelpCircle,
  Users,
  Download,
  Globe,
  Zap,
  Target,
  Compass,
  Calendar,
  Lock,
  Smartphone,
  Monitor,
  Menu as MenuIcon,
  X,
  Search,
} from 'lucide-react';

interface NavigationManagerProps {
  navItems: NavigationItem[];
  currentUserEmail?: string;
  currentUserId?: string;
  onRefresh: () => Promise<void>;
  onShowNotice: (msg: string) => void;
}

// Icon dictionary for dynamic rendering
export const NAV_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Info,
  Briefcase,
  Award,
  GraduationCap,
  FileText,
  Send,
  Building,
  Star,
  BookOpen,
  Layout,
  Layers,
  Phone,
  HelpCircle,
  Users,
  Download,
  Globe,
  Zap,
  Target,
  Compass,
  Calendar,
};

export const AVAILABLE_PAGES: { value: NavigationPage; label: string; defaultUrl: string }[] = [
  { value: 'home', label: 'Home Page', defaultUrl: '/' },
  { value: 'about', label: 'About Us', defaultUrl: '/about' },
  { value: 'services', label: 'Services Overview', defaultUrl: '/services' },
  { value: 'industries', label: 'Industries We Serve', defaultUrl: '/industries' },
  { value: 'portfolio', label: 'Projects & Case Studies', defaultUrl: '/portfolio' },
  { value: 'skills', label: 'Skills & Technologies', defaultUrl: '/skills' },
  { value: 'experience', label: 'Work Experience', defaultUrl: '/experience' },
  { value: 'training', label: 'Training & Development', defaultUrl: '/training' },
  { value: 'resume', label: 'Executive Resume / CV', defaultUrl: '/resume' },
  { value: 'insights', label: 'Insights & Articles', defaultUrl: '/insights' },
  { value: 'contact', label: 'Contact Us', defaultUrl: '/contact' },
  { value: 'book-consultation', label: 'Book Consultation (Modal)', defaultUrl: '/book-consultation' },
];

export const NavigationManager: React.FC<NavigationManagerProps> = ({
  navItems,
  currentUserEmail = 'admin',
  currentUserId = 'admin',
  onRefresh,
  onShowNotice,
}) => {
  // Local state for editing/sorting
  const [items, setItems] = useState<NavigationItem[]>(navItems);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit / Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem>>({
    label: '',
    slug: '',
    page: 'home',
    url: '/',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'Home',
    order: 1,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: '',
  });
  const [modalErrors, setModalErrors] = useState<string[]>([]);

  // Delete Confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Live Preview Modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewMobileMenuOpen, setPreviewMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Drag and Drop
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Keep local state in sync when parent data updates (if no pending changes)
  React.useEffect(() => {
    if (!hasUnsavedChanges) {
      setItems(navItems);
    }
  }, [navItems, hasUnsavedChanges]);

  // Hierarchical item organizing
  const rootItems = useMemo(() => {
    return items
      .filter((i) => !i.parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [items]);

  const getSubmenuItems = (parentId: string) => {
    return items
      .filter((i) => i.parentId === parentId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  // Helper to determine depth
  const getItemDepth = (item: NavigationItem): number => {
    if (!item.parentId) return 0;
    const parent = items.find((i) => i.id === item.parentId);
    if (!parent) return 0;
    if (!parent.parentId) return 1;
    return 2;
  };

  // Helper to find descendants (to prevent circular parent assignments)
  const getDescendantIds = (itemId: string): string[] => {
    const directChildren = items.filter((i) => i.parentId === itemId);
    let descendants: string[] = directChildren.map((c) => c.id);
    for (const child of directChildren) {
      descendants = [...descendants, ...getDescendantIds(child.id)];
    }
    return descendants;
  };

  // Move Up / Move Down handlers within the same parent
  const handleMove = (item: NavigationItem, direction: 'up' | 'down') => {
    const siblings = items
      .filter((i) => (i.parentId || null) === (item.parentId || null))
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const currentIndex = siblings.findIndex((i) => i.id === item.id);
    if (currentIndex === -1) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= siblings.length) return;

    const targetSibling = siblings[targetIndex];

    // Swap orders
    const updated = items.map((i) => {
      if (i.id === item.id) {
        return { ...i, order: targetSibling.order };
      }
      if (i.id === targetSibling.id) {
        return { ...i, order: item.order };
      }
      return i;
    });

    setItems(updated);
    setHasUnsavedChanges(true);
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const sourceItem = items.find((i) => i.id === draggedId);
    const targetItem = items.find((i) => i.id === targetId);
    if (!sourceItem || !targetItem) return;

    // Place source right before target with updated order
    const updatedList = [...items];
    const sourceIndex = updatedList.findIndex((i) => i.id === draggedId);
    updatedList.splice(sourceIndex, 1);

    const targetNewIndex = updatedList.findIndex((i) => i.id === targetId);
    // Adopt target's parent if valid
    const newParentId = targetItem.parentId || null;
    const updatedSource = { ...sourceItem, parentId: newParentId };

    updatedList.splice(targetNewIndex, 0, updatedSource);

    // Re-index orders
    const reordered = updatedList.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    setItems(reordered);
    setHasUnsavedChanges(true);
    setDraggedId(null);
  };

  // Toggle quick visibility
  const handleToggleVisibility = (item: NavigationItem) => {
    const isNowVisible = !item.isVisible;
    const updated = items.map((i) =>
      i.id === item.id ? { ...i, isVisible: isNowVisible, enabled: isNowVisible } : i
    );
    setItems(updated);
    setHasUnsavedChanges(true);
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await saveAllNavigationItems(items);
      await logAuditEvent(
        'REORDER_NAVIGATION',
        'NavigationItem',
        'batch',
        `Updated ordering and configuration for ${items.length} navigation items`,
        currentUserId,
        currentUserEmail
      );
      setHasUnsavedChanges(false);
      onShowNotice('Navigation structure and ordering saved successfully.');
      await onRefresh();
    } catch (err: any) {
      console.error('Error saving navigation:', err);
      alert('Failed to save navigation changes. Please check permissions.');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default structure
  const handleResetToDefault = async () => {
    if (
      !confirm(
        'Are you sure you want to reset website navigation to the recommended structure? Any custom links will be replaced.'
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const resetItems = await resetNavigationItemsToDefault();
      await logAuditEvent(
        'RESET_NAVIGATION',
        'NavigationItem',
        'all',
        'Reset navigation to default corporate structure with nested submenus',
        currentUserId,
        currentUserEmail
      );
      setItems(resetItems);
      setHasUnsavedChanges(false);
      onShowNotice('Navigation reset to initial corporate hierarchy.');
      await onRefresh();
    } catch (err) {
      console.error('Reset error:', err);
      alert('Failed to reset navigation.');
    } finally {
      setSaving(false);
    }
  };

  // Modal Open for Add
  const handleOpenAdd = (parentItem?: NavigationItem) => {
    const defaultPage = 'services';
    const initialParentId = parentItem ? parentItem.id : null;
    const siblings = items.filter((i) => (i.parentId || null) === initialParentId);

    setEditingItem({
      id: `nav-${Date.now()}`,
      label: '',
      slug: '',
      page: defaultPage,
      url: '/services',
      type: initialParentId ? 'dropdown' : 'main',
      parentId: initialParentId,
      destinationType: 'internal',
      icon: 'Briefcase',
      order: siblings.length + 1,
      isVisible: true,
      enabled: true,
      visibleDesktop: true,
      visibleMobile: true,
      showInFooter: !initialParentId,
      openInNewTab: false,
      requiresAuth: false,
      description: '',
    });
    setModalErrors([]);
    setModalMode('add');
    setIsModalOpen(true);
  };

  // Modal Open for Edit
  const handleOpenEdit = (item: NavigationItem) => {
    setEditingItem({ ...item });
    setModalErrors([]);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Form Validation & Save Item
  const handleSaveModalItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!editingItem.label?.trim()) {
      errors.push('Navigation label is required.');
    }

    // Auto-generate slug if empty
    let finalSlug = (editingItem.slug || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!finalSlug && editingItem.label) {
      finalSlug = editingItem.label
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    if (!finalSlug) {
      errors.push('A valid slug is required.');
    }

    // Check duplicate slug
    const duplicate = items.find(
      (i) => i.id !== editingItem.id && (i.slug || i.id) === finalSlug
    );
    if (duplicate) {
      errors.push(`The slug "${finalSlug}" is already used by "${duplicate.label}".`);
    }

    // Circular check: cannot select self as parent
    if (editingItem.parentId && editingItem.id && editingItem.parentId === editingItem.id) {
      errors.push('An item cannot be its own parent.');
    }

    // Circular check: cannot select descendant as parent
    if (editingItem.id && editingItem.parentId) {
      const descendants = getDescendantIds(editingItem.id);
      if (descendants.includes(editingItem.parentId)) {
        errors.push('Cannot assign a child or sub-child as the parent (circular hierarchy).');
      }
    }

    // Check nesting depth (max 2 levels)
    if (editingItem.parentId) {
      const parent = items.find((i) => i.id === editingItem.parentId);
      if (parent && parent.parentId) {
        const grandParent = items.find((i) => i.id === parent.parentId);
        if (grandParent && grandParent.parentId) {
          errors.push('Maximum nesting exceeded. Navigation supports up to 2 submenu levels.');
        }
      }
    }

    if (errors.length > 0) {
      setModalErrors(errors);
      return;
    }

    const finalItem: NavigationItem = {
      id: editingItem.id || `nav-${finalSlug}-${Date.now()}`,
      label: editingItem.label!.trim(),
      slug: finalSlug,
      page: editingItem.page || 'home',
      url: editingItem.url || '/',
      type: editingItem.type || (editingItem.parentId ? 'dropdown' : 'main'),
      parentId: editingItem.parentId || null,
      destinationType: editingItem.destinationType || 'internal',
      pageId: editingItem.page,
      icon: editingItem.icon || 'Compass',
      order: Number(editingItem.order) || 1,
      isVisible: editingItem.isVisible ?? true,
      enabled: editingItem.enabled ?? true,
      visibleDesktop: editingItem.visibleDesktop ?? true,
      visibleMobile: editingItem.visibleMobile ?? true,
      showInFooter: editingItem.showInFooter ?? false,
      openInNewTab: editingItem.openInNewTab ?? false,
      requiresAuth: editingItem.requiresAuth ?? false,
      description: editingItem.description || '',
      isExternal: editingItem.destinationType === 'external',
      updatedAt: new Date().toISOString(),
      createdAt: editingItem.createdAt || new Date().toISOString(),
    };

    try {
      await saveNavigationItem(finalItem, finalItem.id);
      await logAuditEvent(
        modalMode === 'add' ? 'CREATE_NAVIGATION_ITEM' : 'UPDATE_NAVIGATION_ITEM',
        'NavigationItem',
        finalItem.id,
        `${modalMode === 'add' ? 'Created' : 'Updated'} navigation item: "${finalItem.label}"`,
        currentUserId,
        currentUserEmail
      );

      // Update local state
      const exists = items.some((i) => i.id === finalItem.id);
      const updated = exists
        ? items.map((i) => (i.id === finalItem.id ? finalItem : i))
        : [...items, finalItem];

      setItems(updated);
      setIsModalOpen(false);
      onShowNotice(`Navigation item "${finalItem.label}" saved successfully.`);
      await onRefresh();
    } catch (err) {
      console.error('Error saving nav item:', err);
      setModalErrors(['Failed to save to database. Check network or security rules.']);
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    const target = items.find((i) => i.id === deletingId);
    if (!target) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteNavigationItem(deletingId);
      await logAuditEvent(
        'DELETE_NAVIGATION_ITEM',
        'NavigationItem',
        deletingId,
        `Permanently deleted navigation item: "${target.label}" (${target.url || target.slug})`,
        currentUserId,
        currentUserEmail
      );

      // Also unparent children
      const updated = items
        .filter((i) => i.id !== deletingId)
        .map((i) => (i.parentId === deletingId ? { ...i, parentId: null } : i));

      setItems(updated);
      setDeletingId(null);
      onShowNotice(`Navigation item "${target.label}" permanently deleted.`);
      await onRefresh();
    } catch (err: any) {
      console.error('Delete error:', err);
      setDeleteError(err?.message || 'Failed to delete navigation item from database.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Renders a navigation row with indentation and controls
  const renderItemRow = (item: NavigationItem, depth = 0) => {
    const children = getSubmenuItems(item.id);
    const IconComp = item.icon ? NAV_ICON_MAP[item.icon] || Compass : Compass;
    const parent = items.find((i) => i.id === item.parentId);

    return (
      <React.Fragment key={item.id}>
        <tr
          draggable
          onDragStart={(e) => handleDragStart(e, item.id)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item.id)}
          className={`hover:bg-slate-50 transition-colors border-b border-slate-100 ${
            depth === 1 ? 'bg-slate-50/40' : depth === 2 ? 'bg-slate-100/40' : 'bg-white'
          }`}
        >
          {/* Label + Hierarchy */}
          <td className="py-3 px-4">
            <div className="flex items-center space-x-2" style={{ paddingLeft: `${depth * 20}px` }}>
              <span className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-600">
                <GripVertical className="w-3.5 h-3.5" />
              </span>

              {depth > 0 && (
                <span className="text-slate-400 font-mono text-xs select-none">└──</span>
              )}

              <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <IconComp className="w-3.5 h-3.5 text-[#10283F]" />
              </div>

              <div>
                <div className="font-semibold text-slate-900 flex items-center space-x-1.5">
                  <span>{item.label}</span>
                  {children.length > 0 && (
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-normal">
                      {children.length} sub-items
                    </span>
                  )}
                  {item.requiresAuth && (
                    <span title="Requires Authentication">
                      <Lock className="w-3 h-3 text-amber-600" />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  slug: {item.slug || item.id}
                </div>
              </div>
            </div>
          </td>

          {/* Menu Type */}
          <td className="py-3 px-4 whitespace-nowrap">
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                item.type === 'main'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : item.type === 'dropdown'
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {item.type || (depth === 0 ? 'Main Menu' : 'Dropdown')}
            </span>
          </td>

          {/* Parent Menu */}
          <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
            {parent ? (
              <span className="font-medium text-slate-800">{parent.label}</span>
            ) : (
              <span className="text-slate-400 italic">None (Top Level)</span>
            )}
          </td>

          {/* Destination URL */}
          <td className="py-3 px-4 text-xs font-mono text-slate-600 max-w-[160px] truncate">
            {item.destinationType === 'external' ? (
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center space-x-1 truncate"
              >
                <span className="truncate">{item.url}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
              </a>
            ) : (
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                {item.page || item.url}
              </span>
            )}
          </td>

          {/* Icon */}
          <td className="py-3 px-4 text-xs text-slate-600 whitespace-nowrap">
            <span className="font-mono text-[11px] text-slate-500">{item.icon || 'None'}</span>
          </td>

          {/* Display Order */}
          <td className="py-3 px-4 whitespace-nowrap">
            <div className="flex items-center space-x-1">
              <span className="w-6 text-center font-bold text-slate-700">{item.order}</span>
              <button
                type="button"
                onClick={() => handleMove(item, 'up')}
                className="p-1 rounded hover:bg-slate-200 text-slate-500"
                title="Move Up"
              >
                <ArrowUp className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(item, 'down')}
                className="p-1 rounded hover:bg-slate-200 text-slate-500"
                title="Move Down"
              >
                <ArrowDown className="w-3 h-3" />
              </button>
            </div>
          </td>

          {/* Visibility Controls */}
          <td className="py-3 px-4 whitespace-nowrap">
            <button
              onClick={() => handleToggleVisibility(item)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                item.isVisible && item.enabled !== false
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {item.isVisible && item.enabled !== false ? 'Active' : 'Disabled'}
            </button>
            <div className="flex space-x-1 mt-1 text-[9px] text-slate-500">
              <span className={item.visibleDesktop !== false ? 'text-slate-700' : 'text-slate-300'}>
                Desk
              </span>
              <span>•</span>
              <span className={item.visibleMobile !== false ? 'text-slate-700' : 'text-slate-300'}>
                Mob
              </span>
              <span>•</span>
              <span className={item.showInFooter ? 'text-[#D5A13A] font-semibold' : 'text-slate-300'}>
                Foot
              </span>
            </div>
          </td>

          {/* Open in New Tab */}
          <td className="py-3 px-4 text-center whitespace-nowrap">
            <span className="text-[10px] text-slate-600">
              {item.openInNewTab ? (
                <span className="text-blue-600 font-semibold">Yes</span>
              ) : (
                <span className="text-slate-400">No</span>
              )}
            </span>
          </td>

          {/* Actions */}
          <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
            <button
              onClick={() => handleOpenAdd(item)}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded"
              title="Add Submenu Item"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleOpenEdit(item)}
              className="p-1.5 text-slate-500 hover:text-[#10283F] hover:bg-slate-100 rounded"
              title="Edit Item"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeletingId(item.id)}
              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
              title="Delete Item"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </td>
        </tr>

        {/* Recursive Submenu items */}
        {children.map((child) => renderItemRow(child, depth + 1))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-6">
      {/* Module Header & Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="font-serif text-2xl font-bold text-[#10283F] flex items-center space-x-2">
            <span>Navigation Management</span>
            <span className="text-xs font-sans font-semibold bg-[#D5A13A]/20 text-[#916215] px-2 py-0.5 rounded-full">
              {items.length} Items Configured
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the website's navigation menus, dropdowns, page links, visibility, and display order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded shadow-sm flex items-center space-x-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#10283F]" />
            <span>Preview Navigation</span>
          </button>

          <button
            onClick={handleResetToDefault}
            disabled={saving}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 flex items-center space-x-1"
            title="Reset to recommended corporate structure"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset Suggested</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5 text-[#D5A13A]" />
            <span>Add Navigation Item</span>
          </button>

          <button
            onClick={handleSaveChanges}
            disabled={saving || !hasUnsavedChanges}
            className={`px-4 py-2 text-xs font-semibold rounded shadow flex items-center space-x-1.5 transition-all ${
              hasUnsavedChanges
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between text-xs text-amber-800 animate-in fade-in">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              You have unsaved navigation ordering or visibility changes. Click <strong>Save Changes</strong> to publish to the live website.
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setItems(navItems);
                setHasUnsavedChanges(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline px-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-3 py-1 bg-[#10283F] text-white font-semibold rounded text-xs hover:bg-[#173859]"
            >
              Save Now
            </button>
          </div>
        </div>
      )}

      {/* Navigation Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a1826] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Navigation Label & Hierarchy</th>
                <th className="py-3.5 px-4">Menu Type</th>
                <th className="py-3.5 px-4">Parent Menu</th>
                <th className="py-3.5 px-4">Destination</th>
                <th className="py-3.5 px-4">Icon</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Visibility</th>
                <th className="py-3.5 px-4 text-center">New Tab</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rootItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No navigation items configured. Click <strong>Add Navigation Item</strong> or <strong>Reset Suggested</strong>.
                  </td>
                </tr>
              ) : (
                rootItems.map((root) => renderItemRow(root, 0))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#10283F] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#D5A13A]" />
                <h3 className="font-serif text-lg font-bold">
                  {modalMode === 'add' ? 'Add Navigation Item' : 'Edit Navigation Item'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="p-6 space-y-4 text-xs">
              {modalErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 space-y-1">
                  {modalErrors.map((err, i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Navigation Label */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Navigation Label <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.label || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingItem({
                        ...editingItem,
                        label: val,
                        // auto-suggest slug if empty or newly typed
                        slug:
                          modalMode === 'add'
                            ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                            : editingItem.slug,
                      });
                    }}
                    placeholder="e.g. Services, About Us"
                    className="w-full p-2 border border-slate-300 rounded focus:border-[#b88528] focus:outline-none"
                  />
                </div>

                {/* Unique ID or Slug */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Navigation Slug / ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.slug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="e.g. services, about-overview"
                    className="w-full p-2 border border-slate-300 rounded font-mono text-slate-700 focus:border-[#b88528] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Menu Type */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Menu Type</label>
                  <select
                    value={editingItem.type || 'main'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        type: e.target.value as NavigationMenuType,
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="main">Main Menu (Header Navbar)</option>
                    <option value="dropdown">Dropdown Submenu</option>
                    <option value="footer">Footer Menu</option>
                  </select>
                </div>

                {/* Parent Menu */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Parent Menu (Nesting)
                  </label>
                  <select
                    value={editingItem.parentId || ''}
                    onChange={(e) => {
                      const val = e.target.value || null;
                      setEditingItem({
                        ...editingItem,
                        parentId: val,
                        type: val ? 'dropdown' : 'main',
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="">None (Top-Level Item)</option>
                    {items
                      .filter(
                        (i) =>
                          i.id !== editingItem.id &&
                          getItemDepth(i) < 2 // allow max 2 levels
                      )
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {getItemDepth(p) === 1 ? '— ' : ''}
                          {p.label} ({p.slug || p.id})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Destination Type */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Destination Type</label>
                  <select
                    value={editingItem.destinationType || 'internal'}
                    onChange={(e) => {
                      const dt = e.target.value as DestinationType;
                      setEditingItem({
                        ...editingItem,
                        destinationType: dt,
                        openInNewTab: dt === 'external' ? true : editingItem.openInNewTab,
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option value="internal">Internal Application Page</option>
                    <option value="external">External Website URL</option>
                    <option value="anchor">Page Section Anchor (#)</option>
                    <option value="custom">Custom Application Route</option>
                  </select>
                </div>

                {/* Page Selection (if internal) */}
                {editingItem.destinationType === 'internal' ? (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Internal Page Route
                    </label>
                    <select
                      value={editingItem.page || 'home'}
                      onChange={(e) => {
                        const selPage = e.target.value as NavigationPage;
                        const matched = AVAILABLE_PAGES.find((p) => p.value === selPage);
                        setEditingItem({
                          ...editingItem,
                          page: selPage,
                          url: matched?.defaultUrl || `/${selPage}`,
                        });
                      }}
                      className="w-full p-2 border border-slate-300 rounded bg-white"
                    >
                      {AVAILABLE_PAGES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label} ({p.defaultUrl})
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Destination URL
                    </label>
                    <input
                      type="text"
                      value={editingItem.url || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                      placeholder={
                        editingItem.destinationType === 'external'
                          ? 'https://example.com'
                          : '/services#strategy'
                      }
                      className="w-full p-2 border border-slate-300 rounded font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Icon Selection */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Menu Icon Preview & Selection
                </label>
                <div className="flex flex-wrap gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded max-h-32 overflow-y-auto">
                  {Object.keys(NAV_ICON_MAP).map((iconKey) => {
                    const Comp = NAV_ICON_MAP[iconKey];
                    const isSelected = editingItem.icon === iconKey;
                    return (
                      <button
                        type="button"
                        key={iconKey}
                        onClick={() => setEditingItem({ ...editingItem, icon: iconKey })}
                        className={`p-2 rounded flex items-center space-x-1.5 text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#10283F] text-[#D5A13A] font-semibold shadow'
                            : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        <Comp className="w-3.5 h-3.5" />
                        <span className="text-[11px]">{iconKey}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingItem.order ?? 1}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Optional Description
                  </label>
                  <input
                    type="text"
                    value={editingItem.description || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, description: e.target.value })
                    }
                    placeholder="Brief tooltip or description"
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* Flags & Checkboxes */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVisible && editingItem.enabled !== false}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isVisible: e.target.checked,
                        enabled: e.target.checked,
                      })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Active & Enabled Publicly</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.visibleDesktop !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, visibleDesktop: e.target.checked })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Visible on Desktop Navbar</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.visibleMobile !== false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, visibleMobile: e.target.checked })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Visible on Mobile Drawer</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.showInFooter ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, showInFooter: e.target.checked })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Display in Footer Navigation</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.openInNewTab ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, openInNewTab: e.target.checked })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Open in New Browser Tab</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.requiresAuth ?? false}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, requiresAuth: e.target.checked })
                    }
                    className="rounded text-[#10283F]"
                  />
                  <span>Require Authentication (Signed In Only)</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#10283F] hover:bg-[#173859] text-white font-semibold rounded shadow flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-[#D5A13A]" />
                  <span>{modalMode === 'add' ? 'Create Nav Item' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteConfirmationModal
        isOpen={!!deletingId}
        title="Delete Navigation Item?"
        recordType="Navigation Item"
        recordName={items.find((i) => i.id === deletingId)?.label || ''}
        recordId={deletingId || undefined}
        confirmationMessage="Are you sure you want to permanently delete this navigation item from the database? This action cannot be undone. Any submenus under this item will become top-level links."
        isDeleting={isDeleting}
        errorMessage={deleteError}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setDeletingId(null);
            setDeleteError(null);
          }
        }}
      />

      {/* LIVE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0a1826] text-white rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-700 overflow-hidden my-6 flex flex-col max-h-[90vh]">
            {/* Preview Toolbar */}
            <div className="bg-[#10283F] px-6 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#D5A13A]" />
                <span className="font-serif font-bold text-sm text-white">
                  Live Navigation Simulator
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  Interactive Preview
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center bg-[#0a1826] rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-3 py-1 rounded text-xs flex items-center space-x-1 ${
                      previewDevice === 'desktop'
                        ? 'bg-[#173859] text-[#D5A13A] font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-3 py-1 rounded text-xs flex items-center space-x-1 ${
                      previewDevice === 'mobile'
                        ? 'bg-[#173859] text-[#D5A13A] font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile Phone</span>
                  </button>
                </div>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Canvas */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-900 flex justify-center items-start">
              {previewDevice === 'desktop' ? (
                /* Desktop Simulated Bar */
                <div className="w-full bg-[#10283F] rounded-xl border border-slate-700 shadow-2xl p-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded bg-[#D5A13A] text-[#10283F] font-serif font-bold text-sm flex items-center justify-center">
                        EA
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-white">
                          Erukneh Ademe
                        </div>
                        <div className="text-[9px] uppercase tracking-wider text-slate-400">
                          Business Consulting
                        </div>
                      </div>
                    </div>

                    {/* Desktop Links with Live Dropdowns */}
                    <nav className="flex items-center space-x-1">
                      {rootItems
                        .filter((i) => i.isVisible && i.enabled !== false && i.visibleDesktop !== false)
                        .map((item) => {
                          const children = getSubmenuItems(item.id).filter(
                            (c) => c.isVisible && c.enabled !== false && c.visibleDesktop !== false
                          );
                          const hasChildren = children.length > 0;
                          const isOpen = activeDropdown === item.id;
                          const IconComp = item.icon ? NAV_ICON_MAP[item.icon] || Compass : Compass;

                          return (
                            <div
                              key={item.id}
                              className="relative"
                              onMouseEnter={() => hasChildren && setActiveDropdown(item.id)}
                              onMouseLeave={() => hasChildren && setActiveDropdown(null)}
                            >
                              <button
                                onClick={() => hasChildren && setActiveDropdown(isOpen ? null : item.id)}
                                className={`px-2.5 py-1.5 text-xs font-medium rounded flex items-center space-x-1 transition-colors ${
                                  isOpen ? 'text-[#D5A13A] bg-white/10' : 'text-slate-200 hover:text-white'
                                }`}
                              >
                                <IconComp className="w-3 h-3 text-[#D5A13A]" />
                                <span>{item.label}</span>
                                {hasChildren && <ChevronDown className="w-3 h-3 opacity-70" />}
                              </button>

                              {hasChildren && isOpen && (
                                <div className="absolute top-full left-0 mt-1 w-56 bg-[#0a1826] border border-slate-700 rounded-lg shadow-2xl py-2 z-50">
                                  {children.map((sub) => {
                                    const SubIcon = sub.icon ? NAV_ICON_MAP[sub.icon] || Compass : Compass;
                                    return (
                                      <div
                                        key={sub.id}
                                        className="px-3 py-1.5 hover:bg-white/10 text-xs text-slate-200 flex items-center space-x-2 cursor-pointer"
                                      >
                                        <SubIcon className="w-3.5 h-3.5 text-[#D5A13A]" />
                                        <span>{sub.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </nav>

                    <button className="px-3 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] rounded">
                      Book Consultation
                    </button>
                  </div>
                  <div className="py-8 text-center text-xs text-slate-500">
                    Hover over top-level items with dropdown indicators to test submenu flyouts.
                  </div>
                </div>
              ) : (
                /* Mobile Phone Simulated View */
                <div className="w-[360px] bg-[#0c1e2f] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                  {/* Phone Header */}
                  <div className="p-3 bg-[#10283F] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 rounded bg-[#D5A13A] text-[#10283F] font-serif font-bold text-xs flex items-center justify-center">
                        EA
                      </div>
                      <span className="font-serif font-bold text-xs text-white">Erukneh Ademe</span>
                    </div>
                    <button
                      onClick={() => setPreviewMobileMenuOpen(!previewMobileMenuOpen)}
                      className="p-1 rounded bg-white/10 text-white"
                    >
                      {previewMobileMenuOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Drawer simulation */}
                  <div className="p-4 space-y-3">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                      Mobile Menu Drawer
                    </div>
                    <div className="space-y-1">
                      {rootItems
                        .filter((i) => i.isVisible && i.enabled !== false && i.visibleMobile !== false)
                        .map((item) => {
                          const children = getSubmenuItems(item.id).filter(
                            (c) => c.isVisible && c.enabled !== false && c.visibleMobile !== false
                          );
                          const hasChildren = children.length > 0;
                          const isOpen = activeDropdown === item.id;
                          const IconComp = item.icon ? NAV_ICON_MAP[item.icon] || Compass : Compass;

                          return (
                            <div key={item.id} className="border-b border-slate-800/80 pb-1">
                              <div
                                onClick={() => hasChildren && setActiveDropdown(isOpen ? null : item.id)}
                                className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer text-xs text-slate-200"
                              >
                                <div className="flex items-center space-x-2">
                                  <IconComp className="w-3.5 h-3.5 text-[#D5A13A]" />
                                  <span className="font-medium">{item.label}</span>
                                </div>
                                {hasChildren && (
                                  <ChevronRight
                                    className={`w-3.5 h-3.5 transition-transform ${
                                      isOpen ? 'rotate-90 text-[#D5A13A]' : 'text-slate-400'
                                    }`}
                                  />
                                )}
                              </div>

                              {hasChildren && isOpen && (
                                <div className="pl-6 pr-2 py-1 space-y-1 bg-white/5 rounded my-1">
                                  {children.map((sub) => {
                                    const SubIcon = sub.icon ? NAV_ICON_MAP[sub.icon] || Compass : Compass;
                                    return (
                                      <div
                                        key={sub.id}
                                        className="py-1 px-2 text-[11px] text-slate-300 flex items-center space-x-1.5"
                                      >
                                        <SubIcon className="w-3 h-3 text-[#D5A13A]" />
                                        <span>{sub.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                    <button className="w-full py-2 bg-[#D5A13A] text-[#10283F] font-semibold text-xs rounded shadow">
                      Book Consultation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
