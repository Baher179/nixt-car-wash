import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';

interface ServicesStoreSwitcherProps {
  activeTab: 'services' | 'store';
  className?: string;
  onServicesClick?: () => void;
  onStoreClick?: () => void;
}

export const ServicesStoreSwitcher: React.FC<ServicesStoreSwitcherProps> = ({
  activeTab,
  className = '',
  onServicesClick,
  onStoreClick
}) => {
  const { currentScreen, setCurrentScreen, setActiveStoreCategory } = useApp();

  const handleServices = () => {
    if (onServicesClick) {
      onServicesClick();
      return;
    }
    if (currentScreen === 'home') {
      const el = document.getElementById('services-selection-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    setCurrentScreen('home');
  };

  const handleStore = () => {
    if (onStoreClick) {
      onStoreClick();
      return;
    }
    setActiveStoreCategory(null);
    if (currentScreen !== 'store') {
      setCurrentScreen('store');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isServicesActive = activeTab === 'services';
  const isStoreActive = activeTab === 'store';

  return (
    <div
      id="primary-section-switcher"
      className={`w-full max-w-[720px] mx-auto ${className}`}
      dir="rtl"
    >
      {/* Title & Subtitle in the center as requested */}
      <div className="text-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          اختر وجهتك
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          اكتشف كل ما تحتاجه في مكان واحد
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
        {/* ========================================================================= */}
        {/* CARD 1: SERVICES (الخدمات) */}
        {/* ========================================================================= */}
        <button
          type="button"
          id="compact-card-services"
          onClick={handleServices}
          aria-current={isServicesActive ? 'page' : undefined}
          className={`group relative text-right flex flex-col justify-between h-[122px] sm:h-[132px] p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.99] border ${
            isServicesActive
              ? 'bg-blue-50/80 border-blue-500/80 shadow-2xs'
              : 'bg-white/90 hover:bg-blue-50/40 border-slate-200/90 hover:border-blue-300 shadow-2xs hover:shadow-xs'
          }`}
        >
          {/* Top Row: Icon + Title + Active Status Pill */}
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isServicesActive
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              </div>
              <span
                className={`text-sm sm:text-base font-black tracking-tight transition-colors ${
                  isServicesActive ? 'text-blue-950' : 'text-slate-800 group-hover:text-blue-600'
                }`}
              >
                الخدمات
              </span>
            </div>

            {isServicesActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 border border-blue-200/60 px-2 py-0.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                <span>القسم الحالي</span>
              </span>
            )}
          </div>

          {/* Middle: Short Description */}
          <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-snug line-clamp-2">
            احجز الخدمة المناسبة بسهولة
          </p>

          {/* Bottom: Text CTA */}
          <div className="pt-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold transition-colors ${
                isServicesActive
                  ? 'text-blue-600 group-hover:text-blue-700'
                  : 'text-slate-500 group-hover:text-blue-600'
              }`}
            >
              <span>احجز الآن</span>
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>
        </button>

        {/* ========================================================================= */}
        {/* CARD 2: STORE (المتجر) */}
        {/* ========================================================================= */}
        <button
          type="button"
          id="compact-card-store"
          onClick={handleStore}
          aria-current={isStoreActive ? 'page' : undefined}
          className={`group relative text-right flex flex-col justify-between h-[122px] sm:h-[132px] p-3 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer active:scale-[0.99] border ${
            isStoreActive
              ? 'bg-amber-50/80 border-amber-500/80 shadow-2xs'
              : 'bg-white/90 hover:bg-amber-50/40 border-slate-200/90 hover:border-amber-300 shadow-2xs hover:shadow-xs'
          }`}
        >
          {/* Top Row: Icon + Title + Active Status Pill */}
          <div className="flex items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isStoreActive
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <span
                className={`text-sm sm:text-base font-black tracking-tight transition-colors ${
                  isStoreActive ? 'text-amber-950' : 'text-slate-800 group-hover:text-amber-700'
                }`}
              >
                المتجر
              </span>
            </div>

            {isStoreActive && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-full shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                <span>القسم الحالي</span>
              </span>
            )}
          </div>

          {/* Middle: Short Description */}
          <p className="text-[11px] sm:text-xs text-slate-600 font-normal leading-snug line-clamp-2">
            اكتشف منتجات وإكسسوارات مختارة
          </p>

          {/* Bottom: Text CTA */}
          <div className="pt-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold transition-colors ${
                isStoreActive
                  ? 'text-amber-800 group-hover:text-amber-900'
                  : 'text-slate-500 group-hover:text-amber-700'
              }`}
            >
              <span>تسوق الآن</span>
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
