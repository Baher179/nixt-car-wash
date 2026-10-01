import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreProduct } from '../../types';
import {
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutGrid,
  Truck,
  Plus,
  Minus,
  Check,
  Star,
  Zap,
  Smartphone,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Share2
} from 'lucide-react';

interface ProductDetailScreenProps {
  product?: StoreProduct | null;
  onBack?: () => void;
  isBookingModeOverride?: boolean;
}

export const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  product: propProduct,
  onBack: propOnBack,
  isBookingModeOverride
}) => {
  const {
    selectedProductForDetail,
    closeProductDetail,
    storeProducts,
    openProductDetail,
    serviceBookingContext,
    returnToServiceBooking,
    addStoreProductToBooking,
    updateStoreProductBookingQuantity,
    bookingAddons,
    cart,
    addToCart,
    updateCartQty,
    setCurrentScreen,
    navigateToStoreCategory
  } = useApp();

  // Active product to display
  const product = propProduct || selectedProductForDetail || storeProducts[0];

  const handleBack = propOnBack || closeProductDetail;

  const isBookingMode = isBookingModeOverride !== undefined
    ? isBookingModeOverride
    : Boolean(serviceBookingContext?.isActive);

  // Gallery Images setup (ensure 4 images minimum for thumbnail gallery)
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    // Fallback: 4 gallery angles / zooms based on the primary image
    return [
      product.image,
      product.image,
      product.image,
      product.image
    ];
  }, [product]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-200 shadow-sm text-right">
        <p className="text-base font-bold text-slate-700 mb-4">لم يتم العثور على تفاصيل المنتج المطلوب</p>
        <button
          id="btn-return-to-store-empty"
          type="button"
          onClick={() => setCurrentScreen('store')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all cursor-pointer"
        >
          العودة للمتجر
        </button>
      </div>
    );
  }

  // Safe navigation between images
  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Cart / Booking counts
  const inCartCount = cart.find(c => c.product.id === product.id)?.quantity || 0;
  const addonId = `store-${product.id}`;
  const bookingItem = bookingAddons.find(a => a.id === addonId);
  const inBookingCount = bookingItem?.quantity || 0;

  // Add Action Handler
  const handlePrimaryAction = () => {
    if (isBookingMode) {
      addStoreProductToBooking(product, 1);
    } else {
      addToCart(product, 1);
    }
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  // Dynamic Product Feature Badges
  const productFeatures = useMemo(() => {
    if (product.features && product.features.length > 0) {
      return product.features;
    }
    // Default features matching product nature
    if (product.id === 'prod-1' || product.name.includes('شاحن') || product.name.includes('سلك')) {
      return [
        { title: 'جودة عالية', subtitle: 'مقاوم للقطع', iconType: 'shield' },
        { title: 'شحن سريع', subtitle: 'بقوة 6A', iconType: 'bolt' },
        { title: 'متوافق مع أجهزة متعددة', subtitle: 'أندرويد و أبل', iconType: 'devices' }
      ];
    }
    return [
      { title: 'جودة عالية', subtitle: 'ضمان أصلي 100%', iconType: 'shield' },
      { title: 'خامات فائقة', subtitle: 'تحمل واستخدام يومي', iconType: 'bolt' },
      { title: 'سهل الاستخدام', subtitle: 'ملائم لسيارتك ومنزلك', iconType: 'devices' }
    ];
  }, [product]);

  // Related products from the same category
  const relatedProducts = useMemo(() => {
    return storeProducts
      .filter(p => p.id !== product.id && (p.category === product.category || p.mainCategory === product.mainCategory))
      .slice(0, 4);
  }, [storeProducts, product]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div id="product-detail-page" className="space-y-6 pb-20 animate-in fade-in duration-300 text-right">
      {/* 1. TOP HEADER & BREADCRUMBS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs">
        {/* Breadcrumbs */}
        <nav aria-label="مسار التنقل" className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
          <button
            id="breadcrumb-home"
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
          <span className="text-slate-300">/</span>
          <button
            id="breadcrumb-store"
            type="button"
            onClick={handleBack}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            المتجر
          </button>
          <span className="text-slate-300">/</span>
          {product.categoryLabel && (
            <>
              <button
                type="button"
                onClick={() => navigateToStoreCategory(product.mainCategory || 'cars')}
                className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
              >
                {product.categoryLabel}
              </button>
              <span className="text-slate-300">/</span>
            </>
          )}
          <span className="text-blue-600 font-bold max-w-[200px] truncate">{product.name}</span>
        </nav>

        {/* Top Back & Close Buttons */}
        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            id="btn-share-product"
            type="button"
            onClick={handleShare}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
            title="مشاركة رابط المنتج"
            aria-label="مشاركة المنتج"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Return to Store button */}
          <button
            id="btn-back-to-store"
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمتجر</span>
          </button>

          {/* Circular Close button (matching design in user screenshot) */}
          <button
            id="btn-close-product-detail"
            type="button"
            onClick={handleBack}
            aria-label="إغلاق تفاصيل المنتج"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SERVICE BOOKING BANNER (If user is adding product during booking) */}
      {isBookingMode && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-amber-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                حجز الخدمة نشط
              </span>
              <span className="text-xs text-amber-300 font-bold">
                {serviceBookingContext?.serviceName || 'طلب الخدمة'}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              سيتم إلحاق هذا المنتج بطلب خدمتك مباشرة ويحضره الكابتن في موعد حجزك دون رسوم شحن إضافية.
            </p>
          </div>
          <button
            id="btn-return-booking-from-detail"
            type="button"
            onClick={returnToServiceBooking}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>العودة لمتابعة الحجز</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN DEDICATED PRODUCT DETAILS CARD (MATCHING USER SCREENSHOT) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-5 sm:p-8 lg:p-10 relative overflow-hidden">
        {/* Added Feedback Toast */}
        {addedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
            <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
            <span className="text-xs font-bold">
              {isBookingMode ? 'تمت إضافة المنتج إلى طلب حجزك بنجاح 🚚' : 'تمت إضافة المنتج إلى السلة بنجاح!'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ========================================================
              LEFT COLUMN: HERO PRODUCT IMAGE & THUMBNAIL GALLERY SLIDER
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-4">
            {/* Main Hero Image Frame */}
            <div className="relative aspect-square rounded-3xl bg-slate-50/90 border border-slate-200/80 p-6 sm:p-8 flex items-center justify-center overflow-hidden group select-none">
              <img
                key={galleryImages[activeImageIndex] || product.image}
                src={galleryImages[activeImageIndex] || product.image}
                alt={product.name}
                className="w-full h-full object-contain max-h-[380px] drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />

              {/* Slider Arrow Left (<) */}
              <button
                id="btn-gallery-prev"
                type="button"
                onClick={handlePrevImage}
                aria-label="الصورة السابقة"
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Slider Arrow Right (>) */}
              <button
                id="btn-gallery-next"
                type="button"
                onClick={handleNextImage}
                aria-label="الصورة التالية"
                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-slate-950 shadow-md border border-slate-200/70 flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* In Stock or New Tag */}
              {product.isNew && (
                <span className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-xs">
                  جديد
                </span>
              )}
            </div>

            {/* Thumbnail Gallery underneath (Row of 4 thumbnails) */}
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {galleryImages.map((imgUrl, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={`thumb-${idx}`}
                    id={`btn-thumb-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`aspect-square rounded-2xl overflow-hidden bg-slate-50 p-2 flex items-center justify-center cursor-pointer transition-all ${
                      isActive
                        ? 'border-2 border-blue-600 ring-2 ring-blue-100 shadow-xs bg-white scale-[1.02]'
                        : 'border border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`عرض الصورة ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} - صورة ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              RIGHT COLUMN: PRODUCT DETAILS, SPECIFICATIONS & ACTIONS
             ======================================================== */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Badges Row: Gold original badge + Blue subcategory badge */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Gold/Amber Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-black shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />
                  <span>منتج أصلي ومضمون</span>
                </div>

                {/* Blue SubCategory Pill */}
                {(product.subCategoryLabel || product.categoryLabel) && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-black shadow-2xs">
                    <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
                    <span>{product.subCategoryLabel || product.categoryLabel}</span>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mr-auto">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{product.rating || 4.5}</span>
                  <span className="text-slate-400 text-[10px]">({product.reviewsCount || '4K'} تقييم)</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-slate-950 font-['Cairo'] tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Product Description */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                {product.description}
              </p>

              {/* Delivery Method Box (Light blue background matching image) */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-500 block">طريقة الاستلام</span>
                  <span className="text-sm sm:text-base font-black text-slate-900 block font-['Cairo']">
                    يصلك مع الكابتن
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Truck className="w-6 h-6 stroke-[2]" />
                </div>
              </div>

              {/* 3 Distinct Feature Highlights (Matching screenshot layout) */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2">
                {productFeatures.map((feat, fIdx) => (
                  <div
                    key={`feature-${fIdx}`}
                    className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3 sm:p-4 flex flex-col items-center justify-center text-center shadow-2xs"
                  >
                    <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-100/90 text-blue-600 flex items-center justify-center mb-2 shrink-0">
                      {feat.iconType === 'shield' ? (
                        <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                      ) : feat.iconType === 'bolt' ? (
                        <Zap className="w-5 h-5 stroke-[2.2]" />
                      ) : (
                        <Smartphone className="w-5 h-5 stroke-[2.2]" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 font-['Cairo'] block leading-tight">
                      {feat.title}
                    </span>
                    <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-0.5 block leading-tight">
                      {feat.subtitle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action & Price Section */}
            <div className="border-t border-slate-100 pt-6 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Price Display */}
                <div>
                  <span className="text-xs text-slate-400 font-bold block mb-0.5">السعر</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-blue-600 font-['Cairo']">
                      {product.price.toFixed(2)}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-slate-700">ر.س</span>
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through block mt-0.5 font-['Cairo']">
                      {product.originalPrice.toFixed(2)} ر.س
                    </span>
                  )}
                </div>

                {/* Primary Action Button (Add to Order / Add to Cart / Quantity Stepper) */}
                <div className="flex items-center gap-3">
                  {isBookingMode ? (
                    inBookingCount > 0 ? (
                      <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-2xl p-1.5 shadow-sm">
                        <button
                          id="btn-detail-decrease-booking"
                          type="button"
                          onClick={() => updateStoreProductBookingQuantity(product.id, inBookingCount - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-amber-100 text-amber-950 font-black cursor-pointer transition-colors"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-2 text-center">
                          <span className="font-black text-base text-amber-950 block">{inBookingCount}</span>
                          <span className="text-[9px] text-amber-800 font-bold block">مضاف للطلب</span>
                        </div>
                        <button
                          id="btn-detail-increase-booking"
                          type="button"
                          onClick={() => updateStoreProductBookingQuantity(product.id, inBookingCount + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black cursor-pointer transition-colors"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id="btn-detail-add-to-order"
                        type="button"
                        onClick={handlePrimaryAction}
                        className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base sm:text-lg px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400"
                      >
                        <Plus className="w-5 h-5 stroke-[3]" />
                        <span>أضف للطلب</span>
                      </button>
                    )
                  ) : (
                    inCartCount > 0 ? (
                      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        <button
                          id="btn-detail-decrease-cart"
                          type="button"
                          onClick={() => updateCartQty(product.id, inCartCount - 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                          aria-label="تقليل الكمية"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-2 text-center">
                          <span className="font-black text-base text-slate-900 block">{inCartCount}</span>
                          <span className="text-[9px] text-slate-500 font-bold block">في السلة</span>
                        </div>
                        <button
                          id="btn-detail-increase-cart"
                          type="button"
                          onClick={() => updateCartQty(product.id, inCartCount + 1)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                          aria-label="زيادة الكمية"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id="btn-detail-add-to-cart"
                        type="button"
                        onClick={handlePrimaryAction}
                        className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-base sm:text-lg px-8 sm:px-12 py-3.5 sm:py-4 rounded-2xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                        <span>أضف للطلب</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. RELATED PRODUCTS SECTION (ENHANCED DISCOVERY) */}
      {relatedProducts.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-['Cairo'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>منتجات مشابهة قد تهمك</span>
            </h3>
            <button
              id="btn-see-all-store"
              type="button"
              onClick={handleBack}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              عرض كافة منتجات المتجر
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                id={`card-related-${rel.id}`}
                onClick={() => {
                  openProductDetail(rel);
                  setActiveImageIndex(0);
                }}
                className="bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-col justify-between group cursor-pointer transition-all hover:shadow-md hover:border-blue-200"
              >
                <div className="aspect-square rounded-xl bg-white p-2 mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={rel.image}
                    alt={rel.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1 font-['Cairo'] mb-1">
                    {rel.name}
                  </h4>
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <span className="text-xs sm:text-sm font-black text-blue-700 font-['Cairo']">
                      {rel.price.toFixed(2)} ر.س
                    </span>
                    <span className="text-[10px] text-slate-400">عرض</span>
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
