import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage, NavigationItem, SiteSettings } from '../../types';
import {
  Menu,
  X,
  Phone,
  Mail,
  Shield,
  User as UserIcon,
  LogOut,
  Calendar,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, param?: string) => void;
  onOpenConsultation: (serviceSlug?: string) => void;
  navigationItems?: NavigationItem[];
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenConsultation,
  navigationItems = [],
  settings,
}) => {
  const { currentUser, userProfile, isAdmin, isEmailVerified, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Filter visible items sorted by order
  const visibleNavLinks = navigationItems.length > 0
    ? navigationItems.filter((i) => i.isVisible).sort((a, b) => a.order - b.order)
    : [
        { id: '1', label: 'Home', page: 'home' as NavigationPage, order: 1, isVisible: true },
        { id: '2', label: 'About Us', page: 'about' as NavigationPage, order: 2, isVisible: true },
        { id: '3', label: 'Services', page: 'services' as NavigationPage, order: 3, isVisible: true },
        { id: '4', label: 'Industries', page: 'industries' as NavigationPage, order: 4, isVisible: true },
        { id: '5', label: 'Projects', page: 'portfolio' as NavigationPage, order: 5, isVisible: true },
        { id: '6', label: 'Skills & Experience', page: 'skills' as NavigationPage, order: 6, isVisible: true },
        { id: '7', label: 'Resume', page: 'resume' as NavigationPage, order: 7, isVisible: true },
        { id: '8', label: 'Insights', page: 'insights' as NavigationPage, order: 8, isVisible: true },
        { id: '9', label: 'Contact', page: 'contact' as NavigationPage, order: 9, isVisible: true },
      ];

  const handleLinkClick = (page: NavigationPage, url?: string, isExternal?: boolean) => {
    if (isExternal && url) {
      window.open(url, '_blank');
      return;
    }
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const companyName = settings?.companyName || 'Erukneh Ademe';
  const tagline = settings?.tagline || 'Business Consulting';
  const phone = settings?.phone || '+251 11 667 8900';
  const email = settings?.email || 'info@eruknehademe.com';
  const consultationBtnText = settings?.consultationBtnText || 'Book Consultation';

  return (
    <header className="sticky top-0 z-50 bg-[#10283F] text-white shadow-xl border-b border-[#1b3d5e]/70">
      {/* Top micro bar for corporate contacts */}
      <div className="hidden md:block bg-[#0a1826] text-xs text-slate-300 py-1.5 px-6 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse"></span>
              Addis Ababa Head Office &bull; East Africa
            </span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center hover:text-[#D5A13A] transition-colors"
            >
              <Phone className="w-3 h-3 mr-1.5 text-[#D5A13A]" />
              {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center hover:text-[#D5A13A] transition-colors"
            >
              <Mail className="w-3 h-3 mr-1.5 text-[#D5A13A]" />
              {email}
            </a>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>CMC Standards &bull; IFRS Compliant Advisory</span>
            {isAdmin && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D5A13A]/20 text-[#D5A13A] border border-[#D5A13A]/30">
                <Shield className="w-2.5 h-2.5 mr-1" />
                Admin Authorized
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Branding */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={companyName}
                className="w-11 h-11 object-contain rounded-lg"
              />
            ) : (
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#D5A13A] via-[#b88528] to-[#916215] p-0.5 shadow-md group-hover:shadow-[#D5A13A]/30 transition-shadow">
                <div className="w-full h-full bg-[#10283F] rounded-[7px] flex items-center justify-center border border-[#D5A13A]/40">
                  <span className="font-serif font-bold text-lg text-[#D5A13A] tracking-wider">
                    EA
                  </span>
                </div>
              </div>
            )}
            <div>
              <div className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#D5A13A] transition-colors flex items-center">
                {companyName}
              </div>
              <div className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-slate-300">
                {tagline}
              </div>
            </div>
          </div>

          {/* Dynamic Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {visibleNavLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.page, item.url, item.isExternal)}
                  className={`px-3 py-2 text-xs font-medium rounded-md transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'text-[#D5A13A] bg-white/5 font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#D5A13A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs & Auth Dropdown */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Book Consultation Button */}
            <button
              onClick={() => onOpenConsultation()}
              className="group relative inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow-lg shadow-black/20 hover:shadow-[#D5A13A]/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#10283F]" />
              {consultationBtnText}
            </button>

            {/* Auth status & actions */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-[#173859] hover:bg-[#1f4b75] border border-slate-700/60 transition-colors text-xs text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D5A13A] text-[#10283F] font-bold flex items-center justify-center text-xs">
                    {(userProfile?.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[90px] truncate font-medium">
                    {userProfile?.displayName?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#0e2133] rounded-lg shadow-2xl border border-slate-700 py-2 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-semibold text-white truncate">
                        {currentUser.email}
                      </p>
                      <div className="flex items-center space-x-1.5 mt-1">
                        <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-[#D5A13A] uppercase tracking-wider font-semibold">
                          {isAdmin ? 'Administrator' : 'Client Account'}
                        </span>
                        {isEmailVerified ? (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-emerald-500/20 text-emerald-400 font-medium">
                            Verified
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/20 text-amber-400 font-medium">
                            Unverified
                          </span>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs flex items-center text-[#D5A13A] hover:bg-white/5 font-semibold"
                      >
                        <Shield className="w-3.5 h-3.5 mr-2" />
                        Admin Dashboard & CMS
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onNavigate('account');
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center hover:bg-white/5"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      Client Profile & Requests
                    </button>

                    <div className="border-t border-slate-800 my-1" />

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                        onNavigate('home');
                      }}
                      className="w-full text-left px-4 py-2 text-xs flex items-center text-rose-400 hover:bg-rose-500/10"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-[#173859]/70 hover:bg-[#173859] border border-slate-700 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center xl:hidden space-x-2">
            <button
              onClick={() => onOpenConsultation()}
              className="px-2.5 py-1 text-xs font-semibold text-[#10283F] bg-[#D5A13A] rounded shadow"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0c1e2f] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            {visibleNavLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.page, item.url, item.isExternal)}
                className={`text-left px-3 py-2 text-xs rounded ${
                  currentPage === item.page
                    ? 'bg-[#D5A13A]/20 text-[#D5A13A] font-semibold'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded-md shadow"
            >
              {consultationBtnText}
            </button>

            {currentUser ? (
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 px-1">
                  Signed in: <span className="text-white font-medium">{currentUser.email}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left py-2 px-3 text-xs font-semibold text-[#D5A13A] bg-white/5 rounded flex items-center"
                  >
                    <Shield className="w-3.5 h-3.5 mr-2" />
                    Administrator Dashboard & CMS
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigate('account');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-slate-200 hover:bg-white/5 rounded flex items-center"
                >
                  <UserIcon className="w-3.5 h-3.5 mr-2" />
                  Client Profile & Requests
                </button>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    onNavigate('home');
                  }}
                  className="w-full text-left py-2 px-3 text-xs text-rose-400 hover:bg-rose-500/10 rounded flex items-center"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('login');
                }}
                className="w-full py-2 px-4 text-center text-xs font-medium text-slate-200 bg-[#173859] rounded-md"
              >
                Sign In to Client Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
