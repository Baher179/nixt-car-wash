import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Riyal } from './Riyal';
import { useApp } from '../../context/AppContext';
import { ServiceItem, StoreProduct } from '../../types';
import { Search, X, Clock } from 'lucide-react';

interface HeaderSearchProps {
  className?: string;
  isMobileDrawer?: boolean;
  onResultClick?: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  type: 'service' | 'product' | 'package';
  typeLabel: string;
  price?: number;
  original: ServiceItem | StoreProduct;
}

export const HeaderSearch: React.FC<HeaderSearchProps> = ({
  className = '',
  isMobileDrawer = false,
  onResultClick
}) => {
  const {
    services,
    storeProducts,
    packages,
    openBookingModal,
    openProductDetail,
    openPackageDetail
  } = useApp();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular search terms
  const popularSearches = [
    'غسيل سيارات',
    'تلميع داخلي وخارجي',
    'غسيل سجاد',
    'معطر سيارة',
    'باقات شهرية',
    'تنظيف كنب'
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching results without complicated categories or tabs
  const trimmedQuery = query.trim().toLowerCase();

  const results: SearchResultItem[] = useMemo(() => {
    if (!trimmedQuery) return [];

    const items: SearchResultItem[] = [];

    // Match Services
    services.forEach((s) => {
      if (
        s.title.toLowerCase().includes(trimmedQuery) ||
        (s.description && s.description.toLowerCase().includes(trimmedQuery)) ||
        (s.category && s.category.toLowerCase().includes(trimmedQuery))
      ) {
        items.push({
          id: `service-${s.id}`,
          title: s.title,
          type: 'service',
          typeLabel: 'خدمة',
          price: s.price,
          original: s
        });
      }
    });

    // Match Products
    storeProducts.forEach((p) => {
      if (
        p.name.toLowerCase().includes(trimmedQuery) ||
        (p.description && p.description.toLowerCase().includes(trimmedQuery)) ||
        (p.categoryLabel && p.categoryLabel.toLowerCase().includes(trimmedQuery))
      ) {
        items.push({
          id: `product-${p.id}`,
          title: p.name,
          type: 'product',
          typeLabel: 'منتج',
          price: p.price,
          original: p
        });
      }
    });

    // Match Packages
    packages.forEach((pkg) => {
      if (
        pkg.title.toLowerCase().includes(trimmedQuery) ||
        (pkg.description && pkg.description.toLowerCase().includes(trimmedQuery))
      ) {
        items.push({
          id: `pkg-${pkg.id}`,
          title: pkg.title,
          type: 'package',
          typeLabel: 'باقة',
          price: pkg.price,
          original: pkg
        });
      }
    });

    return items;
  }, [services, storeProducts, packages, trimmedQuery]);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    if (onResultClick) onResultClick();

    if (item.type === 'service') {
      openBookingModal(item.original as ServiceItem);
    } else if (item.type === 'product') {
      openProductDetail(item.original as StoreProduct);
    } else if (item.type === 'package') {
      openPackageDetail(item.original as ServiceItem);
    }
  };

  const handleSelectPopular = (term: string) => {
    setQuery(term);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      id="header-site-search"
      className={`relative ${className}`}
      dir="rtl"
    >
      {/* Search Input Bar */}
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          placeholder="ما الذي تبحث عنه؟"
          className="w-full h-10 pr-9 pl-9 text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100/90 focus:bg-white text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition-all"
        />

        {/* Search Icon */}
        <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center justify-center">
          <Search className="w-4 h-4 text-slate-400" />
        </div>

        {/* Clear Button */}
        {query && (
          <div className="absolute left-2.5 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="مسح"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="header-search-results-dropdown"
          className={`absolute z-50 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden text-right ${
            isMobileDrawer
              ? 'left-0 right-0 w-full'
              : 'right-0 w-[300px] sm:w-[350px] md:w-[380px] max-w-[92vw]'
          }`}
        >
          {/* 1. Popular Searches when input is empty */}
          {!trimmedQuery && (
            <div className="p-3.5 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>عمليات البحث الشائعة</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => handleSelectPopular(term)}
                    className="text-xs bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2.5 py-1 rounded-lg transition-colors font-medium border border-slate-200/60"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Matched Results List (Simple and direct) */}
          {trimmedQuery && results.length > 0 && (
            <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 transition-colors text-right cursor-pointer group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        item.type === 'service'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'product'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.typeLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </span>
                  </div>

                  {item.price !== undefined && (
                    <span className="text-xs font-bold text-slate-900 shrink-0 mr-2">
                      {item.price} <span className="text-[10px] font-normal text-slate-500"><Riyal /></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* 3. No Results State */}
          {trimmedQuery && results.length === 0 && (
            <div className="p-5 text-center text-xs text-slate-500">
              لا توجد نتائج مطابقة لـ "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
