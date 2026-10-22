export type UserRole = 'admin' | 'customer' | 'consultation_user' | string;
export type AccountStatus = 'active' | 'inactive' | 'disabled';
export type ContentStatus = 'draft' | 'published';
export type ConsultationStatus = 'pending' | 'reviewed' | 'scheduled' | 'completed' | 'archived';
export type MessageStatus = 'unread' | 'read' | 'replied' | 'archived';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: AccountStatus;
  emailVerified: boolean;
  phone?: string;
  company?: string;
  photoURL?: string;
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  isSystem?: boolean;
  permissions: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PermissionMetadata {
  key: string;
  label: string;
  description: string;
  category: 'Dashboard & Navigation' | 'Consultation Management' | 'User Profile' | 'User Management & Permissions' | 'Website Content & CMS' | 'System & Audit';
}

export const SYSTEM_PERMISSIONS: PermissionMetadata[] = [
  {
    key: 'dashboard.view',
    label: 'View Dashboard',
    description: 'Access the executive analytics and management overview.',
    category: 'Dashboard & Navigation',
  },
  {
    key: 'consultation.view',
    label: 'View Consultations',
    description: 'Inspect consultation requests and meeting schedules.',
    category: 'Consultation Management',
  },
  {
    key: 'consultation.create',
    label: 'Create Consultation Request',
    description: 'Register and submit new advisory consultation inquiries.',
    category: 'Consultation Management',
  },
  {
    key: 'consultation.edit',
    label: 'Edit Consultations',
    description: 'Update consultation statuses, meeting details, and partner feedback.',
    category: 'Consultation Management',
  },
  {
    key: 'consultation.delete',
    label: 'Delete Consultations',
    description: 'Permanently remove consultation inquiries from the database.',
    category: 'Consultation Management',
  },
  {
    key: 'profile.view',
    label: 'View Profile',
    description: 'Access personal account profile and verified credentials.',
    category: 'User Profile',
  },
  {
    key: 'profile.edit',
    label: 'Edit Profile',
    description: 'Update permitted personal contact and company details.',
    category: 'User Profile',
  },
  {
    key: 'user_management.view',
    label: 'View Users & Roles',
    description: 'Access registered users list and roles directory.',
    category: 'User Management & Permissions',
  },
  {
    key: 'user_management.manage',
    label: 'Manage Users & Permissions',
    description: 'Assign roles, toggle account active/disabled states, and configure role permissions.',
    category: 'User Management & Permissions',
  },
  {
    key: 'settings.manage',
    label: 'Manage Site Settings',
    description: 'Update branding, themes, typography, and contact configuration.',
    category: 'Website Content & CMS',
  },
  {
    key: 'content.view',
    label: 'View Public Content',
    description: 'Browse articles, case studies, and firm credentials.',
    category: 'Website Content & CMS',
  },
  {
    key: 'content.edit',
    label: 'Edit Website CMS Content',
    description: 'Create and update articles, portfolio case studies, and page sections.',
    category: 'Website Content & CMS',
  },
  {
    key: 'messages.view',
    label: 'View Contact Messages',
    description: 'Inspect inquiries submitted via the public contact form.',
    category: 'Website Content & CMS',
  },
  {
    key: 'messages.delete',
    label: 'Delete Contact Messages',
    description: 'Permanently purge contact inquiries from the inbox.',
    category: 'Website Content & CMS',
  },
  {
    key: 'audit.view',
    label: 'View Audit Logs',
    description: 'Review administrative security events, role changes, and system audit trail.',
    category: 'System & Audit',
  },
];

export const DEFAULT_SYSTEM_ROLES: RoleDefinition[] = [
  {
    id: 'admin',
    name: 'Administrator',
    description: 'Full administrative access to all modules, records, and security settings.',
    isSystem: true,
    permissions: SYSTEM_PERMISSIONS.map((p) => p.key),
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'customer',
    name: 'Registered User',
    description: 'Default role for verified client portal users with personal profile and consultation privileges.',
    isSystem: true,
    permissions: [
      'profile.view',
      'profile.edit',
      'consultation.view',
      'consultation.create',
      'content.view',
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'consultation_user',
    name: 'Consultation User',
    description: 'Corporate client actively participating in advisory engagements and scheduled sessions.',
    isSystem: false,
    permissions: [
      'profile.view',
      'profile.edit',
      'consultation.view',
      'consultation.create',
      'content.view',
    ],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];


export interface SiteSettings {
  id?: string;
  companyName: string;
  tagline: string;
  phone: string;
  secondaryPhone?: string;
  email: string;
  address: string;
  workingHours: string;
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  heroPrimaryBtnText?: string;
  heroPrimaryBtnTarget?: string;
  heroSecondaryBtnText?: string;
  heroSecondaryBtnTarget?: string;
  heroImagePosition?: 'right' | 'left' | 'center' | 'background';
  aboutSummary: string;
  aboutBadge?: string;
  aboutTitle?: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  founderImageUrl: string;
  vision: string;
  mission: string;
  methodology: string;
  credentials: string[];
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    telegram?: string;
    facebook?: string;
    github?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  ogImageUrl?: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string; // Default #10283F
  secondaryColor?: string; // Default #ffffff
  accentColor?: string; // Default #D5A13A
  fontFamily?: string;
  copyrightText?: string;
  disclaimerText?: string;
  consultationCtaHeading?: string;
  consultationCtaText?: string;
  consultationBtnText?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export type NavigationMenuType = 'main' | 'dropdown' | 'footer' | 'header';
export type DestinationType = 'internal' | 'external' | 'custom' | 'anchor';

export interface NavigationItem {
  id: string;
  label: string;
  slug?: string;
  page: NavigationPage;
  url?: string;
  type?: NavigationMenuType;
  parentId?: string | null;
  destinationType?: DestinationType;
  pageId?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
  enabled?: boolean;
  visibleDesktop?: boolean;
  visibleMobile?: boolean;
  showInFooter?: boolean;
  openInNewTab?: boolean;
  requiresAuth?: boolean;
  description?: string;
  isExternal?: boolean;
  isHighlighted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  children?: NavigationItem[];
}

export interface PageSectionItem {
  id: string;
  pageId: 'home' | 'about' | 'services' | 'industries' | 'insights' | 'portfolio' | 'resume' | 'contact' | 'custom';
  sectionId: string;
  sectionType:
    | 'hero'
    | 'text'
    | 'image-text'
    | 'card-grid'
    | 'timeline'
    | 'gallery'
    | 'stats'
    | 'contact'
    | 'cta'
    | 'custom';
  title: string;
  subtitle?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'background';
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
  textColor?: string;
  layout?: 'default' | 'split' | 'grid-3' | 'grid-4' | 'centered';
  displayOrder: number;
  isVisible: boolean;
  status: ContentStatus;
  customData?: Record<string, any>;
  updatedAt?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'Strategy & Growth' | 'Finance & Capital' | 'Operations & PMO' | 'Technology & Analytics' | 'Governance & Leadership';
  proficiency: number; // 0 to 100
  icon?: string;
  description?: string;
  order: number;
  status: ContentStatus;
  createdAt?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  achievements: string[];
  order: number;
  status: ContentStatus;
  logoUrl?: string;
  createdAt?: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationYear: string;
  honors?: string;
  order: number;
  status: ContentStatus;
  createdAt?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
  credentialId?: string;
  order: number;
  status: ContentStatus;
  createdAt?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  client: string;
  summary: string;
  description: string;
  impactMetrics: string;
  coverImageUrl: string;
  tags: string[];
  projectUrl?: string;
  order: number;
  status: ContentStatus;
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ResumeConfig {
  id?: string;
  targetRole: string;
  executiveSummary: string;
  contactEmail: string;
  contactPhone: string;
  location: string;
  pdfUrl?: string;
  docxUrl?: string;
  keyCompetencies: string[];
  languages: { language: string; fluency: string }[];
  professionalAffiliations: string[];
  updatedAt?: string;
}

export interface ExecutiveLetterTemplate {
  id: string;
  title: string;
  category: 'Advisory Proposal' | 'Executive Cover Letter' | 'Board Endorsement' | 'Strategic Memorandum';
  recipientName: string;
  recipientTitle: string;
  recipientCompany: string;
  subject: string;
  date: string;
  openingSalutation: string;
  bodyParagraphs: string[];
  closingText: string;
  signatoryName: string;
  signatoryTitle: string;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImageUrl: string;
  imageAlt?: string;
  imagePosition?: 'center' | 'top' | 'bottom' | 'cover';
  storagePath?: string;
  icon: string;
  benefits: string[];
  deliverables: string[];
  order: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Industry {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImageUrl: string;
  icon: string;
  highlights: string[];
  order: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImageUrl: string;
  author: string;
  authorRole: string;
  category: string;
  tags: string[];
  status: ContentStatus;
  readTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface MediaItem {
  id: string;
  title: string;
  altText: string;
  caption?: string;
  url: string;
  storagePath?: string;
  sizeBytes: number;
  mimeType: string;
  category: string;
  createdAt: string;
  createdBy: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientCompany: string;
  clientLocation: string;
  avatarUrl: string;
  rating: number;
  quote: string;
  serviceCategory: string;
  status: ContentStatus;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ConsultationRequest {
  id: string;
  clientName: string;
  email: string;
  phone?: string;
  companyName?: string;
  industry?: string;
  serviceInterest?: string;
  projectDescription?: string;
  estimatedTimeline?: string;
  preferredDate?: string;
  status: ConsultationStatus;
  adminNotes?: string;
  userId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy: string;
  userEmail: string;
  details: string;
  createdAt: string;
}

export type NavigationPage =
  | 'home'
  | 'about'
  | 'services'
  | 'service-detail'
  | 'industries'
  | 'industry-detail'
  | 'portfolio'
  | 'skills'
  | 'experience'
  | 'training'
  | 'resume'
  | 'insights'
  | 'article-detail'
  | 'contact'
  | 'book-consultation'
  | 'login'
  | 'register'
  | 'verify-email'
  | 'forgot-password'
  | 'reset-password'
  | 'account'
  | 'admin';
