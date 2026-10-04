import React, { useState, useMemo, useEffect } from 'react';
import { Riyal } from '../common/Riyal';
import { useApp } from '../../context/AppContext';
import { StoreProduct } from '../../types';
import { StoreCategoryTemplate } from './StoreCategoryTemplate';
import storeHeroImg from '../../assets/brand/home-products-gateway-v2.webp';
import servicesBannerImg from '../../assets/brand/home-services-gateway-v2.webp';
import {
  ShoppingBag,
  Star,
  Plus,
  Minus,
  Truck,
  Sparkles,
  Check,
  Tag,
  ArrowLeft,
  ArrowRight,
  Car,
  Layers,
  Armchair,
  Flame,
  Grid,
  Percent,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ThumbsUp,
  Award,
  BadgePercent,
  PackageCheck,
  X,
  Quote,
  Clock
} from 'lucide-react';

interface CategoryCardInfo {
  id: string;
  title: string;
  subtitle: string;
  productCountText: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  themeGradient: string;
  bgGradient: string;
  borderColor: string;
  features: string[];
  image: string;
}

export const StoreScreen: React.FC = () => {
  const {
    storeProducts,
    addToCart,
    cart,
    updateCartQty,
    setCurrentScreen,
    serviceBookingContext,
    returnToServiceBooking,
    exitServiceBookingStoreContext,
    addStoreProductToBooking,
    updateStoreProductBookingQuantity,
    bookingAddons,
    openProductDetail,
    activeStoreCategory,
    setActiveStoreCategory
  } = useApp();

  const isBookingMode = Boolean(serviceBookingContext?.isActive);

  // If user entered from booking with a preferred category, open that category
  useEffect(() => {
    if (isBookingMode && serviceBookingContext?.preferredCategory && !activeStoreCategory) {
      const pref = serviceBookingContext.preferredCategory;
      if (['cars', 'carpets', 'furniture', 'wash_offers'].includes(pref)) {
        setActiveStoreCategory(pref);
      }
    }
  }, [isBookingMode, serviceBookingContext?.preferredCategory, activeStoreCategory, setActiveStoreCategory]);

  // Search state across store
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Coming soon modal state
  const [showComingSoonModal, setShowComingSoonModal] = useState<boolean>(false);

  // Responsive cards per view for deals & reviews carousels (Image 2 & Image 3)
  const [cardsPerView, setCardsPerView] = useState<number>(3);
  // Responsive cards per view for category carousel (Compact width)
  const [catCardsPerView, setCatCardsPerView] = useState<number>(5);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
        setCatCardsPerView(2);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
        setCatCardsPerView(3);
      } else {
        setCardsPerView(3);
        setCatCardsPerView(5);
      }
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Category carousel state
  const [catSlideIndex, setCatSlideIndex] = useState<number>(0);
  const [isHoveredCat, setIsHoveredCat] = useState<boolean>(false);
  const [catTouchStartX, setCatTouchStartX] = useState<number | null>(null);

  // Deals carousel state (Image 2)
  const [dealsSlideIndex, setDealsSlideIndex] = useState<number>(0);
  const [isHoveredDeals, setIsHoveredDeals] = useState<boolean>(false);
  const [dealsTouchStartX, setDealsTouchStartX] = useState<number | null>(null);

  // Customer reviews carousel state (Image 3)
  const [reviewsSlideIndex, setReviewsSlideIndex] = useState<number>(0);
  const [isHoveredReviews, setIsHoveredReviews] = useState<boolean>(false);
  const [reviewsTouchStartX, setReviewsTouchStartX] = useState<number | null>(null);

  // Color & Gradient Themes for Offers Cards matching Image 2
  const dealThemes = useMemo(() => [
    {
      bgGradient: 'from-amber-50/90 via-orange-50/40 to-white',
      borderColor: 'border-amber-200/80',
      badgeColor: 'bg-amber-700 text-white',
      couponCode: 'SAVE20'
    },
    {
      bgGradient: 'from-sky-50/90 via-cyan-50/40 to-white',
      borderColor: 'border-sky-200/80',
      badgeColor: 'bg-sky-700 text-white',
      couponCode: 'CARE25'
    },
    {
      bgGradient: 'from-purple-50/90 via-indigo-50/40 to-white',
      borderColor: 'border-purple-200/80',
      badgeColor: 'bg-purple-600 text-white',
      couponCode: 'VIP30'
    },
    {
      bgGradient: 'from-emerald-50/90 via-teal-50/40 to-white',
      borderColor: 'border-emerald-200/80',
      badgeColor: 'bg-emerald-700 text-white',
      couponCode: 'CLEAN15'
    },
    {
      bgGradient: 'from-rose-50/90 via-pink-50/40 to-white',
      borderColor: 'border-rose-200/80',
      badgeColor: 'bg-rose-700 text-white',
      couponCode: 'NEXT40'
    },
    {
      bgGradient: 'from-blue-50/90 via-indigo-50/40 to-white',
      borderColor: 'border-blue-200/80',
      badgeColor: 'bg-blue-600 text-white',
      couponCode: 'PRO20'
    }
  ], []);

  // 1. MAIN STORE CATEGORIES DEFINITION (Matching the requested division like services: Cars, Carpets, Furniture)
  const mainCategoriesList: CategoryCardInfo[] = useMemo(() => [
    {
      id: 'cars',
      title: 'قسم السيارات',
      subtitle: 'اكسسوارات داخلية وخارجية، منتجات العناية الفائقة، ولوازم التخييم والتلميع',
      productCountText: '13+ منتج أصلي',
      badge: 'الأكثر طلباً 🚗',
      icon: Car,
      iconBg: 'bg-blue-100 text-blue-700',
      iconColor: 'text-blue-600',
      themeGradient: 'from-blue-600 to-indigo-700',
      bgGradient: 'from-blue-50/70 via-sky-50/30 to-white',
      borderColor: 'border-blue-200/90 hover:border-blue-400',
      features: ['شواحن وكيابل معتمدة', 'نانو سيراميك وحماية', 'تلميع بخار وبولش', 'لوازم الرحلات'],
      image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'carpets',
      title: 'قسم السجاد',
      subtitle: 'أكياس التغليف المعقمة، سوائل غسيل المفارش والبطانيات، ومساحيق السجاد الفعالة',
      productCountText: '6+ منتجات معتمدة',
      badge: 'تغليف وحفظ 🧼',
      icon: Layers,
      iconBg: 'bg-emerald-100 text-emerald-700',
      iconColor: 'text-emerald-600',
      themeGradient: 'from-emerald-600 to-teal-700',
      bgGradient: 'from-emerald-50/70 via-teal-50/30 to-white',
      borderColor: 'border-emerald-200/90 hover:border-emerald-400',
      features: ['رول أكياس سميكة', 'سوائل تعقيم المفارش', 'شامبو مركز للسجاد', 'فراشي إزالة الوبر'],
      image: 'https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'furniture',
      title: 'قسم الكنب والمجالس',
      subtitle: 'شامبو الرغوة الجافة، معطرات العود الملكي، وبخاخات الحماية من السوائل والأوساخ',
      productCountText: '5+ منتجات فاخرة',
      badge: 'عناية ملكية 🛋️',
      icon: Armchair,
      iconBg: 'bg-amber-100 text-amber-700',
      iconColor: 'text-amber-600',
      themeGradient: 'from-amber-600 to-rose-700',
      bgGradient: 'from-amber-50/70 via-rose-50/30 to-white',
      borderColor: 'border-amber-200/90 hover:border-amber-400',
      features: ['رغوة جافة بدون ماء', 'معطر العود الملكي', 'حماية نانو عازلة', 'مناشف مايكروفايبر'],
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'wash_offers',
      title: 'عروض وباقات الغسيل',
      subtitle: 'باقات توفير مجمعة لغسيل السيارات والسجاد بأسعار مخفضة وهدايا فورية',
      productCountText: 'باقات توفير خاصة',
      badge: 'وفر حتى 40% 🔥',
      icon: Flame,
      iconBg: 'bg-red-100 text-red-700',
      iconColor: 'text-red-600',
      themeGradient: 'from-red-600 to-amber-600',
      bgGradient: 'from-red-50/70 via-orange-50/30 to-white',
      borderColor: 'border-red-200/90 hover:border-red-400',
      features: ['غسيل 3 سيارات + واكس', 'سجاد 4 بسعر 3', 'توصيل واستلام مجاني', 'ضمان النظافة 100%'],
      image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'coming_soon',
      title: 'أقسام أخرى',
      subtitle: 'أقسام ومنتجات جديدة نوفرها قريباً',
      productCountText: 'قريباً في المتجر',
      badge: 'قريباً ✨',
      icon: Sparkles,
      iconBg: 'bg-indigo-100 text-indigo-700',
      iconColor: 'text-indigo-600',
      themeGradient: 'from-indigo-600 to-purple-700',
      bgGradient: 'from-indigo-50/70 via-purple-50/30 to-white',
      borderColor: 'border-indigo-200/90 hover:border-indigo-400',
      features: ['عناية منزلية متكاملة', 'مكافحة الحشرات والآفات', 'تنظيف وتعقيم الخزانات', 'عروض حصرية جديدة'],
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'
    }
  ], []);

  // 2. DEALS PRODUCTS (Products from different categories that have active offers / discounts)
  const dealsProducts = useMemo(() => {
    return storeProducts
      .filter(p => p.originalPrice && p.originalPrice > p.price)
      .slice(0, 8);
  }, [storeProducts]);

  // 3. BEST-SELLER PRODUCTS (High rating and high reviews count from different categories)
  const bestSellerProducts = useMemo(() => {
    return [...storeProducts]
      .sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0))
      .slice(0, 8);
  }, [storeProducts]);

  // 4. CUSTOMER REVIEWS & RATINGS (Dedicated reviews for store products and fast delivery)
  const storeCustomerReviews = useMemo(() => [
    {
      id: 'store-rev-1',
      name: 'سعود الدوسري',
      city: 'الرياض - حي النرجس',
      avatarBg: 'bg-blue-100 text-blue-800',
      initial: 'س',
      product: 'رول أكياس تغليف وحفظ السجاد',
      rating: 5,
      date: 'منذ يومين',
      review: 'طلبت رول أكياس حفظ السجاد ومحلول غسيل المفارش، التوصيل وصل في أقل من 24 ساعة والتغليف متقن والنايلون سميك جداً مع فتحات تهوية ممتازة.'
    },
    {
      id: 'store-rev-2',
      name: 'منى الشمري',
      city: 'جدة - حي الزهراء',
      avatarBg: 'bg-amber-100 text-amber-800',
      initial: 'م',
      product: 'شامبو رغوة جافة + معطر العود الملكي للكنب',
      rating: 5,
      date: 'منذ 3 أيام',
      review: 'شامبو الرغوة الجافة للكنب خيالي! نظفت بقع عصير قديمة على كنب الصالون واختفت فوراً بدون ما يتبلل القماش، والريحة تدوم أيام في المجلس.'
    },
    {
      id: 'store-rev-3',
      name: 'م. عبدالعزيز الغامدي',
      city: 'الدمام - حي الشاطئ',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      initial: 'ع',
      product: 'بخاخ نانو سيراميك ملمع وطارد للمطر',
      rating: 5,
      date: 'منذ 5 أيام',
      review: 'بخاخ النانو سيراميك وسلك الشاحن المعتمد من أفضل ما اشتريت لسيارتي، مفعول طرد الماء من زجاج السيارة في المطر ممتاز والتوصيل سريع جداً.'
    },
    {
      id: 'store-rev-4',
      name: 'أحمد الحربي',
      city: 'مكة المكرمة - حي العوالي',
      avatarBg: 'bg-purple-100 text-purple-800',
      initial: 'أ',
      product: 'ملمع وحامي إطارات عميق',
      rating: 5,
      date: 'منذ أسبوع',
      review: 'أعجبني خيار إضافة منتجات المتجر مباشرة لحجز الغسيل المتنقل، الكابتن أحضر ملمع الإطارات وشامبو الواكس ونفذ الخدمة باحترافية تامة.'
    },
    {
      id: 'store-rev-5',
      name: 'فهد القحطاني',
      city: 'الخبر - حي الحزام الذهبي',
      avatarBg: 'bg-sky-100 text-sky-800',
      initial: 'ف',
      product: 'بكج مناشف مايكروفايبر فاخرة (4 حبات)',
      rating: 5,
      date: 'منذ أسبوعين',
      review: 'المناشف مايكروفايبر ذات امتصاص جبار وما تترك أي خدوش على طلاء السيارة، وجودتها تفوق منتجات السوق بكثير وتوصيلهم كان في نفس اليوم.'
    },
    {
      id: 'store-rev-6',
      name: 'نورة العنزي',
      city: 'الرياض - حي الملقا',
      avatarBg: 'bg-rose-100 text-rose-800',
      initial: 'ن',
      product: 'بخاخ نانو عازل وحامي أقمشة الكنب والمجالس',
      rating: 5,
      date: 'منذ أسبوعين',
      review: 'رشيت البخاخ على كنب الصالة، انسكب عصير تفاح ومسحته بكل بساطة بمنديل جاف بدون ما يمتصه القماش نهائياً! منتج سحري وعملي يستاهل كل ريال.'
    }
  ], []);

  // Categories carousel navigation helpers
  const maxCatSlideIndex = useMemo(() => {
    return Math.max(0, mainCategoriesList.length - catCardsPerView);
  }, [mainCategoriesList.length, catCardsPerView]);

  useEffect(() => {
    if (catSlideIndex > maxCatSlideIndex) {
      setCatSlideIndex(maxCatSlideIndex);
    }
  }, [maxCatSlideIndex, catSlideIndex]);

  useEffect(() => {
    if (isHoveredCat || maxCatSlideIndex === 0) return;
    const interval = setInterval(() => {
      setCatSlideIndex(prev => (prev >= maxCatSlideIndex ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [isHoveredCat, maxCatSlideIndex]);

  const nextCatSlide = () => {
    setCatSlideIndex(prev => (prev >= maxCatSlideIndex ? 0 : prev + 1));
  };
  const prevCatSlide = () => {
    setCatSlideIndex(prev => (prev <= 0 ? maxCatSlideIndex : prev - 1));
  };

  const handleCatTouchStart = (e: React.TouchEvent) => {
    setCatTouchStartX(e.touches[0].clientX);
    setIsHoveredCat(true);
  };
  const handleCatTouchEnd = (e: React.TouchEvent) => {
    if (catTouchStartX === null) return;
    const diff = catTouchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextCatSlide();
    } else if (diff < -45) {
      prevCatSlide();
    }
    setCatTouchStartX(null);
    setIsHoveredCat(false);
  };

  // Deals carousel navigation helpers
  const maxDealsSlideIndex = useMemo(() => {
    return Math.max(0, dealsProducts.length - cardsPerView);
  }, [dealsProducts.length, cardsPerView]);

  useEffect(() => {
    if (dealsSlideIndex > maxDealsSlideIndex) {
      setDealsSlideIndex(maxDealsSlideIndex);
    }
  }, [maxDealsSlideIndex, dealsSlideIndex]);

  useEffect(() => {
    if (isHoveredDeals || maxDealsSlideIndex === 0) return;
    const interval = setInterval(() => {
      setDealsSlideIndex(prev => (prev >= maxDealsSlideIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveredDeals, maxDealsSlideIndex]);

  const nextDealsSlide = () => {
    setDealsSlideIndex(prev => (prev >= maxDealsSlideIndex ? 0 : prev + 1));
  };
  const prevDealsSlide = () => {
    setDealsSlideIndex(prev => (prev <= 0 ? maxDealsSlideIndex : prev - 1));
  };

  const handleDealsTouchStart = (e: React.TouchEvent) => {
    setDealsTouchStartX(e.touches[0].clientX);
    setIsHoveredDeals(true);
  };
  const handleDealsTouchEnd = (e: React.TouchEvent) => {
    if (dealsTouchStartX === null) return;
    const diff = dealsTouchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextDealsSlide();
    } else if (diff < -45) {
      prevDealsSlide();
    }
    setDealsTouchStartX(null);
    setIsHoveredDeals(false);
  };

  // Reviews carousel navigation helpers
  const maxReviewsSlideIndex = useMemo(() => {
    return Math.max(0, storeCustomerReviews.length - cardsPerView);
  }, [storeCustomerReviews.length, cardsPerView]);

  useEffect(() => {
    if (reviewsSlideIndex > maxReviewsSlideIndex) {
      setReviewsSlideIndex(maxReviewsSlideIndex);
    }
  }, [maxReviewsSlideIndex, reviewsSlideIndex]);

  useEffect(() => {
    if (isHoveredReviews || maxReviewsSlideIndex === 0) return;
    const interval = setInterval(() => {
      setReviewsSlideIndex(prev => (prev >= maxReviewsSlideIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isHoveredReviews, maxReviewsSlideIndex]);

  const nextReviewsSlide = () => {
    setReviewsSlideIndex(prev => (prev >= maxReviewsSlideIndex ? 0 : prev + 1));
  };
  const prevReviewsSlide = () => {
    setReviewsSlideIndex(prev => (prev <= 0 ? maxReviewsSlideIndex : prev - 1));
  };

  const handleReviewsTouchStart = (e: React.TouchEvent) => {
    setReviewsTouchStartX(e.touches[0].clientX);
    setIsHoveredReviews(true);
  };
  const handleReviewsTouchEnd = (e: React.TouchEvent) => {
    if (reviewsTouchStartX === null) return;
    const diff = reviewsTouchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextReviewsSlide();
    } else if (diff < -45) {
      prevReviewsSlide();
    }
    setReviewsTouchStartX(null);
    setIsHoveredReviews(false);
  };

  // Search Results across store
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return storeProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(q))
    );
  }, [storeProducts, searchQuery]);

  // Booking calculations
  const bookingStoreAddons = bookingAddons.filter(a => a.id.startsWith('store-'));
  const bookingStoreItemsCount = bookingStoreAddons.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const bookingStoreItemsTotal = bookingStoreAddons.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleAddToCart = (product: StoreProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
  };

  const handleAddToOrder = (product: StoreProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addStoreProductToBooking(product, 1);
  };

  // IF A SPECIFIC CATEGORY IS SELECTED, RENDER THE UNIFIED CATEGORY LANDING PAGE TEMPLATE
  if (activeStoreCategory) {
    return (
      <StoreCategoryTemplate
        categoryId={activeStoreCategory}
        onBackToHome={() => setActiveStoreCategory(null)}
      />
    );
  }

  // ELSE: RENDER THE STORE HOMEPAGE
  return (
    <div id="store-homepage" className="pb-28 animate-in fade-in duration-300 text-right bg-canvas">
      {/* 1. SERVICE BOOKING BANNER (If user navigated from booking flow) */}
      {isBookingMode && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-6">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-400/40 relative overflow-hidden text-right">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-black shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>تخصيص وإضافة منتجات للخدمة</span>
                </span>
                <span className="text-xs text-amber-300 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-lg border border-amber-400/20">
                  المرحلة {serviceBookingContext?.bookingStep || 3}: الإضافات ومنتجات العناية
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-black text-white">
                أنت الآن تتصفح المتجر لإضافة منتجات إلى: <span className="text-amber-300 font-black">{serviceBookingContext?.serviceName || 'طلب الخدمة'}</span>
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed">
                أي منتج تقوم بالضغط على <strong>&quot;أضف للطلب&quot;</strong> سيتم إلحاقه بحجز خدمتك مباشرة بدون رسوم شحن إضافية، وسيقوم الكابتن بإحضاره معه عند تنفيذ الخدمة.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={returnToServiceBooking}
                className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg hover:shadow-amber-400/30 transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
              >
                <span>العودة لاستكمال حجز الخدمة</span>
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={exitServiceBookingStoreContext}
                className="bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-bold px-3.5 py-3 rounded-2xl border border-white/20 transition-all cursor-pointer"
                title="تصفح المتجر كطلب منفصل للشراء العادي عبر السلة"
              >
                <span>تصفح كمتجر عادي</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* 2. STORE HERO — full-bleed, matching the homepage */}
      {!isBookingMode && (
        <section className="relative overflow-hidden bg-navy">
          <img
            src={storeHeroImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Darkening sits behind the copy, leaving the photograph visible */}
          <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] bg-gradient-to-l from-navy via-navy/90 to-transparent" />
          <div className="absolute inset-0 bg-navy/30 sm:bg-navy/15 lg:bg-navy/5" />

          <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 lg:py-24">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>متجر نيكست الرسمي للأصليات</span>
              </span>

              <h1 className="display text-white text-[2rem] sm:text-5xl lg:text-[3.25rem]">
                إكسسوارات وعناية
                <br />
                <span className="relative inline-block">
                  <span className="relative z-10">لمركبتك ومنزلك</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-1 h-2.5 sm:h-3.5 bg-accent/55 -z-0 rounded-sm"
                  />
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-200 max-w-lg">
                منتجات العناية المعتمدة للسيارات، مستلزمات تغليف وحفظ السجاد،
                وشامبو الكنب — مع توصيل إلى باب بيتك.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <span className="chip"><Truck className="w-3.5 h-3.5 text-brand" />توصيل 1-3 أيام</span>
                <span className="chip"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />منتجات أصلية 100%</span>
                <span className="chip"><PackageCheck className="w-3.5 h-3.5 text-amber-600" />تغليف آمن ومحكم</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH RESULTS VIEW (If searching) */}
      {searchQuery.trim() && (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="bg-white rounded-3xl p-5 sm:p-6 ring-1 ring-hairline space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">
              نتائج البحث عن: <span className="text-blue-600">&quot;{searchQuery}&quot;</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {searchResults.length} منتج مطابق
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold">لا توجد منتجات مطابقة لكلمة البحث</p>
              <p className="text-xs text-faint">جرب البحث بكلمات أخرى أو تصفح الأقسام أدناه</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
              {searchResults.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => openProductDetail(prod)}
                  className="bg-slate-50 rounded-2xl p-3 border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="h-32 rounded-xl overflow-hidden bg-white mb-2">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-2">{prod.name}</h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-black text-blue-700">{prod.price.toFixed(2)} <Riyal /></span>
                    <button
                      type="button"
                      onClick={e => handleAddToCart(prod, e)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      أضف للسلة
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      )}

      {/* 4. MAIN CATEGORIES SECTION - Swipeable Carousel with Centered Text & Compact Cards */}
      {!searchQuery.trim() && (
        <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <header className="space-y-6 mb-12">
            <div className="space-y-4">
              <span className="eyebrow"><span>الأقسام</span></span>
              <h2 className="section-title max-w-2xl">أقسام المتجر</h2>
              <p className="text-[15px] text-muted max-w-md">تصفّح أقسام ومنتجات المتجر المعتمدة بكل سهولة.</p>
            </div>
            <div className="rule" />
          </header>

          {/* Swipeable Categories Carousel Container */}
          <div
            className="relative select-none"
            onMouseEnter={() => setIsHoveredCat(true)}
            onMouseLeave={() => setIsHoveredCat(false)}
            onTouchStart={handleCatTouchStart}
            onTouchEnd={handleCatTouchEnd}
          >
            {/* Carousel Navigation Arrow Right (Previous in RTL) */}
            {mainCategoriesList.length > catCardsPerView && (
              <button
                type="button"
                onClick={prevCatSlide}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous Category"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Carousel Navigation Arrow Left (Next in RTL) */}
            {mainCategoriesList.length > catCardsPerView && (
              <button
                type="button"
                onClick={nextCatSlide}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Next Category"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Viewport with overflow hidden */}
            <div className="overflow-hidden py-1 px-0.5">
              {/* Sliding Flex Track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${catSlideIndex * (100 / catCardsPerView)}%)`
                }}
              >
                {mainCategoriesList.map(cat => {
                  const IconComp = cat.icon;
                  const isSelected = activeStoreCategory === cat.id;
                  const isComingSoon = cat.id === 'coming_soon';

                  return (
                    <div
                      key={cat.id}
                      className="shrink-0 px-1 sm:px-1.5 box-border"
                      style={{ width: `${100 / catCardsPerView}%` }}
                    >
                      <button
                        id={`store-category-card-${cat.id}`}
                        onClick={() => {
                          if (isComingSoon) {
                            setShowComingSoonModal(true);
                          } else {
                            setActiveStoreCategory(cat.id);
                          }
                        }}
                        className={`w-full group relative flex flex-col justify-between items-center p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl border transition-all duration-300 cursor-pointer h-[205px] sm:h-[225px] text-center shadow-2xs hover:shadow-md ${
                          isSelected
                            ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-300/40 shadow-xs'
                            : isComingSoon
                            ? 'bg-gradient-to-b from-indigo-50/40 to-white border-indigo-200/90 hover:border-indigo-400'
                            : 'bg-white border-slate-200/90 hover:border-blue-300'
                        }`}
                      >
                        {/* Inner Image Frame Container with Border & Eye-Comfortable Soft Transparency */}
                        <div className="relative w-full h-24 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 group-hover:border-blue-200 transition-all duration-300 shadow-2xs shrink-0">
                          {cat.image && (
                            <img
                              src={cat.image}
                              alt={cat.title}
                              className="w-full h-full object-cover object-center opacity-75 group-hover:opacity-95 group-hover:scale-108 transition-all duration-500 ease-out"
                              referrerPolicy="no-referrer"
                            />
                          )}

                          {/* Subtle soft tint for gentle contrast */}
                          <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-300" />

                          {/* Corner Icon Badge with Frosted Glass Effect */}
                          <div className={`absolute top-1.5 right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl ${
                            isComingSoon ? 'bg-indigo-600 text-white' : 'bg-white/90 backdrop-blur-md text-blue-600'
                          } shadow-2xs border border-white/80 flex items-center justify-center group-hover:scale-105 ${
                            isComingSoon ? '' : 'group-hover:bg-blue-600 group-hover:text-white'
                          } transition-all duration-300`}>
                            <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>


                        </div>

                        {/* Text Information on crisp comfortable white card background */}
                        <div className="space-y-0.5 w-full my-auto px-1 text-center">
                          <h3 className={`text-xs sm:text-sm font-black leading-tight ${
                            isComingSoon ? 'text-indigo-950 group-hover:text-indigo-600' : 'text-slate-900 group-hover:text-blue-600'
                          } transition-colors line-clamp-1`}>
                            {cat.title}
                          </h3>
                          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-1 leading-relaxed">
                            {cat.subtitle}
                          </p>
                        </div>

                        {/* Bottom Action Icon with Arrow */}
                        <div className="self-start mt-0.5">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full ${
                            isComingSoon
                              ? 'bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600'
                              : 'bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-500'
                          } flex items-center justify-center transition-all duration-200 shadow-2xs`}>
                            <ArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            {maxCatSlideIndex > 0 && (
              <div className="flex items-center justify-center gap-1.5 pt-2">
                {Array.from({ length: maxCatSlideIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCatSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      catSlideIndex === idx ? 'w-5 bg-blue-600' : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          </div>
        </section>
      )}

      {/* 5. DEALS CAROUSEL SECTION (عروض وتخفيضات حصرية - تصميم مطابق للصورة 2) */}
      {!searchQuery.trim() && dealsProducts.length > 0 && (
        <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <header className="space-y-6 mb-12">
            <div className="space-y-4">
              <span className="eyebrow"><span>لفترة محدودة</span></span>
              <h2 className="section-title max-w-2xl">عروض وتخفيضات</h2>
              <p className="text-[15px] text-muted max-w-md">لا تفوّت أفضل الأسعار على منتجات العناية المختارة.</p>
            </div>
            <div className="rule" />
          </header>

          {/* Offer Cards Slider Container with Navigation Arrows */}
          <div
            className="relative group select-none"
            onMouseEnter={() => setIsHoveredDeals(true)}
            onMouseLeave={() => setIsHoveredDeals(false)}
            onTouchStart={handleDealsTouchStart}
            onTouchEnd={handleDealsTouchEnd}
          >
            {/* Carousel Navigation Arrow Right (Previous in RTL) */}
            <button
              type="button"
              onClick={prevDealsSlide}
              className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous Offer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Carousel Navigation Arrow Left (Next in RTL) */}
            <button
              type="button"
              onClick={nextDealsSlide}
              className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
              aria-label="Next Offer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Viewport with overflow hidden */}
            <div className="overflow-hidden py-1 px-0.5">
              {/* Sliding Flex Track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${dealsSlideIndex * (100 / cardsPerView)}%)`
                }}
              >
                {dealsProducts.map((prod, index) => {
                  const theme = dealThemes[index % dealThemes.length];
                  const discountPct = prod.originalPrice
                    ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)
                    : 25;

                  const inCartCount = cart.find(c => c.product.id === prod.id)?.quantity || 0;
                  const addonId = `store-${prod.id}`;
                  const bookingItem = bookingAddons.find(a => a.id === addonId);
                  const inBookingCount = bookingItem?.quantity || 0;

                  return (
                    <div
                      key={`deal-${prod.id}`}
                      className="w-full sm:w-1/2 lg:w-1/3 min-w-full sm:min-w-[50%] lg:min-w-[33.333333%] shrink-0 px-2 sm:px-2.5"
                    >
                      <div
                        onClick={() => openProductDetail(prod)}
                        className={`card-i relative overflow-hidden rounded-3xl border ${theme.borderColor} bg-gradient-to-l ${theme.bgGradient} p-5 sm:p-6 flex items-center gap-4 min-h-[230px] sm:min-h-[240px] cursor-pointer group/card`}
                      >
                        {/* Right Content (Text & Action Button) */}
                        <div className="z-10 space-y-2.5 flex-1 min-w-0">
                          {/* Badges row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`${theme.badgeColor} text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs flex items-center gap-1`}>
                              <span>خصم {discountPct}%</span>
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-[15px] sm:text-base font-bold text-ink tracking-tight leading-snug group-hover/card:text-brand transition-colors line-clamp-2 min-h-[2.6rem]">
                            {prod.name}
                          </h4>

                          {/* Subtitle */}
                          <p className="text-[11px] sm:text-xs text-muted font-medium line-clamp-2">
                            {prod.categoryLabel || 'منتج أصلي معتمد وتوصيل سريع'}
                          </p>

                          {/* Price Display */}
                          <div className="flex items-baseline gap-1.5 pt-0.5">
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                              {prod.price.toFixed(2)} <Riyal />
                            </span>
                            {prod.originalPrice && (
                              <span className="text-xs text-faint line-through font-medium">
                                {prod.originalPrice.toFixed(2)} <Riyal />
                              </span>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="pt-1">
                            {isBookingMode ? (
                              inBookingCount > 0 ? (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-xl p-1 shadow-2xs"
                                >
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      updateStoreProductBookingQuantity(prod.id, inBookingCount - 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-amber-100 text-amber-950 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                                    aria-label="تقليل الكمية"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="font-black text-xs min-w-4 text-center text-amber-950 font-mono">
                                    {inBookingCount}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      updateStoreProductBookingQuantity(prod.id, inBookingCount + 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                                    aria-label="زيادة الكمية"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={e => handleAddToOrder(prod, e)}
                                  className="bg-blue-600 group-hover/card:bg-blue-700 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                                >
                                  <span>أضف للطلب</span>
                                  <ArrowLeft className="w-3.5 h-3.5 group-hover/card:-translate-x-0.5 transition-transform" />
                                </button>
                              )
                            ) : (
                              inCartCount > 0 ? (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-1 shadow-2xs"
                                >
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      updateCartQty(prod.id, inCartCount - 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-blue-100 text-blue-900 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                                    aria-label="تقليل الكمية"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="font-black text-xs min-w-4 text-center text-blue-900 font-mono">
                                    {inCartCount}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.stopPropagation();
                                      updateCartQty(prod.id, inCartCount + 1);
                                    }}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                                    aria-label="زيادة الكمية"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={e => handleAddToCart(prod, e)}
                                  className="bg-blue-600 group-hover/card:bg-blue-700 active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                                >
                                  <span>أضف للسلة</span>
                                  <ArrowLeft className="w-3.5 h-3.5 group-hover/card:-translate-x-0.5 transition-transform" />
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Left Content (Product Image) */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-xs shrink-0 bg-white border border-white/90 group-hover/card:scale-105 transition-transform duration-300">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: maxDealsSlideIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => setDealsSlideIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dealsSlideIndex === dotIndex
                      ? 'w-7 bg-blue-600'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
          </div>
        </section>
      )}

      {/* 6. BEST-SELLERS SECTION (المنتجات الأكثر مبيعاً من فئات مختلفة) */}
      {!searchQuery.trim() && bestSellerProducts.length > 0 && (
        <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <header className="space-y-6 mb-12">
            <div className="space-y-4">
              <span className="eyebrow"><span>الأكثر طلباً</span></span>
              <h2 className="section-title max-w-2xl">المنتجات الأكثر مبيعاً</h2>
              <p className="text-[15px] text-muted max-w-md">الأعلى طلباً والأكثر تقييماً من عملائنا في مختلف الفئات.</p>
            </div>
            <div className="rule" />
          </header>

          {/* Best-Sellers Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {bestSellerProducts.map(prod => {
              const inCartCount = cart.find(c => c.product.id === prod.id)?.quantity || 0;
              const addonId = `store-${prod.id}`;
              const bookingItem = bookingAddons.find(a => a.id === addonId);
              const inBookingCount = bookingItem?.quantity || 0;

              return (
                <div
                  key={`bestseller-${prod.id}`}
                  id={`bestseller-card-${prod.id}`}
                  onClick={() => openProductDetail(prod)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer group relative"
                >
                  {/* Best-seller badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                      <Flame className="w-3 h-3 fill-slate-950" />
                      <span>الأكثر مبيعاً</span>
                    </span>
                  </div>

                  {/* Image */}
                  <div className="relative h-36 sm:h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{prod.rating || '4.9'}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      {prod.categoryLabel && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          {prod.categoryLabel}
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-faint mt-1">
                        <Truck className="w-3 h-3 text-blue-600 shrink-0" />
                        <span>
                          {isBookingMode
                            ? 'يصلك مع كابتن الخدمة 🚚'
                            : (prod.deliveryEstimate || 'التوصيل: 1 - 3 أيام')}
                        </span>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-base sm:text-lg font-black text-blue-700">
                            {prod.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600"><Riyal /></span>
                        </div>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-faint line-through block -mt-1">
                            {prod.originalPrice.toFixed(2)} <Riyal />
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      {isBookingMode ? (
                        inBookingCount > 0 ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 rounded-xl p-1 shadow-2xs"
                          >
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateStoreProductBookingQuantity(prod.id, inBookingCount - 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-amber-100 text-amber-950 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-xs min-w-4 text-center text-amber-950 font-mono">
                              {inBookingCount}
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateStoreProductBookingQuantity(prod.id, inBookingCount + 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={e => handleAddToOrder(prod, e)}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black px-3 py-1.5 rounded-xl cursor-pointer"
                          >
                            أضف للطلب
                          </button>
                        )
                      ) : (
                        inCartCount > 0 ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl p-1 shadow-2xs"
                          >
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateCartQty(prod.id, inCartCount - 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-white hover:bg-blue-100 text-blue-900 font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                              aria-label="تقليل الكمية"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-xs min-w-4 text-center text-blue-900 font-mono">
                              {inCartCount}
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateCartQty(prod.id, inCartCount + 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-black text-xs cursor-pointer shadow-2xs active:scale-95 transition-all"
                              aria-label="زيادة الكمية"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={e => handleAddToCart(prod, e)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                          >
                            أضف للسلة
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
        </section>
      )}

      {/* 7. CUSTOMER REVIEWS & RATINGS SECTION */}
      {!searchQuery.trim() && (
        <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 relative">
          <header className="space-y-6 mb-12">
            <div className="space-y-4">
              <span className="eyebrow"><span>آراء العملاء</span></span>
              <h2 className="section-title max-w-2xl">ماذا يقول عملاؤنا</h2>
              <p className="text-[15px] text-muted max-w-md">تجارب موثقة من عملاء في مختلف مدن المملكة.</p>
            </div>
            <div className="rule" />
          </header>

          {/* Customer Reviews Interactive Carousel Container */}
          <div
            className="relative select-none"
            onMouseEnter={() => setIsHoveredReviews(true)}
            onMouseLeave={() => setIsHoveredReviews(false)}
            onTouchStart={handleReviewsTouchStart}
            onTouchEnd={handleReviewsTouchEnd}
          >
            {/* Carousel Navigation Arrow Right (Previous in RTL) */}
            {storeCustomerReviews.length > cardsPerView && (
              <button
                type="button"
                onClick={prevReviewsSlide}
                className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous Reviews"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Carousel Navigation Arrow Left (Next in RTL) */}
            {storeCustomerReviews.length > cardsPerView && (
              <button
                type="button"
                onClick={nextReviewsSlide}
                className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Next Reviews"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}

            {/* Viewport */}
            <div className="overflow-hidden py-1 px-0.5">
              {/* Sliding Track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${reviewsSlideIndex * (100 / cardsPerView)}%)`
                }}
              >
                {storeCustomerReviews.map(rev => (
                  <div
                    key={rev.id}
                    className="w-full sm:w-1/2 lg:w-1/3 min-w-full sm:min-w-[50%] lg:min-w-[33.333333%] shrink-0 px-2 sm:px-2.5"
                  >
                    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5 shadow-2xs hover:border-blue-200 hover:shadow-md transition-all duration-300 min-h-[220px]">
                      <div className="space-y-3">
                        {/* Top: Avatar, Name, Rating & Quote */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full ${rev.avatarBg} flex items-center justify-center font-black text-xs shrink-0 shadow-2xs`}>
                              {rev.initial}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-black text-slate-900">{rev.name}</h4>
                              <span className="text-[11px] text-faint font-medium block">{rev.city}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                            {[...Array(rev.rating)].map((_, idx) => (
                              <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        {/* Product purchased tag */}
                        <div className="bg-blue-50/80 border border-blue-100 rounded-lg px-2.5 py-1 text-[11px] font-bold text-blue-700 inline-block">
                          المنتج: {rev.product}
                        </div>

                        {/* Review Quote */}
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          &quot;{rev.review}&quot;
                        </p>
                      </div>

                      {/* Footer: Date & Verified purchase */}
                      <div className="pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-faint">
                        <span>{rev.date}</span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          شراء موثق
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: maxReviewsSlideIndex + 1 }).map((_, dotIndex) => (
                <button
                  key={dotIndex}
                  type="button"
                  onClick={() => setReviewsSlideIndex(dotIndex)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    reviewsSlideIndex === dotIndex
                      ? 'w-7 bg-blue-600'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Reviews Slide ${dotIndex + 1}`}
                />
              ))}
            </div>
          </div>
          </div>
        </section>
      )}

      {/* 7b. SERVICES AD BANNER — closes the page by sending shoppers to the
           booking side, mirroring the store banner on the homepage. */}
      {!searchQuery.trim() && (
        <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
          <button
            onClick={() => {
              setActiveStoreCategory(null);
              setCurrentScreen('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="تصفّح خدمات نيكست المتنقلة"
            className="card-i group relative block w-full overflow-hidden rounded-[1.75rem] bg-navy h-[17rem] sm:h-[14rem] lg:h-[16rem] text-right cursor-pointer"
          >
            <img
              src={servicesBannerImg}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-l from-navy via-navy/85 to-transparent" />

            <span className="relative h-full flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-5 px-7 sm:px-10">
              <span className="space-y-2">
                <span className="block text-[11px] font-bold tracking-[0.18em] text-accent">خدمات نيكست</span>
                <span className="block text-2xl sm:text-[1.75rem] lg:text-3xl font-bold text-white tracking-tight max-w-md">
                  نغسل سيارتك وسجادك في موقعك
                </span>
                <span className="block text-[13px] text-slate-300 max-w-sm">
                  فنيون مختصون وفانات مجهزة تصلك في الموعد الذي تختاره.
                </span>
              </span>

              <span className="shrink-0 inline-flex w-fit items-center gap-2.5 bg-accent group-hover:bg-white text-navy font-bold text-[14px] px-6 py-3 rounded-full transition-colors duration-300">
                احجز خدمة
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </span>
            </span>
          </button>
          </div>
        </section>
      )}

      {/* 8. FLOATING RETURN BAR (Only when in booking flow mode) */}
      {isBookingMode && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 z-40 max-w-xl mx-auto animate-in slide-in-from-bottom-3 duration-300">
          <div className="bg-slate-950/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3 text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shrink-0 shadow-md">
                {bookingStoreItemsCount}
              </div>
              <div>
                <span className="text-xs font-black text-white block">
                  {bookingStoreItemsCount > 0
                    ? `${bookingStoreItemsCount} منتج مضاف لطلب الخدمة`
                    : 'استكمال حجز الخدمة'}
                </span>
                <span className="text-[11px] text-amber-300 font-bold">
                  {bookingStoreItemsCount > 0
                    ? `إجمالي المنتجات: ${bookingStoreItemsTotal.toFixed(2)} ر.س`
                    : (serviceBookingContext?.serviceName || 'الخدمة الحالية')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={returnToServiceBooking}
              className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer border border-amber-300"
            >
              <span>العودة للخدمة</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* 9. FLOATING BOTTOM CART BAR (Regular store mode with cart items) */}
      {!isBookingMode && cart.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-6 left-4 right-4 z-30 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setCurrentScreen('cart')}
            className="w-full bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 flex items-center justify-between hover:bg-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xs">
                {cart.reduce((a, c) => a + c.quantity, 0)}
              </div>
              <span className="text-xs font-bold">عناصر في سلة الشراء</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400">
                عرض السلة والدفع
              </span>
              <ArrowLeft className="w-4 h-4 text-amber-400" />
            </div>
          </button>
        </div>
      )}

      {/* 10. COMING SOON DEPARTMENTS MODAL */}
      {showComingSoonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative text-right animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowComingSoonModal(false)}
              className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block">
                أقسام قادمة قريباً ✨
              </span>
              <h3 className="text-lg font-black text-slate-900">
                نعمل على توفير أقسام جديدة قريباً!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pt-1 font-medium">
                فريق نيكست يعمل على إضافة أقسام ومنتجات متخصصة جديدة تلبي كافة احتياجات العناية بالمنزل والمركبات بأعلى معايير الجودة، وتشمل قريباً:
              </p>
            </div>

            <div className="space-y-2 py-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>منتجات ومستلزمات تنظيف وتعقيم الخزانات العلوية والأرضية</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>أجهزة وبخاخات مكافحة الحشرات والآفات المعتمدة</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>باقات التعقيم والتنظيف الشامل للمنازل والفلل</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowComingSoonModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
            >
              متابعة التسوق في الأقسام الحالية
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
