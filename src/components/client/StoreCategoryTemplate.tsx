import React, { useState, useMemo, useEffect } from 'react';
import { Riyal } from '../common/Riyal';
import { useApp } from '../../context/AppContext';
import { StoreProduct } from '../../types';
import carCareBannerImg from '../../assets/images/car_care_banner_1788357613398.jpg';
import heroWashBannerImg from '../../assets/images/hero_car_wash_banner_1788336434912.jpg';
import {
  Car,
  Layers,
  Armchair,
  Flame,
  ArrowRight,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Star,
  Plus,
  Minus,
  Truck,
  Sparkles,
  Tag,
  Check,
  Percent,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Gift,
  ShieldCheck,
  Package,
  X
} from 'lucide-react';

export interface CategoryTemplateConfig {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  themeGradient: string;
  accentColor: string;
  bannerTitle: string;
  bannerSubtitle: string;
  promoCode: string;
  promoDiscount: string;
  bannerImage: string;
  promoCardImage?: string;
  brands?: { name: string; label: string }[];
  subcategories: {
    id: string;
    label: string;
    subTags?: string[];
  }[];
}

export const CATEGORY_CONFIGS: Record<string, CategoryTemplateConfig> = {
  cars: {
    id: 'cars',
    title: 'متجر مستلزمات وعناية السيارات',
    shortTitle: 'السيارات',
    subtitle: 'اكسسوارات داخلية وخارجية، منتجات العناية الفائقة، ولوازم الرحلات والتلميع',
    badge: 'منتجات أصلية معتمدة 🚗',
    icon: Car,
    themeGradient: 'from-blue-600 via-indigo-600 to-slate-900',
    accentColor: 'text-blue-600',
    bannerTitle: 'عروض حصرية على اكسسوارات ومنتجات العناية بالسيارات',
    bannerSubtitle: 'وفّر حتى 35% على منتجات النانو سيراميك، أجهزة البخار، والشواحن الأصلية المعتمدة',
    promoCode: 'CAR25',
    promoDiscount: 'خصم 25%',
    bannerImage: carCareBannerImg,
    promoCardImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    brands: [
      { name: 'ArmorAll', label: 'ArmorAll' },
      { name: 'HIKVISION', label: 'HIKVISION' },
      { name: 'SARI WAX', label: 'SARI WAX' },
      { name: '70mai', label: '70mai' },
      { name: 'MA-FRA', label: 'MA-FRA' },
      { name: 'LIQUI MOLY', label: 'LIQUI MOLY' },
      { name: 'MOTUL', label: 'MOTUL' },
      { name: 'EZI', label: 'EZI' },
      { name: 'Shell', label: 'Shell' },
    ],
    subcategories: [
      {
        id: 'all',
        label: 'الكل في السيارات',
        subTags: ['جميع المنتجات', 'الأكثر طلباً', 'عروض خاصة', 'جديدنا']
      },
      {
        id: 'interior_acc',
        label: 'إكسسوارات داخلية',
        subTags: [
          'أجهزة لعب ومنظمات',
          'شواحن السيارات',
          'أغطية المقاعد والاكسسوارات',
          'منقيات الجو',
          'عجلات القيادة والاكسسوارات',
          'دواسات الأرضيات وبطانات التحميل'
        ]
      },
      {
        id: 'exterior_acc',
        label: 'إكسسوارات خارجية',
        subTags: [
          'الشارات وملصقات ممتصات الصدمات',
          'المصابيح وإكسسوارات الإضاءة',
          'منتجات السحب',
          'أغطية السيارة بالكامل',
          'السلامة'
        ]
      },
      {
        id: 'car_care',
        label: 'العناية بالسيارات',
        subTags: [
          'المعدات والأدوات',
          'العناية الخارجية',
          'العناية الداخلية',
          'طلاءات ونانو سيراميك',
          'بطارية تشغيل السيارة',
          'منافخ الإطارات'
        ]
      },
      {
        id: 'electronics',
        label: 'إلكترونيات السيارات',
        subTags: [
          'أجهزة الفيديو للسيارات',
          'صوتيات للسيارات',
          'كاميرات داش',
          'أجهزة تحديد المواقع للسيارات'
        ]
      },
      {
        id: 'camping_trips',
        label: 'المركبات والرحلات',
        subTags: [
          'مواطير هواء وكشتات',
          'مراتب هوائية للسيارة',
          'أجهزة فحص أعطال المركبات',
          'دباب رباعي ولوازم طوارئ'
        ]
      }
    ]
  },
  carpets: {
    id: 'carpets',
    title: 'متجر مستلزمات وعناية السجاد',
    shortTitle: 'السجاد',
    subtitle: 'أكياس التغليف المعقمة، سوائل غسيل المفارش والبطانيات، ومساحيق العناية الفائقة',
    badge: 'عناية احترافية ومواد معتمدة 🧼',
    icon: Layers,
    themeGradient: 'from-emerald-700 via-teal-800 to-slate-900',
    accentColor: 'text-emerald-600',
    bannerTitle: 'خصومات خاصة على مستلزمات تغليف وحفظ السجاد والمفارش',
    bannerSubtitle: 'احمِ سجاد منزلك ومفارشك الفندقية من الأتربة والحشرات بأجود أنواع التغليف والمعقمات',
    promoCode: 'CARPET20',
    promoDiscount: 'خصم 20%',
    bannerImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
    promoCardImage: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80',
    brands: [
      { name: 'Kärcher', label: 'Kärcher' },
      { name: 'Bissell', label: 'Bissell' },
      { name: 'Vanish', label: 'Vanish' },
      { name: 'Clorox', label: 'Clorox' },
      { name: 'Dettol', label: 'Dettol' },
      { name: 'Fairy', label: 'Fairy' }
    ],
    subcategories: [
      {
        id: 'all',
        label: 'الكل في السجاد',
        subTags: ['جميع المنتجات', 'الأكثر طلباً', 'عروض التغليف', 'جديد']
      },
      {
        id: 'carpet_packaging',
        label: 'تغليف وحفظ السجاد',
        subTags: ['أكياس سميكة معقمة', 'رولات تهوية وحفظ', 'أربطة وأشرطة تثبيت', 'تخزين موسمي آمن']
      },
      {
        id: 'blankets_quilts',
        label: 'غسيل بطانيات ولحافات',
        subTags: ['سوائل معقمة فندقية', 'منعمات أقمشة فاخرة', 'روائح منعشة تدوم', 'شامبو ألياف الصوف']
      },
      {
        id: 'carpet_care',
        label: 'العناية ومساحيق السجاد',
        subTags: ['شامبو رغوة عميقة', 'بودرة لافندر فورية', 'مزيلات بقع القهوة والزيوت', 'معقم مضاد للبكتيريا']
      },
      {
        id: 'carpet_tools',
        label: 'أدوات وفراشي السجاد',
        subTags: ['فراشي سيليكون دوارة', 'مكانس إزالة الوبر', 'مماسح بخار للأرضيات']
      }
    ]
  },
  furniture: {
    id: 'furniture',
    title: 'متجر عناية الكنب والمجالس',
    shortTitle: 'الكنب',
    subtitle: 'شامبو الرغوة الجافة، معطرات العود الملكي، وبخاخات الحماية من السوائل والأوساخ',
    badge: 'نظافة ملكية لمجالس منزلك 🛋️',
    icon: Armchair,
    themeGradient: 'from-amber-600 via-rose-700 to-slate-950',
    accentColor: 'text-amber-600',
    bannerTitle: 'جدد أطقم الكنب والمجالس برغوة التنظيف الجاف الفورية',
    bannerSubtitle: 'إزالة أصعب البقع بدون ماء، معطر العود الملكي الفاخر، وتقنية النانو العازلة للانسكابات',
    promoCode: 'SOFA30',
    promoDiscount: 'خصم 30%',
    bannerImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    promoCardImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    brands: [
      { name: 'Astonish', label: 'Astonish' },
      { name: 'Leather Master', label: 'Leather Master' },
      { name: 'Sonax', label: 'Sonax' },
      { name: 'HG', label: 'HG' },
      { name: 'Febreze', label: 'Febreze' }
    ],
    subcategories: [
      {
        id: 'all',
        label: 'الكل في الكنب',
        subTags: ['جميع المنتجات', 'الأكثر طلباً', 'عناية خاصة', 'جديد']
      },
      {
        id: 'furniture_shampoo',
        label: 'شامبو ورغوة جافة',
        subTags: ['رغوة سريعة جافة', 'مزيل بقع فوري', 'منظف أقمشة حساسة', 'منظف جلود فاخر']
      },
      {
        id: 'furniture_perfume',
        label: 'معطرات ومعقمات الكنب',
        subTags: ['معطر العود الملكي', 'معقم ومطهر مفروشات', 'رذاذ اللافندر الفندقي', 'بخاخ طارد للروائح']
      },
      {
        id: 'furniture_protect',
        label: 'حماية الأقمشة والجلد',
        subTags: ['نانو عازل للسوائل', 'مرطب وملمع جلد طبيعي', 'طبقة حماية للمخمل']
      },
      {
        id: 'furniture_tools',
        label: 'أدوات ومناشف الكنب',
        subTags: ['مناشف مايكروفايبر كثيفة', 'إسفنج رغوي خاص', 'فراشي زوايا دقيقة']
      }
    ]
  },
  wash_offers: {
    id: 'wash_offers',
    title: 'عروض وباقات الغسيل المتنوعة',
    shortTitle: 'عروض الغسيل',
    subtitle: 'باقات توفير حصرية تشمل خدمات متعددة بأسعار مخفضة وهدايا فورية',
    badge: 'أفضل قيمة توفيرية 🔥',
    icon: Flame,
    themeGradient: 'from-orange-600 via-red-600 to-slate-950',
    accentColor: 'text-red-600',
    bannerTitle: 'وفر حتى 40% مع باقات الغسيل المتعددة للسيارات والسجاد',
    bannerSubtitle: 'احجز باقات الغسيل واستمتع بهدايا فورية وخدمة متنقلة تصلك أينما كنت عند باب بيتك',
    promoCode: 'SAVE40',
    promoDiscount: 'وفر 40 ر.س',
    bannerImage: heroWashBannerImg,
    promoCardImage: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80',
    brands: [
      { name: '3M', label: '3M' },
      { name: 'Meguiar\'s', label: 'Meguiar\'s' },
      { name: 'Turtle Wax', label: 'Turtle Wax' },
      { name: 'Chemical Guys', label: 'Chemical Guys' },
      { name: 'Sonax', label: 'Sonax' }
    ],
    subcategories: [
      {
        id: 'all',
        label: 'الكل في العروض',
        subTags: ['جميع العروض', 'غسيل سيارات', 'غسيل سجاد']
      },
      {
        id: 'cars_offers',
        label: 'عروض غسيل السيارات',
        subTags: ['عرض 3 سيارات + واكس', 'غسيل خارجي وداخلي متكامل', 'باقة VIP التلميع الساطع']
      },
      {
        id: 'carpets_offers',
        label: 'عروض غسيل السجاد',
        subTags: ['عرض 4 سجادات بسعر 3', 'باقة غسيل البطانيات والمفارش', 'خدمة الاستلام والتسليم المجاني']
      },
      {
        id: 'subscriptions_offers',
        label: 'الاشتراكات الشهرية',
        subTags: ['اشتراك غسيل شهري', 'باقة الشركات والعوائل', 'كروت هدايا ورصيد إضافي']
      }
    ]
  }
};

interface StoreCategoryTemplateProps {
  categoryId: string;
  onBackToHome: () => void;
}

export const StoreCategoryTemplate: React.FC<StoreCategoryTemplateProps> = ({
  categoryId,
  onBackToHome
}) => {
  const {
    storeProducts,
    addToCart,
    cart,
    updateCartQty,
    serviceBookingContext,
    returnToServiceBooking,
    addStoreProductToBooking,
    updateStoreProductBookingQuantity,
    bookingAddons,
    openProductDetail,
    applyCoupon,
    setCurrentScreen
  } = useApp();

  const isBookingMode = Boolean(serviceBookingContext?.isActive);

  // Fallback to cars if invalid category id
  const config = CATEGORY_CONFIGS[categoryId] || CATEGORY_CONFIGS.cars;
  const CategoryIcon = config.icon;

  // Subcategory navigation in header
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  // Sub-sub category / nested tags
  const [selectedNestedTag, setSelectedNestedTag] = useState<string>('الكل');
  // Mega menu hover state
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState<boolean>(false);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<'default' | 'price_low' | 'price_high' | 'rating'>('default');
  const [copiedCoupon, setCopiedCoupon] = useState<boolean>(false);

  // Offers Carousel State (Matching HomeScreen)
  const [offerSlideIndex, setOfferSlideIndex] = useState<number>(0);
  const [isHoveredOffers, setIsHoveredOffers] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [cardsPerView, setCardsPerView] = useState<number>(3);

  // Responsive cards per view for offers slider
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

  // Get current subcategory definition
  const currentSubCatDef = useMemo(() => {
    return (
      config.subcategories.find(s => s.id === selectedSubCategory) ||
      config.subcategories[0]
    );
  }, [config, selectedSubCategory]);

  const handleSubCategoryChange = (subId: string) => {
    setSelectedSubCategory(subId);
    setSelectedNestedTag('الكل');
  };

  // 1. Filter products belonging to this category
  const categoryProducts = useMemo(() => {
    return storeProducts.filter(p => {
      if (config.id === 'cars') {
        return (
          p.mainCategory === 'cars' ||
          ['interior_acc', 'exterior_acc', 'car_care', 'camping_trips', 'electronics', 'steam_polishing', 'cars', 'cleaning'].includes(p.category)
        );
      }
      if (config.id === 'carpets') {
        return (
          p.mainCategory === 'carpets' ||
          ['carpet_packaging', 'blankets_quilts', 'carpet_care', 'carpet_tools', 'sofa_polishing', 'carpets'].includes(p.category)
        );
      }
      if (config.id === 'furniture') {
        return (
          p.mainCategory === 'furniture' ||
          p.category === 'furniture' ||
          p.subCategory === 'furniture_shampoo' ||
          p.subCategory === 'furniture_perfume' ||
          p.subCategory === 'furniture_protect' ||
          p.subCategory === 'furniture_tools'
        );
      }
      if (config.id === 'wash_offers') {
        return p.mainCategory === 'wash_offers' || p.category === 'wash_offers';
      }
      return p.mainCategory === config.id || p.category === config.id;
    });
  }, [storeProducts, config.id]);

  // 2. Filter products belonging to this category that have offers/deals
  const categoryDeals = useMemo(() => {
    return categoryProducts.filter(
      p => p.originalPrice && p.originalPrice > p.price
    );
  }, [categoryProducts]);

  // Offers slider max index
  const maxOfferSlideIndex = useMemo(() => {
    return Math.max(0, categoryDeals.length - cardsPerView);
  }, [categoryDeals.length, cardsPerView]);

  useEffect(() => {
    if (offerSlideIndex > maxOfferSlideIndex) {
      setOfferSlideIndex(maxOfferSlideIndex);
    }
  }, [maxOfferSlideIndex, offerSlideIndex]);

  // Auto-play for offers slider (pause on hover)
  useEffect(() => {
    if (isHoveredOffers || categoryDeals.length <= cardsPerView) return;
    const interval = setInterval(() => {
      setOfferSlideIndex(prev => (prev >= maxOfferSlideIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveredOffers, maxOfferSlideIndex, categoryDeals.length, cardsPerView]);

  const nextOfferSlide = () => {
    setOfferSlideIndex(prev => (prev >= maxOfferSlideIndex ? 0 : prev + 1));
  };

  const prevOfferSlide = () => {
    setOfferSlideIndex(prev => (prev <= 0 ? maxOfferSlideIndex : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsHoveredOffers(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;
    if (diff > 45) {
      nextOfferSlide();
    } else if (diff < -45) {
      prevOfferSlide();
    }
    setTouchStartX(null);
    setIsHoveredOffers(false);
  };

  // 3. Filtered products for main list (taking into account subcategory, nested tags)
  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts];

    // Filter by Subcategory
    if (selectedSubCategory !== 'all') {
      if (config.id === 'cars') {
        if (selectedSubCategory === 'interior_acc') {
          list = list.filter(p => p.subCategory === 'interior_acc' || p.category === 'interior_acc' || p.name.includes('داخلي') || p.name.includes('شاحن') || p.name.includes('مقعد'));
        } else if (selectedSubCategory === 'exterior_acc') {
          list = list.filter(p => p.subCategory === 'exterior_acc' || p.category === 'exterior_acc' || p.name.includes('خارجي') || p.name.includes('مظلة') || p.name.includes('غطاء'));
        } else if (selectedSubCategory === 'car_care') {
          list = list.filter(p => p.subCategory === 'car_care' || p.category === 'car_care' || p.name.includes('نانو') || p.name.includes('واكس') || p.name.includes('شامبو') || p.name.includes('تلميع'));
        } else if (selectedSubCategory === 'electronics') {
          list = list.filter(p => p.subCategory === 'electronics' || p.category === 'electronics' || p.name.includes('كاميرا') || p.name.includes('داش') || p.name.includes('شاحن'));
        } else if (selectedSubCategory === 'camping_trips') {
          list = list.filter(p => p.subCategory === 'camping_trips' || p.category === 'camping_trips' || p.name.includes('رحلات') || p.name.includes('هواء') || p.name.includes('مرتبة'));
        } else {
          list = list.filter(p => p.subCategory === selectedSubCategory || p.category === selectedSubCategory);
        }
      } else if (config.id === 'carpets') {
        list = list.filter(
          p => p.subCategory === selectedSubCategory || p.category === selectedSubCategory
        );
      } else if (config.id === 'furniture') {
        if (selectedSubCategory === 'furniture_shampoo') {
          list = list.filter(p => p.subCategory === 'furniture_shampoo' || p.name.includes('شامبو') || p.name.includes('رغوة') || p.name.includes('بقع'));
        } else if (selectedSubCategory === 'furniture_perfume') {
          list = list.filter(p => p.subCategory === 'furniture_perfume' || p.name.includes('معطر') || p.name.includes('عود'));
        } else if (selectedSubCategory === 'furniture_protect') {
          list = list.filter(p => p.subCategory === 'furniture_protect' || p.name.includes('حماية') || p.name.includes('نانو') || p.name.includes('عازل'));
        } else if (selectedSubCategory === 'furniture_tools') {
          list = list.filter(p => p.subCategory === 'furniture_tools' || p.name.includes('مناشف') || p.name.includes('إسفنج') || p.name.includes('أدوات'));
        } else {
          list = list.filter(p => p.subCategory === selectedSubCategory || p.category === selectedSubCategory);
        }
      } else if (config.id === 'wash_offers') {
        if (selectedSubCategory === 'cars_offers') {
          list = list.filter(p => p.name.includes('سيارات') || p.name.includes('سيارة'));
        } else if (selectedSubCategory === 'carpets_offers') {
          list = list.filter(p => p.name.includes('سجاد') || p.name.includes('سجادات'));
        }
      }
    }

    // Filter by Nested Tag (if selected and not default "الكل")
    if (selectedNestedTag && selectedNestedTag !== 'الكل' && selectedNestedTag !== 'جميع المنتجات') {
      const term = selectedNestedTag.toLowerCase();
      if (term.includes('عروض') || term.includes('خاصة')) {
        list = list.filter(p => p.originalPrice && p.originalPrice > p.price);
      } else if (term.includes('جديد')) {
        list = list.filter(p => p.isNew);
      } else if (term.includes('الأكثر طلباً')) {
        list = list.filter(p => (p.rating >= 4.8 || p.reviewsCount > 500));
      } else {
        // Tag or brand keyword match
        const matched = list.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          (p.subCategoryLabel && p.subCategoryLabel.toLowerCase().includes(term))
        );
        if (matched.length > 0) {
          list = matched;
        }
      }
    }

    // Sorting
    if (sortBy === 'price_low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [categoryProducts, selectedSubCategory, selectedNestedTag, sortBy, config.id]);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleProductAddToCart = (product: StoreProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, 1);
  };

  const handleProductAddToBooking = (product: StoreProduct, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addStoreProductToBooking(product, 1);
  };

  return (
    <div id="category-store-page" className="space-y-6 pb-28 animate-in fade-in duration-300 text-right">
      {/* 1. TOP HEADER & BREADCRUMBS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-3.5 sm:p-5 border border-slate-200/90 shadow-xs">
        {/* Breadcrumb Path */}
        <nav aria-label="مسار التنقل" className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-slate-500 overflow-x-auto whitespace-nowrap">
          <button
            type="button"
            onClick={() => setCurrentScreen('home')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            الرئيسية
          </button>
          <span className="text-slate-300">/</span>
          <button
            type="button"
            onClick={onBackToHome}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            المتجر
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-blue-600 font-black">{config.title}</span>
          {selectedSubCategory !== 'all' && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-slate-700">{currentSubCatDef.label}</span>
            </>
          )}
        </nav>

        {/* Back to Store Homepage Button */}
        <button
          type="button"
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-2xl transition-all cursor-pointer shadow-2xs"
        >
          <span>العودة لأقسام المتجر</span>
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* 2. SUBCATEGORIES HEADER WITH MEGA-MENU ON HOVER (مطابق للتصميم في الصورة المرفقة) */}
      <div
        className="relative z-30 bg-white rounded-3xl border border-slate-200/90 shadow-sm"
        onMouseLeave={() => {
          setIsMegaMenuOpen(false);
          setHoveredSubCategory(null);
        }}
      >
        {/* Top Category Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 pt-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-['Cairo'] text-slate-900">
                  {config.title}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation List (Bar of Subcategories) */}
        <div className="px-3 sm:px-6 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1 w-full">
            {config.subcategories
              .filter(sub => sub.id !== 'all')
              .map(sub => {
                const isSelected = selectedSubCategory === sub.id;
                const isHovered = hoveredSubCategory === sub.id;

              return (
                <button
                  key={sub.id}
                  type="button"
                  onMouseEnter={() => {
                    setHoveredSubCategory(sub.id);
                    setIsMegaMenuOpen(true);
                  }}
                  onClick={() => {
                    handleSubCategoryChange(sub.id);
                    setIsMegaMenuOpen(false);
                  }}
                  className={`relative px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isSelected || isHovered
                      ? 'text-slate-950 font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{sub.label}</span>
                  {/* Underline Indicator matching reference image */}
                  {isSelected && (
                    <span className="absolute bottom-0 right-3 left-3 h-0.5 bg-slate-950 rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* MEGA DROPDOWN MENU (يظهر عند الهوفر كما في الصورة المرفقة) */}
        {isMegaMenuOpen && (
          <div
            className="absolute top-full right-0 left-0 z-50 bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 animate-in fade-in slide-in-from-top-2 duration-200"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
          >
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8">
              {/* Columns on Right (Categories & Sub-tags list matching reference image) */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-right w-full">
                {config.subcategories
                  .filter(sub => sub.id !== 'all')
                  .map(sub => {
                    const isCurrentHovered = hoveredSubCategory === sub.id;
                    const isCurrentSelected = selectedSubCategory === sub.id;

                    return (
                      <div
                        key={sub.id}
                        className={`space-y-2.5 transition-opacity ${
                          hoveredSubCategory && hoveredSubCategory !== 'all' && !isCurrentHovered
                            ? 'opacity-80'
                            : 'opacity-100'
                        }`}
                      >
                        {/* Subcategory Column Header */}
                        <button
                          type="button"
                          onClick={() => {
                            handleSubCategoryChange(sub.id);
                            setIsMegaMenuOpen(false);
                          }}
                          className={`text-xs sm:text-sm font-black font-['Cairo'] block pb-1 border-b border-slate-100 hover:text-blue-600 transition-colors text-right w-full cursor-pointer ${
                            isCurrentSelected ? 'text-blue-600' : 'text-slate-900'
                          }`}
                        >
                          {sub.label}
                        </button>

                        {/* Sub-items list */}
                        <ul className="space-y-1.5 text-[11px] sm:text-xs">
                          {sub.subTags?.map(tag => {
                            const isTagSelected =
                              selectedSubCategory === sub.id && selectedNestedTag === tag;
                            return (
                              <li key={tag}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSubCategoryChange(sub.id);
                                    setSelectedNestedTag(tag);
                                    setIsMegaMenuOpen(false);
                                  }}
                                  className={`text-right w-full py-0.5 hover:text-blue-600 transition-colors block cursor-pointer leading-snug ${
                                    isTagSelected
                                      ? 'text-blue-600 font-bold'
                                      : 'text-slate-600 hover:font-bold'
                                  }`}
                                >
                                  {tag}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
              </div>

              {/* Left Promotional Image Box (matching user's reference image!) */}
              <div className="w-full lg:w-48 shrink-0 flex flex-col items-center justify-center">
                <div
                  onClick={() => {
                    handleSubCategoryChange('all');
                    setIsMegaMenuOpen(false);
                  }}
                  className="relative w-full h-44 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm cursor-pointer group"
                >
                  <img
                    src={config.promoCardImage || config.bannerImage}
                    alt={config.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Black Tag Badge matching reference image ("للسيارات") */}
                  <div className="absolute bottom-3 right-1/2 translate-x-1/2 bg-black text-white px-4 py-1.5 rounded-sm font-black text-xs sm:text-sm tracking-wide shadow-md whitespace-nowrap font-['Cairo']">
                    لـ{config.shortTitle}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Filter Chips (if subcategory or sub-tag is active) */}
      {(selectedSubCategory !== 'all' || selectedNestedTag !== 'الكل') && (
        <div className="flex items-center gap-2 flex-wrap bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-2.5 text-xs animate-in fade-in">
          <span className="text-slate-400 text-[11px] font-bold">التصفية النشطة:</span>
          {selectedSubCategory !== 'all' && (
            <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-xl border border-blue-200/60 flex items-center gap-1.5">
              <span>{currentSubCatDef.label}</span>
              <button
                type="button"
                onClick={() => setSelectedSubCategory('all')}
                className="hover:text-red-500 cursor-pointer"
                title="إلغاء تصفية القسم"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedNestedTag !== 'الكل' && (
            <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5">
              <span>{selectedNestedTag}</span>
              <button
                type="button"
                onClick={() => setSelectedNestedTag('الكل')}
                className="hover:text-red-500 cursor-pointer"
                title="إلغاء التصفية الإضافية"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              setSelectedSubCategory('all');
              setSelectedNestedTag('الكل');
            }}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 underline mr-auto cursor-pointer"
          >
            مسح التصفية بالكامل
          </button>
        </div>
      )}

      {/* 3. PROMOTIONAL ADVERTISING BANNER (بانر إعلاني عصري ومميز بتصميم أفتح وأوضح) */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-lg border border-slate-700/60">
        {/* Background Image with High-End Care Photography and Lighter Modern Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={config.bannerImage}
            alt={config.title}
            className="w-full h-full object-cover object-center opacity-65 scale-102 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/80 via-slate-900/55 to-slate-900/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        </div>

        {/* Inner Content */}
        <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            {/* Limited Time Badge */}
            <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-amber-300 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full border border-amber-400/30 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{config.promoDiscount} لفترة محدودة</span>
            </div>

            {/* Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-['Cairo'] tracking-tight text-white leading-tight">
              {config.bannerTitle}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {config.bannerSubtitle}
            </p>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-1 text-[11px] text-slate-300 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                <span>توصيل سريع</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>منتجات أصلية 100%</span>
              </span>
            </div>
          </div>

          {/* Coupon Code Action Pill */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center space-y-2.5 self-start md:self-auto min-w-[220px]">
            <span className="text-[11px] text-slate-200 font-bold block">
              كود خصم حصري
            </span>
            <div className="flex items-center justify-between gap-2 bg-slate-950/80 rounded-xl px-3.5 py-2 border border-amber-400/40">
              <span className="font-mono text-base sm:text-lg font-black tracking-wider text-amber-400">
                {config.promoCode}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCoupon(config.promoCode)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                title="نسخ كود الخصم وتطبيقه"
              >
                {copiedCoupon ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[10px] text-amber-300/90 block font-medium">
              يطبق تلقائياً عند الدفع
            </span>
          </div>
        </div>
      </div>

      {/* 4. SAME-CATEGORY DEALS & OFFERS SECTION (مطابق لسيكشن العروض بالصفحة الرئيسية للخدمات) */}
      {categoryDeals.length > 0 && (
        <section className="space-y-4">
          {/* Header: Centered Text with Flame and Subtitle (Just like HomeScreen) */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center text-center pb-1">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                <span>عروض وتخفيضات {config.shortTitle}</span>
                <span className="text-amber-500">🔥</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                لا تفوت أفضل الأسعار والخصومات الحصرية لفترة محدودة
              </p>
            </div>
          </div>

          {/* Offer Cards Slider Container with Navigation Arrows & Swipe */}
          <div
            className="relative select-none"
            onMouseEnter={() => setIsHoveredOffers(true)}
            onMouseLeave={() => setIsHoveredOffers(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Right Arrow (Previous in RTL) */}
            {categoryDeals.length > cardsPerView && (
              <button
                type="button"
                onClick={prevOfferSlide}
                className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous Offer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Left Arrow (Next in RTL) */}
            {categoryDeals.length > cardsPerView && (
              <button
                type="button"
                onClick={nextOfferSlide}
                className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
                aria-label="Next Offer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Viewport with overflow hidden */}
            <div className="overflow-hidden py-1 px-0.5">
              {/* Sliding Flex Track */}
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(${offerSlideIndex * (100 / cardsPerView)}%)`
                }}
              >
                {categoryDeals.map(prod => {
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
                        className="relative overflow-hidden rounded-3xl border border-amber-200/90 bg-gradient-to-l from-amber-500/10 via-orange-500/5 to-white p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex items-center justify-between min-h-[185px] sm:min-h-[195px] cursor-pointer group/card"
                      >
                        {/* Right Content (Text & Action Button) */}
                        <div className="z-10 space-y-2 max-w-[62%] text-right">
                          {/* Badges row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="bg-rose-600 text-white text-[11px] sm:text-xs font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                              خصم {discountPct}% 🔥
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug group-hover/card:text-blue-600 transition-colors line-clamp-1 font-['Cairo']">
                            {prod.name}
                          </h4>

                          {/* Subtitle & Rating */}
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-slate-800">{prod.rating || '4.8'}</span>
                            </div>
                          </div>

                          {/* Price Display */}
                          <div className="flex items-baseline gap-1.5 pt-0.5">
                            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-['Cairo']">
                              {prod.price.toFixed(2)} <Riyal />
                            </span>
                            {prod.originalPrice && (
                              <span className="text-xs text-slate-400 line-through font-medium">
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
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleProductAddToBooking(prod, e);
                                  }}
                                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 active:scale-95 font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
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
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleProductAddToCart(prod, e);
                                  }}
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
            {maxOfferSlideIndex > 0 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {Array.from({ length: maxOfferSlideIndex + 1 }).map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => setOfferSlideIndex(dotIndex)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      offerSlideIndex === dotIndex
                        ? 'w-7 bg-blue-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. MAIN CATEGORY PRODUCTS SECTION (بدون محرك بحث وفق الطلب) */}
      <div className="space-y-4">
        {/* Center Title */}
        <div className="text-center py-2 sm:py-3">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Cairo']">
            تصفح المنتجات
          </h3>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-black text-slate-800">لا توجد منتجات مطابقة في هذا التصنيف</h4>
            <p className="text-xs text-slate-500">جرب تعديل خيارات التصفية أو البحث</p>
            <button
              type="button"
              onClick={() => {
                setSelectedSubCategory('all');
                setSelectedNestedTag('الكل');
              }}
              className="text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl cursor-pointer"
            >
              إعادة ضبط التصفية
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map(prod => {
              const inCartCount = cart.find(c => c.product.id === prod.id)?.quantity || 0;
              const addonId = `store-${prod.id}`;
              const bookingItem = bookingAddons.find(a => a.id === addonId);
              const inBookingCount = bookingItem?.quantity || 0;

              return (
                <div
                  key={prod.id}
                  id={`cat-product-${prod.id}`}
                  onClick={() => openProductDetail(prod)}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer relative"
                >
                  {/* Image & Badges */}
                  <div className="relative h-36 sm:h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {prod.isNew && (
                      <span className="absolute top-2.5 right-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        جديد
                      </span>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{prod.rating || '4.8'}</span>
                    </div>

                    {/* Booking badge */}
                    {isBookingMode && inBookingCount > 0 && (
                      <div className="absolute top-2.5 left-2.5 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>مضاف ({inBookingCount})</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      {prod.subCategoryLabel && (
                        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block mb-1">
                          {prod.subCategoryLabel}
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 line-clamp-2 leading-snug font-['Cairo']">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
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
                          <span className="text-base sm:text-lg font-black text-blue-700 font-['Cairo']">
                            {prod.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold text-slate-600"><Riyal /></span>
                        </div>
                        {prod.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through block -mt-1 font-['Cairo']">
                            {prod.originalPrice.toFixed(2)} <Riyal />
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      {isBookingMode ? (
                        inBookingCount > 0 ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl p-1 h-[34px]"
                          >
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateStoreProductBookingQuantity(prod.id, inBookingCount - 1);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-white hover:bg-amber-100 text-amber-950 font-black text-xs cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-xs min-w-4 text-center text-amber-950">
                              {inBookingCount}
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateStoreProductBookingQuantity(prod.id, inBookingCount + 1);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={e => handleProductAddToBooking(prod, e)}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 h-[34px] cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>أضف للطلب</span>
                          </button>
                        )
                      ) : (
                        inCartCount > 0 ? (
                          <div
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm h-[34px]"
                          >
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateCartQty(prod.id, inCartCount - 1);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-black text-xs min-w-4 text-center">
                              {inCartCount}
                            </span>
                            <button
                              type="button"
                              onClick={e => {
                                e.stopPropagation();
                                updateCartQty(prod.id, inCartCount + 1);
                              }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={e => handleProductAddToCart(prod, e)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-4 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 shrink-0 h-[34px] cursor-pointer"
                          >
                            <span>أضف للسلة</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar (if regular store mode and cart has items) */}
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
    </div>
  );
};
