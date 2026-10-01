import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import {
  Car as CarIcon,
  Star,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
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
  Smartphone,
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
        badge: 'خصم 25%',
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
        badge: 'خصم 33%',
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
        badge: 'وفر 40 ر.س',
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
        badge: 'خصم 25%',
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
        badge: 'خصم 30%',
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
        badge: 'وفر 60 ر.س',
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

  /**
   * Coupon surfaced in the homepage strip: configured, active and inside its
   * own validity window today. Nothing is rendered when no coupon qualifies.
   */
  const welcomeCoupon = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return coupons.find(
      c => c.isActive && c.code === 'NEW' && c.startDate <= today && c.endDate >= today
    ) ?? null;
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
      avatarBg: 'bg-amber-100 text-amber-800',
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



  /**
   * One editorial header for every section: a numbered eyebrow, a large
   * title, an optional lead and a hairline. Replaces the repeated centred
   * title/subtitle stack so sections read as a sequence, not a list.
   */
  const SectionHead: React.FC<{
    index: string;
    kicker: string;
    title: React.ReactNode;
    lead?: string;
    action?: { label: string; onClick: () => void };
  }> = ({ index, kicker, title, lead, action }) => (
    <header className="space-y-5">
      <div className="flex items-end justify-between gap-6">
        <div className="space-y-3 min-w-0">
          <span className="eyebrow">
            <span className="tabular-nums">{index}</span>
            <span>{kicker}</span>
          </span>
          <h2 className="section-title max-w-2xl">{title}</h2>
          {lead && (
            <p className="text-[15px] text-muted max-w-lg leading-relaxed">{lead}</p>
          )}
        </div>

        {action && (
          <button
            onClick={action.onClick}
            className="hidden sm:flex shrink-0 items-center gap-2 text-[13px] font-bold text-ink hover:text-brand transition-colors cursor-pointer group pb-1"
          >
            <span>{action.label}</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
          </button>
        )}
      </div>
      <div className="rule" />
    </header>
  );

  return (
    <div className="animate-in fade-in duration-500 text-right bg-white" dir="rtl">

      {/* ===================================================================== */}
      {/* HERO                                                                  */}
      {/* ===================================================================== */}
      <section className="relative overflow-hidden bg-navy">
        <img
          src={heroBannerImg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Two-stop veil: deep on the reading side, clearing toward the car. */}
        <div className="absolute inset-0 bg-gradient-to-l from-navy/20 via-navy/85 to-navy" />
        <div className="absolute inset-0 bg-navy/40 lg:bg-transparent" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28">
          <div className="max-w-3xl space-y-8">
            <span className="eyebrow !text-accent">
              <span>خدمة متنقلة</span>
            </span>

            <h1 className="display text-white text-[2.5rem] sm:text-6xl lg:text-7xl">
              سيارتك وسجادك
              <br />
              <span className="text-[#6FA8FF]">في أيدي محترفة</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300/90 max-w-md">
              نصلك أينما كنت بمعدات كاملة وفنيين مختصين. اختر الموعد الذي
              يناسبك، ونتولى الباقي.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-4 pt-2">
              <button
                onClick={() => handleApplyBannerCode('X25')}
                className="bg-accent hover:bg-amber-300 active:scale-[0.98] text-navy font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
              >
                <span>احجز الخدمة الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {heroOffer && (
                <p className="text-sm text-slate-300">
                  استخدم كود{' '}
                  <span className="text-accent font-bold tracking-wide">{heroOffer.code}</span>{' '}
                  ووفّر {heroOffer.percent}% على أول غسيل
                </p>
              )}
            </div>
          </div>

          {/* Trust row, set on a hairline rather than in pills */}
          <div className="mt-14 sm:mt-16 pt-7 border-t border-white/12 grid grid-cols-1 sm:grid-cols-3 gap-7 sm:gap-10 max-w-4xl">
            {[
              { k: 'فنيون معتمدون', v: 'فريق مدرب وفانات مجهزة بالكامل' },
              { k: 'مواعيد مرنة', v: 'تختار اليوم والوقت الذي يناسبك' },
              { k: 'أسعار واضحة', v: 'السعر شامل الضريبة بلا مفاجآت' }
            ].map(item => (
              <div key={item.k} className="space-y-1.5">
                <p className="text-[15px] font-bold text-white">{item.k}</p>
                <p className="text-[13px] text-slate-400 leading-relaxed">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* QUICK BOOK — straddles the hero edge so the page opens without a gap  */}
      {/* ===================================================================== */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 -mt-10 sm:-mt-14 relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_18px_50px_-20px_rgba(10,22,40,0.35)] ring-1 ring-black/5 p-3 sm:p-4">
          <div className="flex items-center justify-between gap-4 px-2 pt-1 pb-3">
            <p className="text-[13px] font-bold text-ink">احجز بسرعة</p>
            <button
              onClick={() => navigateToCategoryServices('cars')}
              className="text-[12px] font-bold text-brand hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer group"
            >
              كل الخدمات
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {popularServicesData.slice(0, 3).map(item => (
              <button
                key={`quick-${item.id}`}
                onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                className="group flex items-center gap-3.5 p-3 rounded-xl hover:bg-canvas transition-colors text-right cursor-pointer min-w-0"
              >
                <span className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-bold text-ink truncate">{item.title}</span>
                  <span className="price block text-[13px] text-brand mt-0.5">{item.price}</span>
                </span>
                <ArrowLeft className="w-4 h-4 text-faint shrink-0 group-hover:text-brand group-hover:-translate-x-1 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DESTINATION                                                           */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20 space-y-10">
        <SectionHead
          index="٠١"
          kicker="الوجهات"
          title="اختر وجهتك"
          lead="احجز خدمة في موقعك، أو تسوّق منتجات العناية وتصلك إلى بابك."
        />

        <div className="grid md:grid-cols-2 gap-5">
          {/* Services */}
          <button
            onClick={() => navigateToCategoryServices('cars')}
            className="group relative overflow-hidden rounded-[1.75rem] min-h-[19rem] sm:min-h-[23rem] text-right cursor-pointer"
          >
            <img
              src={cardServicesBlueCar}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/15" />

            <div className="relative h-full flex flex-col justify-end gap-3 p-8 sm:p-10">
              <h3 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight">الخدمات</h3>
              <p className="text-sm text-slate-300 max-w-[18rem] leading-relaxed">
                غسيل السيارات والسجاد والكنب والخزانات — في موقعك.
              </p>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-accent pt-2">
                استكشف الخدمات
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </span>
            </div>
          </button>

          {/* Store */}
          <button
            onClick={() => { setCurrentScreen('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative overflow-hidden rounded-[1.75rem] min-h-[19rem] sm:min-h-[23rem] text-right cursor-pointer bg-[#F2EEE6]"
          >
            <img
              src={carCareBanner}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B1409] via-[#1B1409]/55 to-transparent" />

            <div className="relative h-full flex flex-col justify-end gap-3 p-8 sm:p-10">
              <h3 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight">المتجر</h3>
              <p className="text-sm text-stone-300 max-w-[18rem] leading-relaxed">
                منتجات وإكسسوارات عناية مختارة، تصلك إلى بابك.
              </p>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-accent pt-2">
                تسوّق الآن
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CATEGORIES                                                            */}
      {/* ===================================================================== */}
      <section id="services-selection-section" className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 space-y-10">
        <SectionHead
          index="٠٢"
          kicker="الأقسام"
          title="اختر الخدمة التي تحتاجها"
          action={{ label: 'كل الخدمات', onClick: () => navigateToCategoryServices('cars') }}
        />

        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:overflow-visible scrollbar-none">
          {categoryItems.map(cat => (
            <button
              key={cat.id}
              id={cat.id === 'cat-cars' ? 'btn-view-all-services' : undefined}
              onClick={() => handleCategoryCardClick(cat)}
              className="group shrink-0 w-36 lg:w-auto text-right cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-3.5">
                <img
                  src={cat.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/55 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="block text-[13px] font-bold text-white leading-snug">
                    {cat.title}
                  </span>
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[12px] text-muted group-hover:text-brand transition-colors">
                احجز
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* COUPON STRIP — fills the gap between the rail and the offers section  */}
      {/* Reads a configured, in-window coupon; renders nothing if none exists. */}
      {/* ===================================================================== */}
      {welcomeCoupon && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-navy">
            <img
              src={carCareBanner}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-navy/40 to-navy" />

            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-7 p-8 sm:p-10">
              <div className="space-y-3 max-w-md">
                <span className="eyebrow !text-accent"><span>عميل جديد</span></span>
                <h2 className="text-2xl sm:text-[2rem] font-bold text-white tracking-tight leading-tight">
                  وفّر {welcomeCoupon.discountValue}% على أول حجز
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  استخدم الكود عند إتمام الحجز على طلب بقيمة {welcomeCoupon.minOrderValue} ر.س فأكثر.
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="border border-dashed border-white/30 rounded-xl px-5 py-3.5 text-center">
                  <span className="block text-[10px] text-slate-400 mb-1">الكود</span>
                  <span className="block text-lg font-bold text-accent tracking-[0.15em]">
                    {welcomeCoupon.code}
                  </span>
                </span>
                <button
                  onClick={() => handleApplyBannerCode(welcomeCoupon.code)}
                  className="bg-white hover:bg-slate-100 active:scale-[0.98] text-navy font-bold text-[14px] px-6 py-3.5 rounded-full transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>استخدم الكود</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* OFFERS                                                                */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 space-y-10">
        <SectionHead
          index="٠٣"
          kicker="لفترة محدودة"
          title="خدمات عليها عروض"
          action={{
            label: 'كل العروض',
            onClick: () => { setCurrentScreen('offers'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
          }}
        />

        <div
          className="relative"
          onMouseEnter={() => setIsHoveredOffers(true)}
          onMouseLeave={() => setIsHoveredOffers(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-[600ms] ease-out"
              style={{ transform: `translateX(${offerSlideIndex * (100 / cardsPerView)}%)` }}
            >
              {offerCards.map(offer => (
                <div key={offer.id} className="shrink-0 pl-4" style={{ width: `${100 / cardsPerView}%` }}>
                  <button
                    onClick={() => handleOfferClick(offer)}
                    className="group w-full text-right cursor-pointer"
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-[5/3.6] mb-5">
                      <img
                        src={offer.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                      />
                      <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-navy text-[11px] font-bold px-3 py-1.5 rounded-full">
                        {offer.badge}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <h3 className="text-[17px] font-bold text-ink leading-snug line-clamp-1">
                        {offer.title}
                      </h3>
                      <p className="text-[13px] text-muted leading-relaxed line-clamp-2 min-h-[2.75rem]">
                        {offer.subtitle}
                      </p>

                      <div className="flex items-baseline gap-2.5 pt-1">
                        <span className="price text-2xl text-ink">{offer.price}</span>
                        {offer.originalPrice && (
                          <span className="price text-[13px] text-faint line-through font-medium">
                            {offer.originalPrice}
                          </span>
                        )}
                      </div>

                      <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand pt-1">
                        اطلب الخدمة
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Controls sit together under the rail rather than floating over it */}
          <div className="flex items-center justify-between gap-6 pt-9">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxOfferSlideIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOfferSlideIndex(idx)}
                  aria-label={`الشريحة ${idx + 1}`}
                  aria-current={offerSlideIndex === idx}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    offerSlideIndex === idx ? 'w-8 bg-ink' : 'w-4 bg-hairline hover:bg-faint'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevOfferSlide}
                aria-label="العروض السابقة"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={nextOfferSlide}
                aria-label="العروض التالية"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* POPULAR                                                               */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28 space-y-10">
        <SectionHead
          index="٠٤"
          kicker="الأكثر طلباً"
          title="أشهر الخدمات"
          action={{ label: 'عرض الكل', onClick: () => navigateToCategoryServices('cars') }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {popularServicesData.map(item => (
            <article key={item.id} className="group flex flex-col">
              {/* Image is a second route to the same screen. It is removed from the
                  tab order so each card offers one keyboard stop, not two, and
                  carries a name for pointer/AT users who do reach it. */}
              <button
                onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                aria-label={`${item.title} — عرض التفاصيل`}
                tabIndex={-1}
                className="text-right cursor-pointer"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[5/4] mb-5">
                  <img
                    src={item.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                  />
                  {item.badge && (
                    <span className="absolute top-4 right-4 bg-navy text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>

              {/* Favourite is its own control, outside the card link */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-[16px] font-bold text-ink leading-snug">{item.title}</h3>
                <button
                  onClick={(e) => toggleFavorite(item.id, e)}
                  aria-label={favoriteServiceIds.includes(item.id) ? `إزالة ${item.title} من المفضلة` : `إضافة ${item.title} إلى المفضلة`}
                  aria-pressed={favoriteServiceIds.includes(item.id)}
                  className="shrink-0 p-1 -m-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <Heart
                    className={`w-[18px] h-[18px] transition-colors ${
                      favoriteServiceIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-faint'
                    }`}
                  />
                </button>
              </div>

              <p className="text-[13px] text-muted leading-relaxed line-clamp-2 mb-3 flex-1">
                {item.subtitle}
              </p>

              <div className="flex items-center gap-1.5 mb-4 text-[12px]">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="font-bold text-ink tabular-nums">{item.rating}</span>
                <span className="text-faint tabular-nums">({item.reviewsCount})</span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-hairline">
                <span className="price text-xl text-ink">{item.price}</span>
                <button
                  onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                  className="text-[13px] font-bold text-brand hover:text-navy transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  احجز
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* TWO-UP BANNERS — subscriptions and referrals, both existing screens   */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28">
        <div className="grid md:grid-cols-2 gap-5">
          <button
            onClick={() => { setCurrentScreen('subscriptions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative overflow-hidden rounded-[1.75rem] bg-brand-soft p-8 sm:p-10 text-right cursor-pointer min-h-[14rem] flex flex-col justify-between gap-6"
          >
            <div className="space-y-3">
              <span className="eyebrow"><span>اشتراكات</span></span>
              <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug max-w-[16rem]">
                خدمة تتكرر دون أن تعيد الحجز
              </h3>
              <p className="text-[13px] text-muted leading-relaxed max-w-[18rem]">
                اختر باقة دورية لسيارتك أو منزلك، ونأتيك في الموعد المتفق عليه.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand">
              تصفّح الاشتراكات
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
            </span>
            <img
              src={cardSubscriptionsClipboard}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute -bottom-6 -left-6 w-32 h-32 object-cover rounded-2xl opacity-90 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500"
            />
          </button>

          <button
            onClick={() => { setCurrentScreen('referral'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="group relative overflow-hidden rounded-[1.75rem] bg-canvas p-8 sm:p-10 text-right cursor-pointer min-h-[14rem] flex flex-col justify-between gap-6"
          >
            <div className="space-y-3">
              <span className="eyebrow"><span>ادعُ واكسب</span></span>
              <h3 className="text-xl sm:text-2xl font-bold text-ink leading-snug max-w-[16rem]">
                شارك نيكست مع من تعرف
              </h3>
              <p className="text-[13px] text-muted leading-relaxed max-w-[18rem]">
                لكل صديق يحجز عبر رمزك، مكافأة تضاف إلى محفظتك.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand">
              رمز الدعوة
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform duration-300" />
            </span>
            <img
              src={cardPackagesGift}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute -bottom-6 -left-6 w-32 h-32 object-cover rounded-2xl opacity-90 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500"
            />
          </button>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* WHY NIXT — dark band, the one tonal break in the page                 */}
      {/* ===================================================================== */}
      <section className="mt-24 sm:mt-32 bg-navy text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">

            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <span className="eyebrow !text-accent"><span>لماذا نيكست</span></span>
                <h2 className="section-title !text-white max-w-md">
                  تجربة تنظيف تستحق الثقة
                </h2>
              </div>

              <dl className="space-y-0">
                {whyNixtItems.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-5 py-6 ${i > 0 ? 'border-t border-white/10' : ''}`}
                  >
                    <span className="text-[13px] font-bold text-accent tabular-nums pt-0.5 shrink-0 w-6">
                      {['٠١', '٠٢', '٠٣', '٠٤'][i]}
                    </span>
                    <div className="space-y-1.5 min-w-0">
                      <dt className="text-[17px] font-bold text-white">{item.title}</dt>
                      <dd className="text-[14px] text-slate-400 leading-relaxed">{item.desc}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            {/* Offset imagery */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-[1.75rem] overflow-hidden aspect-[4/3]">
                <img
                  src="https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1100&q=80"
                  alt="تنظيف المقصورة الداخلية للسيارة"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-4 sm:left-6 w-40 sm:w-52 rounded-2xl overflow-hidden aspect-square ring-8 ring-navy">
                <img
                  src="https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=700&q=80"
                  alt="تنظيف السجاد بالمعدات الاحترافية"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* PACKAGES / SUBSCRIPTIONS / GIFTS                                      */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 space-y-10">
        <SectionHead
          index="٠٥"
          kicker="وفّر أكثر"
          title="الباقات والاشتراكات والهدايا"
          lead="خيارات متكررة ومُهداة لمن يحتاج الخدمة أكثر من مرة."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              id: 'nav-gifts',
              screen: 'send_gift' as const,
              title: 'الهدايا',
              desc: 'أرسل باقة أو رصيد محفظة لمن تحب.',
              cta: 'عرض الهدايا',
              image: cardPackagesGift
            },
            {
              id: 'nav-subscriptions',
              screen: 'subscriptions' as const,
              title: 'الاشتراكات',
              desc: 'خدمة دورية تتجدد دون أن تعيد الحجز.',
              cta: 'عرض الاشتراكات',
              image: cardSubscriptionsClipboard
            },
            {
              id: 'nav-offers',
              screen: 'offers' as const,
              title: 'العروض',
              desc: 'خصومات سارية لفترة محدودة.',
              cta: 'عرض العروض',
              image: cardDiscountsCoupon
            }
          ].map(card => (
            <button
              key={card.id}
              onClick={() => { setCurrentScreen(card.screen); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group relative overflow-hidden rounded-2xl bg-canvas hover:bg-brand-soft transition-colors duration-300 p-7 text-right cursor-pointer flex flex-col gap-3 min-h-[13rem]"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden mb-1">
                <img src={card.image} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xl font-bold text-ink">{card.title}</h3>
              <p className="text-[13px] text-muted leading-relaxed flex-1">{card.desc}</p>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand">
                {card.cta}
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform duration-300" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* REVIEWS                                                               */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 space-y-10">
        <SectionHead
          index="٠٦"
          kicker="آراء العملاء"
          title="ماذا يقول عملاؤنا"
          lead="تجارب موثقة من عملاء في مختلف مدن المملكة."
        />

        <div
          className="relative"
          onMouseEnter={() => setIsHoveredReviews(true)}
          onMouseLeave={() => setIsHoveredReviews(false)}
          onTouchStart={handleReviewsTouchStart}
          onTouchEnd={handleReviewsTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-[600ms] ease-out"
              style={{ transform: `translateX(${reviewsSlideIndex * (100 / cardsPerView)}%)` }}
            >
              {customerReviewsData.map(review => (
                <div key={review.id} className="shrink-0 pl-4" style={{ width: `${100 / cardsPerView}%` }}>
                  <figure className="h-full bg-canvas rounded-2xl p-7 flex flex-col gap-5">
                    <div className="flex items-center gap-1" aria-label={`التقييم ${review.rating} من 5`}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>

                    <blockquote className="text-[15px] text-ink-soft leading-[1.9] flex-1">
                      {review.review}
                    </blockquote>

                    <figcaption className="flex items-center gap-3 pt-5 border-t border-hairline">
                      <span className={`w-10 h-10 rounded-full ${review.avatarBg} flex items-center justify-center text-sm font-bold shrink-0`}>
                        {review.initial}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-bold text-ink truncate">{review.name}</span>
                        <span className="block text-[12px] text-faint truncate">{review.location}</span>
                      </span>
                      <span className="text-[11px] font-bold text-brand bg-white px-2.5 py-1 rounded-full shrink-0 max-w-[8rem] truncate">
                        {review.service}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 pt-9">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxReviewsSlideIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setReviewsSlideIndex(idx)}
                  aria-label={`الشريحة ${idx + 1}`}
                  aria-current={reviewsSlideIndex === idx}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    reviewsSlideIndex === idx ? 'w-8 bg-ink' : 'w-4 bg-hairline hover:bg-faint'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={prevReviewsSlide}
                aria-label="الآراء السابقة"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={nextReviewsSlide}
                aria-label="الآراء التالية"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* APP — store links and QR are placeholders until listings exist        */}
      {/* ===================================================================== */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-24 sm:pb-32">
        <div className="rounded-[1.75rem] bg-canvas overflow-hidden">
          <div className="grid lg:grid-cols-12 items-center gap-10">
            <div className="lg:col-span-7 p-9 sm:p-14 space-y-6">
              <span className="eyebrow"><span>التطبيق</span></span>
              <h2 className="section-title max-w-md">احجز من جوالك في أقل من دقيقة</h2>
              <p className="text-[15px] text-muted max-w-sm leading-relaxed">
                تطبيق نيكست قيد الإطلاق. سجّل اهتمامك الآن ونخبرك فور توفره.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <span className="inline-flex items-center gap-2.5 bg-white border border-hairline rounded-xl px-5 py-3 text-ink">
                  <Smartphone className="w-4 h-4 text-faint shrink-0" />
                  <span className="leading-tight">
                    <span className="block text-[10px] text-faint">قريباً على</span>
                    <span className="block text-[13px] font-bold">App Store</span>
                  </span>
                </span>
                <span className="inline-flex items-center gap-2.5 bg-white border border-hairline rounded-xl px-5 py-3 text-ink">
                  <Smartphone className="w-4 h-4 text-faint shrink-0" />
                  <span className="leading-tight">
                    <span className="block text-[10px] text-faint">قريباً على</span>
                    <span className="block text-[13px] font-bold">Google Play</span>
                  </span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 h-full min-h-[16rem] relative" aria-hidden="true">
              <img
                src={heroBannerImg}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-canvas lg:to-canvas/90" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
