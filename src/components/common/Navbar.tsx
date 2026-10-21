import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NavigationPage, NavigationItem, SiteSettings } from '../../types';
import { NAV_ICON_MAP } from '../admin/NavigationManager';
import { DEFAULT_NAVIGATION_ITEMS } from '../../services/dataService';
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
  ChevronRight,
  ExternalLink,
  Compass,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentPage: NavigationPage;
  currentSubpage?: string;
  currentUrl?: string;
  onNavigate: (page: NavigationPage, param?: string, targetUrl?: string) => void;
  onOpenConsultation: (serviceSlug?: string) => void;
  navigationItems?: NavigationItem[];
  settings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  currentSubpage,
  currentUrl,
  onNavigate,
  onOpenConsultation,
  navigationItems = [],
  settings,
}) => {
  const { currentUser, userProfile, isAdmin, isEmailVerified, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeDesktopDropdown, setActiveDesktopDropdown] = useState<string | null>(null);
  const [expandedMobileParentIds, setExpandedMobileParentIds] = useState<Record<string, boolean>>({});
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setActiveDesktopDropdown(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDesktopDropdown(null);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 1. Separate Root Items and Child Submenus (using DEFAULT_NAVIGATION_ITEMS as rich canonical fallback)
  const validItems = useMemo(() => {
    if (navigationItems && navigationItems.length > 0) {
      // If navigationItems from database is missing canonical roots or children, merge them in
      const existingIds = new Set(navigationItems.map((i) => i.id));
      const merged = [...navigationItems];
      for (const def of DEFAULT_NAVIGATION_ITEMS) {
        if (!existingIds.has(def.id)) {
          merged.push(def);
        }
      }
      return merged;
    }
    return DEFAULT_NAVIGATION_ITEMS;
  }, [navigationItems]);

  // Desktop active items
  const desktopRootItems = useMemo(() => {
    return validItems
      .filter(
        (i) =>
          (!i.parentId || i.parentId === null) &&
          (i.isVisible ?? true) &&
          (i.enabled ?? true) &&
          (i.visibleDesktop ?? true)
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [validItems]);

  // Mobile active items
  const mobileRootItems = useMemo(() => {
    return validItems
      .filter(
        (i) =>
          (!i.parentId || i.parentId === null) &&
          (i.isVisible ?? true) &&
          (i.enabled ?? true) &&
          (i.visibleMobile ?? true)
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [validItems]);

  const getChildrenForParent = (parentId: string, target: 'desktop' | 'mobile') => {
    return validItems
      .filter((i) => {
        if (i.parentId !== parentId) return false;
        if (!(i.isVisible ?? true) || !(i.enabled ?? true)) return false;
        if (target === 'desktop' && !(i.visibleDesktop ?? true)) return false;
        if (target === 'mobile' && !(i.visibleMobile ?? true)) return false;
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  const handleLinkClick = (item: NavigationItem) => {
    if (item.requiresAuth && !currentUser) {
      onNavigate('login', undefined, '/login');
      setMobileMenuOpen(false);
      setActiveDesktopDropdown(null);
      return;
    }

    if (item.destinationType === 'external' || item.isExternal || item.openInNewTab) {
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
        setActiveDesktopDropdown(null);
        setMobileMenuOpen(false);
        return;
      }
    }

    if (item.destinationType === 'anchor' && item.url?.startsWith('#')) {
      const element = document.querySelector(item.url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
      setActiveDesktopDropdown(null);
      return;
    }

    if (item.page) {
      onNavigate(item.page, item.slug, item.url);
    }
    setActiveDesktopDropdown(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileParent = (parentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMobileParentIds((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const companyName = settings?.companyName || 'Erukneh Ademe';
  const tagline = settings?.tagline || 'Business Consulting';
  const phone = settings?.phone || '+251 11 667 8900';
  const email = settings?.email || 'info@eruknehademe.com';
  const consultationBtnText = settings?.consultationBtnText || 'Book Consultation';

  return (
    <header className="sticky top-0 z-50 bg-[#10283F] text-white shadow-xl border-b border-[#1b3d5e]/70">
      {/* Top micro bar for corporate contacts (visible on tablet & desktop >= 768px) */}
      <div className="hidden md:block bg-[#0a1826] text-xs text-slate-300 py-1.5 px-4 sm:px-6 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4 lg:space-x-6 text-[11px] lg:text-xs">
            <span className="flex items-center text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block mr-2 animate-pulse" />
              Addis Ababa Head Office &bull; East Africa
            </span>
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center hover:text-[#D5A13A] transition-colors"
            >
              <Phone className="w-3 h-3 mr-1.5 text-[#D5A13A]" />
              <span>{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="hidden lg:flex items-center hover:text-[#D5A13A] transition-colors"
            >
              <Mail className="w-3 h-3 mr-1.5 text-[#D5A13A]" />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
            <span className="hidden sm:inline">CMC Standards &bull; IFRS Advisory</span>
            {isAdmin && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#D5A13A]/20 text-[#D5A13A] border border-[#D5A13A]/30">
                <Shield className="w-2.5 h-2.5 mr-1" />
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Branding */}
          <div
            className="flex items-center space-x-2.5 sm:space-x-3.5 cursor-pointer group shrink-0"
            onClick={() => onNavigate('home')}
          >
            {settings?.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={companyName}
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain rounded-lg"
              />
            ) : (
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-br from-[#D5A13A] via-[#b88528] to-[#916215] p-0.5 shadow-md group-hover:shadow-[#D5A13A]/30 transition-shadow">
                <div className="w-full h-full bg-[#10283F] rounded-[7px] flex items-center justify-center border border-[#D5A13A]/40">
                  <span className="font-serif font-bold text-base sm:text-lg text-[#D5A13A] tracking-wider">
                    EA
                  </span>
                </div>
              </div>
            )}
            <div>
              <div className="font-serif text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white group-hover:text-[#D5A13A] transition-colors flex items-center leading-tight">
                {companyName}
              </div>
              <div className="text-[9px] sm:text-[10px] lg:text-[11px] font-medium tracking-[0.18em] uppercase text-slate-300">
                {tagline}
              </div>
            </div>
          </div>

          {/* Dynamic Desktop Navigation Links (>= 1024px) */}
          <nav ref={desktopNavRef} className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5">
            {desktopRootItems.map((item) => {
              const children = getChildrenForParent(item.id, 'desktop');
              const hasDropdown = children.length > 0;
              const isCurrent =
                currentPage === item.page ||
                (currentUrl && item.url && currentUrl === item.url) ||
                children.some(
                  (c) =>
                    currentPage === c.page &&
                    (c.slug === currentSubpage || (currentUrl && c.url === currentUrl))
                );
              const isOpen = activeDesktopDropdown === item.id;
              const IconComp = item.icon ? NAV_ICON_MAP[item.icon] || Compass : null;

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => hasDropdown && setActiveDesktopDropdown(item.id)}
                  onMouseLeave={() => hasDropdown && setActiveDesktopDropdown(null)}
                >
                  <button
                    onClick={() => {
                      if (hasDropdown) {
                        setActiveDesktopDropdown(isOpen ? null : item.id);
                      } else {
                        handleLinkClick(item);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                        if (hasDropdown) {
                          e.preventDefault();
                          setActiveDesktopDropdown(isOpen ? null : item.id);
                        }
                      } else if (e.key === 'Escape') {
                        setActiveDesktopDropdown(null);
                      }
                    }}
                    aria-expanded={hasDropdown ? isOpen : undefined}
                    aria-haspopup={hasDropdown ? 'true' : undefined}
                    className={`px-2.5 lg:px-2.5 xl:px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 flex items-center space-x-1 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D5A13A] ${
                      isCurrent || isOpen
                        ? 'text-[#D5A13A] bg-white/5 font-bold shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {IconComp && <IconComp className="w-3.5 h-3.5 text-[#D5A13A] shrink-0" />}
                    <span>{item.label}</span>
                    {item.requiresAuth && (
                      <Lock className="w-2.5 h-2.5 text-amber-400 shrink-0 opacity-75" />
                    )}
                    {hasDropdown && (
                      <ChevronDown
                        className={`w-3 h-3 opacity-75 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#D5A13A]' : ''
                        }`}
                      />
                    )}
                    {isCurrent && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#D5A13A] rounded-full" />
                    )}
                  </button>

                  {/* Desktop Dropdown Flyout */}
                  {hasDropdown && isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-[#0a1826] border border-slate-700/80 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-3.5 py-2 border-b border-slate-800 text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center justify-between">
                        <span>{item.label}</span>
                        {item.page && (
                          <button
                            onClick={() => handleLinkClick(item)}
                            className="text-[#D5A13A] hover:underline normal-case text-[11px] font-semibold flex items-center space-x-1"
                          >
                            <span>Overview</span>
                            <span>&rarr;</span>
                          </button>
                        )}
                      </div>
                      <div className="py-1">
                        {children.map((sub) => {
                          const SubIcon = sub.icon ? NAV_ICON_MAP[sub.icon] || Compass : Compass;
                          const isSubActive =
                            (currentUrl && sub.url && currentUrl === sub.url) ||
                            (currentPage === sub.page && currentSubpage && sub.slug === currentSubpage);
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleLinkClick(sub)}
                              className={`w-full text-left px-3.5 py-2 text-xs flex items-center space-x-2.5 transition-colors focus-visible:outline-none focus-visible:bg-[#173859] ${
                                isSubActive
                                  ? 'bg-[#173859] text-[#D5A13A] font-semibold'
                                  : 'text-slate-200 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0">
                                <SubIcon className="w-3.5 h-3.5 text-[#D5A13A]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="truncate flex items-center space-x-1">
                                  <span>{sub.label}</span>
                                  {sub.openInNewTab && (
                                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                  )}
                                </div>
                                {sub.description && (
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {sub.description}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action CTAs & Auth Dropdown (Desktop >= 640px) */}
          <div className="hidden sm:flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Book Consultation Button */}
            <button
              onClick={() => onOpenConsultation()}
              className="group relative inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] via-[#D5A13A] to-[#c4912e] rounded-md shadow-md hover:shadow-[#D5A13A]/25 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#10283F]" />
              <span>{consultationBtnText}</span>
            </button>

            {/* Auth status & actions */}
            {currentUser ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-md bg-[#173859] hover:bg-[#1f4b75] border border-slate-700/60 transition-colors text-xs text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-[#D5A13A] text-[#10283F] font-bold flex items-center justify-center text-xs">
                    {(userProfile?.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[80px] lg:max-w-[100px] truncate font-medium">
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
                      Client Profile & Consultations
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
                className="px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-[#173859]/70 hover:bg-[#173859] border border-slate-700 rounded-md transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile & Tablet Control Buttons (< 1024px) */}
          <div className="flex items-center lg:hidden space-x-2">
            <button
              onClick={() => onOpenConsultation()}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#10283F] bg-[#D5A13A] rounded shadow sm:hidden"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-white/10 border border-slate-700/60"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#D5A13A]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Fully responsive across 320px to 1024px) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a1826] border-b border-slate-800 max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in slide-in-from-top-2">
          {/* Drawer Top Branding & Close Header */}
          <div className="px-4 py-3 bg-[#0d2135] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-[#D5A13A] text-[#10283F] font-serif font-bold text-xs flex items-center justify-center">
                EA
              </div>
              <span className="font-serif font-bold text-xs text-white">Menu Navigation</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Accordion Items */}
          <div className="px-4 py-3 space-y-1">
            {mobileRootItems.map((item) => {
              const children = getChildrenForParent(item.id, 'mobile');
              const hasChildren = children.length > 0;
              const isExpanded = !!expandedMobileParentIds[item.id];
              const isCurrent =
                currentPage === item.page ||
                children.some((c) => currentPage === c.page);
              const IconComp = item.icon ? NAV_ICON_MAP[item.icon] || Compass : Compass;

              return (
                <div key={item.id} className="border-b border-slate-800/60 pb-1">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLinkClick(item)}
                      className={`flex-1 text-left py-2 px-2.5 rounded text-xs flex items-center space-x-2 transition-colors ${
                        isCurrent
                          ? 'bg-[#D5A13A]/20 text-[#D5A13A] font-bold'
                          : 'text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-[#D5A13A] shrink-0" />
                      <span>{item.label}</span>
                      {item.requiresAuth && (
                        <Lock className="w-2.5 h-2.5 text-amber-400 ml-1 shrink-0" />
                      )}
                    </button>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={(e) => toggleMobileParent(item.id, e)}
                        className="p-2 text-slate-400 hover:text-[#D5A13A] transition-colors rounded"
                        aria-label={`Expand ${item.label} submenu`}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180 text-[#D5A13A]' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Submenu Accordion Drawer */}
                  {hasChildren && isExpanded && (
                    <div className="pl-6 pr-2 py-1.5 space-y-1 bg-white/5 rounded-md my-1 border-l-2 border-[#D5A13A]/40">
                      {children.map((sub) => {
                        const SubIcon = sub.icon ? NAV_ICON_MAP[sub.icon] || Compass : Compass;
                        const isSubActive =
                          (currentUrl && sub.url && currentUrl === sub.url) ||
                          (currentPage === sub.page && currentSubpage && currentSubpage === sub.slug);
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleLinkClick(sub)}
                            className={`w-full text-left py-1.5 px-2 rounded text-xs flex items-center space-x-2 ${
                              isSubActive
                                ? 'text-[#D5A13A] font-semibold bg-white/10'
                                : 'text-slate-300 hover:text-white'
                            }`}
                          >
                            <SubIcon className="w-3 h-3 text-[#D5A13A] shrink-0" />
                            <span className="truncate">{sub.label}</span>
                            {sub.openInNewTab && (
                              <ExternalLink className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Drawer Bottom CTAs */}
          <div className="p-4 bg-[#0d2135] border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-2.5 px-4 text-center text-xs font-semibold text-[#10283F] bg-gradient-to-r from-[#e6b956] to-[#D5A13A] rounded-md shadow flex items-center justify-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{consultationBtnText}</span>
            </button>

            {currentUser ? (
              <div className="space-y-1 pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 px-1 truncate">
                  Signed in: <span className="text-white font-medium">{currentUser.email}</span>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate('admin');
                    }}
                    className="w-full text-left py-2 px-2.5 text-xs font-semibold text-[#D5A13A] bg-white/5 rounded flex items-center"
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
                  className="w-full text-left py-2 px-2.5 text-xs text-slate-200 hover:bg-white/5 rounded flex items-center"
                >
                  <UserIcon className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  Client Profile & Requests
                </button>
                <button
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    onNavigate('home');
                  }}
                  className="w-full text-left py-2 px-2.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded flex items-center"
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
                className="w-full py-2 px-4 text-center text-xs font-medium text-slate-200 bg-[#173859] hover:bg-[#1f4b75] rounded-md transition-colors"
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
