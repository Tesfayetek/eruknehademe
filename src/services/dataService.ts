import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import {
  SiteSettings,
  Service,
  Industry,
  Article,
  MediaItem,
  Testimonial,
  ConsultationRequest,
  ContactMessage,
  AuditLog,
  UserProfile,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ResumeConfig,
  ExecutiveLetterTemplate,
  PageSectionItem,
  NavigationItem,
  ConsultationStatus,
  MessageStatus,
  AccountStatus,
  RoleDefinition,
  DEFAULT_SYSTEM_ROLES,
} from '../types';

// ==================== DEFAULT SEED CONTENT ====================
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'general',
  companyName: 'Erukneh Ademe Business Consulting',
  tagline: 'Strategic Insight. Sustainable Growth. Transformative Impact.',
  phone: '+251 11 667 8900',
  secondaryPhone: '+251 91 123 4567',
  email: 'info@eruknehademe.com',
  address: 'Bole Sub-City, Namibia Street, Edna Mall Business Center, 6th Floor, Addis Ababa, Ethiopia',
  workingHours: 'Monday - Friday: 8:30 AM - 5:30 PM (East Africa Time)',
  heroBadge: 'Premier Advisory • Addis Ababa & East Africa',
  heroTitle: 'Build a Stronger Business. Achieve Sustainable Growth.',
  heroSubtitle:
    'Strategic insights and practical consulting solutions to help your organization grow, improve performance, and seize new opportunities in Ethiopia and beyond.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80',
  heroPrimaryBtnText: 'Explore Our Services',
  heroPrimaryBtnTarget: 'services',
  heroSecondaryBtnText: 'Book a Consultation',
  heroSecondaryBtnTarget: 'consultation',
  heroImagePosition: 'right',
  aboutSummary:
    'Erukneh Ademe Business Consulting is a premier strategic advisory firm headquartered in Addis Ababa, Ethiopia. We bridge the gap between visionary ambition and on-the-ground operational execution, helping domestic enterprises, international investors, and development agencies succeed in East Africa’s rapidly evolving economic landscape.',
  aboutBadge: 'About Our Firm',
  aboutTitle: 'Bridging Vision with Practical Execution',
  founderName: 'Erukneh Ademe',
  founderTitle: 'Managing Partner & Senior Strategic Advisor',
  founderBio:
    'Erukneh Ademe brings over 18 years of executive consulting experience across Ethiopia, Kenya, and international commercial hubs. With credentials in corporate finance, operational restructuring, and market systems development, he has counseled Fortune-ranked multinationals, fast-scaling Ethiopian conglomerates, and multilateral institutions. Recognized for rigorous analytical depth and pragmatic implementation.',
  founderImageUrl:
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  vision:
    'To be the most trusted and transformative strategic consulting firm in East Africa, recognized for empowering sustainable enterprise growth and driving institutional excellence.',
  mission:
    'Deliver bespoke, data-grounded strategic advisory and hands-on consulting solutions that unlock economic value, enhance operational competitiveness, and generate enduring social and commercial impact.',
  methodology:
    'Our proven four-stage engagement framework: 1. Comprehensive Diagnostic Assessment, 2. Strategy & Solution Architecture, 3. Agile Execution Roadmap & Change Management, and 4. Continuous Value Measurement & Performance Optimization.',
  credentials: [
    'Certified Management Consultant (CMC) Standards Compliant',
    'Advisory Partner for Ethiopian Capital Market / ESX Pre-Listing',
    'Member of the Ethiopian Chamber of Commerce & Sectoral Associations',
    'Authorized Feasibility & Business Plan Specialist for DBE & Commercial Banks',
    'AfCFTA Regional Trade & Investment Advisory Specialist',
  ],
  stats: [
    { label: 'Combined Advisory Experience', value: '18+', description: 'Years of top-tier consulting excellence' },
    { label: 'Completed Corporate Engagements', value: '140+', description: 'Across manufacturing, agriculture, & services' },
    { label: 'Client Retention & Satisfaction', value: '98%', description: 'Long-term strategic partnership record' },
    { label: 'Capital & Investment Advisory', value: '$95M+', description: 'Debt, equity, and project finance facilitated' },
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/company/erukneh-ademe-consulting',
    twitter: 'https://twitter.com/erukneh_consult',
    telegram: 'https://t.me/eruknehconsulting',
    facebook: 'https://facebook.com/eruknehconsulting',
  },
  primaryColor: '#10283F',
  secondaryColor: '#ffffff',
  accentColor: '#D5A13A',
  copyrightText: '© 2026 Erukneh Ademe Business Consulting. All Rights Reserved. Regulated under Ethiopian Commercial Law.',
  disclaimerText: 'All client consultations and project specifications are protected under strict non-disclosure protocols.',
  consultationCtaHeading: 'Ready to Navigate Your Next Strategic Horizon?',
  consultationCtaText: 'Schedule a confidential discussion with our senior consulting partners in Addis Ababa or virtually.',
  consultationBtnText: 'Book a Consultation',
  seoTitle: 'Erukneh Ademe Business Consulting | Premier Advisory in Ethiopia & East Africa',
  seoDescription:
    'Leading management consulting firm in Addis Ababa offering business strategy, financial advisory, market feasibility, and corporate restructuring in Ethiopia and internationally.',
  ogImageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
};

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  // 1. Home
  {
    id: 'nav-home',
    label: 'Home',
    slug: 'home',
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
    description: 'Welcome homepage & corporate executive overview',
  },
  // 2. About Us (with submenus)
  {
    id: 'nav-about',
    label: 'About Us',
    slug: 'about',
    page: 'about',
    url: '/about',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'Info',
    order: 2,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Firm heritage, executive advisory profile & values',
  },
  {
    id: 'nav-about-overview',
    label: 'Company Overview',
    slug: 'company-overview',
    page: 'about',
    url: '/about/company-overview',
    type: 'dropdown',
    parentId: 'nav-about',
    destinationType: 'internal',
    icon: 'Building',
    order: 1,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Our institutional heritage and African commercial presence',
  },
  {
    id: 'nav-about-mission',
    label: 'Mission, Vision & Values',
    slug: 'mission-vision-values',
    page: 'about',
    url: '/about/mission-vision-values',
    type: 'dropdown',
    parentId: 'nav-about',
    destinationType: 'internal',
    icon: 'Target',
    order: 2,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Core institutional principles, vision & mission',
  },
  {
    id: 'nav-about-approach',
    label: 'Our Approach',
    slug: 'our-approach',
    page: 'about',
    url: '/about/our-approach',
    type: 'dropdown',
    parentId: 'nav-about',
    destinationType: 'internal',
    icon: 'Compass',
    order: 3,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: '4-phase consulting execution methodology',
  },
  {
    id: 'nav-about-leadership',
    label: 'Leadership & Team',
    slug: 'leadership-team',
    page: 'about',
    url: '/about/leadership-team',
    type: 'dropdown',
    parentId: 'nav-about',
    destinationType: 'internal',
    icon: 'Users',
    order: 4,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Managing partner profile & senior advisory leadership',
  },
  // 3. Services (with submenus)
  {
    id: 'nav-services',
    label: 'Services',
    slug: 'services',
    page: 'services',
    url: '/services',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'Briefcase',
    order: 3,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Advisory practices across strategy, finance, and operations',
  },
  {
    id: 'nav-svc-strategy',
    label: 'Business Strategy & Planning',
    slug: 'business-strategy-planning',
    page: 'services',
    url: '/services/business-strategy-planning',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'TrendingUp',
    order: 1,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: '5-year corporate master planning & market expansion',
  },
  {
    id: 'nav-svc-mgmt',
    label: 'Management Consulting',
    slug: 'management-consulting',
    page: 'services',
    url: '/services/management-consulting',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Layers',
    order: 2,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Lean operational excellence & cost transformation',
  },
  {
    id: 'nav-svc-org',
    label: 'Organizational Development',
    slug: 'organizational-development',
    page: 'services',
    url: '/services/organizational-development',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Building',
    order: 3,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Governance architecture, RACI matrices & corporate restructuring',
  },
  {
    id: 'nav-svc-leadership',
    label: 'Leadership & Management Training',
    slug: 'leadership-management-training',
    page: 'services',
    url: '/services/leadership-management-training',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Award',
    order: 4,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Executive leadership coaching & managerial capability',
  },
  {
    id: 'nav-svc-hr',
    label: 'Human Resource Consulting',
    slug: 'human-resource-consulting',
    page: 'services',
    url: '/services/human-resource-consulting',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Users',
    order: 5,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Talent architecture, salary benchmarking & job grading',
  },
  {
    id: 'nav-svc-process',
    label: 'Business Process Improvement',
    slug: 'business-process-improvement',
    page: 'services',
    url: '/services/business-process-improvement',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Zap',
    order: 6,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Workflow reengineering & SOP standardization',
  },
  {
    id: 'nav-svc-perf',
    label: 'Performance Management',
    slug: 'performance-management',
    page: 'services',
    url: '/services/performance-management',
    type: 'dropdown',
    parentId: 'nav-services',
    destinationType: 'internal',
    icon: 'Target',
    order: 7,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Balanced Scorecard, OKRs & incentive frameworks',
  },
  // 4. Training & Development (with submenus)
  {
    id: 'nav-training',
    label: 'Training & Development',
    slug: 'training',
    page: 'training',
    url: '/training',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'GraduationCap',
    order: 4,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Executive education, management courses & skill development',
  },
  {
    id: 'nav-train-prog',
    label: 'Training Programs',
    slug: 'programs',
    page: 'training',
    url: '/training/programs',
    type: 'dropdown',
    parentId: 'nav-training',
    destinationType: 'internal',
    icon: 'BookOpen',
    order: 1,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Executive leadership cohorts & certification curricula',
  },
  {
    id: 'nav-train-courses',
    label: 'Management Courses',
    slug: 'management-courses',
    page: 'training',
    url: '/training/management-courses',
    type: 'dropdown',
    parentId: 'nav-training',
    destinationType: 'internal',
    icon: 'Award',
    order: 2,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Targeted short modules for executive competency',
  },
  {
    id: 'nav-train-upcoming',
    label: 'Upcoming Training',
    slug: 'upcoming-training',
    page: 'training',
    url: '/training/upcoming-training',
    type: 'dropdown',
    parentId: 'nav-training',
    destinationType: 'internal',
    icon: 'Calendar',
    order: 3,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Upcoming cohort calendar & enrollment deadlines',
  },
  {
    id: 'nav-train-corp',
    label: 'Corporate Training',
    slug: 'corporate-training',
    page: 'training',
    url: '/training/corporate-training',
    type: 'dropdown',
    parentId: 'nav-training',
    destinationType: 'internal',
    icon: 'Building',
    order: 4,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Bespoke in-house executive retreats & workshops',
  },
  // 5. Insights (with submenus)
  {
    id: 'nav-insights',
    label: 'Insights',
    slug: 'insights',
    page: 'insights',
    url: '/insights',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'BookOpen',
    order: 5,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Articles, market intelligence & case studies',
  },
  {
    id: 'nav-ins-articles',
    label: 'Articles & Resources',
    slug: 'articles-resources',
    page: 'insights',
    url: '/insights/articles-resources',
    type: 'dropdown',
    parentId: 'nav-insights',
    destinationType: 'internal',
    icon: 'FileText',
    order: 1,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Strategic essays, policy analysis & research papers',
  },
  {
    id: 'nav-ins-cases',
    label: 'Case Studies',
    slug: 'case-studies',
    page: 'insights',
    url: '/insights/case-studies',
    type: 'dropdown',
    parentId: 'nav-insights',
    destinationType: 'internal',
    icon: 'Briefcase',
    order: 2,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Proven transaction records & client transformation cases',
  },
  {
    id: 'nav-ins-news',
    label: 'News & Updates',
    slug: 'news-updates',
    page: 'insights',
    url: '/insights/news-updates',
    type: 'dropdown',
    parentId: 'nav-insights',
    destinationType: 'internal',
    icon: 'Send',
    order: 3,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: false,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Firm announcements, media releases & regulatory briefings',
  },
  // 6. Contact Us
  {
    id: 'nav-contact',
    label: 'Contact Us',
    slug: 'contact',
    page: 'contact',
    url: '/contact',
    type: 'main',
    parentId: null,
    destinationType: 'internal',
    icon: 'Phone',
    order: 6,
    isVisible: true,
    enabled: true,
    visibleDesktop: true,
    visibleMobile: true,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Direct corporate headquarters & inquiry details',
  },
  // 7. Portfolio (available in footer & direct route)
  {
    id: 'nav-portfolio',
    label: 'Portfolio',
    slug: 'portfolio',
    page: 'portfolio',
    url: '/portfolio',
    type: 'footer',
    parentId: null,
    destinationType: 'internal',
    icon: 'Briefcase',
    order: 7,
    isVisible: true,
    enabled: true,
    visibleDesktop: false,
    visibleMobile: false,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Bankable feasibility studies and transaction records',
  },
  // 8. Executive Resume (available in footer & direct route)
  {
    id: 'nav-resume',
    label: 'Executive Resume',
    slug: 'resume',
    page: 'resume',
    url: '/resume',
    type: 'footer',
    parentId: null,
    destinationType: 'internal',
    icon: 'FileText',
    order: 8,
    isVisible: true,
    enabled: true,
    visibleDesktop: false,
    visibleMobile: false,
    showInFooter: true,
    openInNewTab: false,
    requiresAuth: false,
    description: 'Executive bio, competencies, and verified credentials',
  },
];

export const DEFAULT_PROJECTS: Omit<ProjectItem, 'id'>[] = [
  {
    title: '$42M Kilinto Industrial Park Agro-Chemical Facility Feasibility & Financing',
    slug: 'kilinto-agro-chemical-facility',
    client: 'Abyssinia Chemical & Pharmaceutical Consortium',
    summary: 'A bankable technical and economic feasibility study that secured long-term credit from Development Bank of Ethiopia and private equity co-financiers.',
    description: `### Engagement Scope & Strategic Mandate
The client sought to establish a state-of-the-art agro-chemical and liquid fertilizer blending facility within the Kilinto Industrial Park, south of Addis Ababa. Key challenges included stringent Environmental Protection Authority (EPA) compliance, foreign exchange currency volatility for imported active ingredients, and domestic distribution modeling.

#### Key Interventions Delivered:
1. **Financial Modeling & Valuation:** Built a comprehensive dynamic IFRS-compliant financial model with 10-year cash flow projections, debt service coverage ratio (DSCR) stress-testing, and raw material import sensitivity matrices.
2. **EPC Contract & PMO Architecture:** Drafted procurement contracts and established milestone verification gates for Chinese and European machinery suppliers.
3. **Regulatory Clearance & Incentives:** Coordinated direct filings with the Ethiopian Investment Commission (EIC) for capital goods duty-free exemptions.

#### Measurable Impact:
- **$42M Capital Secured:** Unanimous credit approval achieved within 4 months.
- **Import Substitution:** Projected foreign exchange savings of $18M annually for Ethiopian agriculture.`,
    impactMetrics: '$42M Debt & Equity Raised • 320 Industrial Jobs Created • 18% IRR',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    tags: ['Manufacturing', 'Feasibility Study', 'Project Finance', 'Industrial Parks'],
    order: 1,
    status: 'published',
    featured: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    title: 'Cross-Border Djibouti Corridor Logistics Modernization & AfCFTA Readiness',
    slug: 'djibouti-corridor-logistics-modernization',
    client: 'Horn Freight Forwarding & Intermodal Transport PLC',
    summary: 'Operational turnaround and digital tracking integration cutting cargo turnaround times by 34% across the Addis-Djibouti trade corridor.',
    description: `### Transforming Landlocked Supply Chains
With rising port demurrage fees in Djibouti and container clearance delays at the Modjo Dry Port, Horn Freight required an aggressive operational re-engineering.

#### Solutions Implemented:
- Restructured driver incentive schemes and telemetry GPS fleet tracking.
- Secured bonded customs warehousing status.
- Designed regional tariff optimization under the African Continental Free Trade Area (AfCFTA) framework.`,
    impactMetrics: '34% Reduction in Turnaround Time • $2.4M Annual Cost Savings',
    coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Trade & Logistics', 'Operations', 'AfCFTA', 'Supply Chain'],
    order: 2,
    status: 'published',
    featured: true,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
  },
  {
    title: 'Commercial Bank Tier-1 Capital Restructuring & ESX Public Listing Advisory',
    slug: 'commercial-bank-capital-restructuring',
    client: 'Mid-Tier Ethiopian Commercial Banking Institution',
    summary: 'Balance sheet optimization, IFRS-9 provision modeling, and strategic equity offering memorandum in preparation for the Ethiopian Securities Exchange.',
    description: `### Preparing for the Capital Market Era
In response to National Bank of Ethiopia (NBE) minimum capital directives (5 Billion ETB) and the upcoming Ethiopian Securities Exchange (ESX) launch, our transaction advisory team steered the bank's capital replenishment strategy.

#### Key Results:
- Performed independent business valuation utilizing discounted cash flows and peer multiples.
- Engineered hybrid rights-issue structures and corporate governance charters.`,
    impactMetrics: '4.8B ETB Capital Target Achieved • 100% NBE Compliance Verified',
    coverImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Financial Advisory', 'Capital Markets', 'ESX', 'Banking'],
    order: 3,
    status: 'published',
    featured: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
  },
];

export const DEFAULT_SKILLS: Omit<SkillItem, 'id'>[] = [
  {
    name: 'Corporate Growth & Market Entry Strategy',
    category: 'Strategy & Growth',
    proficiency: 95,
    icon: 'TrendingUp',
    description: '5-year corporate master planning, AfCFTA trade entry, competitive moat analysis.',
    order: 1,
    status: 'published',
  },
  {
    name: 'Bankable Feasibility Studies (DBE & Commercial Banks)',
    category: 'Finance & Capital',
    proficiency: 98,
    icon: 'FileText',
    description: 'Technical, environmental, and financial feasibility conforming to Ethiopian banking criteria.',
    order: 2,
    status: 'published',
  },
  {
    name: 'Financial Modeling & Valuation (IFRS)',
    category: 'Finance & Capital',
    proficiency: 92,
    icon: 'DollarSign',
    description: 'DCF, multiples valuation, capital restructuring, and ESX pre-listing diligence.',
    order: 3,
    status: 'published',
  },
  {
    name: 'Supply Chain & Operations Optimization',
    category: 'Operations & PMO',
    proficiency: 90,
    icon: 'Briefcase',
    description: 'Lean manufacturing systems, procurement resilience, and multimodal transit efficiency.',
    order: 4,
    status: 'published',
  },
  {
    name: 'Project Management Office (PMO) & Turnkey EPC',
    category: 'Operations & PMO',
    proficiency: 94,
    icon: 'Layers',
    description: 'Milestone governance, contractor oversight, risk register, and plant commissioning.',
    order: 5,
    status: 'published',
  },
  {
    name: 'Corporate Governance & Board Fiduciary Design',
    category: 'Governance & Leadership',
    proficiency: 90,
    icon: 'Shield',
    description: 'Audit committee charters, executive succession planning, RACI matrix design.',
    order: 6,
    status: 'published',
  },
  {
    name: 'Macroeconomic & Regulatory Intelligence',
    category: 'Strategy & Growth',
    proficiency: 96,
    icon: 'Search',
    description: 'National Bank directives, Ethiopian Investment Commission navigation, currency reform modeling.',
    order: 7,
    status: 'published',
  },
];

export const DEFAULT_EXPERIENCE: Omit<ExperienceItem, 'id'>[] = [
  {
    company: 'Erukneh Ademe Business Consulting',
    role: 'Managing Partner & Senior Strategic Advisor',
    location: 'Addis Ababa, Ethiopia',
    period: '2016 - Present',
    summary: 'Founding leader directing over 140 corporate strategy, feasibility, and transaction advisory mandates across Ethiopia, Kenya, and East Africa.',
    achievements: [
      'Facilitated over $95M in debt, equity, and project finance across agro-industry, manufacturing, and logistics.',
      'Advised senior executive boards of financial institutions on capital adequacy and ESX public listing preparation.',
      'Maintained a 98% client satisfaction rate over 9 continuous years of practice.',
    ],
    order: 1,
    status: 'published',
  },
  {
    company: 'East African Industrial Development Advisory Group',
    role: 'Principal Operations & Strategy Consultant',
    location: 'Nairobi & Addis Ababa',
    period: '2011 - 2016',
    summary: 'Led cross-border industrial park advisory, supply chain diagnostic audits, and foreign direct investment (FDI) joint venture structuring.',
    achievements: [
      'Spearheaded feasibility studies for multinational manufacturing entrants into Hawassa and Bole Lemi industrial zones.',
      'Designed lean manufacturing transformations that reduced operational waste by an average of 22% across 8 client facilities.',
    ],
    order: 2,
    status: 'published',
  },
  {
    company: 'Consolidated Commercial Advisory Services',
    role: 'Senior Financial & Feasibility Analyst',
    location: 'Addis Ababa, Ethiopia',
    period: '2006 - 2011',
    summary: 'Conducted credit modeling, working capital forecasting, and commercial bank credit committee defense.',
    achievements: [
      'Constructed bankable models resulting in 30+ approved enterprise commercial loans.',
      'Conducted sector-wide agro-processing value chain studies for multilateral donor programs.',
    ],
    order: 3,
    status: 'published',
  },
];

export const DEFAULT_EDUCATION: Omit<EducationItem, 'id'>[] = [
  {
    institution: 'Addis Ababa University, School of Commerce',
    degree: 'Master of Science (MSc)',
    field: 'Finance & Investment Management',
    graduationYear: '2008',
    honors: 'Graduated with Highest Distinction',
    order: 1,
    status: 'published',
  },
  {
    institution: 'Addis Ababa University',
    degree: 'Bachelor of Arts (BA)',
    field: 'Economics & Business Administration',
    graduationYear: '2005',
    honors: 'Dean’s Honor List',
    order: 2,
    status: 'published',
  },
];

export const DEFAULT_CERTIFICATIONS: Omit<CertificationItem, 'id'>[] = [
  {
    title: 'Certified Management Consultant (CMC)',
    issuer: 'International Council of Management Consulting Institutes (ICMCI)',
    issueDate: '2015',
    credentialId: 'CMC-EA-2015-884',
    order: 1,
    status: 'published',
  },
  {
    title: 'Chartered Financial Analyst (CFA) Level II Candidate / Practice Compliance',
    issuer: 'CFA Institute',
    issueDate: '2018',
    order: 2,
    status: 'published',
  },
  {
    title: 'Project Management Professional (PMP) Methodology Trained',
    issuer: 'Project Management Institute (PMI Standards)',
    issueDate: '2017',
    order: 3,
    status: 'published',
  },
  {
    title: 'Capital Market Specialist & ESX Listing Rules Certification',
    issuer: 'Ethiopian Capital Market Authority (ECMA Curriculum)',
    issueDate: '2024',
    order: 4,
    status: 'published',
  },
];

export const DEFAULT_RESUME_CONFIG: ResumeConfig = {
  targetRole: 'Executive Managing Partner & Senior Strategy Advisor',
  executiveSummary:
    'Distinguished management consulting executive with 18+ years of leadership in corporate strategy, capital mobilization, bankable feasibility development, and operational restructuring across Ethiopia and East Africa. Adept at steering complex multi-million dollar industrial mandates, regulatory negotiations, and capital market transformation.',
  contactEmail: 'erukneh@eruknehademe.com',
  contactPhone: '+251 11 667 8900',
  location: 'Addis Ababa, Ethiopia (Available for regional and international engagements)',
  keyCompetencies: [
    'Corporate Strategy Formulation',
    'Bankable Feasibility & DBE Advisory',
    'IFRS Valuation & Financial Modeling',
    'AfCFTA Regional Trade & Supply Chains',
    'PMO & Turnkey Industrial Project Oversight',
    'Board Fiduciary Governance & ESX Readiness',
  ],
  languages: [
    { language: 'Amharic', fluency: 'Native' },
    { language: 'English', fluency: 'Full Professional Proficiency' },
    { language: 'Oromo (Afaan Oromoo)', fluency: 'Professional Working Proficiency' },
  ],
  professionalAffiliations: [
    'Member, Ethiopian Chamber of Commerce & Sectoral Associations (ECCSA)',
    'Certified Management Consultant (CMC) Professional Member',
    'Associate Member, African Economics & Strategy Association',
  ],
};

export const DEFAULT_EXECUTIVE_LETTERS: Omit<ExecutiveLetterTemplate, 'id'>[] = [
  {
    title: 'Strategic Advisory Proposal Cover Letter',
    category: 'Advisory Proposal',
    recipientName: 'Ato Yohannes Haile',
    recipientTitle: 'Chief Executive Officer',
    recipientCompany: 'National Agro-Industrial Conglomerate S.C.',
    subject: 'Proposal for Corporate Strategy & Capital Mobilization Mandate',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    openingSalutation: 'Dear Ato Yohannes,',
    bodyParagraphs: [
      'It was a privilege speaking with you regarding your organization’s planned manufacturing expansion and the strategic imperatives driven by the ongoing macroeconomic liberalization in Ethiopia.',
      'Erukneh Ademe Business Consulting has structured this engagement proposal to deliver comprehensive support across three core phases: (1) In-depth operational and working capital diagnostic assessment, (2) Formulation of a bankable 5-year corporate master plan compliant with Development Bank of Ethiopia criteria, and (3) Structuring investor roadshows to mobilize equity and long-term project debt.',
      'With over 18 years of advisory success in Addis Ababa and industrial parks across East Africa, our senior partners are uniquely equipped to bridge visionary strategy with on-the-ground operational execution.',
      'We look forward to formalizing our partnership and commencing the preliminary diagnostic phase at your earliest convenience.',
    ],
    closingText: 'Yours in Strategic Partnership,',
    signatoryName: 'Erukneh Ademe',
    signatoryTitle: 'Managing Partner & Senior Strategic Advisor',
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Board of Directors Endorsement & Listing Readiness Memorandum',
    category: 'Board Endorsement',
    recipientName: 'The Board of Directors',
    recipientTitle: 'Governance & Audit Committee',
    recipientCompany: 'Awash Commercial Holdings PLC',
    subject: 'Independent Strategic Assessment: Preparedness for Public Listing on the Ethiopian Securities Exchange (ESX)',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    openingSalutation: 'Distinguished Members of the Board,',
    bodyParagraphs: [
      'Following our detailed four-month review of the company’s capital structure, governance framework, and IFRS financial accounting systems, we hereby submit our independent strategic assessment regarding readiness for initial public offering (IPO) on the ESX.',
      'The company exhibits robust underlying market fundamentals, positive operational EBITDA margins across its logistics and manufacturing units, and commendable brand equity within the domestic market.',
      'To ensure maximum valuation optimization and regulatory alignment with the Ethiopian Capital Market Authority (ECMA), we recommend implementing the two governance and audit enhancements detailed in the accompanying strategic dossier.',
      'We stand ready to guide the executive management team through the pre-listing prospectus drafting and institutional placement processes.',
    ],
    closingText: 'Respectfully submitted,',
    signatoryName: 'Erukneh Ademe',
    signatoryTitle: 'Managing Partner, Transaction & Strategy Advisory',
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_SERVICES: Omit<Service, 'id'>[] = [
  {
    title: 'Business Strategy & Planning',
    slug: 'business-strategy-planning',
    summary: 'Custom growth blueprints, 5-year master planning, market entry, and AfCFTA regional integration for domestic and regional enterprises.',
    description:
      'We work alongside executive leadership teams to define clear, winning strategic visions. In an era of macroeconomic shifts and currency reforms in Ethiopia, we help businesses formulate agile 3-5 year corporate strategies, competitive positioning, and commercial roadmaps that seize domestic and cross-border opportunities.',
    coverImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    icon: 'TrendingUp',
    benefits: [
      'Clarity on long-term competitive moat and revenue drivers',
      'Actionable entry plans into new East African and regional markets',
      'Alignment of leadership, capital, and organizational resources',
      'Resilient risk mitigation frameworks for volatile macroeconomic cycles',
    ],
    deliverables: [
      '5-Year Corporate Strategic Master Plan',
      'Market Entry & Competitive Landscaping Dossier',
      'Executive Balanced Scorecard & Key Performance Indicators (KPIs)',
      'Strategic Implementation Roadmap with Milestones',
    ],
    order: 1,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Management Consulting',
    slug: 'management-consulting',
    summary: 'Process re-engineering, supply chain optimization, cost transformation, and operational performance turnaround.',
    description:
      'We eliminate operational friction, optimize throughput, and reduce overhead across core business processes. From factory floor logistics to headquarters workflow automation, our consultants install lean management systems and accountability structures.',
    coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    icon: 'Briefcase',
    benefits: [
      'Measurable reduction in operational waste and processing cycle times',
      'Optimized procurement and domestic supply chain resilience',
      'Institutionalized SOPs and international quality standards',
      'Enhanced management accountability and reporting transparency',
    ],
    deliverables: [
      'End-to-End Operational Diagnostic Audit',
      'Lean Process Maps & Standard Operating Procedures (SOPs)',
      'Organizational RACI Governance Matrix',
      'Continuous Improvement Coaching Program',
    ],
    order: 2,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Organizational Development',
    slug: 'organizational-development',
    summary: 'Corporate restructuring, governance architecture, departmental design, and high-performance culture engineering.',
    description:
      'As organizations scale, organizational friction and ambiguity dilute leadership focus. We design agile organizational structures, clear reporting hierarchies, and change management frameworks that empower teams and elevate managerial effectiveness.',
    coverImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    icon: 'Building',
    benefits: [
      'Elimination of role overlap and organizational confusion',
      'Scalable departmental hierarchy aligned with business goals',
      'Fostering high-trust, results-oriented institutional culture',
      'Smooth transition during corporate mergers and restructuring',
    ],
    deliverables: [
      'Organizational Blueprint & Departmental Charters',
      'RACI Functional Responsibility Matrices',
      'Executive Succession & Talent Continuity Plan',
      'Change Management & Internal Communication Protocol',
    ],
    order: 3,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Leadership & Management Training',
    slug: 'leadership-management-training',
    summary: 'Executive leadership coaching, managerial capability building, decision-making mastery, and board governance seminars.',
    description:
      'Empowering C-suite executives and mid-level managers with strategic foresight, leadership agility, and commercial acumen. Our executive education cohorts combine international best practices with ground-level African commercial realities.',
    coverImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    icon: 'Award',
    benefits: [
      'Sharpened executive decision-making under uncertainty',
      'Enhanced delegation, team motivation, and conflict resolution',
      'Deepened financial and commercial management literacy',
      'Strengthened board governance and fiduciary responsibility',
    ],
    deliverables: [
      'Executive Leadership Competency Assessment',
      'Bespoke Modular Training Curriculum & Courseware',
      'One-on-One C-Suite Strategic Advisory Coaching',
      'Post-Training Performance Impact Evaluation',
    ],
    order: 4,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Human Resource Consulting',
    slug: 'human-resource-consulting',
    summary: 'Strategic talent acquisition, compensation & salary benchmarking, performance grading, and labor compliance.',
    description:
      'We align human capital strategy with enterprise objectives. From competitive compensation modeling conforming to the Ethiopian market to performance-linked incentive schemes, our consultants build compliant, high-retention HR systems.',
    coverImageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
    icon: 'Users',
    benefits: [
      'Market-competitive compensation and grading structures',
      'Strict adherence to Ethiopian labor laws and regulatory directives',
      'Higher retention of critical leadership and technical talent',
      'Data-driven employee performance appraisal systems',
    ],
    deliverables: [
      'Salary Survey & Total Rewards Benchmarking Report',
      'Job Descriptions, Competency Profiles & Grading Ladder',
      'Employee Handbook & HR Policy Manual',
      'Talent Pipeline & Retention Strategic Plan',
    ],
    order: 5,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Business Process Improvement',
    slug: 'business-process-improvement',
    summary: 'Lean workflow optimization, cycle time compression, administrative streamlining, and digital SOP adoption.',
    description:
      'Eliminate bureaucratic bottlenecks and accelerate service delivery. We map end-to-end operational workflows, remove redundant verification layers, and engineer lean digital procedures that slash costs and elevate customer satisfaction.',
    coverImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    icon: 'Zap',
    benefits: [
      '30-50% reduction in approval and document processing cycle times',
      'Clear, visual process documentation that reduces errors',
      'Seamless readiness for ERP and digital workflow automation',
      'Immediate cost savings through administrative waste elimination',
    ],
    deliverables: [
      'As-Is Process Diagnostic & Value Stream Maps',
      'To-Be Streamlined Process Architecture',
      'Complete Set of Standard Operating Procedures (SOPs)',
      'Process Owner Training & Performance Dashboards',
    ],
    order: 6,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Performance Management',
    slug: 'performance-management',
    summary: 'Balanced Scorecard implementation, cascading OKRs, KPI monitoring dashboards, and executive incentive structures.',
    description:
      'Strategy without measurement remains aspirational. We architect rigorous performance management frameworks that cascade corporate targets down to individual contributors, enabling executive visibility and objective merit-based evaluations.',
    coverImageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    icon: 'Target',
    benefits: [
      'Total clarity across all organizational levels on quarterly priorities',
      'Objective, transparent performance appraisals tied to results',
      'Real-time executive visibility into strategic initiative progress',
      'Alignment of employee incentives with shareholder value creation',
    ],
    deliverables: [
      'Corporate & Departmental Balanced Scorecard (BSC)',
      'Quarterly OKR (Objectives & Key Results) Tracker',
      'Performance Review Toolkits & Manager Appraisal Guides',
      'Performance-Linked Bonus & Incentive Scheme Design',
    ],
    order: 7,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Business Plan & Bankable Feasibility Studies',
    slug: 'business-plan-development',
    summary: 'Rigorous feasibility studies and bankable business plans accepted by DBE, commercial banks, and international financiers.',
    description:
      'We craft authoritative, bankable business plans that withstand rigorous scrutiny from credit committees, investment boards, and regulatory bodies such as the Ethiopian Investment Commission (EIC).',
    coverImageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    icon: 'FileText',
    benefits: [
      'Accelerated credit approval and investor confidence',
      'Validated technical, market, environmental, and financial viability',
      'Customized compliance with Ethiopian banking regulatory directives',
      'Clear sensitivity analysis and break-even scenarios',
    ],
    deliverables: [
      'Full Bankable Feasibility Study Document',
      'Comprehensive Project Financial Analysis & NPV/IRR Calculations',
      'Executive Pitch Deck for Lenders and Equity Partners',
      'Lender Presentation Assistance & Credit Defense Preparation',
    ],
    order: 8,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Financial Advisory & Capital Raising',
    slug: 'financial-advisory',
    summary: 'Valuation, financial structuring, capital market readiness (ESX), and loan syndication advisory.',
    description:
      'Navigating capital requirements requires seasoned financial acumen. We assist Ethiopian enterprises in preparing for equity investment, debt financing from commercial banks and development financial institutions (DFIs), and structuring listings on the Ethiopian Securities Exchange.',
    coverImageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    icon: 'DollarSign',
    benefits: [
      'Bank-ready financial models built according to IFRS standards',
      'Optimized capital structure balancing debt servicing and equity dilution',
      'Independent company valuation for mergers, acquisitions, and partnerships',
      'Comprehensive preparation for public and private equity placements',
    ],
    deliverables: [
      'Comprehensive 5-Year Dynamic Financial Projections Model',
      'Institutional Investor Information Memorandum (CIM)',
      'Independent DCF & Multiples Business Valuation Report',
      'Due Diligence Readiness Folder',
    ],
    order: 9,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
];

export const DEFAULT_INDUSTRIES: Omit<Industry, 'id'>[] = [
  {
    title: 'SMEs & High-Growth Startups',
    slug: 'smes-and-startups',
    summary: 'Scalable business models, governance, financial discipline, and seed-to-growth capital advisory for emerging enterprises.',
    description:
      'Small and Medium Enterprises represent the economic backbone of Ethiopia. We provide accessible yet sophisticated consulting to help founders professionalize operations, manage working capital, hire key talent, and secure expansion funding.',
    coverImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    icon: 'Zap',
    highlights: [
      'Over 45 SMEs guided through institutional governance setup',
      'Working capital management frameworks during currency fluctuations',
      'Tech-enabled ERP and accounting systems deployment',
    ],
    order: 1,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Manufacturing & Heavy Industry',
    slug: 'manufacturing-industry',
    summary: 'Advisory for industrial parks, textiles, cement, steel, automotive assembly, and chemical production.',
    description:
      'With Ethiopia’s industrial parks (Hawassa, Bole Lemi, Kilinto) and import-substitution policies, we advise manufacturers on plant feasibility, energy efficiency, raw material sourcing, and factory floor throughput optimization.',
    coverImageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    icon: 'Factory',
    highlights: [
      'Comprehensive feasibility studies for $40M+ industrial projects',
      'Local sourcing integration and backward linkage creation',
      'Occupational health, safety, and ISO standards compliance',
    ],
    order: 2,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Trade, Freight & Logistics',
    slug: 'trade-and-logistics',
    summary: 'Multimodal freight logistics, Djibouti corridor trade, customs bonded warehousing, and cross-border AfCFTA operations.',
    description:
      'Efficient logistics is the lifeblood of landlocked trade. We assist shipping companies, freight forwarders, and distribution networks in cutting transit lead times and adopting digitized cargo tracking.',
    coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    icon: 'Truck',
    highlights: [
      'Corridor transit optimization along the Addis-Djibouti route',
      'Cold-chain logistics feasibility for horticultural exporters',
      'Customs automation and trade tariff compliance advisory',
    ],
    order: 3,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Agriculture & Agro-Processing',
    slug: 'agriculture-agro-processing',
    summary: 'Coffee, oilseeds, sesame, horticulture, livestock value addition, and commercial farming investments.',
    description:
      'From farm-gate to global retail shelves, we help agribusinesses modernize processing plants, implement contract-farming outgrower schemes, and meet strict international export certifications.',
    coverImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    icon: 'Wheat',
    highlights: [
      'Coffee specialty value chain optimization and European export compliance',
      'Edible oil refining plant feasibility and oilseed sourcing networks',
      'Climate-smart irrigation and regenerative agriculture advisory',
    ],
    order: 4,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'NGOs & International Development',
    slug: 'ngos-and-development',
    summary: 'Program mid-term evaluations, economic baseline research, institutional capacity building, and donor grant audits.',
    description:
      'We partner with UN agencies, USAID, EU missions, and international non-profits to design impactful private-sector development initiatives, vocational training programs, and market system resilience programs.',
    coverImageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=80',
    icon: 'Globe',
    highlights: [
      '30+ third-party evaluations executed with rigorous statistical sampling',
      'Gender-inclusive economic empowerment framework design',
      'Youth entrepreneurship and SME accelerator program development',
    ],
    order: 5,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'International Investors & Joint Ventures',
    slug: 'international-investors',
    summary: 'Foreign direct investment (FDI) advisory, regulatory navigation, local partner matching, and market entry.',
    description:
      'Entering the Ethiopian and East African market presents immense growth opportunities alongside specific regulatory landscapes. We provide international firms with trusted local insight, legal entity setup advice, and joint venture mediation.',
    coverImageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    icon: 'Building2',
    highlights: [
      'Guided global firms from Europe, Asia, and North America into Ethiopia',
      'Direct liaison with the Ethiopian Investment Commission (EIC)',
      'Forex repatriation and bilateral investment treaty analysis',
    ],
    order: 6,
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
];

export const DEFAULT_ARTICLES: Omit<Article, 'id'>[] = [
  {
    title: 'Preparing for the Ethiopian Securities Exchange (ESX): A Strategic Guide for Domestic Corporations',
    slug: 'preparing-for-ethiopian-securities-exchange-esx',
    summary: 'As Ethiopia launches its historic stock exchange, discover the critical corporate governance, IFRS accounting, and valuation milestones required for initial public listing.',
    content: `### The Dawn of a Modern Capital Market in Ethiopia
The establishment of the Ethiopian Securities Exchange (ESX) marks one of the most pivotal financial milestones in East African commercial history. For decades, Ethiopian businesses have relied almost exclusively on commercial bank loans and retained earnings for capital. With the inception of the ESX, enterprises now have an unprecedented vehicle to raise long-term equity capital, unlock liquidity, and achieve institutional prestige.

However, transitioning from a private, closely held family enterprise to a publicly traded corporation requires profound structural transformation.

#### 1. Corporate Governance & Board Independence
Public markets demand transparency. Companies aspiring to list must dismantle informal management practices in favor of:
- Independent board directors with proven fiduciary governance experience.
- Formal board audit, risk, and compensation committees.
- Clear separation between shareholder ownership and executive management.

#### 2. Transitioning to Full IFRS Financial Reporting
The days of dual-ledger bookkeeping or delayed audits are over. The ESX and the Capital Market Authority (CMA) enforce rigorous adherence to International Financial Reporting Standards (IFRS). Companies should immediately conduct an IFRS gap analysis with certified external auditors.

#### 3. Defining a Clear Growth Equity Story
Investors on the exchange will not simply evaluate historical balance sheets; they invest in future cash flow potential. A compelling Investment Memorandum must outline competitive moats, market expansion strategies under the African Continental Free Trade Area (AfCFTA), and risk mitigation plans against foreign exchange exposure.

#### Conclusion
At Erukneh Ademe Business Consulting, our transaction advisory team assists Ethiopian firms in auditing their listing readiness, formulating corporate governance charters, and modeling equity valuations. Now is the time to prepare your organization for the public stage.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    author: 'Erukneh Ademe',
    authorRole: 'Managing Partner',
    category: 'Capital Markets',
    tags: ['ESX', 'Capital Markets', 'Corporate Governance', 'Financial Advisory', 'Ethiopia'],
    status: 'published',
    readTimeMinutes: 6,
    seoTitle: 'How to Prepare for the Ethiopian Securities Exchange (ESX) | Erukneh Ademe',
    seoDescription: 'Expert strategic guide on corporate governance, IFRS standards, and capital restructuring for Ethiopian companies preparing to list on the ESX.',
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Supply Chain Agility in East Africa: Overcoming Currency Realignment and Port Bottlenecks',
    slug: 'supply-chain-agility-east-africa',
    summary: 'Practical operational tactics for manufacturers and importers adapting to floating currency reforms and multi-modal transit corridors.',
    content: `### Adapting Operations to New Macroeconomic Realities
The ongoing liberalization of the foreign exchange market in Ethiopia has dramatically altered the cost calculation of imported raw materials, packaging, and machinery. For manufacturers, these changes require an immediate pivot from passive procurement to proactive supply chain engineering.

#### Key Strategic Priorities:
1. **Accelerating Backward Linkages & Local Sourcing:** Enterprises that replace imported inputs with domestically cultivated agricultural produce or local raw materials dramatically reduce FX volatility risks.
2. **Multimodal Transport Corridor Optimization:** Relying solely on traditional logistics arrangements can induce costly demurrage fees. Implementing bonded warehousing, utilizing dry ports (such as Modjo and Kombolcha), and negotiating multi-modal carrier agreements generate significant cost savings.
3. **Dynamic Working Capital Forecasting:** Historical 30-day supplier credit terms are insufficient in a shifting exchange environment. Companies must establish weekly rolling cash-flow models.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    author: 'Erukneh Ademe',
    authorRole: 'Managing Partner',
    category: 'Operations',
    tags: ['Supply Chain', 'Manufacturing', 'Macroeconomics', 'Logistics'],
    status: 'published',
    readTimeMinutes: 5,
    seoTitle: 'Supply Chain Strategy in East Africa | Erukneh Ademe Consulting',
    seoDescription: 'How East African businesses can optimize logistics, secure local raw materials, and manage currency realignment.',
    publishedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
  {
    title: 'Transforming Ethiopian Agribusiness: Moving from Raw Commodities to High-Value Agro-Processing',
    slug: 'transforming-ethiopian-agribusiness-agro-processing',
    summary: 'Why value addition in coffee, oilseeds, and horticulture represents the single greatest industrial opportunity in Ethiopia today.',
    content: `### Capturing the Value Gradient
Ethiopia is celebrated globally for the exquisite profiles of Yirgacheffe and Sidama coffees, as well as high-grade sesame and pulses. Yet, historically, a disproportionate share of global commercial profits has been captured downstream by international roasters, refiners, and brand houses.

The strategic imperative for the next decade is **industrial value addition within Ethiopia**.

#### Strategic Pillars for Success:
- **Quality Certifications:** Achieving Organic, Fairtrade, and Rainforest Alliance certifications opens direct premium export channels.
- **Contract Outgrower Systems:** Establishing formalized support and guaranteed purchase agreements with farmer cooperatives ensures steady factory throughput.
- **Packaging and Shelf-Life Innovation:** Investing in state-of-the-art nitrogen packaging allows domestic brands to compete in international supermarket chains.`,
    featuredImageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    author: 'Erukneh Ademe',
    authorRole: 'Managing Partner',
    category: 'Agribusiness',
    tags: ['Agribusiness', 'Agro-processing', 'Coffee', 'Exports', 'AfCFTA'],
    status: 'published',
    readTimeMinutes: 7,
    seoTitle: 'Agro-Processing in Ethiopia: Strategic Opportunities | Erukneh Ademe',
    seoDescription: 'Strategic analysis on how Ethiopian agricultural firms can scale high-value agro-processing and capture export margins.',
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  },
];

export const DEFAULT_TESTIMONIALS: Omit<Testimonial, 'id'>[] = [
  {
    clientName: 'Dawit Mengistu',
    clientTitle: 'Chief Executive Officer',
    clientCompany: 'Abyssinia Agro-Industries PLC',
    clientLocation: 'Addis Ababa & Hawassa, Ethiopia',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    quote:
      'Erukneh Ademe Business Consulting transformed our business model. Their team developed an airtight bankable feasibility study that secured our $8.5M expansion financing from the Development Bank of Ethiopia. Their analytical depth and local market grounding are peerless.',
    serviceCategory: 'Financial Advisory',
    status: 'published',
    order: 1,
    createdAt: new Date().toISOString(),
  },
  {
    clientName: 'Dr. Senait Tadesse',
    clientTitle: 'Country Representative',
    clientCompany: 'East Africa Sustainable Trade Initiative',
    clientLocation: 'Nairobi & Addis Ababa',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    quote:
      'When our international consortium needed an independent program evaluation across 12 manufacturing parks, Erukneh Ademe’s consulting team delivered thorough, data-backed insights ahead of schedule. Truly world-class advisory with authentic African insight.',
    serviceCategory: 'NGOs & Development',
    status: 'published',
    order: 2,
    createdAt: new Date().toISOString(),
  },
  {
    clientName: 'Marcus von Berg',
    clientTitle: 'Director of African Investments',
    clientCompany: 'Global Equity Partners GmbH',
    clientLocation: 'Frankfurt & Addis Ababa',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    rating: 5,
    quote:
      'Navigating regulatory nuances and selecting the right local joint-venture partner in Ethiopia would have been impossible without Erukneh’s counsel. He provided honest, clear-eyed strategic direction that safeguarded our capital.',
    serviceCategory: 'International Investors',
    status: 'published',
    order: 3,
    createdAt: new Date().toISOString(),
  },
];

// ==================== SERVICE FUNCTIONS ====================

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'general');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (error) {
    console.warn('Could not load remote site settings, using default values:', error);
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    const docRef = doc(db, 'siteSettings', 'general');
    await setDoc(docRef, { ...settings, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'siteSettings/general');
  }
}

export async function getNavigationItems(): Promise<NavigationItem[]> {
  try {
    const snap = await getDocs(collection(db, 'navigationItems'));
    const list: NavigationItem[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<NavigationItem, 'id'>) }));
    if (list.length === 0) {
      return DEFAULT_NAVIGATION_ITEMS;
    }
    // Merge any missing canonical items from DEFAULT_NAVIGATION_ITEMS so public navigation is complete
    const existingIds = new Set(list.map((i) => i.id));
    const merged = [...list];
    for (const def of DEFAULT_NAVIGATION_ITEMS) {
      if (!existingIds.has(def.id)) {
        merged.push(def);
      }
    }
    merged.sort((a, b) => (a.order || 0) - (b.order || 0));
    return merged;
  } catch (error) {
    console.warn('Navigation fallback:', error);
    return DEFAULT_NAVIGATION_ITEMS;
  }
}

export async function saveNavigationItem(item: Partial<NavigationItem>, id?: string): Promise<string> {
  try {
    const itemId = id || (item.slug ? `nav-${item.slug}` : `nav-${Date.now()}`);
    const dataToSave = {
      ...item,
      updatedAt: new Date().toISOString(),
      createdAt: item.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, 'navigationItems', itemId), dataToSave, { merge: true });
    return itemId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `navigationItems/${id || 'new'}`);
  }
}

export async function saveAllNavigationItems(items: NavigationItem[]): Promise<void> {
  try {
    for (const item of items) {
      const dataToSave = {
        ...item,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'navigationItems', item.id), dataToSave, { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'navigationItems/batch');
  }
}

export async function resetNavigationItemsToDefault(): Promise<NavigationItem[]> {
  try {
    // Delete existing
    const snap = await getDocs(collection(db, 'navigationItems'));
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    // Write defaults
    for (const item of DEFAULT_NAVIGATION_ITEMS) {
      await setDoc(doc(db, 'navigationItems', item.id), item);
    }
    return DEFAULT_NAVIGATION_ITEMS;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'navigationItems/reset');
  }
}

export async function deleteNavigationItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'navigationItems', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `navigationItems/${id}`);
  }
}

// Projects & Portfolio CRUD
export async function getProjects(includeDrafts = false): Promise<ProjectItem[]> {
  try {
    const snap = await getDocs(collection(db, 'projects'));
    const list: ProjectItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<ProjectItem, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_PROJECTS.map((p, idx) => ({ id: `default-proj-${idx}`, ...p })) as ProjectItem[]);
  } catch (error) {
    console.warn('Projects fallback:', error);
    return DEFAULT_PROJECTS.map((p, idx) => ({ id: `default-proj-${idx}`, ...p })) as ProjectItem[];
  }
}

export async function saveProject(project: Partial<ProjectItem>, id?: string): Promise<string> {
  try {
    const projId = id || (project.slug ? project.slug : `proj-${Date.now()}`);
    const dataToSave = {
      ...project,
      updatedAt: new Date().toISOString(),
      createdAt: project.createdAt || new Date().toISOString(),
    };
    await setDoc(doc(db, 'projects', projId), dataToSave, { merge: true });
    return projId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `projects/${id || 'new'}`);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
  }
}

// Skills CRUD
export async function getSkills(includeDrafts = false): Promise<SkillItem[]> {
  try {
    const snap = await getDocs(collection(db, 'skills'));
    const list: SkillItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<SkillItem, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_SKILLS.map((s, idx) => ({ id: `default-skill-${idx}`, ...s })) as SkillItem[]);
  } catch (error) {
    console.warn('Skills fallback:', error);
    return DEFAULT_SKILLS.map((s, idx) => ({ id: `default-skill-${idx}`, ...s })) as SkillItem[];
  }
}

export async function saveSkill(skill: Partial<SkillItem>, id?: string): Promise<string> {
  try {
    const skillId = id || `skill-${Date.now()}`;
    await setDoc(doc(db, 'skills', skillId), skill, { merge: true });
    return skillId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `skills/${id || 'new'}`);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'skills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
  }
}

// Experience CRUD
export async function getExperience(includeDrafts = false): Promise<ExperienceItem[]> {
  try {
    const snap = await getDocs(collection(db, 'experience'));
    const list: ExperienceItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<ExperienceItem, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_EXPERIENCE.map((e, idx) => ({ id: `default-exp-${idx}`, ...e })) as ExperienceItem[]);
  } catch (error) {
    console.warn('Experience fallback:', error);
    return DEFAULT_EXPERIENCE.map((e, idx) => ({ id: `default-exp-${idx}`, ...e })) as ExperienceItem[];
  }
}

export async function saveExperience(exp: Partial<ExperienceItem>, id?: string): Promise<string> {
  try {
    const expId = id || `exp-${Date.now()}`;
    await setDoc(doc(db, 'experience', expId), exp, { merge: true });
    return expId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `experience/${id || 'new'}`);
  }
}

export async function deleteExperience(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'experience', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `experience/${id}`);
  }
}

// Education CRUD
export async function getEducation(includeDrafts = false): Promise<EducationItem[]> {
  try {
    const snap = await getDocs(collection(db, 'education'));
    const list: EducationItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<EducationItem, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_EDUCATION.map((edu, idx) => ({ id: `default-edu-${idx}`, ...edu })) as EducationItem[]);
  } catch (error) {
    console.warn('Education fallback:', error);
    return DEFAULT_EDUCATION.map((edu, idx) => ({ id: `default-edu-${idx}`, ...edu })) as EducationItem[];
  }
}

export async function saveEducation(edu: Partial<EducationItem>, id?: string): Promise<string> {
  try {
    const eduId = id || `edu-${Date.now()}`;
    await setDoc(doc(db, 'education', eduId), edu, { merge: true });
    return eduId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `education/${id || 'new'}`);
  }
}

export async function deleteEducation(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'education', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `education/${id}`);
  }
}

// Certifications CRUD
export async function getCertifications(includeDrafts = false): Promise<CertificationItem[]> {
  try {
    const snap = await getDocs(collection(db, 'certifications'));
    const list: CertificationItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<CertificationItem, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_CERTIFICATIONS.map((c, idx) => ({ id: `default-cert-${idx}`, ...c })) as CertificationItem[]);
  } catch (error) {
    console.warn('Certifications fallback:', error);
    return DEFAULT_CERTIFICATIONS.map((c, idx) => ({ id: `default-cert-${idx}`, ...c })) as CertificationItem[];
  }
}

export async function saveCertification(cert: Partial<CertificationItem>, id?: string): Promise<string> {
  try {
    const certId = id || `cert-${Date.now()}`;
    await setDoc(doc(db, 'certifications', certId), cert, { merge: true });
    return certId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `certifications/${id || 'new'}`);
  }
}

export async function deleteCertification(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'certifications', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `certifications/${id}`);
  }
}

// Resume Configuration CRUD
export async function getResumeConfig(): Promise<ResumeConfig> {
  try {
    const snap = await getDoc(doc(db, 'resume', 'main'));
    if (snap.exists()) {
      return { id: snap.id, ...DEFAULT_RESUME_CONFIG, ...snap.data() } as ResumeConfig;
    }
    return DEFAULT_RESUME_CONFIG;
  } catch (error) {
    console.warn('Resume config fallback:', error);
    return DEFAULT_RESUME_CONFIG;
  }
}

export async function saveResumeConfig(config: Partial<ResumeConfig>): Promise<void> {
  try {
    await setDoc(doc(db, 'resume', 'main'), { ...config, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'resume/main');
  }
}

// Executive Letter Templates CRUD
export async function getExecutiveLetters(): Promise<ExecutiveLetterTemplate[]> {
  try {
    const snap = await getDocs(collection(db, 'executiveLetters'));
    const list: ExecutiveLetterTemplate[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ExecutiveLetterTemplate, 'id'>) }));
    return list.length > 0 ? list : (DEFAULT_EXECUTIVE_LETTERS.map((l, idx) => ({ id: `default-letter-${idx}`, ...l })) as ExecutiveLetterTemplate[]);
  } catch (error) {
    console.warn('Executive letters fallback:', error);
    return DEFAULT_EXECUTIVE_LETTERS.map((l, idx) => ({ id: `default-letter-${idx}`, ...l })) as ExecutiveLetterTemplate[];
  }
}

export async function saveExecutiveLetter(letter: Partial<ExecutiveLetterTemplate>, id?: string): Promise<string> {
  try {
    const letterId = id || `letter-${Date.now()}`;
    await setDoc(doc(db, 'executiveLetters', letterId), letter, { merge: true });
    return letterId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `executiveLetters/${id || 'new'}`);
  }
}

export async function deleteExecutiveLetter(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'executiveLetters', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `executiveLetters/${id}`);
  }
}

// Page Sections (Universal Dynamic Section Builder) CRUD
export async function getPageSections(pageId?: string, includeDrafts = false): Promise<PageSectionItem[]> {
  try {
    const ref = collection(db, 'pageSections');
    const snap = await getDocs(ref);
    const list: PageSectionItem[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<PageSectionItem, 'id'>;
      if ((!pageId || data.pageId === pageId) && (includeDrafts || (data.isVisible && data.status === 'published'))) {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return list;
  } catch (error) {
    console.warn('Page sections query note:', error);
    return [];
  }
}

export async function savePageSection(section: Partial<PageSectionItem>, id?: string): Promise<string> {
  try {
    const secId = id || (section.sectionId ? `${section.pageId || 'page'}-${section.sectionId}` : `sec-${Date.now()}`);
    const dataToSave = {
      ...section,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'pageSections', secId), dataToSave, { merge: true });
    return secId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `pageSections/${id || 'new'}`);
  }
}

export async function deletePageSection(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'pageSections', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pageSections/${id}`);
  }
}

// Services CRUD
export async function getServices(includeDrafts = false): Promise<Service[]> {
  try {
    const servicesRef = collection(db, 'services');
    const snap = await getDocs(servicesRef);
    const list: Service[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<Service, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })) as Service[]);
  } catch (error) {
    console.warn('Using default services fallback:', error);
    return DEFAULT_SERVICES.map((s, idx) => ({ id: `default-${idx}`, ...s })) as Service[];
  }
}

export async function saveService(serviceData: Partial<Service>, id?: string): Promise<string> {
  try {
    const serviceId = id || (serviceData.slug ? serviceData.slug : `service-${Date.now()}`);
    const docRef = doc(db, 'services', serviceId);
    const dataToSave = {
      ...serviceData,
      updatedAt: new Date().toISOString(),
      createdAt: serviceData.createdAt || new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return serviceId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `services/${id || 'new'}`);
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'services', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `services/${id}`);
  }
}

// Industries CRUD
export async function getIndustries(includeDrafts = false): Promise<Industry[]> {
  try {
    const industriesRef = collection(db, 'industries');
    const snap = await getDocs(industriesRef);
    const list: Industry[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<Industry, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_INDUSTRIES.map((ind, idx) => ({ id: `default-${idx}`, ...ind })) as Industry[]);
  } catch (error) {
    console.warn('Using default industries fallback:', error);
    return DEFAULT_INDUSTRIES.map((ind, idx) => ({ id: `default-${idx}`, ...ind })) as Industry[];
  }
}

export async function saveIndustry(industryData: Partial<Industry>, id?: string): Promise<string> {
  try {
    const industryId = id || (industryData.slug ? industryData.slug : `industry-${Date.now()}`);
    const docRef = doc(db, 'industries', industryId);
    const dataToSave = {
      ...industryData,
      updatedAt: new Date().toISOString(),
      createdAt: industryData.createdAt || new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return industryId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `industries/${id || 'new'}`);
  }
}

export async function deleteIndustry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'industries', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `industries/${id}`);
  }
}

// Articles CRUD
export async function getArticles(includeDrafts = false): Promise<Article[]> {
  try {
    const articlesRef = collection(db, 'articles');
    const snap = await getDocs(articlesRef);
    const list: Article[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<Article, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list.length > 0 ? list : (DEFAULT_ARTICLES.map((a, idx) => ({ id: `default-${idx}`, ...a })) as Article[]);
  } catch (error) {
    console.warn('Using default articles fallback:', error);
    return DEFAULT_ARTICLES.map((a, idx) => ({ id: `default-${idx}`, ...a })) as Article[];
  }
}

export async function saveArticle(articleData: Partial<Article>, id?: string): Promise<string> {
  try {
    const articleId = id || (articleData.slug ? articleData.slug : `article-${Date.now()}`);
    const docRef = doc(db, 'articles', articleId);
    const dataToSave = {
      ...articleData,
      updatedAt: new Date().toISOString(),
      createdAt: articleData.createdAt || new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return articleId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `articles/${id || 'new'}`);
  }
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'articles', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `articles/${id}`);
  }
}

// Testimonials CRUD
export async function getTestimonials(includeDrafts = false): Promise<Testimonial[]> {
  try {
    const ref = collection(db, 'testimonials');
    const snap = await getDocs(ref);
    const list: Testimonial[] = [];
    snap.forEach((d) => {
      const data = d.data() as Omit<Testimonial, 'id'>;
      if (includeDrafts || data.status === 'published') {
        list.push({ id: d.id, ...data });
      }
    });
    list.sort((a, b) => (a.order || 0) - (b.order || 0));
    return list.length > 0 ? list : (DEFAULT_TESTIMONIALS.map((t, idx) => ({ id: `default-${idx}`, ...t })) as Testimonial[]);
  } catch (error) {
    console.warn('Using default testimonials fallback:', error);
    return DEFAULT_TESTIMONIALS.map((t, idx) => ({ id: `default-${idx}`, ...t })) as Testimonial[];
  }
}

export async function saveTestimonial(testData: Partial<Testimonial>, id?: string): Promise<string> {
  try {
    const testId = id || `test-${Date.now()}`;
    const docRef = doc(db, 'testimonials', testId);
    const dataToSave = {
      ...testData,
      updatedAt: new Date().toISOString(),
      createdAt: testData.createdAt || new Date().toISOString(),
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return testId;
  } catch (error) {
    handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, `testimonials/${id || 'new'}`);
  }
}

export async function deleteTestimonial(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
  }
}

// Media Library
export async function getMediaItems(): Promise<MediaItem[]> {
  try {
    const snap = await getDocs(collection(db, 'media'));
    const list: MediaItem[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<MediaItem, 'id'>) }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Could not load media items:', error);
    return [];
  }
}

export async function saveMediaItem(media: Omit<MediaItem, 'id'>, id?: string): Promise<string> {
  try {
    const mediaId = id || `media-${Date.now()}`;
    await setDoc(doc(db, 'media', mediaId), media);
    return mediaId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'media');
  }
}

export async function deleteMediaItem(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'media', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `media/${id}`);
  }
}

// Consultation Requests
export async function submitConsultationRequest(
  requestData: Partial<Omit<ConsultationRequest, 'id' | 'createdAt' | 'status'>> & {
    clientName: string;
    email: string;
    userId?: string;
  }
): Promise<string> {
  try {
    const currentAuthUser = auth.currentUser;
    if (!currentAuthUser) {
      throw new Error('Authentication required: Please sign in or register to submit a consultation request.');
    }

    const isSystemAdmin = (currentAuthUser.email || '').toLowerCase() === 'arabsafashion@gmail.com';
    if (!currentAuthUser.emailVerified && !isSystemAdmin) {
      throw new Error('Email verification required: Please verify your email before registering for a consultation.');
    }

    const reqId = `consult-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullRequest: Omit<ConsultationRequest, 'id'> = {
      clientName: requestData.clientName.trim(),
      email: requestData.email.trim(),
      phone: requestData.phone?.trim() || '',
      companyName: requestData.companyName?.trim() || '',
      industry: requestData.industry?.trim() || '',
      serviceInterest: requestData.serviceInterest?.trim() || 'General Strategic Consulting',
      projectDescription: requestData.projectDescription?.trim() || 'Register for consultation request',
      status: 'pending',
      userId: currentAuthUser.uid, // Derived strictly from verified session UID to prevent impersonation
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'consultationRequests', reqId), fullRequest);
    return reqId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'consultationRequests');
  }
}

export async function getConsultationRequests(): Promise<ConsultationRequest[]> {
  try {
    const snap = await getDocs(collection(db, 'consultationRequests'));
    const list: ConsultationRequest[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ConsultationRequest, 'id'>) }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'consultationRequests');
  }
}

export async function getUserConsultationRequests(userId: string): Promise<ConsultationRequest[]> {
  try {
    const currentUid = auth.currentUser?.uid;
    const isSystemAdmin = (auth.currentUser?.email || '').toLowerCase() === 'arabsafashion@gmail.com';
    // Strict ownership verification: cannot query another user's consultations
    if (!currentUid || (currentUid !== userId && !isSystemAdmin)) {
      throw new Error('Unauthorized: You can only query your own consultation requests.');
    }

    const q = query(collection(db, 'consultationRequests'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const list: ConsultationRequest[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ConsultationRequest, 'id'>) }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'consultationRequests');
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const currentUid = auth.currentUser?.uid;
    const isSystemAdmin = (auth.currentUser?.email || '').toLowerCase() === 'arabsafashion@gmail.com';
    // Strict ownership verification: cannot read another user's profile
    if (!currentUid || (currentUid !== userId && !isSystemAdmin)) {
      throw new Error('Unauthorized: You can only view your own user profile.');
    }

    const docSnap = await getDoc(doc(db, 'users', userId));
    if (!docSnap.exists()) return null;
    return { uid: docSnap.id, ...(docSnap.data() as Omit<UserProfile, 'uid'>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${userId}`);
  }
}

export async function updateConsultationStatus(id: string, status: ConsultationStatus, adminNotes?: string): Promise<void> {
  try {
    const docRef = doc(db, 'consultationRequests', id);
    const payload: Partial<ConsultationRequest> = {
      status,
      updatedAt: new Date().toISOString(),
    };
    if (adminNotes !== undefined) {
      payload.adminNotes = adminNotes;
    }
    await updateDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `consultationRequests/${id}`);
  }
}

export async function deleteConsultationRequest(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: You must be signed in as an administrator to delete consultation requests.');
    }
    await deleteDoc(doc(db, 'consultationRequests', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `consultationRequests/${id}`);
  }
}

// Contact Messages
export async function submitContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const msgId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const fullMsg: Omit<ContactMessage, 'id'> = {
      ...messageData,
      status: 'unread',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'contactMessages', msgId), fullMsg);
    return msgId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'contactMessages');
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: Only administrators can view contact inquiries.');
    }
    const snap = await getDocs(collection(db, 'contactMessages'));
    const list: ContactMessage[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'contactMessages');
  }
}

export async function updateContactMessageStatus(id: string, status: MessageStatus): Promise<void> {
  try {
    await updateDoc(doc(db, 'contactMessages', id), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: You must be signed in as an administrator to delete contact inquiries.');
    }
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `contactMessages/${id}`);
  }
}

// Customers Management: Strictly Admin Only
export async function getUsersList(): Promise<UserProfile[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: Listing user accounts is restricted to administrators.');
    }
    const snap = await getDocs(collection(db, 'users'));
    const list: UserProfile[] = [];
    snap.forEach((d) => list.push({ uid: d.id, ...(d.data() as Omit<UserProfile, 'uid'>) }));
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'users');
  }
}

export async function updateUserAccountStatus(uid: string, status: AccountStatus): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      status,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

export async function updateUserRole(uid: string, role: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      role,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

// ==================== ROLES & PERMISSIONS ====================
export async function getRoles(): Promise<RoleDefinition[]> {
  try {
    const snap = await getDocs(collection(db, 'roles'));
    if (snap.empty) {
      // Return default system roles if database has not seeded yet
      return DEFAULT_SYSTEM_ROLES;
    }
    const list: RoleDefinition[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...(d.data() as Omit<RoleDefinition, 'id'>) });
    });
    return list;
  } catch (error) {
    console.warn('Roles fetch notice, falling back to defaults:', error);
    return DEFAULT_SYSTEM_ROLES;
  }
}

export async function saveRole(role: RoleDefinition): Promise<void> {
  try {
    const roleRef = doc(db, 'roles', role.id);
    await setDoc(roleRef, {
      ...role,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `roles/${role.id}`);
  }
}

export async function deleteRole(roleId: string): Promise<void> {
  try {
    if (roleId === 'admin' || roleId === 'customer') {
      throw new Error('System roles cannot be deleted.');
    }
    await deleteDoc(doc(db, 'roles', roleId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `roles/${roleId}`);
  }
}

export async function deleteUserAccount(uid: string): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('Unauthorized: You must be signed in as an administrator to delete user accounts.');
    }
    if (auth.currentUser.uid === uid) {
      throw new Error('Operation prohibited: You cannot delete your own administrative account.');
    }
    await deleteDoc(doc(db, 'users', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}`);
  }
}

// Audit Logs
export async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const snap = await getDocs(collection(db, 'auditLogs'));
    const list: AuditLog[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...(d.data() as Omit<AuditLog, 'id'>) }));
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  } catch (error) {
    console.warn('Could not load audit logs:', error);
    return [];
  }
}

export async function logAuditEvent(
  action: string,
  entityType: string,
  entityId: string,
  details: string,
  performedBy: string,
  userEmail: string
): Promise<void> {
  try {
    const logId = `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, 'auditLogs', logId), {
      action,
      entityType,
      entityId,
      performedBy,
      userEmail,
      details,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Audit logging note:', error);
  }
}

// Database Seeding Check & Population
export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  try {
    const settingsSnap = await getDoc(doc(db, 'siteSettings', 'general'));
    if (!settingsSnap.exists()) {
      await setDoc(doc(db, 'siteSettings', 'general'), DEFAULT_SITE_SETTINGS);

      // Seed navigation
      for (const nav of DEFAULT_NAVIGATION_ITEMS) {
        await setDoc(doc(db, 'navigationItems', nav.id), nav);
      }

      // Seed projects
      for (const proj of DEFAULT_PROJECTS) {
        await setDoc(doc(db, 'projects', proj.slug), proj);
      }

      // Seed skills
      for (let i = 0; i < DEFAULT_SKILLS.length; i++) {
        await setDoc(doc(db, 'skills', `skill-${i + 1}`), DEFAULT_SKILLS[i]);
      }

      // Seed experience
      for (let i = 0; i < DEFAULT_EXPERIENCE.length; i++) {
        await setDoc(doc(db, 'experience', `exp-${i + 1}`), DEFAULT_EXPERIENCE[i]);
      }

      // Seed education
      for (let i = 0; i < DEFAULT_EDUCATION.length; i++) {
        await setDoc(doc(db, 'education', `edu-${i + 1}`), DEFAULT_EDUCATION[i]);
      }

      // Seed certifications
      for (let i = 0; i < DEFAULT_CERTIFICATIONS.length; i++) {
        await setDoc(doc(db, 'certifications', `cert-${i + 1}`), DEFAULT_CERTIFICATIONS[i]);
      }

      // Seed resume config
      await setDoc(doc(db, 'resume', 'main'), DEFAULT_RESUME_CONFIG);

      // Seed executive letters
      for (let i = 0; i < DEFAULT_EXECUTIVE_LETTERS.length; i++) {
        await setDoc(doc(db, 'executiveLetters', `letter-${i + 1}`), DEFAULT_EXECUTIVE_LETTERS[i]);
      }

      // Seed services
      for (const svc of DEFAULT_SERVICES) {
        await setDoc(doc(db, 'services', svc.slug), svc);
      }

      // Seed industries
      for (const ind of DEFAULT_INDUSTRIES) {
        await setDoc(doc(db, 'industries', ind.slug), ind);
      }

      // Seed articles
      for (const art of DEFAULT_ARTICLES) {
        await setDoc(doc(db, 'articles', art.slug), art);
      }

      // Seed testimonials
      for (let i = 0; i < DEFAULT_TESTIMONIALS.length; i++) {
        await setDoc(doc(db, 'testimonials', `test-${i + 1}`), DEFAULT_TESTIMONIALS[i]);
      }

      // Seed system roles
      for (const role of DEFAULT_SYSTEM_ROLES) {
        await setDoc(doc(db, 'roles', role.id), role);
      }

      return true;
    }
    return false;
  } catch (err) {
    console.warn('Database seed check note:', err);
    return false;
  }
}
