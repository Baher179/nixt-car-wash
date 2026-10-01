import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { HeaderSearch } from './HeaderSearch';
import {
  MapPin,
  Wallet,
  ShoppingBag,
  Bell,
  User,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  UserCheck,
  LogOut,
  Settings,
  HelpCircle,
  FileText,
  Search
} from 'lucide-react';

interface HeaderProps {
  onOpenCarModal?: () => void;
  onOpenAddressModal?: () => void;
  onOpenProfileModal?: (tab?: 'info' | 'subscriptions') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCarModal,
  onOpenAddressModal,
  onOpenProfileModal
}) => {
  const {
    currentScreen,
    setCurrentScreen,
    walletBalance,
    cartCount,
    user,
    setShowAuthModal,
    logout,
    isAdmin,
    setIsAdmin,
    selectedAddress,
    notifications,
    markNotificationAsRead,
    setActiveStoreCategory
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationsDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'nav-home', key: 'home', label: 'الخدمات' },
    { id: 'nav-store', key: 'store', label: 'المتجر' },
    { id: 'nav-orders', key: 'orders', label: 'طلباتي' },
    { id: 'nav-wallet', key: 'subscriptions', label: 'اشتراكاتي' },
  ];

  const handleNavClick = (screenKey: string) => {
    setIsAdmin(false);
    if (screenKey === 'store') {
      setActiveStoreCategory(null);
    }
    setCurrentScreen(screenKey as any);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-hairline">
      {/* Top micro bar for announcements & admin toggle */}
      <div className="bg-ink text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="hidden sm:inline-block bg-accent text-ink font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">
              عرض
            </span>
            <span className="text-slate-300 text-[11px] sm:text-xs truncate">
              خصم 25% على غسيل السيارات بكود <strong className="text-accent font-bold">X25</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Switcher */}
            <button
              id="btn-admin-toggle"
              onClick={() => {
                setIsAdmin(!isAdmin);
                if (!isAdmin) setCurrentScreen('admin');
                else setCurrentScreen('home');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold transition-all ${
                isAdmin
                  ? 'bg-amber-500 text-slate-950 ring-1 ring-amber-400'
                  : 'bg-slate-800 text-amber-400 hover:bg-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{isAdmin ? 'العودة لواجهة العميل' : 'لوحة تحكم الإدارة'}</span>
              <span className="sm:hidden">{isAdmin ? 'العميل' : 'الإدارة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Container (Height: 64-68px) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-2 sm:gap-6">

        {/* RIGHT SECTION: Brand Logo & Booking Location Selector */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* NIXT Brand Logo */}
          <button
            id="btn-logo-home"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep rounded-xl"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-ink flex items-center justify-center text-white font-bold text-xl shadow-xs group-hover:scale-105 transition-transform">
              <span>N</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-ink leading-none">
                NIXT
              </span>
              <span className="hidden sm:block text-[11px] text-muted leading-tight mt-0.5">
                خدماتك بخبرة واحترافية
              </span>
            </div>
          </button>

          {/* Booking Location Selector (Option 02 Reference Style) */}
          <button
            id="btn-location-picker"
            onClick={() => {
              setCurrentScreen('addresses');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden md:flex items-center gap-2.5 hover:bg-canvas text-ink border border-hairline h-11 px-3.5 rounded-full transition-colors text-right group"
            title="تغيير موقع الحجز"
          >
            <MapPin className="w-4 h-4 text-brand-deep shrink-0" />
            <div className="flex flex-col leading-none text-right">
              <span className="text-[10px] text-faint mb-0.5">موقع الحجز</span>
              <span className="text-xs font-bold text-ink max-w-[140px] truncate">
                {selectedAddress ? `${selectedAddress.name} - ${selectedAddress.city}` : 'اختر موقعك'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-faint shrink-0" />
          </button>
        </div>

        {/* MIDDLE SECTION: Main Navigation & Site-Wide Search Bar */}
        <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 flex-1 justify-center max-w-xl mx-1 sm:mx-3">
          {/* Main Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium shrink-0">
            {navItems.map((item) => {
              const isActive = (currentScreen === item.key || (item.key === 'store' && currentScreen === 'product_detail')) && !isAdmin;
              return (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => handleNavClick(item.key)}
                  className={`relative px-3 py-2 text-[13px] transition-colors whitespace-nowrap ${
                    isActive ? 'text-ink font-bold' : 'text-muted hover:text-ink font-medium'
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-deep transition-opacity ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Site-Wide Search Bar (Desktop & Tablet) */}
          <HeaderSearch className="hidden sm:block flex-1 min-w-[180px] max-w-[320px] lg:max-w-[360px]" />
        </div>

        {/* LEFT SECTION: User Actions (Wallet -> Notifications -> Secondary Action -> User Profile -> Mobile Menu) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Mobile Search Icon Button (< sm) */}
          <button
            id="btn-mobile-search-toggle"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className={`sm:hidden w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
              showMobileSearch ? 'bg-canvas border-hairline text-brand-deep' : 'border-hairline hover:bg-canvas text-ink'
            }`}
            title="البحث في الموقع"
            aria-label="البحث في الموقع"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>
          
          {/* 1. Wallet Balance Chip (Compact Green Chip) */}
          <button
            id="btn-header-wallet"
            onClick={() => handleNavClick('wallet')}
            className={`hidden sm:flex items-center gap-2 h-10 px-3.5 rounded-full border transition-colors ${
              currentScreen === 'wallet' && !isAdmin
                ? 'bg-canvas border-hairline text-ink'
                : 'border-hairline hover:bg-canvas text-ink'
            }`}
            title="رصيد المحفظة"
          >
            <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="price text-[13px] whitespace-nowrap">
              {walletBalance.toFixed(2)} <span className="text-[10px] font-medium text-muted">ر.س</span>
            </span>
          </button>

          {/* 2. Notifications Bell with Badge */}
          <div className="relative" ref={notifRef}>
            <button
              id="btn-header-notifications"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                showNotificationsDropdown ? 'bg-canvas border-hairline text-brand-deep' : 'border-hairline hover:bg-canvas text-ink'
              }`}
              title="الإشعارات"
              aria-expanded={showNotificationsDropdown}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ink text-white text-[10px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-canvas animate-scale-in">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {showNotificationsDropdown && (
              <div className="absolute left-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-100 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 text-right">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-900">
                    الإشعارات ({notifications.length})
                  </span>
                  <span className="text-[11px] text-brand-deep font-medium">تحديثات النظام</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer text-right border ${
                        n.read
                          ? 'bg-slate-50/80 border-slate-100 text-slate-600'
                          : 'bg-brand-soft/80 border-brand-soft text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-brand-deep">{n.title}</span>
                        <span className="text-[10px] text-slate-400">الآن</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Secondary Action: Cart Icon */}
          <button
            id="btn-header-cart"
            onClick={() => handleNavClick('cart')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
              currentScreen === 'cart' && !isAdmin ? 'bg-canvas border-hairline text-brand-deep' : 'border-hairline hover:bg-canvas text-ink'
            }`}
            title="سلة المشتريات"
          >
            <ShoppingBag className="w-[18px] h-[18px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-ink text-white text-[10px] font-bold w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-xs ring-2 ring-canvas animate-scale-in">
                {cartCount}
              </span>
            )}
          </button>

          {/* 4. User Profile Dropdown Button (Avatar + Name + Chevron Down) */}
          <div className="relative" ref={profileRef}>
            <button
              id="btn-user-profile-menu"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`flex items-center gap-2 h-10 px-2 sm:px-3 rounded-full border transition-colors text-right ${
                showProfileDropdown || currentScreen === 'menu'
                  ? 'bg-canvas border-hairline text-ink'
                  : 'border-hairline hover:bg-canvas text-ink'
              }`}
              title="الملف الشخصي والحساب"
              aria-expanded={showProfileDropdown}
            >
              {/* User Avatar */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-brand-soft flex items-center justify-center text-brand-deep font-bold text-xs shrink-0 border border-slate-200">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-brand-deep" />
                )}
              </div>

              {/* User Name */}
              <span className="hidden md:inline text-xs font-semibold max-w-[110px] xl:max-w-[140px] truncate text-slate-800">
                {user.isLoggedIn ? user.name : 'مرحباً، زائر'}
              </span>

              {/* Chevron Indicator */}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                showProfileDropdown ? 'rotate-180 text-brand-deep' : ''
              }`} />
            </button>

            {/* Profile Menu Dropdown */}
            {showProfileDropdown && (
              <div
                id="header-profile-dropdown"
                className="absolute left-0 mt-2.5 w-72 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200/90 p-2 z-50 animate-in fade-in slide-in-from-top-2 text-right"
              >
                {/* User Info Header */}
                <div className="p-3 bg-slate-50/90 rounded-xl mb-1.5 border border-slate-100 text-right flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand-deep flex items-center justify-center font-bold text-sm shrink-0 border border-hairline overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-brand-deep" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-black text-slate-900 truncate">{user.name || 'حساب المستخدم'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal" dir="ltr">{user.phone ? `+${user.phone}` : 'زائر'}</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-1">
                  <button
                    id="dropdown-btn-profile"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleNavClick('profile');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-soft/70 hover:text-brand-deep transition-all text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-soft flex items-center justify-center text-slate-500 group-hover:text-brand-deep transition-colors shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <span>الملف الشخصي وإعدادات الحساب</span>
                    </div>
                  </button>

                  <button
                    id="dropdown-btn-help"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleNavClick('help');
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-brand-soft/70 hover:text-brand-deep transition-all text-right cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-brand-soft flex items-center justify-center text-slate-500 group-hover:text-brand-deep transition-colors shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span>المساعدة والدعم الفني</span>
                    </div>
                  </button>
                </div>

                {/* Logout or Login option */}
                <div className="pt-1.5 mt-1.5 border-t border-slate-100">
                  {user.isLoggedIn ? (
                    <button
                      id="dropdown-btn-logout"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-all text-right cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-red-50 group-hover:bg-red-100/80 flex items-center justify-center text-red-500 transition-colors shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>تسجيل الخروج</span>
                      </div>
                    </button>
                  ) : (
                    <button
                      id="dropdown-btn-login"
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleNavClick('auth');
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-brand-deep hover:bg-brand-soft transition-all text-right cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-soft group-hover:bg-brand-soft flex items-center justify-center text-brand-deep transition-colors shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <span>تسجيل الدخول / إنشاء حساب</span>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 5. Mobile Menu Toggle Button (Hamburger) */}
          <button
            id="btn-mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden w-10 h-10 rounded-full border border-hairline hover:bg-canvas flex items-center justify-center text-ink transition-colors"
            title="القائمة الرئيسية"
            aria-label="القائمة الرئيسية"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5 text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Dropdown Strip (< sm) */}
      {showMobileSearch && (
        <div className="sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-sm animate-in slide-in-from-top-2 duration-150">
          <HeaderSearch
            isMobileDrawer
            onResultClick={() => setShowMobileSearch(false)}
          />
        </div>
      )}

      {/* Mobile Collapsible Navigation Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-t border-slate-200/80 px-4 py-3.5 shadow-md animate-in slide-in-from-top-2 duration-150 space-y-3">
          {/* Mobile Search inside Drawer */}
          <div className="sm:hidden">
            <HeaderSearch
              isMobileDrawer
              onResultClick={() => setShowMobileMenu(false)}
            />
          </div>

          {/* Location and wallet live here on narrow screens, where showing them
              in the bar pushed the actions off the edge. */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setShowMobileMenu(false);
                setCurrentScreen('addresses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 p-3 rounded-xl border border-hairline hover:bg-canvas transition-colors text-right min-w-0"
            >
              <MapPin className="w-4 h-4 text-brand-deep shrink-0" />
              <span className="flex flex-col leading-none min-w-0">
                <span className="text-[10px] text-faint mb-1">موقع الحجز</span>
                <span className="text-xs font-bold text-ink truncate">
                  {selectedAddress ? `${selectedAddress.name} - ${selectedAddress.city}` : 'اختر موقعك'}
                </span>
              </span>
            </button>

            <button
              onClick={() => handleNavClick('wallet')}
              className="sm:hidden flex items-center gap-2 p-3 rounded-xl border border-hairline hover:bg-canvas transition-colors text-right min-w-0"
            >
              <Wallet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="flex flex-col leading-none min-w-0">
                <span className="text-[10px] text-faint mb-1">رصيد المحفظة</span>
                <span className="price text-xs text-ink truncate">
                  {walletBalance.toFixed(2)} <span className="text-[10px] font-medium text-muted">ر.س</span>
                </span>
              </span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
            {navItems.map((item) => {
              const isActive = currentScreen === item.key && !isAdmin;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.key)}
                  className={`py-2.5 px-3 rounded-xl transition-colors text-center ${
                    isActive ? 'bg-ink text-white font-bold' : 'bg-canvas hover:bg-brand-deep-soft text-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Additional quick links on mobile */}
          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('menu')}
              className="flex items-center gap-1.5 hover:text-brand-deep py-1"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>كافة الإعدادات والقائمة</span>
            </button>
            <button
              onClick={() => handleNavClick('help')}
              className="flex items-center gap-1.5 hover:text-brand-deep py-1"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>المساعدة والدعم</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
