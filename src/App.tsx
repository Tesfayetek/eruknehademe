import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { ServicesView } from './components/public/ServicesView';
import { TrainingView } from './components/public/TrainingView';
import { IndustriesView } from './components/public/IndustriesView';
import { PortfolioView } from './components/public/PortfolioView';
import { SkillsView } from './components/public/SkillsView';
import { ResumeView } from './components/public/ResumeView';
import { InsightsView } from './components/public/InsightsView';
import { ContactView } from './components/public/ContactView';
import { ConsultationModal } from './components/consultation/ConsultationModal';
import { LoginView } from './components/auth/LoginView';
import { RegisterView } from './components/auth/RegisterView';
import { ForgotPasswordView } from './components/auth/ForgotPasswordView';
import { ResetPasswordConfirmView } from './components/auth/ResetPasswordConfirmView';
import { VerifyEmailNotice } from './components/auth/VerifyEmailNotice';
import { AccountProfileView } from './components/customer/AccountProfileView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Shield, Loader2 } from 'lucide-react';
import {
  NavigationPage,
  SiteSettings,
  Service,
  Industry,
  Article,
  Testimonial,
  ProjectItem,
  SkillItem,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  ResumeConfig,
  PageSectionItem,
  NavigationItem,
} from './types';
import {
  getSiteSettings,
  getServices,
  getIndustries,
  getArticles,
  getTestimonials,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getCertifications,
  getResumeConfig,
  getPageSections,
  getNavigationItems,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_RESUME_CONFIG,
} from './services/dataService';

function parsePathname(pathname: string): { page: NavigationPage; subpage?: string } {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return { page: 'home' };

  const segments = clean.split('/');
  const root = segments[0]?.toLowerCase();
  const sub = segments[1]?.toLowerCase();

  switch (root) {
    case 'about':
      return { page: 'about', subpage: sub };
    case 'services':
      return { page: 'services', subpage: sub };
    case 'training':
      return { page: 'training', subpage: sub };
    case 'insights':
      return { page: 'insights', subpage: sub };
    case 'contact':
      return { page: 'contact' };
    case 'industries':
      return { page: 'industries', subpage: sub };
    case 'portfolio':
      return { page: 'portfolio', subpage: sub };
    case 'skills':
      return { page: 'skills', subpage: sub };
    case 'experience':
      return { page: 'experience', subpage: sub };
    case 'resume':
      return { page: 'resume' };
    case 'login':
      return { page: 'login' };
    case 'register':
      return { page: 'register' };
    case 'forgot-password':
      return { page: 'forgot-password' };
    case 'reset-password':
      return { page: 'reset-password' };
    case 'account':
      return { page: 'account' };
    case 'admin':
      return { page: 'admin' };
    default:
      return { page: 'home' };
  }
}

function AppContent() {
  const { currentUser, isAdmin, isEmailVerified, loading: authLoading, logout } = useAuth();

  const initialRoute = parsePathname(window.location.pathname);
  const [currentPage, setCurrentPage] = useState<NavigationPage>(initialRoute.page);
  const [currentSubpage, setCurrentSubpage] = useState<string | undefined>(initialRoute.subpage);
  const [currentUrl, setCurrentUrl] = useState<string>(window.location.pathname);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [resumeConfig, setResumeConfig] = useState<ResumeConfig | null>(null);
  const [pageSections, setPageSections] = useState<PageSectionItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  // Modals & Selected states
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationPreselectedService, setConsultationPreselectedService] = useState<string | undefined>();
  const [returnToConsultation, setReturnToConsultation] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const fetchPublicContent = async () => {
    try {
      const [
        sets,
        nList,
        sList,
        iList,
        aList,
        tList,
        pList,
        skList,
        expList,
        eduList,
        certList,
        resConf,
        secList,
      ] = await Promise.all([
        getSiteSettings(),
        getNavigationItems(),
        getServices(false),
        getIndustries(false),
        getArticles(false),
        getTestimonials(false),
        getProjects(false),
        getSkills(false),
        getExperience(false),
        getEducation(false),
        getCertifications(false),
        getResumeConfig(),
        getPageSections(undefined, false),
      ]);
      setSettings(sets);
      setNavItems(nList);
      setServices(sList);
      setIndustries(iList);
      setArticles(aList);
      setTestimonials(tList);
      setProjects(pList);
      setSkills(skList);
      setExperience(expList);
      setEducation(eduList);
      setCertifications(certList);
      setResumeConfig(resConf);
      setPageSections(secList);
    } catch (err) {
      console.warn('Error fetching public content:', err);
    } finally {
      setLoadingContent(false);
    }
  };

  // Check URL query parameters for Firebase action links (mode, oobCode)
  const [actionLinkParams, setActionLinkParams] = useState<{ mode: string; oobCode: string } | null>(null);

  useEffect(() => {
    fetchPublicContent();

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');
      if (mode && oobCode) {
        setActionLinkParams({ mode, oobCode });
        setCurrentPage('reset-password');
        setCurrentUrl('/reset-password');
      }
    } catch (e) {
      console.warn('URL action link detection notice:', e);
    }

    const handlePopState = () => {
      const route = parsePathname(window.location.pathname);
      setCurrentPage(route.page);
      setCurrentSubpage(route.subpage);
      setCurrentUrl(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Auto-resume consultation registration once user verifies email and logs in
  useEffect(() => {
    if (returnToConsultation && currentUser && isEmailVerified) {
      setReturnToConsultation(false);
      setIsConsultationModalOpen(true);
    }
  }, [returnToConsultation, currentUser, isEmailVerified]);

  const handleNavigate = (page: NavigationPage, param?: string, targetUrl?: string) => {
    if (page === 'book-consultation') {
      handleOpenConsultation();
      return;
    }

    let nextUrl = targetUrl;
    if (!nextUrl) {
      if (page === 'home') {
        nextUrl = '/';
      } else if (param) {
        nextUrl = `/${page}/${param}`;
      } else {
        nextUrl = `/${page}`;
      }
    }

    try {
      if (window.location.pathname !== nextUrl) {
        window.history.pushState(null, '', nextUrl);
      }
    } catch (err) {
      // In constrained iframe environments pushState might warn safely
    }

    setCurrentPage(page);
    setCurrentSubpage(param);
    setCurrentUrl(nextUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (serviceName?: string) => {
    if (serviceName) {
      setConsultationPreselectedService(serviceName);
    }
    // Step 2 & 3: Check authentication status. If not logged in, redirect to login page.
    if (!currentUser) {
      setReturnToConsultation(true);
      handleNavigate('login');
      return;
    }
    // Step 6: Block unverified users from accessing protected consultation form
    if (!isEmailVerified) {
      setReturnToConsultation(true);
      handleNavigate('account');
      return;
    }
    setIsConsultationModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#D5A13A]/30">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        currentSubpage={currentSubpage}
        currentUrl={currentUrl}
        onNavigate={handleNavigate}
        onOpenConsultation={handleOpenConsultation}
        navigationItems={navItems}
        settings={settings}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {loadingContent || authLoading ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#10283F]" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Loading Erukneh Ademe Consulting...
              </p>
            </div>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomeView
                settings={settings}
                services={services}
                industries={industries}
                articles={articles}
                testimonials={testimonials}
                pageSections={pageSections.filter((s) => s.pageId === 'home')}
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
                onSelectService={(svc) => {
                  setSelectedService(svc);
                  handleNavigate('services', svc.slug, `/services/${svc.slug}`);
                }}
                onSelectArticle={(art) => {
                  setSelectedArticle(art);
                  handleNavigate('insights', undefined, '/insights');
                }}
              />
            )}

            {currentPage === 'about' && (
              <AboutView
                settings={settings}
                subpage={currentSubpage}
                pageSections={pageSections.filter((s) => s.pageId === 'about')}
                onNavigate={handleNavigate}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'services' && (
              <ServicesView
                services={services}
                subpage={currentSubpage}
                onOpenConsultation={handleOpenConsultation}
                selectedService={selectedService}
                onSelectService={setSelectedService}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'training' && (
              <TrainingView
                subpage={currentSubpage as any}
                onNavigate={handleNavigate}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {currentPage === 'industries' && (
              <IndustriesView
                industries={industries}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'portfolio' && (
              <PortfolioView
                projects={projects}
                onOpenConsultation={handleOpenConsultation}
              />
            )}

            {(currentPage === 'skills' || currentPage === 'experience') && (
              <SkillsView
                skills={skills}
                experience={experience}
                education={education}
                certifications={certifications}
                onNavigate={handleNavigate}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'resume' && (
              <ResumeView
                resumeConfig={resumeConfig || DEFAULT_RESUME_CONFIG}
                experience={experience}
                education={education}
                certifications={certifications}
                settings={settings}
                onNavigate={handleNavigate}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'insights' && (
              <InsightsView
                articles={articles}
                projects={projects}
                subpage={currentSubpage}
                selectedArticle={selectedArticle}
                onSelectArticle={setSelectedArticle}
                onNavigate={handleNavigate}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'contact' && (
              <ContactView
                settings={settings}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'login' && (
              <LoginView
                onNavigate={handleNavigate}
                consultationNotice={returnToConsultation}
                onAuthSuccess={() => {
                  if (returnToConsultation) {
                    setReturnToConsultation(false);
                    setIsConsultationModalOpen(true);
                    handleNavigate('home');
                  } else {
                    handleNavigate('account');
                  }
                }}
              />
            )}

            {currentPage === 'register' && <RegisterView onNavigate={handleNavigate} />}

            {currentPage === 'forgot-password' && (
              <ForgotPasswordView onNavigate={handleNavigate} />
            )}

            {currentPage === 'reset-password' && (
              <ResetPasswordConfirmView
                mode={actionLinkParams?.mode || 'resetPassword'}
                oobCode={actionLinkParams?.oobCode || ''}
                onNavigate={handleNavigate}
                onClearActionParams={() => {
                  setActionLinkParams(null);
                  try {
                    window.history.replaceState({}, document.title, window.location.pathname);
                  } catch (e) {
                    // ignore
                  }
                }}
              />
            )}

            {currentPage === 'account' && (
              !currentUser ? (
                <LoginView onNavigate={handleNavigate} />
              ) : !isEmailVerified ? (
                <div className="max-w-2xl mx-auto px-4 py-16">
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200">
                    <VerifyEmailNotice
                      onRefreshComplete={() => handleNavigate('account')}
                      onSignOut={async () => {
                        await logout();
                        handleNavigate('login');
                      }}
                    />
                  </div>
                </div>
              ) : (
                <AccountProfileView
                  onNavigate={handleNavigate}
                  onOpenConsultation={() => handleOpenConsultation()}
                />
              )
            )}

            {currentPage === 'admin' && (
              !currentUser ? (
                <LoginView onNavigate={handleNavigate} />
              ) : !isEmailVerified ? (
                <div className="max-w-2xl mx-auto px-4 py-16">
                  <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200">
                    <VerifyEmailNotice
                      onRefreshComplete={() => handleNavigate('admin')}
                      onSignOut={async () => {
                        await logout();
                        handleNavigate('login');
                      }}
                    />
                  </div>
                </div>
              ) : !isAdmin ? (
                <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-slate-50">
                  <div className="max-w-md w-full bg-white p-8 rounded-xl shadow border border-slate-200 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-slate-900">
                      Access Restricted
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      The administrator dashboard requires verified administrative credentials.
                    </p>
                    <button
                      onClick={() => handleNavigate('home')}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#10283F] rounded hover:bg-[#173859]"
                    >
                      Return to Home
                    </button>
                  </div>
                </div>
              ) : (
                <AdminDashboard
                  onNavigate={handleNavigate}
                  onRefreshPublicData={fetchPublicContent}
                />
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={handleNavigate}
          onOpenConsultation={() => handleOpenConsultation()}
          settings={settings}
          navigationItems={navItems}
        />
      )}

      {/* Global Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        preselectedService={consultationPreselectedService}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
