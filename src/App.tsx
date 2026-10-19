import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/public/HomeView';
import { AboutView } from './components/public/AboutView';
import { ServicesView } from './components/public/ServicesView';
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

function AppContent() {
  const { currentUser, isAdmin, isEmailVerified, loading: authLoading, logout } = useAuth();

  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
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

  useEffect(() => {
    fetchPublicContent();
  }, []);

  const handleNavigate = (page: NavigationPage, param?: string) => {
    if (page === 'book-consultation') {
      setIsConsultationModalOpen(true);
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (serviceName?: string) => {
    setConsultationPreselectedService(serviceName);
    setIsConsultationModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#D5A13A]/30">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
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
                  setCurrentPage('services');
                }}
                onSelectArticle={(art) => {
                  setSelectedArticle(art);
                  setCurrentPage('insights');
                }}
              />
            )}

            {currentPage === 'about' && (
              <AboutView
                settings={settings}
                pageSections={pageSections.filter((s) => s.pageId === 'about')}
                onNavigate={handleNavigate}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'services' && (
              <ServicesView
                services={services}
                onOpenConsultation={handleOpenConsultation}
                selectedService={selectedService}
                onSelectService={setSelectedService}
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
                selectedArticle={selectedArticle}
                onSelectArticle={setSelectedArticle}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'contact' && (
              <ContactView
                settings={settings}
                onOpenConsultation={() => handleOpenConsultation()}
              />
            )}

            {currentPage === 'login' && <LoginView onNavigate={handleNavigate} />}

            {currentPage === 'register' && <RegisterView onNavigate={handleNavigate} />}

            {currentPage === 'forgot-password' && (
              <ForgotPasswordView onNavigate={handleNavigate} />
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
        />
      )}

      {/* Global Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        preselectedService={consultationPreselectedService}
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
