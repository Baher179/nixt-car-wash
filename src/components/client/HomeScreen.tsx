import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  Car as CarIcon,
  Sparkles,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Flame,
  LayoutGrid,
  Heart,
  Sofa,
  Bug,
  Brush,
  ShieldCheck,
  Droplets,
  BadgeCheck,
  CalendarClock,
  Wallet,
  Gift,
  CalendarCheck,
  Repeat,
  Ticket,
  Smartphone,
  QrCode,
  CheckCircle2,
  Tag
} from 'lucide-react';

// 3D Illustration assets matching the design
import cardPackagesGift from '../../assets/images/card_packages_gift_1788336459498.jpg';
import cardSubscriptionsClipboard from '../../assets/images/card_subscriptions_clipboard_1788336474969.jpg';
import cardDiscountsCoupon from '../../assets/images/card_discounts_coupon_1788336491476.jpg';
import heroBannerImg from '../../assets/images/hero_car_wash_banner_1788336434912.jpg';
import cardServicesBlueCar from '../../assets/images/card_services_blue_car_1788336446999.jpg';
import carCareBanner from '../../assets/images/car_care_banner_1788357613398.jpg';

interface HomeScreenProps {
  onSelectService?: (service: ServiceItem) => void;
  onOpenCarModal?: () => void;
  onOpenAddressModal?: () => void;
}

interface CategoryCardItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconStyle: string;
  accent: string;
  categoryKey: string;
  targetServiceId?: string;
}

/** Formats a configured numeric price into the displayed Saudi riyal string. */
const formatSAR = (value: number): string => `${value.toFixed(2)} ر.س`;

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectService }) => {
  const {
    services,
    coupons,
    packages,
    subscriptions,
    activeCategory,
    setActiveCategory,
    activeServiceTab,
    setActiveServiceTab,
    applyCoupon,
    openBookingModal,
    openPackageDetail,
    openServiceDetail,
    navigateToCategoryServices,
    setCurrentScreen
  } = useApp();

  /** Looks a service up by its configured id, so displayed values stay data-driven. */
  const serviceById = useMemo(() => {
    const map = new Map<string, ServiceItem>();
    services.forEach(s => map.set(s.id, s));
    return map;
  }, [services]);

  const handleApplyBannerCode = (code: string) => {
    applyCoupon(code);
    const targetService = services.find(s => s.id === 'srv-ext' || s.id === 'srv-1') || services[0];
    handleServiceClick(targetService);
  };

  // Selected Category among the service categories
  const [selectedCatId, setSelectedCatId] = useState<string>('cat-cars');

  // Favorites tracking
  const [favoriteServiceIds, setFavoriteServiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nixt_fav_services');
      return saved ? JSON.parse(saved) : ['srv-ext', 'srv-sofa-3'];
    } catch {
      return ['srv-ext', 'srv-sofa-3'];
    }
  });

  // Offers Carousel state & controls
  const [offerSlideIndex, setOfferSlideIndex] = useState<number>(0);
  const [isHoveredOffers, setIsHoveredOffers] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [cardsPerView, setCardsPerView] = useState<number>(3);

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setCardsPerView(1);
        } else if (window.innerWidth < 1024) {
          setCardsPerView(2);
        } else {
          setCardsPerView(3);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Explorer view expanded
  const [showExplorer, setShowExplorer] = useState<boolean>(false);

  // Toggle favorite
  const toggleFavorite = (serviceId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteServiceIds(prev => {
      const exists = prev.includes(serviceId);
      const updated = exists ? prev.filter(id => id !== serviceId) : [...prev, serviceId];
      try {
        localStorage.setItem('nixt_fav_services', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleServiceClick = (service: ServiceItem) => {
    if (service.type === 'package') {
      openPackageDetail(service);
    } else {
      openServiceDetail(service);
    }
  };

  // The 6 Available Service Categories with dedicated icons
  const categoryItems: CategoryCardItem[] = useMemo(() => [
    {
      id: 'cat-cars',
      title: 'غسيل السيارات',
      subtitle: 'تلميع ونظافة شاملة لسيارتك',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
      icon: CarIcon,
      iconStyle: 'bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600',
      accent: 'from-blue-600/80',
      categoryKey: 'cars',
      targetServiceId: 'srv-ext'
    },
    {
      id: 'cat-carpets',
      title: 'غسيل السجاد',
      subtitle: 'عناية احترافية للسجاد والموكيت',
      image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
      icon: Brush,
      iconStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600',
      accent: 'from-emerald-600/80',
      categoryKey: 'carpets',
      targetServiceId: 'srv-carpet-m2'
    },
    {
      id: 'cat-furniture',
      title: 'غسيل الكنب',
      subtitle: 'تجديد ونظافة عميقة لجميع أنواع الكنب',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      icon: Sofa,
      iconStyle: 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600',
      accent: 'from-amber-600/80',
      categoryKey: 'furniture',
      targetServiceId: 'srv-sofa-3'
    },
    {
      id: 'cat-tanks',
      title: 'تنظيف الخزانات',
      subtitle: 'مياه نظيفة وصحية لعائلتك',
      image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
      icon: Droplets,
      iconStyle: 'bg-sky-50 text-sky-600 border-sky-100 group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600',
      accent: 'from-sky-600/80',
      categoryKey: 'tanks',
      targetServiceId: 'srv-tank-upper'
    },
    {
      id: 'cat-pest',
      title: 'مكافحة الحشرات',
      subtitle: 'بيئة صحية وآمنة لمنزلك ومكان عملك',
      image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80',
      icon: Bug,
      iconStyle: 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-600 group-hover:text-white group-hover:border-rose-600',
      accent: 'from-rose-600/80',
      categoryKey: 'pest_control',
      targetServiceId: 'srv-pest'
    },
    {
      id: 'cat-others',
      title: 'خدمات أخرى',
      subtitle: 'اكتشف المزيد من الخدمات قريباً',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
      icon: LayoutGrid,
      iconStyle: 'bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600',
      accent: 'from-indigo-600/80',
      categoryKey: 'other'
    }
  ], []);

  // Handle Category click - opens dedicated full-page view
  const handleCategoryCardClick = (cat: CategoryCardItem) => {
    setSelectedCatId(cat.id);
    navigateToCategoryServices(cat.categoryKey);
  };

  // Section: Services with Active Offers & Discounts.
  // Presentation only: prices/titles are read from the configured service records
  // so the displayed amounts always follow business configuration, never a copy.
  const offerCards = useMemo(() => {
    const defs = [
      {
        id: 'offer-cars-ext',
        title: 'غسيل خارجي للسيارة',
        serviceId: 'srv-ext',
        subtitle: 'رغوة واكس وتلميع الجنوط وتسويد الإطارات',
        badge: 'خصم 25% 🔥',
        badgeColor: 'bg-blue-600 text-white',
        bgGradient: 'from-blue-50/90 via-sky-50/40 to-white',
        borderColor: 'border-blue-200/80',
        couponCode: 'X25',
        unitSuffix: '',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'offer-carpets',
        title: 'غسيل السجاد الفاخر',
        serviceId: 'srv-carpet-m2',
        subtitle: 'تنظيف عميق بالبخار وإزالة البقع مع التغليف',
        badge: 'خصم 33% ⚡',
        badgeColor: 'bg-emerald-600 text-white',
        bgGradient: 'from-emerald-50/90 via-teal-50/40 to-white',
        borderColor: 'border-emerald-200/80',
        couponCode: 'CARPET20',
        unitSuffix: ' / م²',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'offer-furniture',
        title: 'غسيل الكنب والمجالس',
        serviceId: 'srv-sofa-3',
        subtitle: 'رغوة جافة وتطهير بالبخار يزيل أصعب البقع',
        badge: 'وفر 40 ر.س ✨',
        badgeColor: 'bg-rose-500 text-white',
        bgGradient: 'from-rose-50/90 via-pink-50/40 to-white',
        borderColor: 'border-rose-200/80',
        couponCode: 'SOFA30',
        unitSuffix: '',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'offer-cars-interior',
        title: 'غسيل داخلي متكامل للسيارة',
        serviceId: 'srv-interior',
        subtitle: 'تنظيف المراتب والديكورات وتعقيم التكييف مع تعطير',
        badge: 'خصم 25% 🚗',
        badgeColor: 'bg-indigo-600 text-white',
        bgGradient: 'from-indigo-50/90 via-blue-50/40 to-white',
        borderColor: 'border-indigo-200/80',
        couponCode: 'X25',
        unitSuffix: '',
        image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'offer-tank-upper',
        title: 'تنظيف وتعقيم خزان علوي',
        serviceId: 'srv-tank-upper',
        subtitle: 'تفريغ الرواسب وتطهير بالكلور الصحي المعتمد',
        badge: 'خصم 30% 💧',
        badgeColor: 'bg-sky-600 text-white',
        bgGradient: 'from-sky-50/90 via-cyan-50/40 to-white',
        borderColor: 'border-sky-200/80',
        couponCode: 'TANK20',
        unitSuffix: '',
        image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80'
      },
      {
        id: 'offer-pest',
        title: 'مكافحة الحشرات ورش مبيدات',
        serviceId: 'srv-pest',
        subtitle: 'مبيدات منخفضة الرائحة مع متابعة ما بعد الخدمة',
        badge: 'وفر 60 ر.س 🛡️',
        badgeColor: 'bg-amber-600 text-white',
        bgGradient: 'from-amber-50/90 via-orange-50/40 to-white',
        borderColor: 'border-amber-200/80',
        couponCode: 'PEST20',
        unitSuffix: '',
        image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=800&q=80'
      }
    ];

    return defs.map(def => {
      const svc = serviceById.get(def.serviceId);
      return {
        ...def,
        price: svc ? `${formatSAR(svc.price)}${def.unitSuffix}` : '',
        originalPrice: svc?.originalPrice ? formatSAR(svc.originalPrice) : ''
      };
    });
  }, [serviceById]);

  // Max slide index depending on cards per view
  const maxOfferSlideIndex = useMemo(() => {
    return Math.max(0, offerCards.length - cardsPerView);
  }, [offerCards.length, cardsPerView]);

  // Clamp index on screen resize
  useEffect(() => {
    if (offerSlideIndex > maxOfferSlideIndex) {
      setOfferSlideIndex(maxOfferSlideIndex);
    }
  }, [maxOfferSlideIndex, offerSlideIndex]);

  // Auto-play interval for Offers Slider (every 4.5 seconds with pause on hover)
  useEffect(() => {
    if (isHoveredOffers) return;
    const interval = setInterval(() => {
      setOfferSlideIndex((prev) => (prev >= maxOfferSlideIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveredOffers, maxOfferSlideIndex]);

  // Next / Prev for offers carousel
  const nextOfferSlide = () => {
    setOfferSlideIndex(prev => (prev >= maxOfferSlideIndex ? 0 : prev + 1));
  };
  const prevOfferSlide = () => {
    setOfferSlideIndex(prev => (prev <= 0 ? maxOfferSlideIndex : prev - 1));
  };

  // Touch Swipe for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsHoveredOffers(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    // In RTL, dragging left (diff > 45) advances to next slide
    if (diff > 45) {
      nextOfferSlide();
    } else if (diff < -45) {
      prevOfferSlide();
    }
    setTouchStartX(null);
    setIsHoveredOffers(false);
  };

  // Handle Offer Click: Applies promo coupon (if any) and navigates directly to booking flow for this service
  const handleOfferClick = (offer: typeof offerCards[0]) => {
    if (offer.couponCode) {
      applyCoupon(offer.couponCode);
    }
    const target = services.find(s => s.id === offer.serviceId) || services[0];
    handleServiceClick(target);
  };

  // Section: Popular Services. Titles and prices come from the configured records.
  const popularServicesData = useMemo(() => {
    const defs = [
      {
        id: 'srv-tank-upper',
        subtitle: 'تنظيف وتعقيم شامل لمياه أكثر صحة',
        rating: '4.8',
        reviewsCount: '840',
        image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
        badge: null as string | null
      },
      {
        id: 'srv-sofa-3',
        subtitle: 'تنظيف وتعقيم وإزالة البقع مع رائحة منعشة',
        rating: '4.8',
        reviewsCount: '980',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        badge: null as string | null
      },
      {
        id: 'srv-carpet-m2',
        subtitle: 'تنظيف عميق وإزالة البقع مع التجفيف السريع',
        rating: '4.7',
        reviewsCount: '760',
        image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80',
        badge: null as string | null
      },
      {
        id: 'srv-ext',
        subtitle: 'غسيل شامل للهيكل الخارجي مع تلميع وإزالة الأتربة',
        rating: '4.9',
        reviewsCount: '3200',
        image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
        badge: 'الأكثر طلباً' as string | null
      }
    ];

    return defs.map(def => {
      const svc = serviceById.get(def.id);
      return {
        ...def,
        title: svc?.title ?? '',
        price: svc ? formatSAR(svc.price) : '',
        fallbackService: svc || services[0]
      };
    });
  }, [serviceById, services]);

  // Section: "لماذا تختار NIXT؟" — labels taken from the approved reference design.
  const whyNixtItems = useMemo(() => [
    {
      id: 'why-quality',
      icon: ShieldCheck,
      title: 'جودة مضمونة',
      desc: 'استخدام أفضل المعدات والمنظفات المعتمدة'
    },
    {
      id: 'why-pros',
      icon: BadgeCheck,
      title: 'فنيون محترفون',
      desc: 'فريق مدرب وجاهز لخدمتك في أي وقت'
    },
    {
      id: 'why-booking',
      icon: CalendarClock,
      title: 'حجز سريع وسهل',
      desc: 'احجز خدمتك في أقل من دقيقة عبر الموقع'
    },
    {
      id: 'why-pricing',
      icon: Wallet,
      title: 'أسعار مناسبة',
      desc: 'أسعار واضحة بلا رسوم مفاجئة'
    }
  ], []);

  /**
   * Hero offer chip. The reference art shows a "SAVE25" code; that code does not
   * exist in this system, so the real configured 25% coupon is used instead.
   */
  const heroOffer = useMemo(() => {
    const coupon = coupons.find(c => c.code === 'X25' && c.isActive);
    return coupon
      ? { code: coupon.code, percent: coupon.discountValue }
      : null;
  }, [coupons]);

  // Customer Reviews Carousel state & data
  const [reviewsSlideIndex, setReviewsSlideIndex] = useState<number>(0);
  const [isHoveredReviews, setIsHoveredReviews] = useState<boolean>(false);
  const [reviewsTouchStartX, setReviewsTouchStartX] = useState<number | null>(null);

  const customerReviewsData = useMemo(() => [
    {
      id: 'rev-1',
      name: 'فهد الشريف',
      location: 'جدة - حي الشاطئ',
      avatarBg: 'bg-blue-100 text-blue-700',
      initial: 'ف',
      service: 'غسيل متنقل شامل للسيارة',
      rating: 5,
      date: 'منذ يومين',
      review: 'ما شاء الله خدمة ممتازة جداً، الكابتن وصل بالموعد المحدد والسيارة رجعت كأنها وكالة وتلميع الكفرات والواكس ممتاز.'
    },
    {
      id: 'rev-2',
      name: 'عبدالله الحربي',
      location: 'جدة - حي الروضة',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      initial: 'ع',
      service: 'تلميع داخلي وتعقيم بالبخار',
      rating: 5,
      date: 'منذ 3 أيام',
      review: 'أفضل تطبيق وموقع غسيل متنقل جربته في جدة، الفان مجهزة بالكامل ومناشف المايكروفايبر جديدة ونظيفة والتعامل راقي جداً.'
    },
    {
      id: 'rev-3',
      name: 'سارة القحطاني',
      location: 'الرياض - حي الملقا',
      avatarBg: 'bg-purple-100 text-purple-700',
      initial: 'س',
      service: 'غسيل سجاد وكنب بالبخار',
      rating: 5,
      date: 'منذ 5 أيام',
      review: 'غسيل السجاد والكنب بالبخار أرجع طقم الكنب مثل الجديد، وأزال بقع قديمة صعبة، وسهولة الحجز واختيار الموعد عبر الموقع رائعة.'
    },
    {
      id: 'rev-4',
      name: 'م. خالد الغامدي',
      location: 'الدمام - حي الشاطئ',
      avatarBg: 'bg-sky-100 text-sky-700',
      initial: 'خ',
      service: 'تنظيف وتعقيم خزان علوي',
      rating: 5,
      date: 'منذ أسبوع',
      review: 'فريق عمل محترف ودقة في المواعيد، قاموا بتفريغ الرواسب وتطهير الخزان بمواد مصرحة وآمنة، وأرسلوا تقرير صور قبل وبعد العمل.'
    },
    {
      id: 'rev-5',
      name: 'ريم الدوسري',
      location: 'الرياض - حي النرجس',
      avatarBg: 'bg-amber-100 text-amber-700',
      initial: 'ر',
      service: 'مكافحة حشرات ورش مبيدات',
      rating: 5,
      date: 'منذ أسبوعين',
      review: 'المبيدات ممتازة جداً بدون أي رائحة ومصرحة وآمنة للأطفال، التزموا بالضمان، والخدمة سريعة ومتقنة وأسعارهم تنافسية.'
    },
    {
      id: 'rev-6',
      name: 'محمد المنصور',
      location: 'مكة المكرمة - حي العوالي',
      avatarBg: 'bg-indigo-100 text-indigo-700',
      initial: 'م',
      service: 'باقة غسيل شهري للسيارات',
      rating: 5,
      date: 'منذ أسبوعين',
      review: 'مشترك في الباقة الشهرية من شهرين ومرتاح جداً، سيارتي دائماً نظيفة وبدون ما أتعنى للمغاسل وزحمتها، أنصح بهم بشدة.'
    }
  ], []);

  const maxReviewsSlideIndex = useMemo(() => {
    return Math.max(0, customerReviewsData.length - cardsPerView);
  }, [customerReviewsData.length, cardsPerView]);

  useEffect(() => {
    if (reviewsSlideIndex > maxReviewsSlideIndex) {
      setReviewsSlideIndex(maxReviewsSlideIndex);
    }
  }, [maxReviewsSlideIndex, reviewsSlideIndex]);

  // Auto-play for reviews slider (5 seconds with pause on hover)
  useEffect(() => {
    if (isHoveredReviews) return;
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
    const touchEndX = e.changedTouches[0].clientX;
    const diff = reviewsTouchStartX - touchEndX;
    if (diff > 45) {
      nextReviewsSlide();
    } else if (diff < -45) {
      prevReviewsSlide();
    }
    setReviewsTouchStartX(null);
    setIsHoveredReviews(false);
  };



  return (
    <div className="animate-in fade-in duration-300 text-right" dir="rtl">

      {/* ===================================================================== */}
      {/* HERO                                                                  */}
      {/* ===================================================================== */}
      <section className="relative w-full overflow-hidden bg-[#07162F]">
        <img
          src={heroBannerImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy veil keeps the Arabic headline readable over the photograph */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#07162F]/35 via-[#07162F]/80 to-[#07162F]/96" />
        <div className="absolute inset-0 bg-[#07162F]/35 lg:bg-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">

            {/* Copy */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-[2rem] leading-[1.2] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.15] font-bold text-white tracking-tight">
                سيارتك وسجادك
                <br />
                <span className="text-[#5FA0FF]">في أيدي محترفة</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
                خدمات تنظيف عالية الجودة في أي مكان ووقت
                <br />
                احجز الآن واستمتع بالنظافة والراحة
              </p>

              <div className="pt-1">
                <button
                  onClick={() => handleApplyBannerCode('X25')}
                  className="bg-[#FFC928] hover:bg-amber-300 active:scale-95 text-[#10182B] font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-amber-400/20 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <span>احجز الخدمة الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 pt-6">
                {[
                  { icon: BadgeCheck, label: 'فنيون معتمدون' },
                  { icon: CalendarClock, label: 'مواعيد مرنة' },
                  { icon: Wallet, label: 'أسعار واضحة' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-[#FFC928]" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating glass offer card */}
            {heroOffer && (
              <div className="lg:col-span-5 flex lg:justify-start">
                <div className="bg-[#0B1E3D]/75 backdrop-blur-xl border border-white/12 rounded-2xl px-6 py-5 shadow-2xl w-full max-w-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="text-2xl sm:text-3xl font-bold text-white">
                        خصم {heroOffer.percent}%
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 font-normal">
                        على غسيل السيارات
                      </p>
                    </div>
                    <span className="bg-[#FFC928] text-[#10182B] text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
                      {heroOffer.code}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">

          {/* ================================================================= */}
          {/* CHOOSE YOUR DESTINATION                                           */}
          {/* ================================================================= */}
          <section className="space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">اختر وجهتك</h2>
              <p className="text-sm text-[#667085]">اختر ما يناسبك وابدأ تجربتك الآن</p>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Services banner */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => navigateToCategoryServices('cars')}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigateToCategoryServices('cars'); }}
                className="group relative overflow-hidden rounded-3xl min-h-[17rem] sm:min-h-[20rem] bg-[#0B3C9E] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={cardServicesBlueCar}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[#0B3C9E]/25 via-[#0E4BB8]/80 to-[#0A3284]/95" />

                <div className="relative h-full flex flex-col justify-center gap-4 p-7 sm:p-9 max-w-[22rem]">
                  <span className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                    <CarIcon className="w-6 h-6 text-white" />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">الخدمات</h3>
                  <p className="text-sm text-blue-100/90 leading-relaxed">
                    حجز خدمات تنظيف السيارات والسجاد في موقعك بسهولة
                  </p>
                  <span className="inline-flex items-center gap-2.5 text-sm font-bold text-white pt-1">
                    <span className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center group-hover:bg-white group-hover:text-[#0B3C9E] transition-colors duration-300">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </span>
                    استكشف الخدمات
                  </span>
                </div>
              </div>

              {/* Store banner */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => { setCurrentScreen('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setCurrentScreen('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                className="group relative overflow-hidden rounded-3xl min-h-[17rem] sm:min-h-[20rem] bg-[#FBF6EC] border border-[#F0E6D4] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={carCareBanner}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute left-0 top-0 h-full w-1/2 object-cover opacity-95 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#FBF6EC]/70 to-[#FBF6EC]" />

                <div className="relative h-full flex flex-col justify-center gap-4 p-7 sm:p-9 max-w-[20rem]">
                  <span className="w-12 h-12 rounded-2xl bg-[#FFC928]/20 border border-[#FFC928]/40 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-[#B8860B]" />
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#10182B]">المتجر</h3>
                  <p className="text-sm text-[#667085] leading-relaxed">
                    منتجات العناية بالسيارات والسجاد بجودة عالية
                  </p>
                  <span className="inline-flex items-center gap-2.5 text-sm font-bold text-[#10182B] pt-1">
                    <span className="w-9 h-9 rounded-full bg-white border border-[#E5EBF4] flex items-center justify-center group-hover:bg-[#10182B] group-hover:text-white transition-colors duration-300">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </span>
                    تسوق الآن
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* SERVICE CATEGORIES                                                */}
          {/* ================================================================= */}
          <section id="services-selection-section" className="space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">
                اختر الخدمة التي تحتاجها
              </h2>
              <p className="text-sm text-[#667085]">خدماتنا في متناولك بكل سهولة</p>
            </div>

            {/* Horizontal scroll on mobile, 6-up grid from large screens */}
            <div className="flex gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:overflow-visible scrollbar-none">
              {categoryItems.map(cat => (
                <button
                  key={cat.id}
                  id={cat.id === 'cat-cars' ? 'btn-view-all-services' : undefined}
                  onClick={() => handleCategoryCardClick(cat)}
                  className={`group shrink-0 w-[9.5rem] lg:w-auto bg-white rounded-2xl p-2.5 text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer border ${
                    selectedCatId === cat.id
                      ? 'border-[#1267F4] shadow-md shadow-blue-500/10'
                      : 'border-[#E5EBF4] shadow-xs'
                  }`}
                >
                  <div className="relative rounded-xl overflow-hidden aspect-4/3">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                  <div className="pt-3 pb-1 px-1 flex items-center justify-between gap-2">
                    <h3 className="text-xs sm:text-[13px] font-bold text-[#10182B] leading-tight line-clamp-2">
                      {cat.title}
                    </h3>
                    <span className="w-6 h-6 shrink-0 rounded-full bg-[#EEF5FF] group-hover:bg-[#1267F4] flex items-center justify-center transition-colors duration-300">
                      <ArrowLeft className="w-3 h-3 text-[#1267F4] group-hover:text-white transition-colors" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SERVICES ON OFFER                                                 */}
          {/* ================================================================= */}
          <section className="space-y-7">
            <div className="relative text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight flex items-center justify-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                خدمات عليها عروض
              </h2>
              <p className="text-sm text-[#667085]">لا تفوت أفضل الأسعار لفترة محدودة</p>
              <button
                onClick={() => { setCurrentScreen('offers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="lg:absolute lg:left-0 lg:top-1 mx-auto lg:mx-0 mt-3 lg:mt-0 bg-white hover:bg-[#EEF5FF] text-[#1267F4] font-bold text-xs px-4 py-2 rounded-full border border-[#E5EBF4] flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>عرض جميع العروض</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsHoveredOffers(true)}
              onMouseLeave={() => setIsHoveredOffers(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <button
                onClick={prevOfferSlide}
                aria-label="السابق"
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E5EBF4] shadow-md items-center justify-center text-[#10182B] hover:bg-[#1267F4] hover:text-white hover:border-[#1267F4] active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={nextOfferSlide}
                aria-label="التالي"
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E5EBF4] shadow-md items-center justify-center text-[#10182B] hover:bg-[#1267F4] hover:text-white hover:border-[#1267F4] active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(${offerSlideIndex * (100 / cardsPerView)}%)` }}
                >
                  {offerCards.map(offer => (
                    <div key={offer.id} className="shrink-0 px-2" style={{ width: `${100 / cardsPerView}%` }}>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOfferClick(offer)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOfferClick(offer); }}
                        className={`group h-full bg-white rounded-2xl border ${offer.borderColor} shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex gap-3 p-3`}
                      >
                        {/* Text side (right in RTL) */}
                        <div className="flex-1 min-w-0 flex flex-col gap-2 py-1">
                          <span className={`self-start ${offer.badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                            {offer.badge}
                          </span>
                          <h3 className="text-sm font-bold text-[#10182B] leading-tight line-clamp-2">
                            {offer.title}
                          </h3>
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-lg font-bold text-[#10182B]">{offer.price}</span>
                            {offer.originalPrice && (
                              <span className="text-[11px] text-[#98A2B3] line-through">{offer.originalPrice}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOfferClick(offer); }}
                            className="mt-auto w-full bg-[#1267F4] hover:bg-[#0E52C7] active:scale-[0.98] text-white font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>اطلب الخدمة الآن</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Image side (left in RTL) */}
                        <div className="w-[7.5rem] shrink-0 rounded-xl overflow-hidden">
                          <img
                            src={offer.image}
                            alt={offer.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-6">
                {Array.from({ length: maxOfferSlideIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOfferSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      offerSlideIndex === idx ? 'w-6 bg-[#1267F4]' : 'w-1.5 bg-[#CFD8E8] hover:bg-[#9FB2D0]'
                    }`}
                    aria-label={`الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* POPULAR SERVICES                                                  */}
          {/* ================================================================= */}
          <section className="space-y-7">
            <div className="relative text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">أشهر الخدمات</h2>
              <p className="text-sm text-[#667085]">الخدمات الأكثر طلباً من عملائنا</p>
              <button
                onClick={() => navigateToCategoryServices('cars')}
                className="lg:absolute lg:left-0 lg:top-1 mx-auto lg:mx-0 mt-3 lg:mt-0 bg-white hover:bg-[#EEF5FF] text-[#1267F4] font-bold text-xs px-4 py-2 rounded-full border border-[#E5EBF4] flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {popularServicesData.map(item => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && item.fallbackService) handleServiceClick(item.fallbackService);
                  }}
                  className="group bg-white rounded-2xl border border-[#E5EBF4] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <button
                      onClick={(e) => toggleFavorite(item.id, e)}
                      aria-label="إضافة للمفضلة"
                      className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favoriteServiceIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-[#98A2B3]'
                        }`}
                      />
                    </button>
                    {item.badge && (
                      <span className="absolute top-3 right-3 bg-[#1267F4] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col">
                    <h3 className="text-[15px] font-bold text-[#10182B] leading-tight line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-[#667085] leading-relaxed line-clamp-2 flex-1">{item.subtitle}</p>

                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-[#FFC928] text-[#FFC928]" />
                      <span className="text-xs font-bold text-[#10182B]">{item.rating}</span>
                      <span className="text-[11px] text-[#98A2B3]">({item.reviewsCount} تقييم)</span>
                    </div>

                    <p className="text-lg font-bold text-[#10182B] pt-0.5">{item.price}</p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.fallbackService) handleServiceClick(item.fallbackService);
                      }}
                      className="w-full border border-[#1267F4]/25 bg-[#EEF5FF] hover:bg-[#1267F4] hover:text-white active:scale-[0.98] text-[#1267F4] font-bold text-xs py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>إضافة طلب</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* WHY NIXT — full-bleed light blue band breaking the card-grid rhythm    */}
      {/* ===================================================================== */}
      <section className="bg-gradient-to-b from-[#EEF5FF] to-[#F7FAFF] border-y border-[#E5EBF4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">
              لماذا تختار NIXT؟
            </h2>
            <p className="text-sm text-[#667085]">تجربة تنظيف احترافية وآمنة ومريحة</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Benefits */}
            <div className="lg:col-span-7 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
              {whyNixtItems.map(item => (
                <div key={item.id} className="text-center space-y-3">
                  <span className="mx-auto w-14 h-14 rounded-full bg-[#1267F4] shadow-lg shadow-blue-500/25 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </span>
                  <h3 className="text-sm font-bold text-[#10182B]">{item.title}</h3>
                  <p className="text-xs text-[#667085] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Overlapping imagery */}
            <div className="lg:col-span-5 relative min-h-[16rem] sm:min-h-[19rem]">
              <div className="absolute top-0 right-0 w-[68%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=900&q=80"
                  alt="تنظيف المقصورة الداخلية للسيارة"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-4/3"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-[58%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=900&q=80"
                  alt="تنظيف السجاد بالمعدات الاحترافية"
                  loading="lazy"
                  className="w-full h-full object-cover aspect-square"
                />
              </div>

              {/* Floating badge */}
              <div className="absolute bottom-6 right-2 sm:right-6 bg-white rounded-xl shadow-lg border border-[#E5EBF4] px-4 py-3 flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-[#EEF5FF] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-[#1267F4]" />
                </span>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#10182B] whitespace-nowrap">خدمة متكاملة</p>
                  <p className="text-[11px] text-[#667085] whitespace-nowrap">للسيارات والسجاد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-[#F7FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">

          {/* ================================================================= */}
          {/* PACKAGES, SUBSCRIPTIONS & GIFTS                                   */}
          {/* ================================================================= */}
          <section className="space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">
                الباقات والاشتراكات والهدايا
              </h2>
              <p className="text-sm text-[#667085]">وفر أكثر مع باقاتنا وخياراتنا المميزة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: 'nav-gifts',
                  screen: 'send_gift' as const,
                  title: 'الهدايا',
                  desc: 'بطاقات مصممة لجميع احتياجاتك',
                  cta: 'عرض الهدايا',
                  icon: Gift,
                  image: cardPackagesGift,
                  titleTone: 'text-[#D98A00]',
                  iconTone: 'bg-[#FFF6E0] text-[#D98A00] border-[#FFE2A8]',
                  shell: 'border-[#F6E3BE] bg-gradient-to-l from-[#FFF8EA] to-white'
                },
                {
                  id: 'nav-subscriptions',
                  screen: 'subscriptions' as const,
                  title: 'الاشتراكات',
                  desc: 'اشتراكات دورية واستمرارية للخدمة',
                  cta: 'عرض الاشتراكات',
                  icon: Repeat,
                  image: cardSubscriptionsClipboard,
                  titleTone: 'text-emerald-600',
                  iconTone: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                  shell: 'border-emerald-100 bg-gradient-to-l from-emerald-50/70 to-white'
                },
                {
                  id: 'nav-offers',
                  screen: 'offers' as const,
                  title: 'العروض',
                  desc: 'خصومات وخدمات لفترة محدودة',
                  cta: 'عرض العروض',
                  icon: Ticket,
                  image: cardDiscountsCoupon,
                  titleTone: 'text-purple-600',
                  iconTone: 'bg-purple-50 text-purple-600 border-purple-100',
                  shell: 'border-purple-100 bg-gradient-to-l from-purple-50/70 to-white'
                }
              ].map(card => {
                const go = () => {
                  setCurrentScreen(card.screen);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                };
                return (
                  <div
                    key={card.id}
                    role="button"
                    tabIndex={0}
                    onClick={go}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') go(); }}
                    className={`group relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer ${card.shell}`}
                  >
                    <div className="space-y-2 min-w-0 z-10">
                      <span className={`w-10 h-10 rounded-xl border flex items-center justify-center ${card.iconTone}`}>
                        <card.icon className="w-5 h-5" />
                      </span>
                      <h3 className={`text-lg font-bold ${card.titleTone}`}>{card.title}</h3>
                      <p className="text-xs text-[#667085] leading-relaxed">{card.desc}</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); go(); }}
                        className="mt-1 bg-white hover:bg-[#F7FAFF] active:scale-95 text-[#10182B] font-bold text-xs px-4 py-2 rounded-full border border-[#E5EBF4] flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <span>{card.cta}</span>
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      </button>
                    </div>

                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <img src={card.image} alt={card.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ================================================================= */}
          {/* CUSTOMER REVIEWS                                                  */}
          {/* ================================================================= */}
          <section className="space-y-7">
            <div className="text-center space-y-2">
              <h2 className="text-[1.75rem] sm:text-3xl font-bold text-[#10182B] tracking-tight">آراء وتقييمات العملاء</h2>
              <p className="text-sm text-[#667085]">تجارب وآراء حقيقية لعملائنا في مختلف مدن المملكة</p>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsHoveredReviews(true)}
              onMouseLeave={() => setIsHoveredReviews(false)}
              onTouchStart={handleReviewsTouchStart}
              onTouchEnd={handleReviewsTouchEnd}
            >
              <button
                onClick={prevReviewsSlide}
                aria-label="السابق"
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E5EBF4] shadow-md items-center justify-center text-[#10182B] hover:bg-[#1267F4] hover:text-white hover:border-[#1267F4] active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={nextReviewsSlide}
                aria-label="التالي"
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-[#E5EBF4] shadow-md items-center justify-center text-[#10182B] hover:bg-[#1267F4] hover:text-white hover:border-[#1267F4] active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(${reviewsSlideIndex * (100 / cardsPerView)}%)` }}
                >
                  {customerReviewsData.map(review => (
                    <div key={review.id} className="shrink-0 px-2" style={{ width: `${100 / cardsPerView}%` }}>
                      <div className="h-full bg-white rounded-2xl border border-[#E5EBF4] shadow-xs hover:shadow-md transition-shadow duration-300 p-5 flex flex-col gap-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center font-bold text-sm shrink-0`}>
                            {review.initial}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-sm font-bold text-[#10182B] truncate">{review.name}</h4>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1267F4] shrink-0" aria-label="عميل موثق" />
                            </div>
                            <p className="text-[11px] text-[#667085] truncate">{review.location}</p>
                          </div>
                          <div className="flex items-center gap-0.5 shrink-0">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-[#FFC928] text-[#FFC928]" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-[#667085] leading-relaxed flex-1">{review.review}</p>

                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#F0F4FA]">
                          <span className="text-[11px] font-bold text-[#1267F4] bg-[#EEF5FF] px-2.5 py-1 rounded-full truncate">
                            {review.service}
                          </span>
                          <span className="text-[11px] text-[#98A2B3] shrink-0">{review.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 pt-6">
                {Array.from({ length: maxReviewsSlideIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setReviewsSlideIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      reviewsSlideIndex === idx ? 'w-6 bg-[#1267F4]' : 'w-1.5 bg-[#CFD8E8] hover:bg-[#9FB2D0]'
                    }`}
                    aria-label={`الشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* APP DOWNLOAD BANNER                                               */}
          {/* NOTE: the store buttons and QR are presentational placeholders —  */}
          {/* no App Store / Google Play listing has been supplied yet.         */}
          {/* ================================================================= */}
          <section className="relative overflow-hidden rounded-3xl bg-[#07162F]">
            {/* Decorative glow shapes */}
            <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-[#1267F4]/25 blur-3xl" />
            <div className="absolute -bottom-24 right-10 w-64 h-64 rounded-full bg-[#1267F4]/15 blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-8 items-center p-8 sm:p-10 lg:p-12">
              <div className="space-y-5 order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  حمل تطبيق NIXT الآن
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                  أسهل وأسرع طريقة لحجز خدمات التنظيف
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-white/10 border border-white/15 rounded-xl px-5 py-2.5 flex items-center gap-2.5 text-white">
                    <Smartphone className="w-5 h-5 shrink-0" />
                    <span className="text-right leading-tight">
                      <span className="block text-[10px] text-slate-400">قريباً على</span>
                      <span className="block text-sm font-bold">App Store</span>
                    </span>
                  </span>
                  <span className="bg-white/10 border border-white/15 rounded-xl px-5 py-2.5 flex items-center gap-2.5 text-white">
                    <Smartphone className="w-5 h-5 shrink-0" />
                    <span className="text-right leading-tight">
                      <span className="block text-[10px] text-slate-400">قريباً على</span>
                      <span className="block text-sm font-bold">Google Play</span>
                    </span>
                  </span>

                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                    <span className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shrink-0">
                      <QrCode className="w-8 h-8 text-[#07162F]" />
                    </span>
                    <span className="text-[11px] text-slate-300 leading-tight max-w-[7rem]">
                      امسح الكود للتحميل عند توفر التطبيق
                    </span>
                  </div>
                </div>
              </div>

              {/* Phone mockups */}
              <div className="order-1 lg:order-2 flex justify-center lg:justify-end gap-4" aria-hidden="true">
                {[heroBannerImg, cardServicesBlueCar].map((img, i) => (
                  <div
                    key={i}
                    className={`w-32 sm:w-40 rounded-[1.75rem] border-[6px] border-slate-800 bg-slate-800 shadow-2xl overflow-hidden ${
                      i === 0 ? 'translate-y-4' : '-translate-y-2'
                    }`}
                  >
                    <div className="h-4 bg-slate-800 flex items-center justify-center">
                      <span className="w-10 h-1 rounded-full bg-slate-600" />
                    </div>
                    <img src={img} alt="" loading="lazy" className="w-full aspect-[9/16] object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
