import React, { useState, useEffect, useMemo } from 'react';
import { Riyal } from '../common/Riyal';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';
import { useReducedMotion } from 'motion/react';
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
  Gift,
  Ticket,
  Sparkles,
  Flame,
} from 'lucide-react';

// 3D Illustration assets matching the design
import cardPackagesGift from '../../assets/images/card_packages_gift_1788336459498.jpg';
import cardSubscriptionsClipboard from '../../assets/images/card_subscriptions_clipboard_1788336474969.jpg';
import cardDiscountsCoupon from '../../assets/images/card_discounts_coupon_1788336491476.jpg';
import tankPlasticWhite from '../../assets/images/tank_plastic_white_1789561943606.jpg';
// NIXT brand photography — uniformed crew, branded vans, Saudi settings.
import bCarWash from '../../assets/brand/category-car-wash-nixt-v5.webp';
import bCarWashAlt from '../../assets/brand/category-car-wash-v3.webp';
import bCarpet from '../../assets/brand/category-carpet-v3.webp';
import bOnsite from '../../assets/brand/onsite-services-category-v2.webp';
import bServicesGateway from '../../assets/brand/home-services-gateway-v2.webp';
import bProductsGateway from '../../assets/brand/home-products-gateway-v2.webp';
import bCollage from '../../assets/brand/services-collage.webp';
import bSofa from '../../assets/brand/store-sofa-v2.webp';
import bCarCare from '../../assets/brand/category-car-maintenance-v1.webp';

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
  isRender?: boolean;
}

/** Formats a configured numeric price into the displayed Saudi riyal string. */
const formatSAR = (value: number): string => value.toFixed(2);

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
      image: bCarWash,
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
      image: bCarpet,
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
      image: bSofa,
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
      image: tankPlasticWhite,
      isRender: true,
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
      image: bOnsite,
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
        image: bCarWash
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
        image: bCarpet
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
        image: bSofa
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
        image: bCarCare
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
        image: tankPlasticWhite,
        isRender: true
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
        price: svc ? formatSAR(svc.price) : '',
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
        image: tankPlasticWhite,
        badge: null as string | null,
        isRender: true
      },
      {
        id: 'srv-sofa-3',
        subtitle: 'تنظيف وتعقيم وإزالة البقع مع رائحة منعشة',
        rating: '4.8',
        reviewsCount: '980',
        image: bSofa,
        badge: null as string | null,
        isRender: false
      },
      {
        id: 'srv-carpet-m2',
        subtitle: 'تنظيف عميق وإزالة البقع مع التجفيف السريع',
        rating: '4.7',
        reviewsCount: '760',
        image: bCarpet,
        badge: null as string | null,
        isRender: false
      },
      {
        id: 'srv-ext',
        subtitle: 'غسيل شامل للهيكل الخارجي مع تلميع وإزالة الأتربة',
        rating: '4.9',
        reviewsCount: '3200',
        image: bCarWash,
        badge: 'الأكثر طلباً' as string | null,
        isRender: false
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
   * Hero slides. Each one speaks to a single service family, with its own
   * copy, imagery and action.
   *
   * Only the car slide applies a coupon — that is the existing hero action and
   * X25 is configured against car washing. The other two navigate only, so no
   * discount is implied for a service it was not configured for.
   */
  const heroSlides = useMemo(() => [
    {
      id: 'hero-cars',
      kicker: 'غسيل السيارات',
      titleLead: 'سيارتك تلمع',
      titleTail: 'أينما كنت',
      lead: 'غسيل داخلي وخارجي بمعدات كاملة ومواد أصلية. نصل إلى موقعك في الموعد الذي تختاره.',
      points: ['رغوة واكس ومناشف مايكروفايبر معقمة', 'تلميع الجنوط وتسويد الإطارات', 'تنظيف المقصورة وتعقيم فتحات التكييف'],
      cta: 'احجز غسيل السيارة',
      action: () => handleApplyBannerCode('X25'),
      showCoupon: true,
      mainImg: bCarWash,
      mainAlt: 'فني نيكست يغسل سيارة أمام المنزل',
      insetImg: bCarCare,
      plainMain: false
    },
    {
      id: 'hero-carpets',
      kicker: 'غسيل السجاد والكنب',
      titleLead: 'سجادك وكنبك',
      titleTail: 'كالجديد',
      lead: 'تنظيف عميق بالبخار يزيل البقع والروائح، مع التغليف والتسليم إلى باب منزلك.',
      points: ['غسيل بالبخار وإزالة البقع والروائح', 'استلام وتسليم إلى باب منزلك', 'تغليف بعد التنظيف'],
      cta: 'احجز غسيل السجاد',
      action: () => navigateToCategoryServices('carpets'),
      showCoupon: false,
      mainImg: bCarpet,
      mainAlt: 'فني نيكست يستلم السجاد من المنزل',
      insetImg: bSofa,
      plainMain: false
    },
    {
      id: 'hero-home',
      kicker: 'خدمات المنزل',
      titleLead: 'خزانات نظيفة',
      titleTail: 'ومنزل آمن',
      lead: 'تنظيف وتعقيم الخزانات العلوية والأرضية، ورش المبيدات على يد فنيين مختصين.',
      points: ['تفريغ الرواسب وتطهير الخزان', 'رش مبيدات منخفضة الرائحة', 'فنيون مختصون بمعدات كاملة'],
      cta: 'استكشف كل الخدمات',
      action: () => {
        const el = document.getElementById('services-selection-section');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      showCoupon: false,
      mainImg: bOnsite,
      mainAlt: 'فريق نيكست أثناء الخدمة في الموقع',
      insetImg: tankPlasticWhite,
      plainMain: false
    }
  ], []);

  const [heroIndex, setHeroIndex] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  const heroReducedMotion = useReducedMotion();
  const activeSlide = heroSlides[heroIndex];

  /* Auto-advance, held while the visitor is on the slider and switched off
     entirely for anyone who prefers reduced motion. */
  useEffect(() => {
    if (heroPaused || heroReducedMotion) return;
    const t = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(t);
  }, [heroPaused, heroReducedMotion, heroSlides.length]);

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


  /** Editorial section header: tracked eyebrow, large title, hairline. */
  const SectionHead: React.FC<{
    kicker: string;
    title: React.ReactNode;
    lead?: string;
    action?: { label: string; onClick: () => void };
  }> = ({ kicker, title, lead, action }) => (
    <header className="space-y-6">
      <div className="flex items-end justify-between gap-8">
        <div className="space-y-4 min-w-0">
          <span className="eyebrow"><span>{kicker}</span></span>
          <h2 className="section-title max-w-2xl">{title}</h2>
          {lead && <p className="text-[15px] text-muted max-w-md">{lead}</p>}
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className="hidden sm:flex shrink-0 items-center gap-2 text-[13px] font-medium text-ink hover:text-brand-deep transition-colors cursor-pointer group pb-2"
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
    <div className="animate-in fade-in duration-500 text-right bg-canvas" dir="rtl">

      {/* ===================================================================== */}
      {/* HERO — ivory, type-led. The photograph sits beside the words rather   */}
      {/* than underneath them, so nothing has to be darkened to stay readable. */}
      {/* ===================================================================== */}
      <section
        className="relative overflow-hidden bg-navy"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        onFocusCapture={() => setHeroPaused(true)}
        onBlurCapture={() => setHeroPaused(false)}
        aria-roledescription="carousel"
        aria-label="خدمات نيكست"
      >
        {/* Full-bleed background. Each slide cross-fades in place. */}
        {heroSlides.map((sl, i) => (
          <img
            key={sl.id}
            src={sl.mainImg}
            alt=""
            aria-hidden="true"
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1100ms] ease-out ${
              heroIndex === i ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* The darkening sits behind the copy only: a panel anchored to the
            reading side that fades out well before the left edge, so most of
            the photograph stays visible. A faint wash keeps the chips legible. */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-[62%] bg-gradient-to-l from-navy via-navy/90 to-transparent" />
        <div className="absolute inset-0 bg-navy/30 sm:bg-navy/15 lg:bg-navy/5" />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24 lg:py-28">
          <div
            key={activeSlide.id}
            className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500"
            aria-live="polite"
          >
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>{activeSlide.kicker}</span>
            </span>

            <h1 className="display text-white text-[2.25rem] sm:text-5xl lg:text-[3.75rem]">
              {activeSlide.titleLead}
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">{activeSlide.titleTail}</span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-1 h-2.5 sm:h-3.5 bg-accent/55 -z-0 rounded-sm"
                />
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-lg">
              {activeSlide.lead}
            </p>

            <ul className="space-y-2.5 pt-1 min-h-[6.5rem]">
              {activeSlide.points.map(pt => (
                <li key={pt} className="flex items-start gap-2.5 text-[13px] sm:text-sm text-slate-200">
                  <BadgeCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={activeSlide.action}
                className="bg-accent hover:bg-amber-300 active:scale-[0.98] text-navy font-bold text-[14px] sm:text-[15px] px-7 py-3.5 rounded-xl transition-colors duration-200 flex items-center gap-2.5 cursor-pointer"
              >
                <span>{activeSlide.cta}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {activeSlide.showCoupon && heroOffer && (
                <p className="text-[13px] text-slate-300">
                  كود{' '}
                  <span className="text-accent font-bold tracking-wide">{heroOffer.code}</span>
                  {' '}يوفّر {heroOffer.percent}%
                </p>
              )}
            </div>

            {/* Trust chips, in the same form the inner screens use */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              <span className="chip"><BadgeCheck className="w-3.5 h-3.5 text-brand" />فنيون معتمدون</span>
              <span className="chip"><CalendarClock className="w-3.5 h-3.5 text-emerald-600" />مواعيد مرنة</span>
              <span className="chip"><Wallet className="w-3.5 h-3.5 text-amber-600" />أسعار شاملة الضريبة</span>
            </div>
          </div>

          {/* Slide controls */}
          <div className="flex items-center justify-between gap-6 mt-12">
            <div className="flex items-center gap-2" role="tablist" aria-label="شرائح الخدمات">
              {heroSlides.map((sl, i) => (
                <button
                  key={sl.id}
                  role="tab"
                  aria-selected={heroIndex === i}
                  aria-label={sl.kicker}
                  onClick={() => setHeroIndex(i)}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    heroIndex === i ? 'w-10 bg-accent' : 'w-5 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => setHeroIndex(prev => (prev - 1 + heroSlides.length) % heroSlides.length)}
                aria-label="الشريحة السابقة"
                className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white hover:text-navy active:scale-95 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setHeroIndex(prev => (prev + 1) % heroSlides.length)}
                aria-label="الشريحة التالية"
                className="w-11 h-11 rounded-full border border-white/25 flex items-center justify-center text-white hover:bg-white hover:text-navy active:scale-95 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* DESTINATION                                                           */}
      {/* ===================================================================== */}
      <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
          kicker="الوجهات"
          title="اختر وجهتك"
          lead="احجز خدمة في موقعك، أو تسوّق منتجات العناية وتصلك إلى بابك."
        />

        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              id: 'dest-services',
              title: 'الخدمات',
              desc: 'غسيل السيارات والسجاد والكنب والخزانات — في موقعك.',
              badge: 'في موقعك',
              cta: 'استكشف الخدمات',
              img: bServicesGateway,
              onClick: () => navigateToCategoryServices('cars'),
              tint: 'bg-brand-soft'
            },
            {
              id: 'dest-store',
              title: 'المتجر',
              desc: 'منتجات وإكسسوارات عناية مختارة، تصلك إلى بابك.',
              badge: 'توصيل للباب',
              cta: 'تسوّق الآن',
              img: bProductsGateway,
              onClick: () => { setCurrentScreen('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); },
              tint: 'bg-shell'
            }
          ].map(d => (
            <button
              key={d.id}
              onClick={d.onClick}
              className="card-i group relative overflow-hidden rounded-[2rem] text-right cursor-pointer min-h-[21rem] sm:min-h-[25rem] bg-navy"
            >
              {/* The photograph fills the card; nothing floats inside a panel. */}
              <img
                src={d.img}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.07]"
              />

              {/* Scrim lives under the copy and deepens on hover */}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy via-navy/55 to-transparent transition-opacity duration-500"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <span className="absolute top-5 right-5 inline-flex items-center gap-2 bg-white/15 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                {d.badge}
              </span>

              <div className="relative h-full flex flex-col justify-end gap-3 p-7 sm:p-9">
                <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{d.title}</h3>
                <p className="text-[13px] sm:text-sm text-slate-200 leading-relaxed max-w-[21rem]">{d.desc}</p>

                <span className="mt-2 inline-flex w-fit items-center gap-2.5 bg-white/12 group-hover:bg-accent backdrop-blur-md text-white group-hover:text-navy font-bold text-[13px] px-5 py-2.5 rounded-full transition-colors duration-300">
                  {d.cta}
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                </span>
              </div>
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CATEGORIES                                                            */}
      {/* ===================================================================== */}
      <section id="services-selection-section" className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
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
              <div className={`rounded-2xl overflow-hidden aspect-square mb-4 ${cat.isRender ? 'bg-white p-4' : 'bg-shell'}`}>
                <img src={cat.image} alt="" aria-hidden="true" loading="lazy"
                  className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.07] ${
                    cat.isRender ? 'render object-contain' : 'photo object-cover'
                  }`} />
              </div>
              <h3 className="text-[13px] font-semibold text-ink leading-snug mb-1.5">{cat.title}</h3>
              <span className="flex items-center gap-1.5 text-[12px] text-faint group-hover:text-brand-deep transition-colors">
                احجز
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* AD BANNER — a plain promotional slot. Artwork can be swapped without */}
      {/* touching the layout; it only renders while a valid coupon exists.    */}
      {/* ===================================================================== */}
      {welcomeCoupon && (
        <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-12">
          <button
            onClick={() => handleApplyBannerCode(welcomeCoupon.code)}
            aria-label={`عرض عميل جديد: خصم ${welcomeCoupon.discountValue}% بكود ${welcomeCoupon.code}`}
            className="card-i group relative block w-full overflow-hidden rounded-[1.75rem] bg-navy h-[15rem] sm:h-[13rem] lg:h-[15rem] text-right cursor-pointer"
          >
            <img
              src={bCarCare}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-l from-navy via-navy/85 to-transparent" />

            <span className="relative h-full flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-5 px-7 sm:px-10">
              <span className="space-y-2">
                <span className="block text-[11px] font-bold tracking-[0.18em] text-accent">عميل جديد</span>
                <span className="block text-2xl sm:text-[1.75rem] lg:text-3xl font-bold text-white tracking-tight">
                  وفّر {welcomeCoupon.discountValue}% على أول حجز
                </span>
                <span className="block text-[13px] text-slate-300">
                  بكود{' '}
                  <span className="font-bold text-accent tracking-[0.15em]">{welcomeCoupon.code}</span>
                  {' '}على طلب بقيمة {welcomeCoupon.minOrderValue} <Riyal /> فأكثر
                </span>
              </span>

              <span className="shrink-0 inline-flex w-fit items-center gap-2.5 bg-accent group-hover:bg-white text-navy font-bold text-[14px] px-6 py-3 rounded-full transition-colors duration-300">
                استخدم الكود
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              </span>
            </span>
          </button>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* OFFERS                                                                */}
      {/* ===================================================================== */}
      <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
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
          <div className="overflow-hidden -my-5 py-5">
            <div className="flex transition-transform duration-[600ms] ease-out"
              style={{ transform: `translateX(${offerSlideIndex * (100 / cardsPerView)}%)` }}>
              {offerCards.map(offer => (
                <div key={offer.id} className="shrink-0 pl-5" style={{ width: `${100 / cardsPerView}%` }}>
                  <button onClick={() => handleOfferClick(offer)} className="group w-full text-right cursor-pointer">
                    <div className={`relative rounded-2xl overflow-hidden aspect-[5/3.6] mb-6 ${offer.isRender ? 'bg-white p-5' : 'bg-canvas'}`}>
                      <img src={offer.image} alt="" aria-hidden="true" loading="lazy"
                        className={`w-full h-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] ${
                          offer.isRender ? 'render object-contain' : 'photo object-cover'
                        }`} />
                      <span className="absolute top-4 right-4 bg-white text-ink text-[11px] font-semibold px-3 py-1.5 rounded-full">
                        {offer.badge}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-[18px] font-semibold text-ink leading-snug line-clamp-1">{offer.title}</h3>
                      <p className="text-[13px] text-muted leading-relaxed line-clamp-2 min-h-[2.75rem]">{offer.subtitle}</p>
                      <div className="flex items-baseline gap-3 pt-1">
                        <span className="price text-2xl text-ink inline-flex items-baseline gap-1.5">
                          {offer.price}
                          <Riyal />
                          {offer.unitSuffix && <span className="text-[13px] font-normal text-muted">{offer.unitSuffix}</span>}
                        </span>
                        {offer.originalPrice && (
                          <span className="price text-[13px] text-faint line-through font-normal inline-flex items-baseline gap-1">
                            {offer.originalPrice}
                            <Riyal />
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-2 text-[13px] font-medium text-accent pt-1">
                        اطلب الخدمة
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1.5 transition-transform duration-300" />
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 pt-10">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxOfferSlideIndex + 1 }).map((_, idx) => (
                <button key={idx} onClick={() => setOfferSlideIndex(idx)}
                  aria-label={`الشريحة ${idx + 1}`} aria-current={offerSlideIndex === idx}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    offerSlideIndex === idx ? 'w-8 bg-ink' : 'w-4 bg-hairline hover:bg-faint'}`} />
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={prevOfferSlide} aria-label="العروض السابقة"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={nextOfferSlide} aria-label="العروض التالية"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* POPULAR                                                               */}
      {/* ===================================================================== */}
      <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
          kicker="الأكثر طلباً"
          title="أشهر الخدمات"
          action={{ label: 'عرض الكل', onClick: () => navigateToCategoryServices('cars') }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {popularServicesData.map(item => (
            <article key={item.id} className="group flex flex-col">
              <button
                onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                aria-label={`${item.title} — عرض التفاصيل`}
                tabIndex={-1}
                className="text-right cursor-pointer"
              >
                <div className={`relative rounded-2xl overflow-hidden aspect-[5/4] mb-6 ${item.isRender ? 'bg-white p-5' : 'bg-shell'}`}>
                  <img src={item.image} alt="" aria-hidden="true" loading="lazy"
                    className={`w-full h-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05] ${
                      item.isRender ? 'render object-contain' : 'photo object-cover'
                    }`} />
                  {item.badge && (
                    <span className="absolute top-4 right-4 bg-white text-ink text-[11px] font-semibold px-3 py-1.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>

              <div className="flex items-start justify-between gap-3 mb-2.5">
                <h3 className="text-[16px] font-semibold text-ink leading-snug">{item.title}</h3>
                <button
                  onClick={(e) => toggleFavorite(item.id, e)}
                  aria-label={favoriteServiceIds.includes(item.id) ? `إزالة ${item.title} من المفضلة` : `إضافة ${item.title} إلى المفضلة`}
                  aria-pressed={favoriteServiceIds.includes(item.id)}
                  className="shrink-0 p-1 -m-1 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                >
                  <Heart className={`w-[18px] h-[18px] transition-colors ${
                    favoriteServiceIds.includes(item.id) ? 'fill-rose-500 text-rose-500' : 'text-faint'}`} />
                </button>
              </div>

              <p className="text-[13px] text-muted leading-relaxed line-clamp-2 mb-3.5 flex-1">{item.subtitle}</p>

              <div className="flex items-center gap-1.5 mb-5 text-[12px]">
                <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                <span className="font-semibold text-ink tabular-nums">{item.rating}</span>
                <span className="text-faint tabular-nums">({item.reviewsCount})</span>
              </div>

              <div className="flex items-center justify-between gap-3 pt-4 border-t border-hairline">
                <span className="price text-xl text-ink inline-flex items-baseline gap-1.5">
                  {item.price}
                  <Riyal />
                </span>
                <button
                  onClick={() => item.fallbackService && handleServiceClick(item.fallbackService)}
                  className="text-[13px] font-medium text-brand-deep hover:text-ink transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  احجز
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </article>
          ))}
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* TWO-UP BANNERS                                                        */}
      {/* ===================================================================== */}
      <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              id: 'b-subs', kicker: 'اشتراكات', title: 'خدمة تتكرر دون أن تعيد الحجز',
              desc: 'اختر باقة دورية لسيارتك أو منزلك، ونأتيك في الموعد المتفق عليه.',
              cta: 'تصفّح الاشتراكات', img: cardSubscriptionsClipboard, tint: 'bg-shell',
              onClick: () => { setCurrentScreen('subscriptions'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            },
            {
              id: 'b-ref', kicker: 'ادعُ واكسب', title: 'شارك نيكست مع من تعرف',
              desc: 'لكل صديق يحجز عبر رمزك، مكافأة تضاف إلى محفظتك.',
              cta: 'رمز الدعوة', img: cardPackagesGift, tint: 'bg-brand-soft',
              onClick: () => { setCurrentScreen('referral'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
            }
          ].map(b => (
            <button
              key={b.id}
              onClick={b.onClick}
              className={`card-i group relative overflow-hidden rounded-[2rem] ${b.tint} text-right cursor-pointer min-h-[15rem] ring-1 ring-transparent hover:ring-brand/20 hover:bg-white`}
            >
              {/* Soft halo that grows on hover, so the card has somewhere to go */}
              <span
                aria-hidden="true"
                className="absolute -top-12 -left-12 w-44 h-44 rounded-full bg-brand/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />

              <div className="relative flex items-start gap-6 sm:gap-7 p-7 sm:p-9 h-full">
                <span className="medallion w-24 h-24 sm:w-28 sm:h-28 mt-1" aria-hidden="true">
                  <img src={b.img} alt="" loading="lazy" />
                </span>

                <div className="flex flex-col justify-between gap-5 min-w-0 flex-1 self-stretch">
                  <div className="space-y-2.5">
                    <span className="eyebrow"><span>{b.kicker}</span></span>
                    <h3 className="text-lg sm:text-xl font-bold text-ink leading-snug tracking-tight">{b.title}</h3>
                    <p className="text-[13px] text-muted leading-relaxed">{b.desc}</p>
                  </div>

                  <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-deep">
                    {b.cta}
                    <span className="w-7 h-7 rounded-full bg-white/70 group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-colors duration-300">
                      <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                    </span>
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* WHY NIXT                                                              */}
      {/* ===================================================================== */}
      <section className="bg-navy on-navy">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-12 gap-14 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-10">
              <div className="space-y-4">
                <span className="eyebrow"><span>لماذا نيكست</span></span>
                <h2 className="section-title max-w-md">تجربة تنظيف تستحق الثقة</h2>
              </div>

              <dl>
                {whyNixtItems.map((item, i) => (
                  <div key={item.id} className={`flex items-start gap-5 py-6 ${i > 0 ? 'border-t border-hairline' : ''}`}>
                    <span className="w-11 h-11 rounded-xl bg-white/10 text-accent flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5" />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[17px] font-semibold text-ink mb-1.5">{item.title}</dt>
                      <dd className="text-[14px] text-muted leading-relaxed">{item.desc}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3] bg-white">
                <img
                  src={bCollage}
                  alt="خدمات نيكست المتنقلة"
                  loading="lazy"
                  className="photo w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-9 -left-3 sm:left-8 w-36 sm:w-48 rounded-2xl overflow-hidden aspect-square ring-8 ring-canvas bg-white">
                <img
                  src={bCarWashAlt}
                  alt="غسيل خارجي للسيارة"
                  loading="lazy"
                  className="photo w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* PACKAGES / SUBSCRIPTIONS / GIFTS                                      */}
      {/* ===================================================================== */}
      <section className="bg-white"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
          kicker="وفّر أكثر"
          title="الباقات والاشتراكات والهدايا"
          lead="خيارات متكررة ومُهداة لمن يحتاج الخدمة أكثر من مرة."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { id: 'nav-gifts', screen: 'send_gift' as const, title: 'الهدايا', desc: 'أرسل باقة أو رصيد محفظة لمن تحب.', cta: 'عرض الهدايا', image: cardPackagesGift },
            { id: 'nav-subscriptions', screen: 'subscriptions' as const, title: 'الاشتراكات', desc: 'خدمة دورية تتجدد دون أن تعيد الحجز.', cta: 'عرض الاشتراكات', image: cardSubscriptionsClipboard },
            { id: 'nav-offers', screen: 'offers' as const, title: 'العروض', desc: 'خصومات سارية لفترة محدودة.', cta: 'عرض العروض', image: cardDiscountsCoupon }
          ].map(card => (
            <button key={card.id}
              onClick={() => { setCurrentScreen(card.screen); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="group rounded-[1.75rem] bg-white/5 ring-1 ring-hairline hover:ring-brand-deep/25 p-8 text-right cursor-pointer flex flex-col gap-4 min-h-[14rem] transition-all duration-300">
              <span className="medallion w-16 h-16 mb-1" aria-hidden="true">
                <img src={card.image} alt="" loading="lazy" />
              </span>
              <h3 className="text-xl font-semibold text-ink">{card.title}</h3>
              <p className="text-[13px] text-muted leading-relaxed flex-1">{card.desc}</p>
              <span className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-deep">
                {card.cta}
                <span className="w-7 h-7 rounded-full bg-brand-soft group-hover:bg-brand group-hover:text-white flex items-center justify-center transition-colors duration-300">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" />
                </span>
              </span>
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* REVIEWS                                                               */}
      {/* ===================================================================== */}
      <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 space-y-12">
        <SectionHead
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
          <div className="overflow-hidden -my-5 py-5">
            <div className="flex transition-transform duration-[600ms] ease-out"
              style={{ transform: `translateX(${reviewsSlideIndex * (100 / cardsPerView)}%)` }}>
              {customerReviewsData.map(review => (
                <div key={review.id} className="shrink-0 pl-5" style={{ width: `${100 / cardsPerView}%` }}>
                  <figure className="card-i h-full bg-white ring-1 ring-hairline hover:ring-brand/20 rounded-[1.75rem] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-1" aria-label={`التقييم ${review.rating} من 5`}>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                      ))}
                    </div>
                    <blockquote className="text-[15px] text-ink-soft leading-[1.95] flex-1">{review.review}</blockquote>
                    <figcaption className="flex items-center gap-3 pt-5 border-t border-hairline">
                      <span className="w-10 h-10 rounded-full bg-shell text-ink flex items-center justify-center text-sm font-semibold shrink-0">
                        {review.initial}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-semibold text-ink truncate">{review.name}</span>
                        <span className="block text-[12px] text-faint truncate">{review.location}</span>
                      </span>
                      <span className="text-[11px] font-medium text-brand-deep bg-brand-soft px-3 py-1.5 rounded-full shrink-0 max-w-[8rem] truncate">
                        {review.service}
                      </span>
                    </figcaption>
                  </figure>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-6 pt-10">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxReviewsSlideIndex + 1 }).map((_, idx) => (
                <button key={idx} onClick={() => setReviewsSlideIndex(idx)}
                  aria-label={`الشريحة ${idx + 1}`} aria-current={reviewsSlideIndex === idx}
                  className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer ${
                    reviewsSlideIndex === idx ? 'w-8 bg-ink' : 'w-4 bg-hairline hover:bg-faint'}`} />
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={prevReviewsSlide} aria-label="الآراء السابقة"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={nextReviewsSlide} aria-label="الآراء التالية"
                className="w-11 h-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:bg-ink hover:text-white hover:border-ink active:scale-95 transition-all cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* STORE AD BANNER — replaces the app-download block, which promised an */}
      {/* app that has no listing yet. Sends the visitor to the store instead. */}
      {/* ===================================================================== */}
      <section className="bg-canvas"><div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <button
          onClick={() => { setCurrentScreen('store'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="تسوّق منتجات العناية من متجر نيكست"
          className="card-i group relative block w-full overflow-hidden rounded-[1.75rem] bg-navy h-[17rem] sm:h-[14rem] lg:h-[16rem] text-right cursor-pointer"
        >
          <img
            src={bProductsGateway}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.06]"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-l from-navy via-navy/85 to-transparent" />

          <span className="relative h-full flex flex-col sm:flex-row sm:items-center justify-center sm:justify-between gap-5 px-7 sm:px-10">
            <span className="space-y-2">
              <span className="block text-[11px] font-bold tracking-[0.18em] text-accent">متجر نيكست</span>
              <span className="block text-2xl sm:text-[1.75rem] lg:text-3xl font-bold text-white tracking-tight max-w-md">
                منتجات العناية بالسيارة والمنزل
              </span>
              <span className="block text-[13px] text-slate-300 max-w-sm">
                إكسسوارات ومستلزمات تنظيف مختارة، تصلك إلى بابك.
              </span>
            </span>

            <span className="shrink-0 inline-flex w-fit items-center gap-2.5 bg-accent group-hover:bg-white text-navy font-bold text-[14px] px-6 py-3 rounded-full transition-colors duration-300">
              تسوّق الآن
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            </span>
          </span>
        </button>
        </div>
      </section>

    </div>
  );
};
