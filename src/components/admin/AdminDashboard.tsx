import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Service,
  Industry,
  Article,
  MediaItem,
  Testimonial,
  ConsultationRequest,
  ContactMessage,
  UserProfile,
  SiteSettings,
  AuditLog,
  NavigationPage,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ResumeConfig,
  ExecutiveLetterTemplate,
  PageSectionItem,
  NavigationItem,
} from '../../types';
import {
  getServices,
  saveService,
  deleteService,
  getIndustries,
  saveIndustry,
  deleteIndustry,
  getArticles,
  saveArticle,
  deleteArticle,
  getMediaItems,
  deleteMediaItem,
  getTestimonials,
  saveTestimonial,
  deleteTestimonial,
  getConsultationRequests,
  updateConsultationStatus,
  deleteConsultationRequest,
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  getUsersList,
  updateUserAccountStatus,
  deleteUserAccount,
  getSiteSettings,
  updateSiteSettings,
  getAuditLogs,
  logAuditEvent,
  seedInitialDatabaseIfEmpty,
  getProjects,
  saveProject,
  deleteProject,
  getSkills,
  saveSkill,
  deleteSkill,
  getExperience,
  saveExperience,
  deleteExperience,
  getEducation,
  saveEducation,
  deleteEducation,
  getCertifications,
  saveCertification,
  deleteCertification,
  getResumeConfig,
  saveResumeConfig,
  getExecutiveLetters,
  getPageSections,
  getNavigationItems,
  saveNavigationItem,
  deleteNavigationItem,
} from '../../services/dataService';
import { MediaUploader } from './MediaUploader';
import { ExecutiveLetterGenerator } from './ExecutiveLetterGenerator';
import { SectionBuilder } from './SectionBuilder';
import { NavigationManager } from './NavigationManager';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import {
  LayoutDashboard,
  Briefcase,
  Building,
  BookOpen,
  Image as ImageIcon,
  Star,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  Shield,
  FileText,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ExternalLink,
  Search,
  Database,
  ArrowRight,
  Eye,
  RefreshCw,
  Compass,
  GraduationCap,
  Award,
  Layers,
  Palette,
  Send,
  Sliders,
  Share2,
  Layout,
  ChevronDown,
  Phone,
  Lock,
  Menu as MenuIcon,
  X as XIcon,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: NavigationPage) => void;
  onRefreshPublicData: () => void;
}

type AdminTab =
  | 'overview'
  | 'settings' // 1. Global Website Settings
  | 'company-info' // Company Information
  | 'branding' // Branding & Logo
  | 'theme' // Theme & Colors
  | 'navigation' // Navigation Management
  | 'hero' // 3. Homepage and Hero Section
  | 'about' // 4. About Me / Founder
  | 'skills' // 5. Skills and Technologies
  | 'experience' // 6. Work Experience
  | 'education' // 7. Education
  | 'certifications' // 8. Certifications and Training
  | 'projects' // 9. Projects and Portfolio
  | 'resume' // 10. Resume / CV
  | 'letters' // 11. Executive Letter Generator
  | 'contact' // 12. Contact Information
  | 'services' // Services CMS
  | 'industries' // Industries CMS
  | 'testimonials' // 13. Testimonials
  | 'articles' // 14. Blog or Articles
  | 'footer' // 15. Footer
  | 'media' // 16. Images and Media Library
  | 'builder' // 17. Page and Section Management
  | 'seo' // 18. SEO and Social Sharing Settings
  | 'consultations'
  | 'messages'
  | 'customers'
  | 'security'
  | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigate,
  onRefreshPublicData,
}) => {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live Firestore State
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [resumeConfig, setResumeConfig] = useState<ResumeConfig | null>(null);
  const [letters, setLetters] = useState<ExecutiveLetterTemplate[]>([]);
  const [sections, setSections] = useState<PageSectionItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals & Editing states
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [editingSkill, setEditingSkill] = useState<Partial<SkillItem> | null>(null);
  const [editingExperience, setEditingExperience] = useState<Partial<ExperienceItem> | null>(null);
  const [editingEducation, setEditingEducation] = useState<Partial<EducationItem> | null>(null);
  const [editingCert, setEditingCert] = useState<Partial<CertificationItem> | null>(null);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingIndustry, setEditingIndustry] = useState<Partial<Industry> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingNavItem, setEditingNavItem] = useState<Partial<NavigationItem> | null>(null);
  const [viewingConsultation, setViewingConsultation] = useState<ConsultationRequest | null>(null);
  const [consultationNote, setConsultationNote] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  // Safe Permanent Deletion State & Handler
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    name: string;
    deleteFn: (id: string) => Promise<void>;
    successMsg: string;
    auditAction?: string;
    auditEntity?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await deleteTarget.deleteFn(deleteTarget.id);
      if (deleteTarget.auditAction) {
        await logAuditEvent(
          deleteTarget.auditAction,
          deleteTarget.auditEntity || deleteTarget.type,
          deleteTarget.id,
          `Permanently deleted ${deleteTarget.type}: "${deleteTarget.name}" (ID: ${deleteTarget.id})`,
          currentUser?.uid || 'admin',
          currentUser?.email || 'admin'
        );
      }
      await loadAllAdminData();
      onRefreshPublicData();
      showNotice(deleteTarget.successMsg);
      if (viewingConsultation && viewingConsultation.id === deleteTarget.id) {
        setViewingConsultation(null);
      }
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Delete error:', err);
      setDeleteError(err?.message || `Failed to permanently delete ${deleteTarget.type}.`);
    } finally {
      setIsDeleting(false);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [
        siteSet,
        nList,
        pList,
        skList,
        expList,
        eduList,
        certList,
        resConf,
        letList,
        secList,
        sList,
        iList,
        aList,
        mList,
        tList,
        cList,
        msgList,
        uList,
        audits,
      ] = await Promise.all([
        getSiteSettings(),
        getNavigationItems(),
        getProjects(true),
        getSkills(true),
        getExperience(true),
        getEducation(true),
        getCertifications(true),
        getResumeConfig(),
        getExecutiveLetters(),
        getPageSections(undefined, true),
        getServices(true),
        getIndustries(true),
        getArticles(true),
        getMediaItems(),
        getTestimonials(true),
        getConsultationRequests(),
        getContactMessages(),
        getUsersList(),
        getAuditLogs(),
      ]);

      setSettings(siteSet);
      setNavItems(nList);
      setProjects(pList);
      setSkills(skList);
      setExperience(expList);
      setEducation(eduList);
      setCertifications(certList);
      setResumeConfig(resConf);
      setLetters(letList);
      setSections(secList);
      setServices(sList);
      setIndustries(iList);
      setArticles(aList);
      setMediaItems(mList);
      setTestimonials(tList);
      setConsultations(cList);
      setMessages(msgList);
      setUsers(uList);
      setAuditLogs(audits);
    } catch (err) {
      console.warn('Admin data load note:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllAdminData();
    }
  }, [isAdmin]);

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSeedDatabase = async () => {
    const seeded = await seedInitialDatabaseIfEmpty();
    if (seeded) {
      showNotice('Database successfully populated with corporate consulting & portfolio seed content.');
      await logAuditEvent(
        'SEED_DATABASE',
        'Database',
        'init',
        'Seeded full corporate and portfolio catalog',
        currentUser?.uid || 'admin',
        currentUser?.email || 'admin'
      );
      await loadAllAdminData();
      onRefreshPublicData();
    } else {
      showNotice('Database already contains existing configuration.');
    }
  };

  // Guard: Access Denied if non-admin
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border border-slate-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">
            Access Restricted
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The administrator dashboard and content management system requires verified administrative credentials.
          </p>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 font-mono">
            Configured Admin: arabsafashion@gmail.com
          </div>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => onNavigate('login')}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
            >
              Sign In with Admin Account
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Summary Metrics Calculations
  const verifiedUsersCount = users.filter((u) => u.emailVerified).length;
  const unverifiedUsersCount = users.length - verifiedUsersCount;
  const pendingConsultationsCount = consultations.filter((c) => c.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const publishedArticlesCount = articles.filter((a) => a.status === 'published').length;
  const publishedProjectsCount = projects.filter((p) => p.status === 'published').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      {/* Top Admin Header Bar */}
      <div className="bg-[#0a1826] text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-1.5 text-slate-300 hover:text-white rounded bg-white/5 border border-slate-700"
            aria-label="Toggle Admin Navigation"
          >
            {mobileSidebarOpen ? <XIcon className="w-4 h-4 text-[#D5A13A]" /> : <MenuIcon className="w-4 h-4 text-slate-300" />}
          </button>
          <div className="w-8 h-8 rounded bg-[#D5A13A] text-[#10283F] font-serif font-bold text-base flex items-center justify-center shadow shrink-0">
            EA
          </div>
          <div>
            <h1 className="font-serif text-sm sm:text-base font-bold text-white tracking-wide truncate max-w-[160px] sm:max-w-none">
              {settings?.companyName || 'Erukneh Ademe'} &bull; Master Content Management
            </h1>
            <span className="text-[10px] text-slate-400 block truncate">
              Authorized Administrator: {currentUser?.email}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleSeedDatabase}
            title="Seed baseline consulting services, portfolio, and skills if empty"
            className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] hover:bg-[#e6b956] rounded transition-colors shadow items-center"
          >
            <Database className="w-3.5 h-3.5 mr-1" />
            Seed Defaults
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded transition-colors flex items-center"
          >
            <Eye className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>
          <button
            onClick={async () => {
              await logout();
              onNavigate('login');
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-white/5 rounded transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-600 text-white text-xs px-6 py-2 flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-white hover:underline">
            ✕
          </button>
        </div>
      )}

      {/* Main Admin Content Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar Navigation: 18 Modules + Configuration Accordion */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 lg:static lg:w-64 bg-[#10283F] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 overflow-y-auto transition-transform duration-200 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-0.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-3 py-2 text-xs font-medium rounded flex items-center space-x-2.5 transition-colors mb-2 ${
                activeTab === 'overview'
                  ? 'bg-[#D5A13A] text-[#10283F] font-bold shadow'
                  : 'hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Overview</span>
            </button>

            {/* Accordion Menu: Configuration */}
            <div className="pt-1 pb-1">
              <button
                type="button"
                onClick={() => setIsConfigOpen(!isConfigOpen)}
                className="w-full text-left px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white flex items-center justify-between transition-colors bg-white/5 rounded-md border border-slate-700/60"
              >
                <div className="flex items-center space-x-2">
                  <Sliders className="w-3.5 h-3.5 text-[#D5A13A]" />
                  <span>Configuration</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isConfigOpen ? 'rotate-180 text-[#D5A13A]' : ''
                  }`}
                />
              </button>

              {isConfigOpen && (
                <div className="pl-2 pr-1 pt-1.5 space-y-0.5 border-l-2 border-[#D5A13A]/50 ml-3 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'settings' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Sliders className="w-3 h-3 text-[#D5A13A]" />
                    <span>General Settings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('company-info')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'company-info' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Building className="w-3 h-3 text-[#D5A13A]" />
                    <span>Company Information</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('branding')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'branding' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Award className="w-3 h-3 text-[#D5A13A]" />
                    <span>Branding & Logo</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('theme')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'theme' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Layout className="w-3 h-3 text-[#D5A13A]" />
                    <span>Theme & Colors</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('navigation')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'navigation' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Compass className="w-3 h-3 text-[#D5A13A]" />
                    <span>Navigation Management</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('hero')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'hero' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Eye className="w-3 h-3 text-[#D5A13A]" />
                    <span>Homepage Configuration</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('builder')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'builder' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Layers className="w-3 h-3 text-[#D5A13A]" />
                    <span>Page Management</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('footer')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'footer' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Layout className="w-3 h-3 text-[#D5A13A]" />
                    <span>Footer Configuration</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'contact' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Phone className="w-3 h-3 text-[#D5A13A]" />
                    <span>Contact & Social Media</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('seo')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'seo' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Share2 className="w-3 h-3 text-[#D5A13A]" />
                    <span>SEO Settings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('customers')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'customers' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Users className="w-3 h-3 text-[#D5A13A]" />
                    <span>User & Role Management</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'security' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Lock className="w-3 h-3 text-[#D5A13A]" />
                    <span>Security Settings</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('audit')}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                      activeTab === 'audit' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3 h-3 text-[#D5A13A]" />
                    <span>Audit Logs</span>
                  </button>
                </div>
              )}
            </div>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Website Content Modules
            </div>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'hero' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>3. Homepage & Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'about' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>4. About Me & Founder</span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Executive Career & Portfolio
            </div>

            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'skills' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>5. Skills & Technologies</span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'experience' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>6. Work Experience</span>
            </button>

            <button
              onClick={() => setActiveTab('education')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'education' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>7. Education</span>
            </button>

            <button
              onClick={() => setActiveTab('certifications')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'certifications' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>8. Certifications & Training</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'projects' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>9. Projects & Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('resume')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'resume' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>10. Resume / CV Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('letters')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'letters' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>11. Executive Letter Generator</span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Content & Layout CMS
            </div>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'contact' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>12. Contact Information</span>
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'testimonials' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>13. Testimonials ({testimonials.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'articles' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>14. Blog & Articles ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'footer' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>15. Footer CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'media' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>16. Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'builder' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>17. Page & Section Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('seo')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'seo' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>18. SEO & Social Sharing</span>
            </button>

            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pt-3 pb-1">
              Client Enquiries & Audit
            </div>

            <button
              onClick={() => setActiveTab('consultations')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                activeTab === 'consultations' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Consultations</span>
              </div>
              {pendingConsultationsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-[#10283F] font-bold">
                  {pendingConsultationsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center justify-between transition-colors ${
                activeTab === 'messages' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Messages</span>
              </div>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-[#10283F] font-bold">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'customers' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Customers ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full text-left px-3 py-1.5 text-xs rounded flex items-center space-x-2 transition-colors ${
                activeTab === 'audit' ? 'bg-[#D5A13A] text-[#10283F] font-bold' : 'hover:bg-white/5'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit Logs</span>
            </button>
          </div>

          <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500">
            Erukneh Ademe Executive CMS &bull; All 18 Modules Active
          </div>
        </aside>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {loading ? (
            <div className="py-24 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-[#10283F]" />
              <p className="text-sm font-medium">Syncing with Cloud Firestore...</p>
            </div>
          ) : (
            <>
              {/* MODULE 0: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Executive Dashboard Overview
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Complete real-time metrics across all 18 configured website & portfolio modules.
                    </p>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                        <span>Total Customers</span>
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-[#10283F]">
                        {users.length}
                      </div>
                      <div className="text-[11px] text-emerald-600 flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {verifiedUsersCount} Verified &bull; {unverifiedUsersCount} Pending
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                        <span>Pending Consultations</span>
                        <Calendar className="w-4 h-4 text-amber-500" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-amber-600">
                        {pendingConsultationsCount}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {consultations.length} total inquiries logged
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                        <span>Portfolio Case Studies</span>
                        <Briefcase className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-[#10283F]">
                        {publishedProjectsCount}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {projects.length} total projects documented
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                      <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                        <span>Core Competencies</span>
                        <Award className="w-4 h-4 text-[#D5A13A]" />
                      </div>
                      <div className="font-serif text-3xl font-bold text-[#10283F]">
                        {skills.length}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Across 5 strategic domains
                      </div>
                    </div>
                  </div>

                  {/* Quick Jump Buttons to All 18 Modules */}
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#10283F]">
                      Quick Access: 18 Content Management Modules
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
                      {[
                        { tab: 'settings', label: '1. Global Settings' },
                        { tab: 'navigation', label: '2. Navigation' },
                        { tab: 'hero', label: '3. Homepage & Hero' },
                        { tab: 'about', label: '4. About Me' },
                        { tab: 'skills', label: '5. Skills & Tech' },
                        { tab: 'experience', label: '6. Work Experience' },
                        { tab: 'education', label: '7. Education' },
                        { tab: 'certifications', label: '8. Certifications' },
                        { tab: 'projects', label: '9. Projects / Portfolio' },
                        { tab: 'resume', label: '10. Resume / CV' },
                        { tab: 'letters', label: '11. Letter Generator' },
                        { tab: 'contact', label: '12. Contact Details' },
                        { tab: 'testimonials', label: '13. Testimonials' },
                        { tab: 'articles', label: '14. Blog & Articles' },
                        { tab: 'footer', label: '15. Footer CMS' },
                        { tab: 'media', label: '16. Media Library' },
                        { tab: 'builder', label: '17. Section Builder' },
                        { tab: 'seo', label: '18. SEO & Social' },
                      ].map((mod) => (
                        <button
                          key={mod.tab}
                          onClick={() => setActiveTab(mod.tab as any)}
                          className="p-2.5 rounded border border-slate-200 bg-slate-50 hover:bg-[#10283F] hover:text-white transition-colors text-left font-medium truncate"
                        >
                          {mod.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recent Consultations Table */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-[#10283F]">
                        Recent Consultation Inquiries
                      </h3>
                      <button
                        onClick={() => setActiveTab('consultations')}
                        className="text-xs text-[#b88528] font-semibold hover:underline"
                      >
                        View All Inquiries &rarr;
                      </button>
                    </div>

                    {consultations.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">
                        No consultation requests currently received.
                      </p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                            <tr>
                              <th className="py-2.5 px-4">Client</th>
                              <th className="py-2.5 px-4">Organization</th>
                              <th className="py-2.5 px-4">Service Required</th>
                              <th className="py-2.5 px-4">Status</th>
                              <th className="py-2.5 px-4">Date</th>
                              <th className="py-2.5 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {consultations.slice(0, 5).map((req) => (
                              <tr key={req.id} className="hover:bg-slate-50/80">
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {req.clientName}
                                  <span className="block text-[10px] font-normal text-slate-400">
                                    {req.email}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-700">{req.companyName}</td>
                                <td className="py-3 px-4 text-slate-700">{req.serviceInterest}</td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                      req.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800'
                                        : req.status === 'reviewed'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {req.status}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                  {new Date(req.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => {
                                      setViewingConsultation(req);
                                      setConsultationNote(req.adminNotes || '');
                                    }}
                                    className="text-xs font-semibold text-[#10283F] hover:text-[#b88528]"
                                  >
                                    Review
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MODULE 1: GLOBAL WEBSITE SETTINGS */}
              {activeTab === 'settings' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 1: Global Website Settings
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure corporate name, logo, brand colors, typography, and copyright text.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      await logAuditEvent('UPDATE_SETTINGS', 'SiteSettings', 'global', 'Saved global settings', currentUser?.uid || 'admin', currentUser?.email || 'admin');
                      onRefreshPublicData();
                      showNotice('Global website settings saved.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Company / Portfolio Name</label>
                        <input
                          type="text"
                          value={settings.companyName || ''}
                          onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tagline</label>
                        <input
                          type="text"
                          value={settings.tagline || ''}
                          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Primary Color</label>
                        <input
                          type="text"
                          value={settings.primaryColor || '#10283F'}
                          onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                          className="w-full p-2 border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Accent Gold Color</label>
                        <input
                          type="text"
                          value={settings.accentColor || '#D5A13A'}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="w-full p-2 border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Logo URL (Optional)</label>
                        <input
                          type="text"
                          value={settings.logoUrl || ''}
                          onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                          placeholder="Leave blank for EA monogram emblem"
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Copyright Footer Text</label>
                      <input
                        type="text"
                        value={settings.copyrightText || ''}
                        onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Confidentiality Disclaimer Notice</label>
                      <input
                        type="text"
                        value={settings.disclaimerText || ''}
                        onChange={(e) => setSettings({ ...settings, disclaimerText: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Save Global Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CONFIGURATION: NAVIGATION MANAGEMENT */}
              {activeTab === 'navigation' && (
                <NavigationManager
                  navItems={navItems}
                  currentUserEmail={currentUser?.email || 'admin'}
                  currentUserId={currentUser?.uid || 'admin'}
                  onRefresh={async () => {
                    await loadAllAdminData();
                    onRefreshPublicData();
                  }}
                  onShowNotice={showNotice}
                />
              )}

              {/* CONFIGURATION: COMPANY INFORMATION */}
              {activeTab === 'company-info' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Company & Advisory Information
                    </h2>
                    <p className="text-xs text-slate-500">
                      Manage official registered corporate name, founding credentials, head office location, and business hours.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      await logAuditEvent('UPDATE_COMPANY_INFO', 'SiteSettings', 'general', 'Updated corporate info', currentUser?.uid || 'admin', currentUser?.email || 'admin');
                      onRefreshPublicData();
                      showNotice('Company information updated successfully.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Company / Firm Legal Name</label>
                        <input
                          type="text"
                          value={settings.companyName || ''}
                          onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Corporate Tagline</label>
                        <input
                          type="text"
                          value={settings.tagline || ''}
                          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Headquarters Street Address</label>
                        <input
                          type="text"
                          value={settings.address || ''}
                          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Operating Business Hours</label>
                        <input
                          type="text"
                          value={settings.workingHours || ''}
                          onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Primary Telephone</label>
                        <input
                          type="text"
                          value={settings.phone || ''}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full p-2 border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Secondary / Direct Mobile</label>
                        <input
                          type="text"
                          value={settings.secondaryPhone || ''}
                          onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
                          className="w-full p-2 border rounded font-mono"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Official Corporate Email</label>
                        <input
                          type="email"
                          value={settings.email || ''}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full p-2 border rounded font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Save Company Information
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CONFIGURATION: BRANDING & LOGO */}
              {activeTab === 'branding' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Branding & Logo Configuration
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure corporate emblem, logo artwork, favicon, and brand badges.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      await logAuditEvent('UPDATE_BRANDING', 'SiteSettings', 'branding', 'Updated branding and logo', currentUser?.uid || 'admin', currentUser?.email || 'admin');
                      onRefreshPublicData();
                      showNotice('Branding and logo settings saved.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Logo Image URL</label>
                          <input
                            type="text"
                            value={settings.logoUrl || ''}
                            onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                            placeholder="Leave empty to use official EA monogram emblem"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Favicon URL</label>
                          <input
                            type="text"
                            value={settings.faviconUrl || ''}
                            onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
                            placeholder="/favicon.ico or icon URL"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">Hero Eyebrow Badge</label>
                          <input
                            type="text"
                            value={settings.heroBadge || ''}
                            onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                            placeholder="e.g. Premier Advisory • Addis Ababa & East Africa"
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center space-y-3">
                        <span className="text-xs font-semibold text-slate-500">Logo Live Preview</span>
                        {settings.logoUrl ? (
                          <img
                            src={settings.logoUrl}
                            alt="Logo Preview"
                            className="w-20 h-20 object-contain rounded-lg border border-slate-200 bg-white p-2"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#D5A13A] via-[#b88528] to-[#916215] p-1 shadow-md">
                            <div className="w-full h-full bg-[#10283F] rounded-[9px] flex items-center justify-center border border-[#D5A13A]/40">
                              <span className="font-serif font-bold text-2xl text-[#D5A13A]">
                                EA
                              </span>
                            </div>
                          </div>
                        )}
                        <span className="text-[11px] text-slate-400">
                          {settings.logoUrl ? 'Custom Image Logo Active' : 'Default Gold Monogram Emblem Active'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Save Branding Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CONFIGURATION: THEME & COLORS */}
              {activeTab === 'theme' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Theme & Visual Styling
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure corporate palette: deep navy blue, warm gold accent, neutral tones, and typography.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      await logAuditEvent('UPDATE_THEME', 'SiteSettings', 'theme', 'Updated theme & colors', currentUser?.uid || 'admin', currentUser?.email || 'admin');
                      onRefreshPublicData();
                      showNotice('Theme and colors updated successfully.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Primary Corporate Navy</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.primaryColor || '#10283F'}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-10 h-9 p-0.5 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.primaryColor || '#10283F'}
                            onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                            className="w-full p-2 border rounded font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Accent Gold Color</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.accentColor || '#D5A13A'}
                            onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                            className="w-10 h-9 p-0.5 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.accentColor || '#D5A13A'}
                            onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                            className="w-full p-2 border rounded font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Background Secondary</label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settings.secondaryColor || '#ffffff'}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                            className="w-10 h-9 p-0.5 border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={settings.secondaryColor || '#ffffff'}
                            onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                            className="w-full p-2 border rounded font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <h4 className="font-semibold text-slate-800 mb-2">Palette Preview</h4>
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-12 w-28 rounded shadow flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: settings.primaryColor || '#10283F' }}
                        >
                          Navy Blue
                        </div>
                        <div
                          className="h-12 w-28 rounded shadow flex items-center justify-center text-[#10283F] font-bold text-xs"
                          style={{ backgroundColor: settings.accentColor || '#D5A13A' }}
                        >
                          Gold Accent
                        </div>
                        <div
                          className="h-12 w-28 rounded shadow border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs"
                          style={{ backgroundColor: settings.secondaryColor || '#ffffff' }}
                        >
                          Background
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Apply Theme Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CONFIGURATION: SECURITY SETTINGS */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Security & Authentication Settings
                    </h2>
                    <p className="text-xs text-slate-500">
                      Audit identity enforcement, verified login rules, password-reset configuration, and RBAC policies.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 text-emerald-700 font-semibold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Email Verification Enforced</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Every newly registered user is required to verify their email address before accessing protected client dashboards and private consultation requests.
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-700 space-y-1">
                        <div>Enforcement: <strong>Active on all routes</strong></div>
                        <div>Rate Limiting: <strong>60-second cooloff per resend</strong></div>
                        <div>Unverified Access: <strong>Blocked with verification banner</strong></div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center space-x-2 text-[#10283F] font-semibold text-sm">
                        <Shield className="w-5 h-5 text-[#D5A13A]" />
                        <span>Firebase Password Reset Standard</span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        Password recovery uses the official Firebase Web SDK flow (`sendPasswordResetEmail`, `verifyPasswordResetCode`, `confirmPasswordReset`). Supported action modes: `resetPassword`, `verifyEmail`, `recoverEmail`.
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-700 space-y-1">
                        <div>Action Link Mode: <strong>resetPassword (standard)</strong></div>
                        <div>Enumeration Protection: <strong>Generic confirmation dialogs</strong></div>
                        <div>Invalid Mode Handling: <strong>Graceful recovery prompt</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODULE 3: HOMEPAGE AND HERO SECTION */}
              {activeTab === 'hero' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 3: Homepage & Hero Section
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure hero headline, supporting text, CTA buttons, badges, and cover imagery.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      onRefreshPublicData();
                      showNotice('Hero section updated.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hero Badge Text</label>
                      <input
                        type="text"
                        value={settings.heroBadge || ''}
                        onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Headline (H1)</label>
                      <input
                        type="text"
                        value={settings.heroTitle || ''}
                        onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                        className="w-full p-2 border rounded font-serif text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Supporting Description</label>
                      <textarea
                        rows={3}
                        value={settings.heroSubtitle || ''}
                        onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Primary Button Label</label>
                        <input
                          type="text"
                          value={settings.heroPrimaryBtnText || 'Explore Our Services'}
                          onChange={(e) => setSettings({ ...settings, heroPrimaryBtnText: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Secondary Button Label</label>
                        <input
                          type="text"
                          value={settings.heroSecondaryBtnText || 'Book a Consultation'}
                          onChange={(e) => setSettings({ ...settings, heroSecondaryBtnText: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Hero Image URL</label>
                      <input
                        type="text"
                        value={settings.heroImageUrl || ''}
                        onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Publish Hero Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODULE 4: ABOUT ME */}
              {activeTab === 'about' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 4: About Me & Founder Profile
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure personal introduction, founder biography, credentials, and methodology.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      onRefreshPublicData();
                      showNotice('About Me content updated.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Founder Full Name</label>
                        <input
                          type="text"
                          value={settings.founderName || ''}
                          onChange={(e) => setSettings({ ...settings, founderName: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Founder Executive Title</label>
                        <input
                          type="text"
                          value={settings.founderTitle || ''}
                          onChange={(e) => setSettings({ ...settings, founderTitle: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Founder Photo URL</label>
                      <input
                        type="text"
                        value={settings.founderImageUrl || ''}
                        onChange={(e) => setSettings({ ...settings, founderImageUrl: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Executive Biography</label>
                      <textarea
                        rows={4}
                        value={settings.founderBio || ''}
                        onChange={(e) => setSettings({ ...settings, founderBio: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Company / Practice Overview</label>
                      <textarea
                        rows={3}
                        value={settings.aboutSummary || ''}
                        onChange={(e) => setSettings({ ...settings, aboutSummary: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Vision Statement</label>
                        <textarea
                          rows={2}
                          value={settings.vision || ''}
                          onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Mission Statement</label>
                        <textarea
                          rows={2}
                          value={settings.mission || ''}
                          onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Publish About Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODULE 5: SKILLS AND TECHNOLOGIES */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 5: Skills & Technologies
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage strategic capabilities, analytical proficiencies, and tools.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingSkill({
                          name: '',
                          category: 'Strategy & Growth',
                          proficiency: 90,
                          icon: 'TrendingUp',
                          order: skills.length + 1,
                          status: 'published',
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Skill
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Skill Name</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Proficiency</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {skills.map((s) => (
                          <tr key={s.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">{s.name}</td>
                            <td className="py-3 px-4 text-slate-600">{s.category}</td>
                            <td className="py-3 px-4 font-mono text-[#b88528] font-bold">
                              {s.proficiency}%
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingSkill(s)}
                                className="text-slate-600 hover:text-[#10283F]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'Skill',
                                    id: s.id,
                                    name: s.name,
                                    deleteFn: deleteSkill,
                                    successMsg: `Skill "${s.name}" permanently deleted.`,
                                    auditAction: 'DELETE_SKILL',
                                    auditEntity: 'Skill',
                                  })
                                }
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 6: WORK EXPERIENCE */}
              {activeTab === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 6: Work Experience
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage career chronology, advisory roles, and verified achievements.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingExperience({
                          role: '',
                          company: '',
                          location: 'Addis Ababa, Ethiopia',
                          period: '2020 - Present',
                          summary: '',
                          achievements: [],
                          order: experience.length + 1,
                          status: 'published',
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Work Experience
                    </button>
                  </div>

                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div
                        key={exp.id}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 max-w-2xl">
                          <span className="font-mono text-[11px] text-[#b88528] font-bold">
                            {exp.period}
                          </span>
                          <h4 className="font-serif text-base font-bold text-[#10283F]">
                            {exp.role} &mdash; <span className="font-sans font-semibold text-slate-700">{exp.company}</span>
                          </h4>
                          <p className="text-xs text-slate-500">{exp.location}</p>
                          <p className="text-xs text-slate-700 pt-1 leading-relaxed">{exp.summary}</p>
                        </div>
                        <div className="space-x-2 shrink-0 text-xs">
                          <button
                            onClick={() => setEditingExperience(exp)}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: 'Work Experience',
                                id: exp.id,
                                name: `${exp.role} at ${exp.company}`,
                                deleteFn: deleteExperience,
                                successMsg: 'Work experience record permanently deleted.',
                                auditAction: 'DELETE_EXPERIENCE',
                                auditEntity: 'Experience',
                              })
                            }
                            className="px-3 py-1 text-rose-600 hover:bg-rose-50 rounded font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 7: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 7: Academic Education
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage university degrees, alma maters, graduation years, and honors.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingEducation({
                          institution: '',
                          degree: 'Master of Science',
                          field: 'Finance',
                          graduationYear: '2010',
                          honors: '',
                          order: education.length + 1,
                          status: 'published',
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Degree
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Degree & Field</th>
                          <th className="py-3 px-4">Institution</th>
                          <th className="py-3 px-4">Year</th>
                          <th className="py-3 px-4">Honors</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {education.map((edu) => (
                          <tr key={edu.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {edu.degree} in {edu.field}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{edu.institution}</td>
                            <td className="py-3 px-4 font-mono text-slate-600">{edu.graduationYear}</td>
                            <td className="py-3 px-4 text-slate-600">{edu.honors || '—'}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingEducation(edu)}
                                className="text-slate-600 hover:text-[#10283F]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'Education',
                                    id: edu.id,
                                    name: `${edu.degree} (${edu.institution})`,
                                    deleteFn: deleteEducation,
                                    successMsg: 'Education record permanently deleted.',
                                    auditAction: 'DELETE_EDUCATION',
                                    auditEntity: 'Education',
                                  })
                                }
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 8: CERTIFICATIONS AND TRAINING */}
              {activeTab === 'certifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 8: Certifications & Training
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage professional credentials, regulatory licenses, and accreditation IDs.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingCert({
                          title: '',
                          issuer: '',
                          issueDate: '2020',
                          credentialId: '',
                          order: certifications.length + 1,
                          status: 'published',
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Certification
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Accrediting Issuer</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Credential ID</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {certifications.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">{c.title}</td>
                            <td className="py-3 px-4 text-slate-600">{c.issuer}</td>
                            <td className="py-3 px-4 font-mono text-slate-600">{c.issueDate}</td>
                            <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{c.credentialId || '—'}</td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingCert(c)}
                                className="text-slate-600 hover:text-[#10283F]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'Certification',
                                    id: c.id,
                                    name: `${c.title} (${c.issuer})`,
                                    deleteFn: deleteCertification,
                                    successMsg: 'Certification permanently deleted.',
                                    auditAction: 'DELETE_CERTIFICATION',
                                    auditEntity: 'Certification',
                                  })
                                }
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 9: PROJECTS AND PORTFOLIO */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 9: Projects & Strategic Portfolio
                      </h2>
                      <p className="text-xs text-slate-500">
                        Document and publish real-world case studies, client mandates, and impact metrics.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingProject({
                          title: '',
                          slug: `proj-${Date.now()}`,
                          client: '',
                          summary: '',
                          description: '',
                          impactMetrics: '',
                          coverImageUrl:
                            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
                          tags: ['Strategy', 'Finance'],
                          order: projects.length + 1,
                          status: 'published',
                          createdAt: new Date().toISOString(),
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Case Study
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Impact Metrics</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {projects.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                              {p.title}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{p.client}</td>
                            <td className="py-3 px-4 text-slate-600">{p.impactMetrics}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingProject(p)}
                                className="text-slate-600 hover:text-[#10283F]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'Project',
                                    id: p.id,
                                    name: p.title,
                                    deleteFn: deleteProject,
                                    successMsg: `Project "${p.title}" permanently deleted.`,
                                    auditAction: 'DELETE_PROJECT',
                                    auditEntity: 'Project',
                                  })
                                }
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 10: RESUME / CV */}
              {activeTab === 'resume' && resumeConfig && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 10: Resume / Curriculum Vitae Settings
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure target role, executive summary, contact details, and downloadable CV documents.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await saveResumeConfig(resumeConfig);
                      showNotice('Resume settings updated.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Target Professional Role</label>
                        <input
                          type="text"
                          value={resumeConfig.targetRole || ''}
                          onChange={(e) => setResumeConfig({ ...resumeConfig, targetRole: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Location Details</label>
                        <input
                          type="text"
                          value={resumeConfig.location || ''}
                          onChange={(e) => setResumeConfig({ ...resumeConfig, location: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">CV Contact Email</label>
                        <input
                          type="email"
                          value={resumeConfig.contactEmail || ''}
                          onChange={(e) => setResumeConfig({ ...resumeConfig, contactEmail: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">CV Contact Phone</label>
                        <input
                          type="text"
                          value={resumeConfig.contactPhone || ''}
                          onChange={(e) => setResumeConfig({ ...resumeConfig, contactPhone: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Executive Profile Summary</label>
                      <textarea
                        rows={4}
                        value={resumeConfig.executiveSummary || ''}
                        onChange={(e) => setResumeConfig({ ...resumeConfig, executiveSummary: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Save Resume Configuration
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODULE 11: EXECUTIVE LETTER GENERATOR */}
              {activeTab === 'letters' && settings && (
                <ExecutiveLetterGenerator
                  letters={letters}
                  settings={settings}
                  onRefresh={loadAllAdminData}
                  showNotice={showNotice}
                />
              )}

              {/* MODULE 12: CONTACT INFORMATION */}
              {activeTab === 'contact' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 12: Contact Information & Office
                    </h2>
                    <p className="text-xs text-slate-500">
                      Update head office address, telephone lines, and operating hours.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      onRefreshPublicData();
                      showNotice('Contact information saved.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Office Address</label>
                      <input
                        type="text"
                        value={settings.address || ''}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Main Phone Line</label>
                        <input
                          type="text"
                          value={settings.phone || ''}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Secondary / Direct Line</label>
                        <input
                          type="text"
                          value={settings.secondaryPhone || ''}
                          onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Corporate Email</label>
                        <input
                          type="email"
                          value={settings.email || ''}
                          onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Operating Hours</label>
                        <input
                          type="text"
                          value={settings.workingHours || ''}
                          onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Publish Contact Updates
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODULE 13: TESTIMONIALS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 13: Client Testimonials
                      </h2>
                      <p className="text-xs text-slate-500">
                        Manage corporate endorsements and client feedback.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingTestimonial({
                          clientName: '',
                          clientTitle: '',
                          clientCompany: '',
                          clientLocation: 'Addis Ababa, Ethiopia',
                          avatarUrl:
                            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
                          rating: 5,
                          quote: '',
                          serviceCategory: 'Strategic Advisory',
                          status: 'published',
                          order: testimonials.length + 1,
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Add Testimonial
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((test) => (
                      <div
                        key={test.id}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 text-xs"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#10283F]">{test.clientName}</span>
                            <span className="text-amber-500">★ {test.rating}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{test.clientCompany}</p>
                          <p className="text-slate-700 italic">"{test.quote}"</p>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2 border-t">
                          <button
                            onClick={() => setEditingTestimonial(test)}
                            className="text-slate-600 hover:text-[#10283F]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: 'Testimonial',
                                id: test.id,
                                name: `${test.clientName} (${test.clientCompany})`,
                                deleteFn: deleteTestimonial,
                                successMsg: 'Testimonial permanently deleted.',
                                auditAction: 'DELETE_TESTIMONIAL',
                                auditEntity: 'Testimonial',
                              })
                            }
                            className="text-rose-600 hover:text-rose-800 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 14: BLOG OR ARTICLES */}
              {activeTab === 'articles' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                        Module 14: Blog & Insights CMS
                      </h2>
                      <p className="text-xs text-slate-500">
                        Create, publish, and edit thought leadership articles with SEO tags.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setEditingArticle({
                          title: '',
                          slug: `article-${Date.now()}`,
                          summary: '',
                          content: '',
                          featuredImageUrl:
                            'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
                          author: settings?.founderName || 'Erukneh Ademe',
                          authorRole: 'Managing Partner',
                          category: 'Strategy',
                          tags: ['Strategy', 'Ethiopia'],
                          readTimeMinutes: 5,
                          status: 'published',
                          publishedAt: new Date().toISOString(),
                        })
                      }
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow flex items-center"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1 text-[#D5A13A]" />
                      Write New Insight
                    </button>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Title</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {articles.map((art) => (
                          <tr key={art.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900 max-w-xs truncate">
                              {art.title}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{art.category}</td>
                            <td className="py-3 px-4 text-slate-600">{art.author}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                                {art.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2">
                              <button
                                onClick={() => setEditingArticle(art)}
                                className="text-slate-600 hover:text-[#10283F]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteTarget({
                                    type: 'Article',
                                    id: art.id,
                                    name: art.title,
                                    deleteFn: deleteArticle,
                                    successMsg: `Article "${art.title}" permanently deleted.`,
                                    auditAction: 'DELETE_ARTICLE',
                                    auditEntity: 'Article',
                                  })
                                }
                                className="text-rose-600 hover:text-rose-800 font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MODULE 15: FOOTER CMS */}
              {activeTab === 'footer' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 15: Footer CMS
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure consultation CTA banner, social links, and footer disclaimer.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      onRefreshPublicData();
                      showNotice('Footer configuration saved.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Upper CTA Banner Heading</label>
                      <input
                        type="text"
                        value={settings.consultationCtaHeading || ''}
                        onChange={(e) => setSettings({ ...settings, consultationCtaHeading: e.target.value })}
                        className="w-full p-2 border rounded font-serif text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Upper CTA Banner Subtext</label>
                      <textarea
                        rows={2}
                        value={settings.consultationCtaText || ''}
                        onChange={(e) => setSettings({ ...settings, consultationCtaText: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={settings.socialLinks?.linkedin || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialLinks: { ...settings.socialLinks, linkedin: e.target.value },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Twitter / X URL</label>
                        <input
                          type="text"
                          value={settings.socialLinks?.twitter || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialLinks: { ...settings.socialLinks, twitter: e.target.value },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Telegram URL</label>
                        <input
                          type="text"
                          value={settings.socialLinks?.telegram || ''}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              socialLinks: { ...settings.socialLinks, telegram: e.target.value },
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Publish Footer Settings
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MODULE 16: IMAGES AND MEDIA LIBRARY */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 16: Centralized Media Library
                    </h2>
                    <p className="text-xs text-slate-500">
                      Upload, replace, and organize media assets stored in Firebase Storage.
                    </p>
                  </div>

                  <MediaUploader
                    onUploadSuccess={() => {
                      loadAllAdminData();
                      showNotice('Asset uploaded and registered in Media Library.');
                    }}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-4">
                    {mediaItems.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
                        <div className="h-28 bg-slate-100 overflow-hidden">
                          <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2 space-y-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.title}</p>
                          <div className="flex justify-between items-center text-[10px]">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                showNotice('URL copied to clipboard.');
                              }}
                              className="text-[#b88528] font-semibold hover:underline"
                            >
                              Copy URL
                            </button>
                            <button
                              onClick={async () => {
                                if (confirm(`Remove asset "${item.title}"?`)) {
                                  await deleteMediaItem(item.id);
                                  await loadAllAdminData();
                                  showNotice('Media item removed.');
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MODULE 17: PAGE AND SECTION MANAGEMENT */}
              {activeTab === 'builder' && (
                <SectionBuilder
                  sections={sections}
                  onRefresh={loadAllAdminData}
                  showNotice={showNotice}
                />
              )}

              {/* MODULE 18: SEO AND SOCIAL SHARING SETTINGS */}
              {activeTab === 'seo' && settings && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Module 18: SEO & Social Sharing Settings
                    </h2>
                    <p className="text-xs text-slate-500">
                      Configure OpenGraph preview cards, default meta description, and page titles.
                    </p>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await updateSiteSettings(settings);
                      onRefreshPublicData();
                      showNotice('SEO settings saved.');
                    }}
                    className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs"
                  >
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Global SEO Title</label>
                      <input
                        type="text"
                        value={settings.seoTitle || ''}
                        onChange={(e) => setSettings({ ...settings, seoTitle: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Meta Description</label>
                      <textarea
                        rows={3}
                        value={settings.seoDescription || ''}
                        onChange={(e) => setSettings({ ...settings, seoDescription: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">OpenGraph Social Share Image URL</label>
                      <input
                        type="text"
                        value={settings.ogImageUrl || ''}
                        onChange={(e) => setSettings({ ...settings, ogImageUrl: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-5 py-2 font-semibold text-white bg-[#10283F] hover:bg-[#173859] rounded shadow"
                      >
                        Publish SEO Metadata
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CONSULTATIONS */}
              {activeTab === 'consultations' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Consultation Inquiries & Scheduling
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Client</th>
                          <th className="py-3 px-4">Company</th>
                          <th className="py-3 px-4">Service</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Review</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {consultations.map((req) => (
                          <tr key={req.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">{req.clientName}</td>
                            <td className="py-3 px-4 text-slate-600">{req.companyName}</td>
                            <td className="py-3 px-4 text-slate-600">{req.serviceInterest}</td>
                            <td className="py-3 px-4">
                              <select
                                value={req.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await updateConsultationStatus(req.id, newStatus);
                                  await loadAllAdminData();
                                  showNotice(`Status updated to ${newStatus}`);
                                }}
                                className="p-1 border rounded text-xs bg-white"
                              >
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="scheduled">Scheduled</option>
                                <option value="completed">Completed</option>
                                <option value="archived">Archived</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setViewingConsultation(req);
                                  setConsultationNote(req.adminNotes || '');
                                }}
                                className="px-3 py-1 text-xs font-semibold text-[#10283F] bg-slate-100 hover:bg-slate-200 rounded"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Contact Messages Inbox
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs">
                        <div className="flex justify-between items-center border-b pb-2">
                          <span className="font-bold text-[#10283F] text-sm">{msg.subject}</span>
                          <span className="text-slate-400 text-[10px]">{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-slate-500">From: {msg.fullName} ({msg.email}) {msg.phone ? `• Tel: ${msg.phone}` : ''}</p>
                        <p className="p-3 bg-slate-50 rounded border text-slate-700 whitespace-pre-line">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CUSTOMERS */}
              {activeTab === 'customers' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      Registered Customers
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Client Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Toggle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {users.map((u) => (
                          <tr key={u.uid} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-bold text-slate-900">{u.displayName || 'Unspecified'}</td>
                            <td className="py-3 px-4 text-slate-600">{u.email}</td>
                            <td className="py-3 px-4 text-slate-600">{u.role}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              {u.email !== 'arabsafashion@gmail.com' && (
                                <button
                                  onClick={async () => {
                                    const next = u.status === 'active' ? 'inactive' : 'active';
                                    await updateUserAccountStatus(u.uid, next);
                                    await loadAllAdminData();
                                    showNotice(`Account status updated to ${next}`);
                                  }}
                                  className="text-[#b88528] font-semibold hover:underline"
                                >
                                  {u.status === 'active' ? 'Deactivate' : 'Activate'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AUDIT LOGS */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#10283F]">
                      System Audit Trail
                    </h2>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                        <tr>
                          <th className="py-3 px-4">Action</th>
                          <th className="py-3 px-4">Entity</th>
                          <th className="py-3 px-4">Details</th>
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4 text-right">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-4 font-bold text-[#10283F]">{log.action}</td>
                            <td className="py-2.5 px-4 text-slate-600">{log.entityType}</td>
                            <td className="py-2.5 px-4 font-sans text-xs text-slate-700">{log.details}</td>
                            <td className="py-2.5 px-4 text-slate-500">{log.userEmail}</td>
                            <td className="py-2.5 px-4 text-right text-slate-400">
                              {new Date(log.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* MODAL: PROJECT EDIT */}
      {editingProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingProject.id ? 'Edit Case Study Project' : 'Add Case Study Project'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Client Name / Consortium</label>
                <input
                  type="text"
                  value={editingProject.client || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Impact Metrics Summary</label>
              <input
                type="text"
                value={editingProject.impactMetrics || ''}
                onChange={(e) => setEditingProject({ ...editingProject, impactMetrics: e.target.value })}
                placeholder="e.g. $42M Capital Raised • 320 Industrial Jobs Created"
                className="w-full p-2 border rounded font-semibold text-[#10283F]"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Executive Summary</label>
              <textarea
                rows={2}
                value={editingProject.summary || ''}
                onChange={(e) => setEditingProject({ ...editingProject, summary: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Detailed Case Study (Markdown)</label>
              <textarea
                rows={6}
                value={editingProject.description || ''}
                onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingProject.coverImageUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, coverImageUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editingProject.status || 'published'}
                  onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingProject.title) return alert('Title required');
                  await saveProject(editingProject, editingProject.id);
                  setEditingProject(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Project saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SKILL EDIT */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingSkill.id ? 'Edit Skill' : 'Add Strategic Capability'}
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Skill Name</label>
              <input
                type="text"
                value={editingSkill.name || ''}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={editingSkill.category || 'Strategy & Growth'}
                onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value as any })}
                className="w-full p-2 border rounded"
              >
                <option value="Strategy & Growth">Strategy & Growth</option>
                <option value="Finance & Capital">Finance & Capital</option>
                <option value="Operations & PMO">Operations & PMO</option>
                <option value="Technology & Analytics">Technology & Analytics</option>
                <option value="Governance & Leadership">Governance & Leadership</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Proficiency % ({editingSkill.proficiency}%)</label>
              <input
                type="range"
                min="50"
                max="100"
                value={editingSkill.proficiency || 90}
                onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingSkill(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingSkill.name) return alert('Skill name required');
                  await saveSkill(editingSkill, editingSkill.id);
                  setEditingSkill(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Skill saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPERIENCE EDIT */}
      {editingExperience && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingExperience.id ? 'Edit Experience' : 'Add Experience Record'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Role / Executive Title</label>
                <input
                  type="text"
                  value={editingExperience.role || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, role: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={editingExperience.company || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, company: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Period (e.g. 2018 - Present)</label>
                <input
                  type="text"
                  value={editingExperience.period || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, period: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location</label>
                <input
                  type="text"
                  value={editingExperience.location || ''}
                  onChange={(e) => setEditingExperience({ ...editingExperience, location: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Summary Description</label>
              <textarea
                rows={3}
                value={editingExperience.summary || ''}
                onChange={(e) => setEditingExperience({ ...editingExperience, summary: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingExperience(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingExperience.role || !editingExperience.company) return alert('Role and company required');
                  await saveExperience(editingExperience, editingExperience.id);
                  setEditingExperience(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Experience saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDUCATION EDIT */}
      {editingEducation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingEducation.id ? 'Edit Degree' : 'Add Degree'}
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Institution</label>
              <input
                type="text"
                value={editingEducation.institution || ''}
                onChange={(e) => setEditingEducation({ ...editingEducation, institution: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Degree</label>
                <input
                  type="text"
                  value={editingEducation.degree || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, degree: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Field of Study</label>
                <input
                  type="text"
                  value={editingEducation.field || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, field: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Graduation Year</label>
                <input
                  type="text"
                  value={editingEducation.graduationYear || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, graduationYear: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Honors (Optional)</label>
                <input
                  type="text"
                  value={editingEducation.honors || ''}
                  onChange={(e) => setEditingEducation({ ...editingEducation, honors: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingEducation(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingEducation.institution || !editingEducation.degree) return alert('Institution and degree required');
                  await saveEducation(editingEducation, editingEducation.id);
                  setEditingEducation(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Education saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Degree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CERTIFICATION EDIT */}
      {editingCert && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingCert.id ? 'Edit Certification' : 'Add Certification'}
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Certification Title</label>
              <input
                type="text"
                value={editingCert.title || ''}
                onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Issuing Body</label>
              <input
                type="text"
                value={editingCert.issuer || ''}
                onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date</label>
                <input
                  type="text"
                  value={editingCert.issueDate || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, issueDate: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Credential ID (Optional)</label>
                <input
                  type="text"
                  value={editingCert.credentialId || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credentialId: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingCert(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingCert.title || !editingCert.issuer) return alert('Title and issuer required');
                  await saveCertification(editingCert, editingCert.id);
                  setEditingCert(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Certification saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Credential
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NAVIGATION ITEM EDIT */}
      {editingNavItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingNavItem.id ? 'Edit Navigation Link' : 'Add Navigation Link'}
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Menu Label</label>
              <input
                type="text"
                value={editingNavItem.label || ''}
                onChange={(e) => setEditingNavItem({ ...editingNavItem, label: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Page</label>
              <select
                value={editingNavItem.page || 'home'}
                onChange={(e) => setEditingNavItem({ ...editingNavItem, page: e.target.value as any })}
                className="w-full p-2 border rounded"
              >
                <option value="home">Home</option>
                <option value="about">About Us</option>
                <option value="services">Services</option>
                <option value="industries">Industries</option>
                <option value="portfolio">Projects & Portfolio</option>
                <option value="skills">Skills & Experience</option>
                <option value="resume">Resume / CV</option>
                <option value="insights">Insights & Blog</option>
                <option value="contact">Contact</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Order Index</label>
                <input
                  type="number"
                  value={editingNavItem.order || 1}
                  onChange={(e) => setEditingNavItem({ ...editingNavItem, order: Number(e.target.value) })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visibility</label>
                <select
                  value={editingNavItem.isVisible ? 'yes' : 'no'}
                  onChange={(e) => setEditingNavItem({ ...editingNavItem, isVisible: e.target.value === 'yes' })}
                  className="w-full p-2 border rounded"
                >
                  <option value="yes">Visible</option>
                  <option value="no">Hidden</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingNavItem(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingNavItem.label) return alert('Label required');
                  await saveNavigationItem(editingNavItem, editingNavItem.id);
                  setEditingNavItem(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Navigation link saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Nav Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ARTICLE EDIT */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingArticle.id ? 'Edit Article' : 'Write New Article'}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Article Title</label>
                <input
                  type="text"
                  value={editingArticle.title || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={editingArticle.category || 'Strategy'}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Summary</label>
              <textarea
                rows={2}
                value={editingArticle.summary || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Content (Markdown)</label>
              <textarea
                rows={8}
                value={editingArticle.content || ''}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full p-2 border rounded font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={editingArticle.featuredImageUrl || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, featuredImageUrl: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status</label>
                <select
                  value={editingArticle.status || 'published'}
                  onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                  className="w-full p-2 border rounded"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingArticle.title || !editingArticle.content) return alert('Title and content required');
                  await saveArticle(editingArticle, editingArticle.id);
                  setEditingArticle(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Article saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TESTIMONIAL EDIT */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg font-bold text-[#10283F]">
              {editingTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Client Full Name</label>
              <input
                type="text"
                value={editingTestimonial.clientName || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingTestimonial.clientTitle || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientTitle: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Company</label>
                <input
                  type="text"
                  value={editingTestimonial.clientCompany || ''}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientCompany: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quote</label>
              <textarea
                rows={3}
                value={editingTestimonial.quote || ''}
                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2 pt-3 border-t">
              <button
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-1.5 text-slate-600 rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingTestimonial.clientName || !editingTestimonial.quote) return alert('Name and quote required');
                  await saveTestimonial(editingTestimonial, editingTestimonial.id);
                  setEditingTestimonial(null);
                  await loadAllAdminData();
                  onRefreshPublicData();
                  showNotice('Testimonial saved.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CONSULTATION DETAIL */}
      {viewingConsultation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif text-lg font-bold text-[#10283F]">
                Consultation: {viewingConsultation.id}
              </h3>
              <button onClick={() => setViewingConsultation(null)} className="text-slate-400">✕</button>
            </div>
            <p><span className="font-bold">Client:</span> {viewingConsultation.clientName} ({viewingConsultation.email})</p>
            <p><span className="font-bold">Company:</span> {viewingConsultation.companyName} &bull; {viewingConsultation.industry}</p>
            <p><span className="font-bold">Scope:</span> {viewingConsultation.projectDescription}</p>
            <div>
              <label className="font-bold block mb-1">Partner Feedback Note:</label>
              <textarea
                rows={3}
                value={consultationNote}
                onChange={(e) => setConsultationNote(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <select
                value={viewingConsultation.status}
                onChange={(e) => setViewingConsultation({ ...viewingConsultation, status: e.target.value as any })}
                className="p-1 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
              <button
                onClick={async () => {
                  await updateConsultationStatus(viewingConsultation.id, viewingConsultation.status, consultationNote);
                  setViewingConsultation(null);
                  await loadAllAdminData();
                  showNotice('Consultation record updated.');
                }}
                className="px-4 py-1.5 font-semibold text-white bg-[#10283F] rounded"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
