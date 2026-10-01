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
  Quote,
  BadgeCheck,
  CalendarClock,
  Wallet,
  Headset,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

// 3D Illustration assets matching the design
import cardPackagesGift from '../../assets/images/card_packages_gift_1788336459498.jpg';
import cardSubscriptionsClipboard from '../../assets/images/card_subscriptions_clipboard_1788336474969.jpg';
import cardDiscountsCoupon from '../../assets/images/card_discounts_coupon_1788336491476.jpg';
import heroBannerImg from '../../assets/images/hero_car_wash_banner_1788336434912.jpg';
import cardServicesBlueCar from '../../assets/images/card_services_blue_car_1788336446999.jpg';
import carCareBanner from '../../assets/images/car_care_banner_1788357613398.jpg';
import sofaCleaningImg from '../../assets/images/sofa_cleaning_item_1789560655946.jpg';
import { ServicesStoreSwitcher } from '../common/ServicesStoreSwitcher';

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

  /**
   * Entrance animation is deliberately limited to the hero and to hover/tap
   * feedback. Content cards are never rendered at opacity 0, so prices stay
   * visible without JavaScript and for visitors who prefer reduced motion.
   */
  const prefersReducedMotion = useReducedMotion();

  // Banner carousel state
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isHoveredBanner, setIsHoveredBanner] = useState(false);

  const banners = [
    {
      id: 'b1',
      badge: 'عرض لفترة محدودة',
      title: 'استخدم كود الخصم',
      code: 'X25',
      desc: 'غسيل داخلي وخارجي شامل بـ 39 ر.س فقط بدلاً من 48 ر.س',
      actionCode: 'X25',
      btnText: 'احجز الآن واستفد',
      image: heroBannerImg
    },
    {
      id: 'b2',
      badge: 'جديدنا المتنقل ✨',
      title: 'غسيل السجاد والكنب بالبخار',
      code: 'CARPET15',
      desc: 'تنظيف عميق بالبخار وإزالة البقع والروائح بأحدث المعدات الألمانية',
      category: 'carpets_furniture',
      btnText: 'احجز خدمة السجاد',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'b3',
      badge: 'توفير عائلي حصري 🎁',
      title: 'باقات واشتراكات الغسيل',
      code: 'SAVE35',
      desc: 'وفر حتى 35% مع هدايا مجانية ومناديل فاخرة لجميع سيارات العائلة',
      tab: 'packages',
      btnText: 'استكشف الباقات',
      image: cardServicesBlueCar
    },
    {
      id: 'b4',
      badge: 'مياه أنظف لعائلتك 💧',
      title: 'تنظيف وتعقيم الخزانات',
      desc: 'تفريغ الرواسب وتطهير الخزان العلوي والأرضي على يد فنيين مختصين',
      category: 'tanks',
      btnText: 'احجز تنظيف الخزان',
      image: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'b5',
      badge: 'حماية لمنزلك 🛡️',
      title: 'مكافحة الحشرات ورش المبيدات',
      desc: 'رش احترافي بمبيدات منخفضة الرائحة مع متابعة ما بعد الخدمة',
      category: 'pest_control',
      btnText: 'احجز الرش الآن',
      image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  // Auto-play banner carousel with pause on hover
  useEffect(() => {
    if (isHoveredBanner) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isHoveredBanner, banners.length]);

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

  // Section: "لماذا تختار NIXT؟".
  // Copy intentionally mirrors the claims already published in the site footer —
  // no new guarantee or policy is introduced here.
  const whyNixtItems = useMemo(() => [
    {
      id: 'why-captains',
      icon: BadgeCheck,
      title: 'فنيون مختصون',
      desc: 'كباتن مدربون وفانات مجهزة بالكامل تصلك أينما كنت',
      tone: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: 'why-time',
      icon: CalendarClock,
      title: 'التزام بالمواعيد',
      desc: 'جدولة ذكية للسعة التشغيلية ومواعيد مرنة تختارها بنفسك',
      tone: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: 'why-materials',
      icon: ShieldCheck,
      title: 'مواد أصلية وآمنة',
      desc: 'شامبو إيطالي وواكس مخصص لحماية الطلاء ومواد معتمدة',
      tone: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    {
      id: 'why-payment',
      icon: Wallet,
      title: 'دفع آمن وتقسيط',
      desc: 'مدى والبطاقات وأبل باي وتقسيط تابي وتمارا ورصيد المحفظة',
      tone: 'bg-purple-50 text-purple-600 border-purple-100'
    }
  ], []);

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

  const activeBanner = banners[bannerIndex];

  return (
    <div className="animate-in fade-in duration-300 pb-16 text-right" dir="rtl">

      {/* ===================================================================== */}
      {/* HERO: full-bleed cinematic banner with rotating promotional slides     */}
      {/* ===================================================================== */}
      <section
        onMouseEnter={() => setIsHoveredBanner(true)}
        onMouseLeave={() => setIsHoveredBanner(false)}
        className="relative w-full overflow-hidden bg-slate-950"
        aria-label="عروض نيكست"
      >
        {/* Layered background photography, cross-fading per slide */}
        <AnimatePresence mode="sync">
          <motion.div
            key={activeBanner.id}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.3 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={activeBanner.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Readability scrim: strongest on the right where RTL text begins */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/20 via-slate-950/70 to-slate-950/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />
        {/* Narrow screens have no side room for the gradient to fall off, so add a flat veil. */}
        <div className="absolute inset-0 bg-slate-950/45 sm:hidden" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-8 items-center">

            {/* Headline column */}
            <div className="lg:col-span-7 space-y-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeBanner.id}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-4"
                >
                  <span className="inline-flex items-center gap-2 bg-amber-400/15 text-amber-300 border border-amber-400/30 backdrop-blur-sm text-[11px] sm:text-xs font-black px-3.5 py-1.5 rounded-full">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeBanner.badge}
                  </span>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight max-w-2xl">
                    {activeBanner.title}
                    {activeBanner.code && (
                      <span className="inline-flex items-baseline align-middle mr-3 bg-amber-400 text-slate-950 text-xl sm:text-3xl px-3 py-1 rounded-xl shadow-lg shadow-amber-400/20">
                        {activeBanner.code}
                      </span>
                    )}
                  </h1>

                  <p className="text-sm sm:text-lg text-slate-300 font-medium leading-relaxed max-w-xl">
                    {activeBanner.desc}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* CTA row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const current = banners[bannerIndex];
                    if (current.actionCode) {
                      handleApplyBannerCode(current.actionCode);
                    } else if (current.category) {
                      setActiveCategory(current.category as any);
                      setShowExplorer(true);
                    } else if (current.tab) {
                      setActiveServiceTab(current.tab as any);
                      setShowExplorer(true);
                    } else {
                      const s = services[0];
                      handleServiceClick(s);
                    }
                  }}
                  className="bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>{activeBanner.btnText}</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('services-selection-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 backdrop-blur-sm font-bold text-sm sm:text-base px-6 py-3 sm:py-3.5 rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>تصفّح الخدمات</span>
                </button>
              </div>

              {/* Trust strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5 border-t border-white/10 mt-6">
                {[
                  { icon: BadgeCheck, label: 'فنيون مختصون' },
                  { icon: CalendarClock, label: 'مواعيد مرنة' },
                  { icon: MapPin, label: 'نصلك أينما كنت' }
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 text-slate-300">
                    <item.icon className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating offer card (desktop only — decorative reinforcement) */}
            <div className="hidden lg:flex lg:col-span-5 justify-start">
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              >
                <div className="flex items-center gap-2 text-amber-400 mb-4">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-black">الأكثر طلباً اليوم</span>
                </div>
                <div className="space-y-3">
                  {popularServicesData.slice(0, 3).map(item => (
                    <button
                      key={item.id}
                      onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/5 transition-colors text-right cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <img src={item.image} alt="" aria-hidden="true" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.subtitle.slice(0, 28)}…</p>
                      </div>
                      <span className="text-sm font-black text-amber-400 shrink-0">{item.price}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Slide pagination */}
          <div className="flex items-center gap-2 pt-10">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => setBannerIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
                  bannerIndex === idx ? 'w-10 bg-amber-400' : 'w-4 bg-white/25 hover:bg-white/50'
                }`}
                aria-label={`الشريحة ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-20 pt-12 sm:pt-16 pb-16">

        {/* ================================================================= */}
        {/* DESTINATION SWITCHER: services vs. store                          */}
        {/* ================================================================= */}
        <section>
          {/* The switcher renders its own "اختر وجهتك" heading. */}
          <ServicesStoreSwitcher activeTab="services" />
        </section>

        {/* ================================================================= */}
        {/* SERVICE CATEGORIES                                                */}
        {/* ================================================================= */}
        <section id="services-selection-section" className="space-y-7">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                اختر الخدمة التي تحتاجها
              </h2>
              <p className="text-sm text-slate-500 font-medium">خدماتنا في متناولك بكل سهولة</p>
            </div>
            <button
              id="btn-view-all-services"
              onClick={() => navigateToCategoryServices('cars')}
              className="shrink-0 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>عرض جميع الخدمات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categoryItems.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryCardClick(cat)}
                className={`group relative overflow-hidden rounded-3xl border bg-white text-right transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer ${
                  selectedCatId === cat.id ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-slate-200/80 shadow-xs'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                  <div className={`absolute top-2.5 right-2.5 w-9 h-9 rounded-xl border backdrop-blur-md flex items-center justify-center transition-all duration-300 ${cat.iconStyle}`}>
                    <cat.icon className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Label */}
                <div className="p-3 sm:p-3.5 space-y-1">
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">{cat.title}</h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug line-clamp-2">{cat.subtitle}</p>
                  <div className="flex items-center justify-end pt-1">
                    <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center transition-colors duration-300">
                      <ArrowLeft className="w-3 h-3 text-slate-600 group-hover:text-white transition-colors" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* OFFERS CAROUSEL                                                   */}
        {/* ================================================================= */}
        <section className="space-y-7">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                خدمات عليها عروض
                <Flame className="w-6 h-6 text-orange-500" />
              </h2>
              <p className="text-sm text-slate-500 font-medium">لا تفوّت أفضل الأسعار لفترة محدودة</p>
            </div>
            <button
              onClick={() => {
                setCurrentScreen('offers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="shrink-0 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
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
            {/* Prev (right in RTL) */}
            <button
              onClick={prevOfferSlide}
              aria-label="السابق"
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Next (left in RTL) */}
            <button
              onClick={nextOfferSlide}
              aria-label="التالي"
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-600 ease-out"
                style={{ transform: `translateX(${offerSlideIndex * (100 / cardsPerView)}%)` }}
              >
                {offerCards.map(offer => (
                  <div
                    key={offer.id}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    <div
                      onClick={() => handleOfferClick(offer)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleOfferClick(offer);
                      }}
                      className={`group relative overflow-hidden rounded-3xl border ${offer.borderColor} bg-white shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 cursor-pointer h-full`}
                    >
                      {/* Image header */}
                      <div className="relative h-40 sm:h-44 overflow-hidden">
                        <img
                          src={offer.image}
                          alt={offer.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                        <span className={`absolute top-3 right-3 ${offer.badgeColor} text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-lg`}>
                          {offer.badge}
                        </span>
                      </div>

                      {/* Body */}
                      <div className={`p-4 sm:p-5 space-y-3 bg-gradient-to-br ${offer.bgGradient}`}>
                        <div className="space-y-1.5">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight line-clamp-1">
                            {offer.title}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 min-h-[2rem]">
                            {offer.subtitle}
                          </p>
                        </div>

                        <div className="flex items-end justify-between gap-3 pt-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-xl sm:text-2xl font-black text-slate-900">{offer.price}</span>
                            {offer.originalPrice && (
                              <span className="text-xs text-slate-400 line-through font-bold">{offer.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOfferClick(offer);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>اطلب الخدمة الآن</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5 pt-6">
              {Array.from({ length: maxOfferSlideIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setOfferSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    offerSlideIndex === idx ? 'w-7 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`الشريحة ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* EDITORIAL SPLIT BANNER: mobile service + store cross-promotion     */}
        {/* ================================================================= */}
        <section className="grid lg:grid-cols-5 gap-4 sm:gap-5">
          {/* Large feature banner */}
          <div
            className="lg:col-span-3 relative overflow-hidden rounded-[2rem] min-h-[18rem] sm:min-h-[22rem] group"
          >
            <img
              src={carCareBanner}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-slate-950/30 via-slate-950/75 to-slate-950/95" />
            <div className="relative h-full flex flex-col justify-center p-7 sm:p-10 gap-4 max-w-lg">
              <span className="inline-flex w-fit items-center gap-2 bg-white/10 text-white border border-white/20 backdrop-blur-sm text-[11px] font-black px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                الخدمة تصلك أينما كنت
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                غسيل متنقل بأحدث الفانات المجهزة
              </h3>
              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                احجز الموعد الذي يناسبك ونصلك إلى موقعك بمعدات كاملة ومواد أصلية، دون انتظار في المغاسل التقليدية.
              </p>
              <button
                onClick={() => navigateToCategoryServices('cars')}
                className="w-fit bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm px-6 py-3 rounded-2xl shadow-xl shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>احجز خدمة السيارات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Store promo */}
          <div
            className="lg:col-span-2 relative overflow-hidden rounded-[2rem] min-h-[18rem] sm:min-h-[22rem] bg-gradient-to-br from-amber-50 via-orange-50/60 to-white border border-amber-200/70 group"
          >
            <img
              src={cardServicesBlueCar}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute -bottom-6 -left-6 w-48 h-48 object-cover rounded-3xl opacity-90 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-700"
            />
            <div className="relative h-full flex flex-col justify-center p-7 sm:p-8 gap-3.5">
              <span className="inline-flex w-fit items-center gap-2 bg-amber-500/10 text-amber-700 border border-amber-300/60 text-[11px] font-black px-3 py-1.5 rounded-full">
                متجر نيكست
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight max-w-[14rem]">
                منتجات العناية بجودة عالية
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[15rem]">
                اكتشف منتجات واكسسوارات مختارة للسيارات والسجاد والأثاث، تُوصل إلى بابك.
              </p>
              <button
                onClick={() => {
                  setCurrentScreen('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-fit bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer mt-1"
              >
                <span>تسوّق الآن</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* POPULAR SERVICES                                                  */}
        {/* ================================================================= */}
        <section className="space-y-7">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">أشهر الخدمات</h2>
              <p className="text-sm text-slate-500 font-medium">الخدمات الأكثر طلباً من عملائنا</p>
            </div>
            <button
              onClick={() => navigateToCategoryServices('cars')}
              className="shrink-0 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>عرض الكل</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {popularServicesData.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && item.fallbackService) {
                    handleServiceClick(item.fallbackService);
                  }
                }}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    aria-label="إضافة للمفضلة"
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        favoriteServiceIds.includes(item.id)
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-slate-400'
                      }`}
                    />
                  </button>

                  {item.badge && (
                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 space-y-2.5 flex-1 flex flex-col">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 flex-1">
                    {item.subtitle}
                  </p>

                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-black text-slate-700">{item.rating}</span>
                    <span className="text-[11px] text-slate-400 font-medium">({item.reviewsCount} تقييم)</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between gap-2">
                    <span className="text-lg sm:text-xl font-black text-slate-900">{item.price}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.fallbackService) handleServiceClick(item.fallbackService);
                    }}
                    className="w-full border border-blue-200 bg-blue-50/60 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-[0.98] text-blue-700 font-bold text-xs sm:text-sm py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>إضافة طلب</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* WHY NIXT                                                          */}
        {/* ================================================================= */}
        <section className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                لماذا تختار <span className="text-blue-600">NIXT</span>؟
              </h2>
              <p className="text-sm text-slate-500 font-medium">تجربة تنظيف احترافية آمنة ومريحة</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
              {whyNixtItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3.5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${item.tone}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="col-span-2 rounded-3xl overflow-hidden aspect-16/10 shadow-lg"
            >
              <img src={heroBannerImg} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div
              className="rounded-3xl overflow-hidden aspect-square shadow-lg"
            >
              <img src={sofaCleaningImg} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div
              className="rounded-3xl overflow-hidden aspect-square shadow-lg"
            >
              <img src={'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80'} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PACKAGES / SUBSCRIPTIONS / OFFERS                                 */}
        {/* ================================================================= */}
        <section className="space-y-7">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              الباقات والاشتراكات والعروض
            </h2>
            <p className="text-sm text-slate-500 font-medium">وفّر أكثر مع باقاتنا وخياراتنا المميزة</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                id: 'nav-packages',
                screen: 'packages' as const,
                title: 'الباقات',
                desc: 'باقات متكاملة تناسب احتياجاتك',
                cta: 'عرض الباقات',
                image: cardPackagesGift,
                titleTone: 'text-orange-500',
                shell: 'border-orange-200/80 bg-gradient-to-l from-orange-50/90 via-amber-50/50 to-white'
              },
              {
                id: 'nav-subscriptions',
                screen: 'subscriptions' as const,
                title: 'الاشتراكات',
                desc: 'اشترك ووفر أكثر مع باقاتنا المميزة',
                cta: 'عرض الاشتراكات',
                image: cardSubscriptionsClipboard,
                titleTone: 'text-emerald-600',
                shell: 'border-emerald-200/80 bg-gradient-to-l from-emerald-50/90 via-teal-50/50 to-white'
              },
              {
                id: 'nav-offers',
                screen: 'offers' as const,
                title: 'العروض',
                desc: 'عروض وخصومات لفترة محدودة',
                cta: 'عرض العروض',
                image: cardDiscountsCoupon,
                titleTone: 'text-purple-600',
                shell: 'border-purple-200/80 bg-gradient-to-l from-purple-50/90 via-indigo-50/50 to-white'
              }
            ].map((card, idx) => {
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') go();
                  }}
                  className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 flex items-center justify-between gap-4 group cursor-pointer ${card.shell}`}
                >
                  <div className="z-10 space-y-2 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-black ${card.titleTone}`}>{card.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{card.desc}</p>
                    <div className="pt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          go();
                        }}
                        className="bg-white hover:bg-slate-50 active:scale-95 text-slate-800 font-bold text-xs px-4 py-2 rounded-full border border-slate-200 shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <span>{card.cta}</span>
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 group-hover:scale-108 group-hover:-rotate-3 transition-transform duration-500">
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
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/70 text-[11px] font-black px-3 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>تقييمات موثقة من عملائنا</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">آراء وتقييمات العملاء</h2>
            <p className="text-sm text-slate-500 font-medium">تجارب وآراء حقيقية لعملائنا في مختلف مدن المملكة</p>
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
              className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={nextReviewsSlide}
              aria-label="التالي"
              className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg items-center justify-center text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-600 ease-out"
                style={{ transform: `translateX(${reviewsSlideIndex * (100 / cardsPerView)}%)` }}
              >
                {customerReviewsData.map(review => (
                  <div
                    key={review.id}
                    className="shrink-0 px-2"
                    style={{ width: `${100 / cardsPerView}%` }}
                  >
                    <div className="relative bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-lg transition-all duration-300 h-full flex flex-col gap-4">
                      <Quote className="absolute top-5 left-5 w-8 h-8 text-slate-100" />

                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full ${review.avatarBg} flex items-center justify-center font-black text-sm shrink-0`}>
                          {review.initial}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-black text-slate-900 truncate">{review.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate">{review.location}</p>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed flex-1 relative z-10">
                        {review.review}
                      </p>

                      <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full truncate">
                          {review.service}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">{review.date}</span>
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
                    reviewsSlideIndex === idx ? 'w-7 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`الشريحة ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SUPPORT CTA                                                       */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 border border-slate-800">
          <div className="absolute inset-0 opacity-25">
            <img src={carCareBanner} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-l from-slate-900/60 to-slate-900" />

          <div className="relative p-7 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-right">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 text-[11px] font-black px-3 py-1.5 rounded-full">
                <Headset className="w-3.5 h-3.5 text-amber-400" />
                <span>نحن هنا لمساعدتك</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                عندك سؤال قبل الحجز؟
              </h3>
              <p className="text-sm text-slate-300 font-medium max-w-lg">
                فريق الدعم يجيبك على استفساراتك حول الخدمات والباقات والمدفوعات ومواعيد الحجز.
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentScreen('help');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="shrink-0 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl shadow-amber-400/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>مركز المساعدة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
