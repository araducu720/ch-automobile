'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { debounce } from '@/lib/utils';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Sheet } from '@/components/ui/sheet';
import { useTranslations } from 'next-intl';
import type { VehicleFilters } from '@/types';

// Maps API values → translation keys
const FUEL_TYPE_KEYS: Record<string, string> = {
  petrol: 'petrol', diesel: 'diesel', electric: 'electric', hybrid: 'hybrid',
  plug_in_hybrid: 'pluginHybrid', hydrogen: 'hydrogen', lpg: 'lpg', cng: 'cng',
};
const TRANSMISSION_KEYS: Record<string, string> = {
  automatic: 'automatic', manual: 'manual', semi_automatic: 'semiAutomatic',
};
const BODY_TYPE_KEYS: Record<string, string> = {
  sedan: 'sedan', suv: 'suv', coupe: 'coupe', cabrio: 'convertible',
  kombi: 'wagon', hatchback: 'hatchback', van: 'van', pickup: 'pickup',
  roadster: 'roadster', limousine: 'sedan', other: 'other',
};
const SORT_KEYS: { value: string; key: string }[] = [
  { value: 'created_at_desc', key: 'newestFirst' },
  { value: 'created_at_asc', key: 'oldestFirst' },
  { value: 'price_asc', key: 'priceAsc' },
  { value: 'price_desc', key: 'priceDesc' },
  { value: 'mileage_asc', key: 'mileageAsc' },
  { value: 'mileage_desc', key: 'mileageDesc' },
  { value: 'year_desc', key: 'yearDesc' },
  { value: 'year_asc', key: 'yearAsc' },
];

interface VehicleFilterBarProps {
  brands: string[];
  totalResults?: number;
  className?: string;
}

export function VehicleFilterBar({ brands, totalResults, className }: VehicleFilterBarProps) {
  const t = useTranslations('vehicles');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Current filters from URL
  const currentFilters: VehicleFilters = useMemo(() => ({
    brand: searchParams.get('brand') || undefined,
    fuel_type: (searchParams.get('fuel_type') as VehicleFilters['fuel_type']) || undefined,
    transmission: (searchParams.get('transmission') as VehicleFilters['transmission']) || undefined,
    body_type: (searchParams.get('body_type') as VehicleFilters['body_type']) || undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    year_min: searchParams.get('year_min') ? Number(searchParams.get('year_min')) : undefined,
    year_max: searchParams.get('year_max') ? Number(searchParams.get('year_max')) : undefined,
    mileage_max: searchParams.get('mileage_max') ? Number(searchParams.get('mileage_max')) : undefined,
    search: searchParams.get('search') || undefined,
    sort: searchParams.get('sort') || undefined,
  }), [searchParams]);

  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page'); // Reset pagination on filter change
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Use refs to keep the debounced function stable across re-renders
  const searchParamsRef = useRef(searchParams);
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);
  useEffect(() => {
    searchParamsRef.current = searchParams;
    pathnameRef.current = pathname;
    routerRef.current = router;
  }, [searchParams, pathname, router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      params.delete('page');
      routerRef.current.push(`${pathnameRef.current}?${params.toString()}`, { scroll: false });
    }, 400),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  const resetFilters = useCallback(() => {
    router.push(pathname);
    setSearchTerm('');
  }, [router, pathname]);

  const activeFilterCount = Object.values(currentFilters).filter(Boolean).length;

  const brandOptions = useMemo(() => brands.map((b) => ({ value: b, label: b })), [brands]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fuelOptions = useMemo(() => Object.entries(FUEL_TYPE_KEYS).map(([v, k]) => ({ value: v, label: t(k as any) })), [t]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transmissionOptions = useMemo(() => Object.entries(TRANSMISSION_KEYS).map(([v, k]) => ({ value: v, label: t(k as any) })), [t]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bodyTypeOptions = useMemo(() => Object.entries(BODY_TYPE_KEYS).map(([v, k]) => ({ value: v, label: t(k as any) })), [t]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortOptions = useMemo(() => SORT_KEYS.map((o) => ({ value: o.value, label: t(o.key as any) })), [t]);

  // Memoize filter controls JSX to avoid creating a new component identity on each render
  const filterControls = useMemo(() => (
    <div className="space-y-4">
      <Select
        label={t('brand')}
        placeholder={t('allBrands')}
        options={brandOptions}
        value={currentFilters.brand || ''}
        onChange={(e) => updateFilter('brand', e.target.value || undefined)}
      />
      <Select
        label={t('fuelType')}
        placeholder={t('allFuelTypes')}
        options={fuelOptions}
        value={currentFilters.fuel_type || ''}
        onChange={(e) => updateFilter('fuel_type', e.target.value || undefined)}
      />
      <Select
        label={t('transmission')}
        placeholder={t('allTransmissions')}
        options={transmissionOptions}
        value={currentFilters.transmission || ''}
        onChange={(e) => updateFilter('transmission', e.target.value || undefined)}
      />
      <Select
        label={t('bodyType')}
        placeholder={t('allBodyTypes')}
        options={bodyTypeOptions}
        value={currentFilters.body_type || ''}
        onChange={(e) => updateFilter('body_type', e.target.value || undefined)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('priceFrom')}
          type="number"
          min={0}
          placeholder="€"
          value={currentFilters.price_min || ''}
          onChange={(e) => updateFilter('price_min', e.target.value || undefined)}
        />
        <Input
          label={t('priceTo')}
          type="number"
          min={0}
          placeholder="€"
          value={currentFilters.price_max || ''}
          onChange={(e) => updateFilter('price_max', e.target.value || undefined)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label={t('yearFrom')}
          type="number"
          placeholder="z.B. 2018"
          value={currentFilters.year_min || ''}
          onChange={(e) => updateFilter('year_min', e.target.value || undefined)}
        />
        <Input
          label={t('yearTo')}
          type="number"
          placeholder="z.B. 2024"
          value={currentFilters.year_max || ''}
          onChange={(e) => updateFilter('year_max', e.target.value || undefined)}
        />
      </div>
      <Input
        label={t('maxMileage')}
        type="number"
        min={0}
        placeholder="z.B. 50000"
        value={currentFilters.mileage_max || ''}
        onChange={(e) => updateFilter('mileage_max', e.target.value || undefined)}
      />
      {activeFilterCount > 0 && (
        <Button variant="outline" fullWidth onClick={resetFilters} leftIcon={<X className="h-4 w-4" />}>
          {t('resetFilters')} ({activeFilterCount})
        </Button>
      )}
    </div>
  ), [t, brandOptions, fuelOptions, transmissionOptions, bodyTypeOptions, currentFilters, updateFilter, activeFilterCount, resetFilters]);

  return (
    <>
      {/* Top bar with search + sort + mobile filter toggle */}
      <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              placeholder={t('searchPlaceholder')}
              aria-label={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full h-10 rounded-lg border-2 border-input-border bg-input pl-9 pr-3 text-sm',
                'text-foreground placeholder:text-muted-foreground',
                'shadow-[var(--input-shadow)]',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:border-border-focus transition-all duration-200',
              )}
            />
          </div>
          {/* Mobile filter button */}
          <button
            onClick={() => setMobileOpen(true)}
            className={cn(
              'lg:hidden flex items-center gap-2 h-10 px-3 rounded-lg border border-border text-sm',
              'text-foreground bg-background hover:bg-secondary',
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {totalResults !== undefined && (
            <span className="text-sm text-muted">
              {t('vehiclesCount', { count: totalResults })}
            </span>
          )}
          <Select
            options={sortOptions}
            placeholder={t('sortBy')}
            value={currentFilters.sort || ''}
            onChange={(e) => updateFilter('sort', e.target.value || undefined)}
            className="w-48"
          />
        </div>
      </div>

      {/* Desktop sidebar filters (rendered by parent via composition) */}
      <div className="hidden lg:block">
        {filterControls}
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={mobileOpen} onClose={() => setMobileOpen(false)} title={t('filterBy')} side="left">
        {filterControls}
      </Sheet>
    </>
  );
}
