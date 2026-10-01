import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Truck,
  Check,
  Star,
  Zap,
  Sparkles,
  Share2,
  CalendarCheck,
  Clock,
  CheckCircle2,
  PhoneCall,
  Car,
  Brush,
  Sofa,
  Cylinder,
  Bug,
  Wind
} from 'lucide-react';

interface ServiceDetailScreenProps {
  service?: ServiceItem | null;
  onBack?: () => void;
}

const CATEGORY_NAMES: Record<string, string> = {
  cars: 'غسيل السيارات',
  carpets: 'غسيل السجاد',
  furniture: 'غسيل الكنب والمجالس',
  carpets_furniture: 'غسيل السجاد والمفروشات',
  wash_offers: 'عروض الغسيل',
  tanks: 'تنظيف الخزانات',
  pest_control: 'مكافحة الحشرات',
  ac: 'تنظيف المكيفات',
  all: 'كافة الخدمات'
};

export const ServiceDetailScreen: React.FC<ServiceDetailScreenProps> = ({
  service: propService,
  onBack: propOnBack
}) => {
  const {
    selectedServiceForDetail,
    closeServiceDetail,
    services,
    openServiceDetail,
    openBookingModal,
    setCurrentScreen,
    selectedCategory,
    setSelectedCategory
  } = useApp();

  // Active service to display
  const service = propService || selectedServiceForDetail || services[0];
  const handleBack = propOnBack || closeServiceDetail;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Calculate active price
  const currentPrice = useMemo(() => {
    if (!service) return 0;
    return service.price;
  }, [service]);

  // Gallery Images setup (ensure 4 images for thumbnail gallery matching service nature)
  const galleryImages = useMemo(() => {
    if (!service) return [];
    
    // Category-specific high-resolution curated image galleries
    if (service.category === 'cars') {
      return [
        service.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80', // interior cleaning
        'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80', // foam wash
        'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=800&q=80'  // detailing & shine
      ];
    }

    if (service.category === 'carpets' || service.category === 'carpets_furniture') {
      return [
        service.image || 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80', // deep steam washing
        'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80', // spotless clean
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80'  // fresh & rolled
      ];
    }

    if (service.category === 'furniture') {
      return [
        service.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // sofa steam extraction
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', // spotless fabric
        'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80'  // living room clean
      ];
    }

    if (service.category === 'tanks') {
      return [
        service.image || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
      ];
    }

    if (service.category === 'pest_control') {
      return [
        service.image || 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      ];
    }

    return [
      service.image,
      service.image,
      service.image,
      service.image
    ];
  }, [service]);

  // Safe navigation between images
  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Related services from the same category
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return services
      .filter(s => s.id !== service.id && (s.category === service.category || service.category === 'all'))
      .slice(0, 4);
  }, [services, service]);

  const categoryTitle = service ? (CATEGORY_NAMES[service.category] || 'خدمات نيكست') : 'الخدمات';

  if (!service) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-xs text-right">
        <p className="text-base font-bold text-slate-700 mb-4">لم يتم العثور على تفاصيل الخدمة المطلوبة</p>
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const hasDiscount = service.originalPrice && service.originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((service.originalPrice! - currentPrice) / service.originalPrice!) * 100)
    : 0;

  return (
    <div id="service-detail-page" className="space-y-6 pb-20 animate-in fade-in duration-300 text-right">
      {/* 1. TOP HEADER & BREADCRUMBS BAR (MATCHING PRODUCT DETAIL SCREEN) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs">
        {/* Breadcrumbs */}
        <nav aria-label="مسار التنقل" className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
          <button
            id="breadcrumb-service-home"
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
          <span className="text-slate-300">/</span>
          <button
            id="breadcrumb-service-category"
            type="button"
            onClick={() => {
              setSelectedCategory(service.category);
              setCurrentScreen('category_services');
            }}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            {categoryTitle}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 font-bold max-w-[220px] truncate">{service.title}</span>
        </nav>

        {/* Top Back & Close Buttons */}
        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            id="btn-share-service"
            type="button"
            onClick={handleShare}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            title="مشاركة رابط الخدمة"
            aria-label="مشاركة الخدمة"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Return to Services button */}
          <button
            id="btn-back-to-services"
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للخدمات</span>
          </button>

          {/* Circular Close button (matching design in ProductDetailScreen) */}
          <button
            id="btn-close-service-detail"
            type="button"
            onClick={handleBack}
            aria-label="إغلاق تفاصيل الخدمة"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-950 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. MAIN DEDICATED SERVICE DETAILS CARD (MATCHING PRODUCT DETAIL SCREEN STRUCTURE) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 lg:p-10 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN: HERO SERVICE IMAGE & THUMBNAIL GALLERY SLIDER
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
            {/* Main Hero Image Frame */}
            <div className="relative aspect-square rounded-3xl bg-slate-100 border border-slate-200/80 overflow-hidden group select-none shadow-inner">
              <img
                key={galleryImages[activeImageIndex] || service.image}
                src={galleryImages[activeImageIndex] || service.image}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Slider Arrow Left (<) */}
              <button
                id="btn-service-gallery-prev"
                type="button"
                onClick={handlePrevImage}
                aria-label="الصورة السابقة"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Slider Arrow Right (>) */}
              <button
                id="btn-service-gallery-next"
                type="button"
                onClick={handleNextImage}
                aria-label="الصورة التالية"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Top Tag */}
              {service.tag && (
                <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-md backdrop-blur-xs">
                  {service.tag}
                </span>
              )}

              {/* Duration Badge Bottom Left */}
              {service.durationMinutes && (
                <div className="absolute bottom-4 left-4 bg-slate-950/80 text-white text-xs font-bold px-3 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 shadow-md">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{service.durationMinutes} دقيقة للخدمة</span>
                </div>
              )}

              {/* Discount Badge Bottom Right */}
              {hasDiscount && (
                <span className="absolute bottom-4 right-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-xl shadow-md">
                  وفر {discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery underneath (Row of 4 thumbnails) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {galleryImages.map((imgUrl, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={`service-thumb-${idx}`}
                    id={`btn-service-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-slate-100 p-0.5 flex items-center justify-center cursor-pointer transition-all ${
                      isActive
                        ? 'border-2 border-blue-600 ring-2 ring-blue-100 shadow-xs scale-[1.02]'
                        : 'border border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`عرض الصورة ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${service.title} - زاوية ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: SERVICE DETAILS, HIGHLIGHTS, CHECKLIST & BOOKING
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Badges Row: Blue Category badge + Rating */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Blue Category Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-black shadow-2xs">
                  <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                  <span>{categoryTitle}</span>
                </div>

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mr-auto">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>4.9</span>
                  <span className="text-slate-400 text-[10px]">(+3.2K تقييم عملاء)</span>
                </div>
              </div>

              {/* Service Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-slate-950 font-['Cairo'] tracking-tight leading-snug">
                {service.title}
              </h1>

              {/* Service Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {service.description}
              </p>

              {/* Service Delivery Method Box (Light blue background matching Product Detail Screen) */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 block">طريقة تقديم الخدمة</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 block font-['Cairo']">
                    خدمة متنقلة - نصلك عند باب بيتك أو عملك 🚗
                  </span>
                  <span className="text-xs text-blue-700 font-medium block">
                    سيارات مجهزة بالكامل بالماء والكهرباء وأحدث معدات التنظيف
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

              {/* 3 Distinct Feature Highlights (Matching screenshot layout) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs">
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100/90 text-blue-600 flex items-center justify-center mb-2 shrink-0">
                    <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-['Cairo'] block leading-tight">
                    خامات إيطالية معتمدة
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5 block leading-tight">
                    آمنة وصديقة للبيئة
                  </span>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs">
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100/90 text-blue-600 flex items-center justify-center mb-2 shrink-0">
                    <Zap className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-['Cairo'] block leading-tight">
                    فنيون متخصصون
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5 block leading-tight">
                    طاقم محترف ومدرب
                  </span>
                </div>

                <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs">
                  <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100/90 text-blue-600 flex items-center justify-center mb-2 shrink-0">
                    <Sparkles className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 font-['Cairo'] block leading-tight">
                    بدون فوضى بموقعك
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5 block leading-tight">
                    نظافة وسرعة فائقة
                  </span>
                </div>
              </div>

              {/* What's included checklist (ماذا تشمل الخدمة بالتفصيل) */}
              {service.includes && service.includes.length > 0 && (
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 font-['Cairo'] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ماذا تشمل الخدمة بالتفصيل:</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {service.includes.map((inc, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              </div>

            {/* Bottom Action & Price Section */}
            <div className="border-t border-slate-100 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Price Display */}
                <div>
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">
                    السعر شامل ضريبة القيمة المضافة
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-blue-600 font-['Cairo']">
                      {currentPrice.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-700">ر.س</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 line-through font-['Cairo']">
                        {service.originalPrice?.toFixed(2)} ر.س
                      </span>
                      <span className="text-[11px] text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded-md">
                        وفرت {(service.originalPrice! - currentPrice).toFixed(2)} ر.س
                      </span>
                    </div>
                  )}
                </div>

                {/* Primary Action Button (احجز الخدمة الآن) */}
                <div className="flex items-center gap-3">
                  <button
                    id="btn-book-service-now"
                    type="button"
                    onClick={() => openBookingModal(service)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
                  >
                    <CalendarCheck className="w-5 h-5 stroke-[2.5]" />
                    <span>احجز الخدمة الآن</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED SERVICES SECTION (ENHANCED DISCOVERY MATCHING PRODUCT DETAIL SCREEN) */}
      {relatedServices.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Cairo'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>خدمات أخرى قد تهمك في {categoryTitle}</span>
            </h3>
            <button
              id="btn-see-all-category-services"
              type="button"
              onClick={() => {
                setSelectedCategory(service.category);
                setCurrentScreen('category_services');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              عرض كافة خدمات القسم
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedServices.map(rel => (
              <div
                key={rel.id}
                id={`card-related-service-${rel.id}`}
                onClick={() => {
                  openServiceDetail(rel);
                  setActiveImageIndex(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between group cursor-pointer transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="aspect-square rounded-xl bg-slate-200 mb-2 overflow-hidden flex items-center justify-center relative">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {rel.tag && (
                    <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                      {rel.tag}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1 font-['Cairo'] mb-1 group-hover:text-blue-600 transition-colors">
                    {rel.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {rel.description}
                  </p>
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <span className="text-xs sm:text-sm font-black text-blue-700 font-['Cairo']">
                      {rel.price.toFixed(2)} ر.س
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">تفاصيل</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
